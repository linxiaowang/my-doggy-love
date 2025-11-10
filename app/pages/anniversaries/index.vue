<template>
  <div class="min-h-screen bg-#f7f6f3">
    <DogHeader />
    <div class="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <div class="rounded-xl bg-white p-4 shadow">
        <form class="grid md:grid-cols-4 gap-2 items-center" @submit.prevent="create">
          <input v-model="title" placeholder="纪念日标题" class="border border-#ece7e1 rounded px-3 py-2 md:col-span-2 bg-white text-#333 placeholder:text-gray-400" />
          <input v-model="date" type="date" class="border border-#ece7e1 rounded px-3 py-2 bg-white text-#333" />
          <button class="px-4 py-2 rounded bg-#e9e4de">创建</button>
        </form>
      </div>
      <div v-if="loading">
        <SkeletonList :count="2" />
      </div>
      <div v-else-if="items.length===0">
        <EmptyState text="添加一个特别的日子吧" img="/assets/images/couple/couple-1.png" cta-text="创建纪念日" cta-to="/anniversaries" />
      </div>
      <div v-else class="grid md:grid-cols-2 gap-4">
        <div
          v-for="a in items"
          :key="a.id"
          class="rounded-xl p-4 shadow-sm border"
          :class="meta(a).overdue ? 'border-#f3d1d1' : 'border-#e1e9f5'"
          :style="{
            background: meta(a).overdue
              ? 'linear-gradient(180deg, #fff, #fdf4f4)'
              : 'linear-gradient(180deg, #fff, #f6f9fd)'
          }"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="card-heading">{{ a.title }}</div>
              <div class="text-sm text-#777">{{ new Date(a.date).toLocaleDateString() }}</div>
            </div>
            <span
              class="px-2 py-0.5 rounded-full text-xs"
              :class="[
                meta(a).overdue ? 'bg-#fdecec text-#b42318' : (meta(a).days===0 ? 'bg-#e7f6ec text-#127a3e' : 'bg-#e6eef5 text-#335b8c'),
                meta(a).canToggle && meta(a).days !== 0 ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
              ]"
              :title="meta(a).canToggle && meta(a).days !== 0 ? '点击切换显示格式' : ''"
              @click="meta(a).canToggle && meta(a).days !== 0 ? toggleFormat(a.id, meta(a).days) : null"
            >
              {{ meta(a).label }}
            </span>
          </div>
          <div class="mt-3 flex items-center gap-3">
            <button class="text-sm underline" @click="openEdit(a)">编辑</button>
            <button class="text-sm underline" @click="remove(a.id)">删除</button>
          </div>
        </div>
      </div>

      <!-- 编辑对话框 -->
      <div v-if="editing" class="fixed inset-0 z-40 bg-black/30 flex items-center justify-center px-4">
        <div class="card w-full max-w-md">
          <div class="card-heading mb-3">编辑纪念日</div>
          <form class="flex flex-col gap-3" @submit.prevent="saveEdit">
            <input v-model="editTitle" placeholder="纪念日标题" class="input" />
            <input v-model="editDate" type="date" class="input" />
            <div class="flex justify-end gap-2 mt-2">
              <button type="button" class="btn-secondary" @click="closeEdit">取消</button>
              <button type="submit" class="btn-primary">保存</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DogHeader from '@/components/ui/DogHeader.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { ref, onMounted } from 'vue'
import SkeletonList from '@/components/ui/SkeletonList.vue'
import { createAnniversary, updateAnniversary, deleteAnniversary } from '@/services/api/anniversaries'
import { apiFetch } from '@/services/api'
import dayjs from 'dayjs'

// 检查登录状态，未登录会自动跳转到登录页
definePageMeta({
  middleware: 'auth',
})

interface Anniversary { id: string; title: string; date: string }
const items = ref<Anniversary[]>([])
const title = ref('')
const date = ref('')
const loading = ref(true)
const editing = ref(false)
const editId = ref<string>('')
const editTitle = ref('')
const editDate = ref('')

// 显示格式类型
type FormatType = 'days' | 'weeks' | 'months' | 'years'

// 每个纪念日的格式状态
const formatStates = ref<Record<string, FormatType>>({})

