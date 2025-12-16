<template>
  <div class="min-h-screen bg-#f7f6f3">
    <DogHeader />
    <div class="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <Card>
        <CardContent class="px-4">
          <form class="flex flex-col md:flex-row gap-3" @submit.prevent="create">
            <div class="flex-1 md:flex-[2]">
              <Input v-model="title" placeholder="纪念日标题" />
            </div>
            <div class="flex-1">
              <Input v-model="date" type="date" />
            </div>
            <Button type="submit" class="md:w-auto">创建</Button>
          </form>
        </CardContent>
      </Card>
      <div v-if="loading">
        <SkeletonList :count="2" />
      </div>
      <div v-else-if="items.length===0">
        <EmptyState text="添加一个特别的日子吧" img="/assets/images/couple/couple-1.png" cta-text="创建纪念日" cta-to="/anniversaries" />
      </div>
      <div v-else class="grid md:grid-cols-2 gap-4">
        <Card
          v-for="a in items"
          :key="a.id"
          :class="meta(a).overdue ? 'border-destructive/30' : 'border-primary/30'"
        >
          <CardContent>
            <div class="flex items-start justify-between gap-3 mb-4">
              <div class="flex-1">
                <h3 class="font-semibold text-lg mb-1">{{ a.title }}</h3>
                <p class="text-sm text-muted-foreground">{{ new Date(a.date).toLocaleDateString() }}</p>
              </div>
              <Badge
                :variant="meta(a).overdue ? 'destructive' : (meta(a).days === 0 ? 'default' : 'secondary')"
                :class="meta(a).canToggle && meta(a).days !== 0 ? 'cursor-pointer hover:opacity-80' : ''"
                :title="meta(a).canToggle && meta(a).days !== 0 ? '点击切换显示格式' : ''"
                @click="meta(a).canToggle && meta(a).days !== 0 ? toggleFormat(a.id, meta(a).days) : null"
              >
                {{ meta(a).label }}
              </Badge>
            </div>
            <div class="flex items-center gap-2">
              <Button variant="outline" size="sm" @click="openEdit(a)">编辑</Button>
              <Button variant="outline" size="sm" @click="remove(a.id)">删除</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- 编辑对话框 -->
      <Dialog :open="editing" @update:open="(val) => editing = val">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑纪念日</DialogTitle>
          </DialogHeader>
          <form class="space-y-4" @submit.prevent="saveEdit">
            <div class="space-y-2">
              <Label for="edit-title">标题</Label>
              <Input id="edit-title" v-model="editTitle" placeholder="纪念日标题" />
            </div>
            <div class="space-y-2">
              <Label for="edit-date">日期</Label>
              <Input id="edit-date" v-model="editDate" type="date" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" @click="closeEdit">取消</Button>
              <Button type="submit">保存</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import DogHeader from '@/components/DogHeader.vue'
import EmptyState from '@/components/EmptyState.vue'
import { ref, onMounted } from 'vue'
import SkeletonList from '@/components/SkeletonList.vue'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
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


