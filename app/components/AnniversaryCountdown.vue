<template>
  <div v-if="!loading && upcomingAnniversary" class="card">
    <div class="flex items-center gap-3 md:gap-4">
      <LineDogSticker
        :slug="stickerSlug"
        size="md"
        wobble
        class="shrink-0"
      />
      <div class="flex-1 min-w-0 text-left">
        <div class="text-xs text-muted-foreground mb-1">纪念日提醒</div>
        <div class="text-base font-semibold text-foreground mb-0.5 truncate">{{ upcomingAnniversary.title }}</div>
        <div class="text-xs text-muted-foreground">
          {{ formatDate(upcomingAnniversary.date) }}
        </div>
      </div>
      <div class="text-right shrink-0">
        <div
          v-if="countdown.days === 0"
          class="text-sm md:text-base font-bold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/40 px-2.5 py-1.5 rounded-lg whitespace-nowrap"
        >
          就是今天！
        </div>
        <div v-else-if="countdown.overdue" class="text-right">
          <div class="text-xs text-muted-foreground mb-0.5">已经</div>
          <div
            class="text-xl font-bold text-red-600 dark:text-red-400 cursor-pointer hover:opacity-80 transition-opacity"
            title="点击切换显示格式"
            @click="toggleFormat"
          >
            {{ displayText }}
          </div>
        </div>
        <div v-else class="text-right">
          <div class="text-xs text-muted-foreground mb-0.5">还有</div>
          <div
            class="text-xl font-bold text-primary cursor-pointer hover:opacity-80 transition-opacity"
            title="点击切换显示格式"
            @click="toggleFormat"
          >
            {{ displayText }}
          </div>
        </div>
      </div>
    </div>
    <NuxtLink
      to="/anniversaries"
      class="mt-3 block text-center text-xs text-muted-foreground hover:text-foreground underline transition-colors"
    >
      查看所有纪念日 →
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { apiFetch } from '@/services/api'
import type { Anniversary } from '@/services/api/anniversaries'
import dayjs from 'dayjs'

interface AnniversaryCountdown {
  days: number
  overdue: boolean
}

const anniversaries = ref<Anniversary[]>([])
const loading = ref(true)

// 显示格式类型
type FormatType = 'days' | 'weeks' | 'months' | 'years'

// 当前显示格式
const formatType = ref<FormatType>('days')

// 计算倒计时信息
function calculateCountdown(anniversary: Anniversary): AnniversaryCountdown {
  const today = new Date()
  const date = new Date(anniversary.date)
  // 清零时分秒，避免时区导致的跨天误差
  const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
  const t1 = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
  const diffDays = Math.round((t1 - t0) / (24 * 60 * 60 * 1000))
  return {
    days: diffDays,
    overdue: diffDays < 0
  }
}

// 格式化日期
function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}月${day}日`
}

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

// 切换显示格式
function toggleFormat() {
  const absDays = Math.abs(countdown.value.days)
  
  // 根据当前天数决定可用的格式
  if (absDays >= 365) {
    // 超过一年：天 -> 周 -> 月 -> 年 -> 天
    if (formatType.value === 'days') {
      formatType.value = 'weeks'
    } else if (formatType.value === 'weeks') {
      formatType.value = 'months'
    } else if (formatType.value === 'months') {
      formatType.value = 'years'
    } else {
      formatType.value = 'days'
    }
  } else if (absDays >= 30) {
    // 超过一月但不足一年：天 -> 周 -> 月 -> 天
    if (formatType.value === 'days') {
      formatType.value = 'weeks'
    } else if (formatType.value === 'weeks') {
      formatType.value = 'months'
    } else {
      formatType.value = 'days'
    }
  } else if (absDays >= 7) {
    // 超过一周但不足一年：天 -> 周 -> 天
    if (formatType.value === 'days') {
      formatType.value = 'weeks'
    } else {
      formatType.value = 'days'
    }
  }
  // 不足一周：只有天数格式，不切换
}

// 当前显示的文本
const displayText = computed(() => {
  if (countdown.value.days === 0) {
    return ''
  }
  return formatCountdown(countdown.value.days, formatType.value, upcomingAnniversary.value?.date)
})

// 获取即将到来的纪念日（优先显示未来的，如果没有则显示最近的已过的）
const upcomingAnniversary = computed<Anniversary | null>(() => {
  if (anniversaries.value.length === 0) return null
  
  // 先找未来的纪念日
  const future = anniversaries.value
    .map(a => ({ anniversary: a, countdown: calculateCountdown(a) }))
    .filter(item => !item.countdown.overdue)
    .sort((a, b) => a.countdown.days - b.countdown.days)
  
  if (future.length > 0 && future[0]) {
    return future[0].anniversary
  }
  
  // 如果没有未来的，显示最近的已过的
  const past = anniversaries.value
    .map(a => ({ anniversary: a, countdown: calculateCountdown(a) }))
    .filter(item => item.countdown.overdue)
    .sort((a, b) => b.countdown.days - a.countdown.days)
  
  return (past.length > 0 && past[0]) ? past[0].anniversary : null
})

// 当前选中纪念日的倒计时
const countdown = computed(() => {
  if (!upcomingAnniversary.value) {
    return { days: 0, overdue: false }
  }
  return calculateCountdown(upcomingAnniversary.value)
})

const stickerSlug = computed(() => {
  if (countdown.value.days === 0)
    return 'celebrate' as const
  if (countdown.value.overdue)
    return 'hug' as const
  return 'heart' as const
})

// 当纪念日改变时，重置格式为默认
watch(upcomingAnniversary, () => {
  formatType.value = 'days'
})

async function loadAnniversaries() {
  loading.value = true
  try {
    const res = await apiFetch<{ items: Anniversary[] }>('/api/anniversaries')
    anniversaries.value = res.items || []
  } catch (e: any) {
    console.error('加载纪念日失败:', e)
    anniversaries.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadAnniversaries()
})
</script>