// 格式化倒计时显示
function formatCountdown(days: number, format: FormatType, anniversaryDate?: string): string {
  const absDays = Math.abs(days)
  
  switch (format) {
    case 'years':
      // 年+天格式
      if (absDays >= 365) {
        if (anniversaryDate) {
          const today = dayjs()
          const target = dayjs(anniversaryDate)
          // 根据日期顺序计算年份差
          const years = Math.abs(today.diff(target, 'year'))
          // 从较早的日期开始加年份
          const earlier = today.isBefore(target) ? today : target
          const later = today.isAfter(target) ? today : target
          const afterYears = earlier.add(years, 'year')
          const remainingDays = Math.abs(later.diff(afterYears, 'day'))
          if (remainingDays === 0) {
            return `${years}年`
          }
          return `${years}年${remainingDays}天`
        } else {
          // 降级处理
          const years = Math.floor(absDays / 365)
          const remainingDays = absDays % 365
          if (remainingDays === 0) {
            return `${years}年`
          }
          return `${years}年${remainingDays}天`
        }
      }
      // 如果不足一年，降级显示
      return formatCountdown(days, 'months', anniversaryDate)

    case 'months':
      // 月+天格式（使用 dayjs 精确计算）
      if (absDays >= 30) {
        if (anniversaryDate) {
          const today = dayjs()
          const target = dayjs(anniversaryDate)
          // 根据日期顺序计算月份差
          const months = Math.abs(today.diff(target, 'month'))
          // 从较早的日期开始加月份
          const earlier = today.isBefore(target) ? today : target
          const later = today.isAfter(target) ? today : target
          const afterMonths = earlier.add(months, 'month')
          const remainingDays = Math.abs(later.diff(afterMonths, 'day'))
          if (remainingDays === 0) {
            return `${months}个月`
          }
          return `${months}个月${remainingDays}天`
        } else {
          // 降级处理：按30天折算
          const months = Math.floor(absDays / 30)
          const remainingDays = absDays % 30
          if (remainingDays === 0) {
            return `${months}个月`
          }
          return `${months}个月${remainingDays}天`
        }
      }
      // 如果不足一月，降级显示
      return formatCountdown(days, 'weeks', anniversaryDate)
    
    case 'weeks':
      // 周+天格式
      if (absDays >= 7) {
        const weeks = Math.floor(absDays / 7)
        const remainingDays = absDays % 7
        if (remainingDays === 0) {
          return `${weeks}周`
        }
        return `${weeks}周${remainingDays}天`
      }
      // 如果不足一周，降级显示
      return formatCountdown(days, 'days', anniversaryDate)
    
    case 'days':
    default:
      // 天数格式
      return `${absDays}天`
  }
}

// 切换格式
function toggleFormat(id: string, days: number) {
  const absDays = Math.abs(days)
  const currentFormat = formatStates.value[id] || 'days'
  
  // 根据当前天数决定可用的格式
  if (absDays >= 365) {
    // 超过一年：天 -> 周 -> 月 -> 年 -> 天
    if (currentFormat === 'days') {
      formatStates.value[id] = 'weeks'
    } else if (currentFormat === 'weeks') {
      formatStates.value[id] = 'months'
    } else if (currentFormat === 'months') {
      formatStates.value[id] = 'years'
    } else {
      formatStates.value[id] = 'days'
    }
  } else if (absDays >= 30) {
    // 超过一月但不足一年：天 -> 周 -> 月 -> 天
    if (currentFormat === 'days') {
      formatStates.value[id] = 'weeks'
    } else if (currentFormat === 'weeks') {
      formatStates.value[id] = 'months'
    } else {
      formatStates.value[id] = 'days'
    }
  } else if (absDays >= 7) {
    // 超过一周但不足一年：天 -> 周 -> 天
    if (currentFormat === 'days') {
      formatStates.value[id] = 'weeks'
    } else {
      formatStates.value[id] = 'days'
    }
  }
  // 不足一周：只有天数格式，不切换
}

function meta(a: Anniversary) {
  const today = new Date()
  const d = new Date(a.date)
  // 清零时分秒，避免时区导致的跨天误差
  const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
  const t1 = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  const diffDays = Math.round((t1 - t0) / (24*60*60*1000))
  const overdue = diffDays < 0
  
  // 获取当前格式
  const currentFormat = formatStates.value[a.id] || 'days'
  const formattedText = diffDays === 0 
    ? '就是今天' 
    : (overdue ? `已经 ${formatCountdown(diffDays, currentFormat, a.date)}` : `还有 ${formatCountdown(diffDays, currentFormat, a.date)}`)
  
  return { days: diffDays, overdue, label: formattedText, canToggle: Math.abs(diffDays) >= 7 }
}

async function load() {
  loading.value = true
  try {
    const res = await apiFetch<{ items: Anniversary[] }>('/api/anniversaries')
    items.value = res.items
    formatStates.value = {}
  } catch (e: any) {
    console.error('加载纪念日列表失败:', e)
  } finally {
    loading.value = false
  }
}
onMounted(load)

async function create() {
  if (!title.value || !date.value) return
  try {
    await createAnniversary({ title: title.value, date: date.value })
    title.value = ''
    date.value = ''
    await load()
  } catch (e: any) {
    console.error('创建纪念日失败:', e)
  }
}

async function remove(id: string) {
  try {
    await deleteAnniversary(id)
    await load()
  } catch (e: any) {
    console.error('删除纪念日失败:', e)
  }
}

function openEdit(a: Anniversary) {
  editId.value = a.id
  editTitle.value = a.title
  editDate.value = a.date.slice(0,10)
  editing.value = true
}

function closeEdit() {
  editing.value = false
}

async function saveEdit() {
  if (!editId.value) return
  try {
    await updateAnniversary(editId.value, { title: editTitle.value, date: editDate.value })
    editing.value = false
    await load()
  } catch (e: any) {
    console.error('更新纪念日失败:', e)
  }
}
</script>


