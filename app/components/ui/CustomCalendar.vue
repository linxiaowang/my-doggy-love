<template>
  <div class="bg-white dark:bg-slate-800 rounded-lg shadow-lg border-2 border-slate-900 dark:border-slate-600 overflow-hidden">
    <div class="flex flex-col md:flex-row">

      <!-- 右侧/底部:日历主体 -->
      <div class="flex-1 p-3 md:p-4">
        <!-- 日历头部:年月切换 -->
        <div class="relative mb-4">
          <div class="flex items-start justify-between mb-3">
            <div class="flex flex-col">
              <button class="text-2xl md:text-3xl font-bold text-red-600 hover:text-red-700 dark:hover:text-red-500 transition-colors cursor-pointer drop-shadow-sm" @click="showYearPicker = !showYearPicker">
                {{ currentYear }}
              </button>
              <div class="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">{{ ganzhiYear }}</div>
            </div>
            <div class="flex items-center">
              <button class="text-2xl md:text-3xl font-bold text-yellow-500 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors cursor-pointer drop-shadow-sm" @click="showMonthPicker = !showMonthPicker">
                {{ currentMonth + 1 }}月
              </button>
            </div>
          </div>
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-700/80 p-0.5 text-xs">
              <button
                class="px-2.5 py-1 rounded-full transition-colors"
                :class="restMode === 'double' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500 dark:text-slate-400'"
                @click="setRestMode('double')"
              >
                双休
              </button>
              <button
                class="px-2.5 py-1 rounded-full transition-colors"
                :class="restMode === 'alternate' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500 dark:text-slate-400'"
                @click="setRestMode('alternate')"
              >
                大小周
              </button>
            </div>
            <div class="flex items-center gap-2">
              <button class="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200" @click="prevMonth" title="上一个月">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <Button v-if="!isCurrentMonth" class="px-3 py-1 text-sm bg-amber-600 hover:bg-amber-700 text-white shadow-sm rounded" @click="goToToday" title="回到今天">
                今天
              </Button>
              <button class="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200" @click="nextMonth" title="下一个月">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          <!-- 年份选择器 -->
          <div v-if="showYearPicker" ref="yearPickerRef" class="absolute top-full left-1/2 -translate-x-1/2 w-64 mt-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-20 p-4 max-h-64 overflow-y-auto">
            <div class="grid grid-cols-4 gap-2">
              <button
                v-for="year in yearRange"
                :key="year"
                class="px-3 py-2 text-sm rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-400"
                :class="year === currentYear ? 'bg-amber-600 text-white hover:bg-amber-700' : ''"
                @click="selectYear(year)"
              >
                {{ year }}
              </button>
            </div>
          </div>

          <!-- 月份选择器 -->
          <div v-if="showMonthPicker" ref="monthPickerRef" class="absolute top-full left-1/2 -translate-x-1/2 w-64 mt-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-20 p-4 max-h-64 overflow-y-auto">
            <div class="grid grid-cols-4 gap-2">
              <button
                v-for="(month, index) in monthNames"
                :key="index"
                class="px-3 py-2 text-sm rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-400"
                :class="index === currentMonth ? 'bg-amber-600 text-white hover:bg-amber-700' : ''"
                @click="selectMonth(index)"
              >
                {{ month }}
              </button>
            </div>
          </div>
        </div>

        <!-- 日历网格 -->
        <div class="w-full relative">
          <!-- 星期标题 -->
          <div class="grid grid-cols-7 gap-1 mb-2">
            <div
              v-for="(day, index) in weekdays"
              :key="day"
              class="text-center text-sm md:text-base font-semibold text-slate-900 dark:text-slate-100 py-2"
              :class="index >= 5 ? 'bg-red-500 text-white rounded-full w-8 h-8 mx-auto flex items-center justify-center shadow-sm' : ''"
            >
              {{ day }}
            </div>
          </div>

          <!-- 日期单元格 -->
          <div class="grid grid-cols-7 gap-1">
            <div
              v-for="(day, index) in calendarDays"
              :key="index"
              class="relative min-h-[64px] md:min-h-[84px] p-1.5 md:p-2 rounded-md border transition-all cursor-pointer flex flex-col items-center"
              :class="{
                'opacity-40': !day.isCurrentMonth,
                'border-amber-600 dark:border-amber-500 border-2 bg-amber-50 dark:bg-amber-900/30 shadow-sm': day.isToday,
                'border-transparent': !day.isToday,
                'bg-pink-50/60 dark:bg-pink-900/20': !day.isToday && day.anniversaries?.length && !day.isRestDay && !day.isMakeupWork,
                'bg-red-100 dark:bg-red-950/50 border-red-200/80 dark:border-red-800/60': !day.isToday && day.isRestDay,
                'bg-sky-50 dark:bg-sky-950/40 border-sky-200/80 dark:border-sky-800/50': !day.isToday && day.isMakeupWork,
                'hover:border-amber-600/50 hover:bg-amber-50/50 dark:hover:bg-amber-900/20': !day.isRestDay && !day.isMakeupWork && !day.isToday,
              }"
              @click="selectDate(day)"
            >
              <span
                v-if="day.restBadge"
                class="absolute top-0.5 left-0.5 z-10 text-[10px] md:text-[11px] font-bold leading-none px-1 py-0.5 rounded-sm shadow-sm"
                :class="day.restBadge === '休'
                  ? 'bg-red-500 text-white'
                  : 'bg-sky-600 text-white'"
              >
                {{ day.restBadge }}
              </span>
              <div v-if="day.anniversaries && day.anniversaries.length > 0" class="absolute top-0.5 right-0.5 z-10">
                <AnniversaryIcon :date="day.date" class="text-pink-400 drop-shadow-sm" />
              </div>
              <div
                class="text-base md:text-lg font-bold mb-0.5"
                :class="{
                  'text-red-600 dark:text-red-400': day.isRestDay,
                  'text-sky-700 dark:text-sky-300': day.isMakeupWork,
                  'text-slate-900 dark:text-slate-100': !day.isRestDay && !day.isMakeupWork && !day.isToday,
                  'text-amber-600 dark:text-amber-500': day.isToday,
                }"
              >
                {{ day.date }}
              </div>
              <div
                v-if="day.displayText"
                class="text-[10px] md:text-xs whitespace-nowrap w-full text-center leading-tight"
                :class="{
                  'text-red-600 dark:text-red-400 font-semibold': day.holidayName || day.isFestival,
                  'text-slate-500 dark:text-slate-400': !day.holidayName && !day.isFestival,
                }"
              >
                {{ day.displayText }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 黄历详情弹窗 -->
    <Teleport to="body">
      <transition name="fade">
        <div
          v-if="selectedDate && showDetailModal"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          @click.self="closeDetailModal"
        >
          <div class="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700">
            <div class="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
              <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">黄历详情</h3>
              <button class="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-400" @click="closeDetailModal">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div v-if="selectedDate" class="p-4 space-y-4">
              <!-- 公历日期 -->
              <div class="space-y-2">
                <div class="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">公历</div>
                <div class="text-base text-slate-900 dark:text-slate-100">{{ selectedDate.fullDate }}</div>
              </div>

              <!-- 农历日期 -->
              <div v-if="selectedDate.lunarFull" class="space-y-2">
                <div class="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">农历</div>
                <div class="text-base text-slate-900 dark:text-slate-100">{{ selectedDate.lunarFull }}</div>
              </div>

              <!-- 干支纪年 -->
              <div v-if="selectedDate.ganzhi" class="space-y-2">
                <div class="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">干支</div>
                <div class="text-base text-slate-900 dark:text-slate-100">{{ selectedDate.ganzhi }}</div>
              </div>

              <!-- 宜忌 -->
              <div v-if="selectedDate.yi || selectedDate.ji" class="space-y-2">
                <div v-if="selectedDate.yi" class="mb-2">
                  <div class="inline-block px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded mr-2">宜</div>
                  <div class="text-sm text-slate-600 dark:text-slate-400 mt-1">{{ selectedDate.yi }}</div>
                </div>
                <div v-if="selectedDate.ji" class="mb-2">
                  <div class="inline-block px-2 py-1 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded mr-2">忌</div>
                  <div class="text-sm text-slate-600 dark:text-slate-400 mt-1">{{ selectedDate.ji }}</div>
                </div>
              </div>

              <!-- 节气 -->
              <div v-if="selectedDate.jieqi" class="space-y-2">
                <div class="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">节气</div>
                <div class="text-base text-amber-600 dark:text-amber-500 font-semibold">{{ selectedDate.jieqi }}</div>
              </div>

              <!-- 法定节假日 / 调休 -->
              <div v-if="selectedDate.holidayName" class="space-y-2">
                <div class="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">节假日</div>
                <div class="text-base font-semibold" :class="selectedDate.isMakeupWork ? 'text-slate-700 dark:text-slate-200' : 'text-red-600 dark:text-red-400'">
                  {{ selectedDate.holidayName }}
                  <span class="ml-2 text-xs px-1.5 py-0.5 rounded text-white" :class="selectedDate.isMakeupWork ? 'bg-slate-500' : 'bg-red-500'">
                    {{ selectedDate.restBadge }}
                  </span>
                </div>
              </div>

              <!-- 纪念日 -->
              <div v-if="selectedDate.anniversaries && selectedDate.anniversaries.length > 0" class="space-y-2">
                <div class="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">纪念日</div>
                <div class="space-y-2">
                  <div
                    v-for="anniversary in selectedDate.anniversaries"
                    :key="anniversary.id"
                    class="px-3 py-2 bg-amber-50 dark:bg-amber-900/30 border border-amber-600/30 dark:border-amber-500/30 rounded text-sm text-slate-900 dark:text-slate-100"
                  >
                    {{ anniversary.title }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, h, defineComponent } from 'vue'
import { Solar, HolidayUtil } from 'lunar-typescript'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import { useAnniversaries } from '@/services/api/anniversaries'
import type { Anniversary } from '@/services/api/anniversaries'
import { onClickOutside, useLocalStorage } from '@vueuse/core'

dayjs.extend(isoWeek)

type RestMode = 'double' | 'alternate'
const REST_MODE_KEY = 'mdl-calendar-rest-mode'
const restMode = useLocalStorage<RestMode>(REST_MODE_KEY, 'double')

function setRestMode(mode: RestMode) {
  restMode.value = mode
}

/** 以「今天所在周」为单休周，下一周为双休周 */
const singleRestWeekParity = dayjs().isoWeek() % 2

function isAlternateSingleRestWeek(date: Date) {
  return dayjs(date).isoWeek() % 2 === singleRestWeekParity
}

function isScheduleRestDay(date: Date, mode: RestMode) {
  const day = date.getDay() // 0日 6六
  if (mode === 'double')
    return day === 0 || day === 6
  // 大小周：单休周只休周日，双休周休六+日
  if (isAlternateSingleRestWeek(date))
    return day === 0
  return day === 0 || day === 6
}

// 纪念日图标组件
const StarIcon = {
  render: () => h('svg', {
    class: 'w-4 h-4',
    fill: 'currentColor',
    viewBox: '0 0 24 24',
  }, [
    h('path', {
      d: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    }),
  ]),
}

const HeartIcon = {
  render: () => h('svg', {
    class: 'w-4 h-4',
    fill: 'currentColor',
    viewBox: '0 0 24 24',
  }, [
    h('path', {
      d: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
    }),
  ]),
}

const FlowerIcon = {
  render: () => h('svg', {
    class: 'w-4 h-4',
    fill: 'currentColor',
    viewBox: '0 0 24 24',
  }, [
    h('path', {
      d: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
    }),
  ]),
}

const weekdays = ['一', '二', '三', '四', '五', '六', '日']
const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']

// 当前显示的月份和年份
const currentDate = ref(new Date())
const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonth = computed(() => currentDate.value.getMonth())


// 选择器显示状态
const showYearPicker = ref(false)
const showMonthPicker = ref(false)
const yearPickerRef = ref<HTMLElement | null>(null)
const monthPickerRef = ref<HTMLElement | null>(null)

// 点击外部关闭选择器
onClickOutside(yearPickerRef, () => {
  showYearPicker.value = false
})
onClickOutside(monthPickerRef, () => {
  showMonthPicker.value = false
})

// 选中的日期和弹窗状态
const selectedDate = ref<any>(null)
const showDetailModal = ref(false)

// 获取纪念日数据
const { data: anniversariesData } = useAnniversaries()
const anniversaries = computed(() => anniversariesData.value?.items || [])

// 纪念日按日期分组（格式：YYYY-MM-DD）
const anniversariesByDate = computed(() => {
  const map = new Map<string, Anniversary[]>()
  anniversaries.value.forEach(anniversary => {
    const dateStr = dayjs(anniversary.date).format('YYYY-MM-DD')
    if (!map.has(dateStr)) {
      map.set(dateStr, [])
    }
    map.get(dateStr)!.push(anniversary)
  })
  return map
})

// 判断是否是当前月份
const isCurrentMonth = computed(() => {
  const today = new Date()
  return currentYear.value === today.getFullYear() && currentMonth.value === today.getMonth()
})

// 计算干支纪年
const ganzhiYear = computed(() => {
  try {
    const solar = Solar.fromYmd(currentYear.value, currentMonth.value + 1, 1)
    const lunarObj = solar.getLunar()
    const yearGanzhi = lunarObj.getYearInGanZhi()
    const zodiac = lunarObj.getYearShengXiao()
    return `${yearGanzhi}年 ${zodiac}年`
  } catch (e) {
    return ''
  }
})

// 年份范围（当前年份前后各10年）
const yearRange = computed(() => {
  const current = currentYear.value
  const years = []
  for (let i = current - 10; i <= current + 10; i++) {
    years.push(i)
  }
  return years
})

// 计算日历天数
const calendarDays = computed(() => {
  // 依赖排班模式，切换双休/大小周时重算
  const _mode = restMode.value
  void _mode
  const year = currentYear.value
  const month = currentMonth.value
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`
  
  // 获取当月第一天和最后一天
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  // 获取第一天是星期几（0=周日，需要转换为1=周一）
  let firstDayWeek = firstDay.getDay()
  firstDayWeek = firstDayWeek === 0 ? 7 : firstDayWeek
  
  // 计算需要的行数
  const totalDays = lastDay.getDate() + (firstDayWeek - 1)
  const rowsNeeded = Math.ceil(totalDays / 7)
  
  // 需要显示的天数（包括上个月的末尾和下个月的开头）
  const days: any[] = []
  
  // 上个月的末尾日期
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = firstDayWeek - 1; i > 0; i--) {
    const date = prevMonthLastDay - i + 1
    const fullDate = new Date(year, month - 1, date)
    days.push(createDayData(fullDate, false, todayStr))
  }
  
  // 当月的日期
  for (let date = 1; date <= lastDay.getDate(); date++) {
    const fullDate = new Date(year, month, date)
    days.push(createDayData(fullDate, true, todayStr))
  }
  
  // 下个月的开头日期（补齐到整行）
  const remainingDays = (rowsNeeded * 7) - days.length
  for (let date = 1; date <= remainingDays; date++) {
    const fullDate = new Date(year, month + 1, date)
    days.push(createDayData(fullDate, false, todayStr))
  }
  
  return days
})

// 创建日期数据
function createDayData(date: Date, isCurrentMonth: boolean, _todayStr: string) {
  const today = new Date()
  const isToday = date.getFullYear() === today.getFullYear() &&
                  date.getMonth() === today.getMonth() &&
                  date.getDate() === today.getDate()

  const dayOfWeek = date.getDay()
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

  // 法定节假日 / 调休（HolidayUtil）
  let holidayName = ''
  let isOfficialRest = false
  let isMakeupWork = false
  const holiday = HolidayUtil.getHoliday(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  )
  if (holiday) {
    holidayName = holiday.getName()
    isMakeupWork = holiday.isWork()
    isOfficialRest = !holiday.isWork()
  }

  const scheduleRest = isScheduleRestDay(date, restMode.value)
  // 调休上班优先；否则法定放假或排班休息日
  const isRestDay = isMakeupWork ? false : (isOfficialRest || scheduleRest)
  // 所有休息日都标「休」，调休上班标「班」，方便一眼区分大小周
  const restBadge = isMakeupWork ? '班' : (isRestDay ? '休' : '')

  // 计算农历
  let lunar = ''
  let lunarFull = ''
  let ganzhi = ''
  let yi = ''
  let ji = ''
  let jieqi = ''
  let displayText = ''
  let isFestival = false

  try {
    const solar = Solar.fromDate(date)
    const lunarObj = solar.getLunar()

    lunar = lunarObj.getDayInChinese()
    lunarFull = lunarObj.toFullString()
    ganzhi = `${lunarObj.getYearInGanZhi()}年 ${lunarObj.getMonthInGanZhi()}月 ${lunarObj.getDayInGanZhi()}日`

    const yiList = lunarObj.getDayYi()
    const jiList = lunarObj.getDayJi()
    if (yiList && yiList.length > 0)
      yi = yiList.join(' ')
    if (jiList && jiList.length > 0)
      ji = jiList.join(' ')

    // 展示优先级：法定节假日名 > 节气 > 农历节日 > 公历节日 > 农历日
    if (holidayName) {
      displayText = holidayName.replace(/节$/, '') || holidayName
      isFestival = true
    }

    const jieqiStr = lunarObj.getJieQi()
    if (jieqiStr) {
      jieqi = jieqiStr
      if (!displayText) {
        displayText = jieqi
        isFestival = true
      }
    }

    if (!displayText) {
      const festivals = lunarObj.getFestivals()
      if (festivals && festivals.length > 0) {
        displayText = festivals[0] as string
        isFestival = true
      }
    }

    // 不展示西方节日（万圣节等），避免冲淡法定假日/休息日
    if (!displayText)
      displayText = lunar
  }
  catch (e) {
    console.error('计算农历失败:', e, date)
  }

  const dateKey = dayjs(date).format('YYYY-MM-DD')
  const dayAnniversaries = anniversariesByDate.value.get(dateKey) || []

  return {
    date: date.getDate(),
    fullDate: dayjs(date).format('YYYY年MM月DD日'),
    dateKey,
    isCurrentMonth,
    isToday,
    isWeekend,
    isRestDay,
    isMakeupWork,
    isOfficialRest,
    holidayName,
    restBadge,
    lunar,
    lunarFull,
    ganzhi,
    yi,
    ji,
    jieqi,
    displayText,
    isFestival,
    anniversaries: dayAnniversaries,
  }
}

// 纪念日图标组件
const AnniversaryIcon = defineComponent({
  props: {
    date: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    // 根据日期选择不同的图标，使图标更丰富
    const iconIndex = props.date % 3
    const icons = [StarIcon, HeartIcon, FlowerIcon]
    const IconComponent = icons[iconIndex]
    
    return () => h(IconComponent as any, { class: 'anniversary-icon' })
  },
})

// 月份切换
function prevMonth() {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() - 1)
  currentDate.value = newDate
  showYearPicker.value = false
  showMonthPicker.value = false
}

function nextMonth() {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() + 1)
  currentDate.value = newDate
  showYearPicker.value = false
  showMonthPicker.value = false
}

function goToToday() {
  currentDate.value = new Date()
  showYearPicker.value = false
  showMonthPicker.value = false
}

// 选择年份
function selectYear(year: number) {
  const newDate = new Date(currentDate.value)
  newDate.setFullYear(year)
  currentDate.value = newDate
  showYearPicker.value = false
}

// 选择月份
function selectMonth(month: number) {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(month)
  currentDate.value = newDate
  showMonthPicker.value = false
}

// 选择日期
function selectDate(day: any) {
  selectedDate.value = day
  showDetailModal.value = true
}

// 关闭详情弹窗
function closeDetailModal() {
  showDetailModal.value = false
  setTimeout(() => {
    selectedDate.value = null
  }, 300)
}

// 监听弹窗状态，控制背景滚动
watch(showDetailModal, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>


<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

