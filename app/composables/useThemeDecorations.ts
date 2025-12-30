import { ref, computed } from 'vue'

export type ThemeDecoration = 'none' | 'new-year-2026'

// 从 localStorage 读取用户偏好,或使用默认值
const STORAGE_KEY = 'theme-decoration'

function getStoredDecoration(): ThemeDecoration {
  if (typeof window === 'undefined') return 'none'

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && ['none', 'new-year-2026'].includes(stored)) {
      return stored as ThemeDecoration
    }
  } catch (e) {
    console.error('Failed to read theme decoration from localStorage:', e)
  }

  // 默认根据月份自动选择
  const month = new Date().getMonth() + 1
  const year = new Date().getFullYear()

  // 2026年1月或2025年12月: 新年装饰
  if ((year === 2025 && month === 12) || (year === 2026 && (month === 1 || month === 2))) {
    return 'new-year-2026'
  }

  return 'none'
}

const currentDecoration = ref<ThemeDecoration>(getStoredDecoration())

export function useThemeDecorations() {
  const isDecorationActive = computed(() => currentDecoration.value !== 'none')

  const isNewYear2026 = computed(() => currentDecoration.value === 'new-year-2026')

  function setDecoration(decoration: ThemeDecoration) {
    currentDecoration.value = decoration

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, decoration)
      } catch (e) {
        console.error('Failed to save theme decoration to localStorage:', e)
      }
    }
  }

  function toggleDecoration() {
    // 循环切换: none -> new-year-2026 -> none
    setDecoration(currentDecoration.value === 'none' ? 'new-year-2026' : 'none')
  }

  // 自动根据月份设置装饰
  function autoSetDecorationByMonth() {
    const month = new Date().getMonth() + 1
    const year = new Date().getFullYear()

    // 2025年12月或2026年1-2月: 马年新年
    if ((year === 2025 && month === 12) || (year === 2026 && (month === 1 || month === 2))) {
      setDecoration('new-year-2026')
    } else {
      setDecoration('none')
    }
  }

  return {
    currentDecoration: computed(() => currentDecoration.value),
    isDecorationActive,
    isNewYear: isNewYear2026,
    isNewYear2026,
    setDecoration,
    toggleDecoration,
    autoSetDecorationByMonth,
  }
}
