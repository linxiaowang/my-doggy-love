<template>
  <div class="relative">
    <!-- 状态显示按钮 -->
    <button
      v-if="currentStatus"
      class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-#f0f0f0 hover:bg-#e0e0e0 transition text-sm"
      @click="showPicker = !showPicker"
    >
      <span class="text-#666">{{ currentStatus }}</span>
      <span class="text-#999 text-xs">▼</span>
    </button>
    <button
      v-else
      class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-#f0f0f0 hover:bg-#e0e0e0 transition text-sm text-#999"
      @click="showPicker = !showPicker"
    >
      <span>设置状态</span>
    </button>

    <!-- 状态选择弹窗 -->
    <transition name="fade">
      <div
        v-if="showPicker"
        class="absolute right-0 top-full mt-2 w-64 rounded-lg border border-#ece7e1 bg-white shadow-lg z-50 overflow-hidden"
      >
        <div v-if="!showCustomInput" class="p-2">
          <div class="text-xs text-#999 px-2 py-1 mb-1">选择一个状态</div>
          <div class="grid grid-cols-2 gap-1">
            <button
              v-for="status in statusOptions"
              :key="status.key"
              class="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-#f7f6f3 transition"
              :class="{ 'bg-#e8f4f8': currentStatus === status.label }"
              @click="selectStatus(status)"
            >
              <span class="text-2xl">{{ status.emoji }}</span>
              <span class="text-sm">{{ status.label }}</span>
            </button>
          </div>
          <button
            class="w-full mt-2 px-3 py-2 text-sm text-#666 hover:bg-#f7f6f3 rounded-lg transition border border-#ece7e1"
            @click="showCustomInput = true"
          >
            <span class="flex items-center justify-center gap-1">
              <span>✏️</span>
              <span>自定义状态</span>
            </span>
          </button>
          <button
            v-if="currentStatus"
            class="w-full mt-2 px-3 py-2 text-sm text-#999 hover:bg-#f7f6f3 rounded-lg transition"
            @click="clearStatus"
          >
            清除状态
          </button>
        </div>
        <!-- 自定义输入区域 -->
        <div v-else class="p-3">
          <div class="text-xs text-#999 mb-2">输入自定义状态</div>
          <input
            ref="customInputRef"
            v-model="customStatusText"
            type="text"
            placeholder="输入你的状态..."
            maxlength="20"
            class="w-full px-3 py-2 border border-#ece7e1 rounded-lg focus:outline-none focus:ring-2 focus:ring-#d4a574 focus:border-transparent"
            @keyup.enter="confirmCustomStatus"
            @keyup.esc="cancelCustomInput"
          />
          <div class="flex gap-2 mt-3">
            <button
              class="flex-1 px-3 py-2 text-sm bg-#f7f6f3 hover:bg-#e8e8e8 rounded-lg transition"
              @click="cancelCustomInput"
            >
              取消
            </button>
            <button
              class="flex-1 px-3 py-2 text-sm bg-#d4a574 text-white hover:bg-#c49564 rounded-lg transition"
              @click="confirmCustomStatus"
            >
              确定
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- 遮罩层，点击关闭弹窗 -->
    <transition name="fade">
      <div
        v-if="showPicker"
        class="fixed inset-0 z-40"
        @click="showPicker = false"
      />
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

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

