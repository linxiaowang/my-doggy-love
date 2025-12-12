<template>
  <div class="bg-white rounded-lg shadow-lg border-2 border-black overflow-hidden">
    <div class="flex flex-col md:flex-row">

      <!-- 右侧/底部：日历主体 -->
      <div class="flex-1 p-3 md:p-4">
        <!-- 日历头部：年月切换 -->
        <div class="relative mb-4">
          <div class="flex items-start justify-between mb-3">
            <div class="flex flex-col">
              <button class="text-2xl md:text-3xl font-bold text-red-600 hover:text-red-700 transition-colors cursor-pointer drop-shadow-sm" @click="showYearPicker = !showYearPicker">
                {{ currentYear }}
              </button>
              <div class="text-xs md:text-sm text-[#666] mt-1 font-medium">{{ ganzhiYear }}</div>
            </div>
            <div class="flex items-center">
              <button class="text-2xl md:text-3xl font-bold text-yellow-500 hover:text-yellow-600 transition-colors cursor-pointer drop-shadow-sm" @click="showMonthPicker = !showMonthPicker">
                {{ currentMonth + 1 }}月
              </button>
            </div>
          </div>
          <div class="flex items-center justify-end gap-2">
            <button class="p-2 rounded hover:bg-[#f7f6f3] transition-colors text-[#666] hover:text-[#333]" @click="prevMonth" title="上一个月">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button v-if="!isCurrentMonth" class="ml-auto px-3 py-1 text-sm bg-[#d4a574] text-white hover:bg-[#c49564] shadow-sm rounded" @click="goToToday" title="回到今天">
              今天
            </button>
            <button class="p-2 rounded hover:bg-[#f7f6f3] transition-colors text-[#666] hover:text-[#333]" @click="nextMonth" title="下一个月">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          <!-- 年份选择器 -->
          <div v-if="showYearPicker" ref="yearPickerRef" class="absolute top-full left-1/2 -translate-x-1/2 w-64 mt-2 bg-white/95 backdrop-blur-md border border-[#ece7e1] rounded-lg shadow-lg z-20 p-4 max-h-64 overflow-y-auto">
            <div class="grid grid-cols-4 gap-2">
              <button
                v-for="year in yearRange"
                :key="year"
                class="px-3 py-2 text-sm rounded hover:bg-[#f7f6f3] transition-colors text-[#666]"
                :class="year === currentYear ? 'bg-[#d4a574] text-white hover:bg-[#c49564]' : ''"
                @click="selectYear(year)"
              >
                {{ year }}
              </button>
            </div>
          </div>
          
          <!-- 月份选择器 -->
          <div v-if="showMonthPicker" ref="monthPickerRef" class="absolute top-full left-1/2 -translate-x-1/2 w-64 mt-2 bg-white/95 backdrop-blur-md border border-[#ece7e1] rounded-lg shadow-lg z-20 p-4 max-h-64 overflow-y-auto">
            <div class="grid grid-cols-4 gap-2">
              <button
                v-for="(month, index) in monthNames"
                :key="index"
                class="px-3 py-2 text-sm rounded hover:bg-[#f7f6f3] transition-colors text-[#666]"
                :class="index === currentMonth ? 'bg-[#d4a574] text-white hover:bg-[#c49564]' : ''"
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
              class="text-center text-sm md:text-base font-semibold text-[#333] py-2"
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
              class="relative min-h-[60px] md:min-h-[80px] p-2 rounded border border-transparent hover:border-[#d4a574]/50 hover:bg-[#fff9f0] transition-all cursor-pointer flex flex-col items-center"
              :class="{
                'opacity-40': !day.isCurrentMonth,
                'bg-[#fff5e6] border-2 border-[#d4a574] shadow-sm': day.isToday,
                'bg-pink-50/50': day.anniversaries && day.anniversaries.length > 0,
                'bg-red-50/20': day.isWeekend,
              }"
              @click="selectDate(day)"
            >
              <div class="text-sm md:text-base font-semibold text-[#333] mb-0.5" :class="{ 'text-red-600': day.isWeekend, 'text-[#d4a574] font-bold': day.isToday }">{{ day.date }}</div>
              <div v-if="day.displayText" class="text-xs text-[#666] whitespace-nowrap w-full text-center" :class="{ 'text-red-600 font-medium': day.isFestival }">
                {{ day.displayText }}
              </div>
              <div v-else-if="day.lunar" class="text-xs text-[#666] whitespace-nowrap w-full text-center">{{ day.lunar }}</div>
              <div v-if="day.anniversaries && day.anniversaries.length > 0" class="absolute top-1 right-1">
                <AnniversaryIcon :date="day.date" class="text-pink-400 drop-shadow-sm" />
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
          <div class="bg-white/95 backdrop-blur-md rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto border border-white/20">
            <div class="flex items-center justify-between p-4 border-b border-[#ece7e1]">
              <h3 class="text-lg font-semibold text-[#333]">黄历详情</h3>
              <button class="p-1 rounded hover:bg-[#f7f6f3] transition-colors text-[#666]" @click="closeDetailModal">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div v-if="selectedDate" class="p-4 space-y-4">
              <!-- 公历日期 -->
              <div class="space-y-2">
                <div class="text-sm font-medium text-[#666] mb-1">公历</div>
                <div class="text-base text-[#333]">{{ selectedDate.fullDate }}</div>
              </div>
              
              <!-- 农历日期 -->
              <div v-if="selectedDate.lunarFull" class="space-y-2">
                <div class="text-sm font-medium text-[#666] mb-1">农历</div>
                <div class="text-base text-[#333]">{{ selectedDate.lunarFull }}</div>
              </div>
              
              <!-- 干支纪年 -->
              <div v-if="selectedDate.ganzhi" class="space-y-2">
                <div class="text-sm font-medium text-[#666] mb-1">干支</div>
                <div class="text-base text-[#333]">{{ selectedDate.ganzhi }}</div>
              </div>
              
              <!-- 宜忌 -->
              <div v-if="selectedDate.yi || selectedDate.ji" class="space-y-2">
                <div v-if="selectedDate.yi" class="mb-2">
                  <div class="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded mr-2">宜</div>
                  <div class="text-sm text-[#666] mt-1">{{ selectedDate.yi }}</div>
                </div>
                <div v-if="selectedDate.ji" class="mb-2">
                  <div class="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded mr-2">忌</div>
                  <div class="text-sm text-[#666] mt-1">{{ selectedDate.ji }}</div>
                </div>
              </div>
              
              <!-- 节气 -->
              <div v-if="selectedDate.jieqi" class="space-y-2">
                <div class="text-sm font-medium text-[#666] mb-1">节气</div>
                <div class="text-base text-[#d4a574] font-semibold">{{ selectedDate.jieqi }}</div>
              </div>
              
              <!-- 纪念日 -->
              <div v-if="selectedDate.anniversaries && selectedDate.anniversaries.length > 0" class="space-y-2">
                <div class="text-sm font-medium text-[#666] mb-1">纪念日</div>
                <div class="space-y-2">
                  <div
                    v-for="anniversary in selectedDate.anniversaries"
                    :key="anniversary.id"
                    class="px-3 py-2 bg-[#fff9f0] border border-[#d4a574]/30 rounded text-sm text-[#333]"
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
import { ref, computed, watch, onMounted, h, defineComponent } from 'vue'
import { Solar, Lunar } from 'lunar-typescript'
import dayjs from 'dayjs'
import { useAnniversaries } from '@/services/api/anniversaries'
import type { Anniversary } from '@/services/api/anniversaries'
import { onClickOutside } from '@vueuse/core'

