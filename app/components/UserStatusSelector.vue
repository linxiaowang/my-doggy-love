<template>
  <div class="relative" ref="containerRef">
    <!-- 状态显示按钮 -->
    <button
      v-if="currentStatus"
      class="flex items-center gap-1 py-1 px-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors text-sm"
      @click="showPicker = !showPicker"
    >
      <span class="text-secondary-foreground">{{ currentStatus }}</span>
      <ChevronDown class="w-4 h-4 text-secondary-foreground/70" />
    </button>
    <button
      v-else
      class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary hover:bg-secondary/80 transition-colors text-sm text-secondary-foreground"
      @click="showPicker = !showPicker"
    >
      <span>设置状态</span>
    </button>

    <!-- 状态选择弹窗 -->
    <transition name="fade">
      <div
        v-if="showPicker"
        class="absolute right-0 top-full mt-2 w-64 rounded-lg border bg-popover shadow-lg z-50 overflow-hidden"
      >
        <div v-if="!showCustomInput" class="p-2">
          <div class="text-xs text-muted-foreground px-2 py-1 mb-1">选择一个状态</div>
          <div class="grid grid-cols-2 gap-1">
            <button
              v-for="status in statusOptions"
              :key="status.key"
              class="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-accent transition-colors"
              :class="{ 'bg-accent': currentStatus === status.label }"
              @click="selectStatus(status)"
            >
              <span class="text-2xl">{{ status.emoji }}</span>
              <span class="text-sm text-foreground">{{ status.label }}</span>
            </button>
          </div>
          <button
            class="w-full mt-2 px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors border"
            @click="showCustomInput = true"
          >
            <span class="flex items-center justify-center gap-1">
              <span>✏️</span>
              <span>自定义状态</span>
            </span>
          </button>
          <button
            v-if="currentStatus"
            class="w-full mt-2 px-3 py-2 text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors"
            @click="clearStatus"
          >
            清除状态
          </button>
        </div>
        <!-- 自定义输入区域 -->
        <div v-else class="p-3">
          <div class="text-xs text-muted-foreground mb-2">输入自定义状态</div>
          <input
            ref="customInputRef"
            v-model="customStatusText"
            type="text"
            placeholder="输入你的状态..."
            maxlength="20"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors"
            @keyup.enter="confirmCustomStatus"
            @keyup.esc="cancelCustomInput"
          />
          <div class="flex gap-2 mt-3">
            <button
              class="flex-1 px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors"
              @click="cancelCustomInput"
            >
              取消
            </button>
            <button
              class="flex-1 px-3 py-2 text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors"
              @click="confirmCustomStatus"
            >
              确定
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, inject } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { ChevronDown } from 'lucide-vue-next'

interface StatusOption {
  key: string
  label: string
  emoji: string
}

const props = defineProps<{
  currentStatus?: string | null
}>()

const emit = defineEmits<{
  (e: 'update', status: string | null): void
}>()

const showPicker = ref(false)
const showCustomInput = ref(false)
const customStatusText = ref('')
const customInputRef = ref<HTMLInputElement | null>(null)
const containerRef = ref(null)

onClickOutside(containerRef, () => {
  showPicker.value = false
})

// 注入父组件提供的关闭其他弹窗的方法
const closeOtherPopups = inject<() => void>('closeOtherPopups', () => {})

// 监听 showPicker 变化，打开时关闭其他弹窗
watch(showPicker, (newVal) => {
  if (newVal) {
    closeOtherPopups()
  }
})

// 当显示自定义输入时，自动聚焦输入框
watch(showCustomInput, async (newVal) => {
  if (newVal) {
    await nextTick()
    customInputRef.value?.focus()
  }
})

// 预设状态选项（参考微信）
const statusOptions: StatusOption[] = [
  { key: 'happy', label: '开心', emoji: '😊' },
  { key: 'busy', label: '忙碌', emoji: '💼' },
  { key: 'thinking', label: '在思考', emoji: '🤔' },
  { key: 'working', label: '工作中', emoji: '💻' },
  { key: 'relaxing', label: '休息中', emoji: '😌' },
  { key: 'eating', label: '吃饭中', emoji: '🍽️' },
  { key: 'sporting', label: '在运动', emoji: '🏃' },
  { key: 'traveling', label: '旅行中', emoji: '✈️' },
  { key: 'sleeping', label: '睡觉中', emoji: '😴' },
  { key: 'studying', label: '学习中', emoji: '📚' },
  { key: 'shopping', label: '购物中', emoji: '🛍️' },
  { key: 'loving', label: '恋爱中', emoji: '💕' },
]

function selectStatus(status: StatusOption) {
  emit('update', status.label)
  showPicker.value = false
  showCustomInput.value = false
}

function clearStatus() {
  emit('update', null)
  showPicker.value = false
  showCustomInput.value = false
}

function confirmCustomStatus() {
  const trimmed = customStatusText.value.trim()
  if (trimmed) {
    emit('update', trimmed)
    showPicker.value = false
    showCustomInput.value = false
    customStatusText.value = ''
  }
}

function cancelCustomInput() {
  showCustomInput.value = false
  customStatusText.value = ''
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