// 导入月份背景图片
const bgImages = import.meta.glob('@/assets/images/*.jpg', { eager: true, import: 'default' })

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
function createDayData(date: Date, isCurrentMonth: boolean, todayStr: string) {
  const today = new Date()
  const isToday = date.getFullYear() === today.getFullYear() &&
                  date.getMonth() === today.getMonth() &&
                  date.getDate() === today.getDate()
  
  // 判断是否为周末
  const dayOfWeek = date.getDay()
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
  
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
    
    // 农历日期（简化显示）
    lunar = lunarObj.getDayInChinese()
    
    // 完整农历信息
    lunarFull = lunarObj.toFullString()
    
    // 干支纪年
    ganzhi = `${lunarObj.getYearInGanZhi()}年 ${lunarObj.getMonthInGanZhi()}月 ${lunarObj.getDayInGanZhi()}日`
    
    // 宜忌
    const yiList = lunarObj.getDayYi()
    const jiList = lunarObj.getDayJi()
    if (yiList && yiList.length > 0) {
      yi = yiList.join(' ')
    }
    if (jiList && jiList.length > 0) {
      ji = jiList.join(' ')
    }
    
    // 节气（优先显示）
    const jieqiStr = lunarObj.getJieQi()
    if (jieqiStr) {
      jieqi = jieqiStr
      displayText = jieqi
      isFestival = true
    }
    
    // 传统节日（如果没有节气，则显示节日）
    if (!displayText) {
      const festivals = lunarObj.getFestivals()
      if (festivals && festivals.length > 0) {
        displayText = festivals[0] as string
        isFestival = true
      }
    }
    
    // 如果既没有节气也没有节日，显示农历日期
    if (!displayText) {
      displayText = lunar
    }
  } catch (e) {
    console.error('计算农历失败:', e, date)
  }
  
  // 获取该日期的纪念日
  const dateKey = dayjs(date).format('YYYY-MM-DD')
  const dayAnniversaries = anniversariesByDate.value.get(dateKey) || []
  
  return {
    date: date.getDate(),
    fullDate: dayjs(date).format('YYYY年MM月DD日'),
    dateKey,
    isCurrentMonth,
    isToday,
    isWeekend,
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

