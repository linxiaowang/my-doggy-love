<template>
  <div class="border-t bg-muted/30 p-4">
    <div class="flex items-end gap-2 max-w-4xl mx-auto bg-background rounded-2xl border shadow-sm p-2 relative">
      <div class="flex-1 relative min-h-[44px]">
        <Textarea
          ref="textareaRef"
          v-model="input"
          :placeholder="placeholder"
          :disabled="disabled"
          rows="1"
          class="min-h-[36px] max-h-[200px] resize-none overflow-y-auto border-0 focus-visible:ring-0 bg-transparent px-3"
          @keydown="handleKeydown"
          @input="handleInput"
        />
        <!-- 字符计数（仅长消息时显示） -->
        <span
          v-if="input.length > 100"
          class="absolute bottom-1.5 right-2 text-xs text-muted-foreground"
        >
          {{ input.length }} / 2000
        </span>

        <!-- @ 提及选择器 -->
        <Transition name="dropdown">
          <div
            v-if="showMentionMenu"
            class="absolute bottom-full left-0 mb-2 w-64 bg-background rounded-lg border shadow-lg z-50 overflow-hidden"
          >
            <div class="p-1">
              <div
                v-for="(item, index) in mentionOptions"
                :key="item.id"
                class="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors"
                :class="selectedIndex === index ? 'bg-muted' : 'hover:bg-muted/50'"
                @click="selectMention(item)"
                @mouseenter="selectedIndex = index"
              >
                <Avatar class="w-6 h-6 bg-muted overflow-hidden">
                  <img
                    :src="item.avatar || (item.id === 'ai' ? '/assets/stickers/line-dog/hehe.gif' : '/assets/stickers/line-dog/love.gif')"
                    :alt="item.name"
                    class="w-full h-full object-cover"
                  >
                </Avatar>
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium truncate">{{ item.name }}</div>
                  <div v-if="item.description" class="text-xs text-muted-foreground truncate">{{ item.description }}</div>
                </div>
              </div>
            </div>
            <div class="border-t px-3 py-2 text-xs text-muted-foreground bg-muted/30">
              使用 ↑↓ 选择，Enter 确认，Esc 取消
            </div>
          </div>
        </Transition>
      </div>
      <Button
        :disabled="disabled || !input.trim()"
        size="icon"
        class="h-9 w-9 flex-shrink-0 transition-all mb-0.5"
        @click="handleSend"
      >
        <svg
          v-if="!disabled"
          :class="['w-4 h-4 transition-transform', input.trim() ? 'translate-x-0.5 translate-y-0.5' : '']"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
        <svg
          v-else
          class="w-4 h-4 animate-spin"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </Button>
    </div>
    <!-- AI 提示指示器（仅情侣会话且检测到 @AI 时显示） -->
    <div
      v-if="hasAIMention && isCoupleConversation"
      class="text-xs text-primary text-center mt-2 flex items-center justify-center gap-1"
    >
      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      AI 将回复
    </div>
    <p v-else class="text-xs text-muted-foreground text-center mt-2">
      Enter 发送，Shift + Enter 换行
      <span v-if="isCoupleConversation" class="ml-2 text-muted-foreground/70">
        输入 <span class="font-mono">@</span> 来提及 AI 或伴侣
      </span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { useAuth } from '@/composables/useAuth'

const props = defineProps<{
  disabled?: boolean
  placeholder?: string
  autoFocus?: boolean
  isCoupleConversation?: boolean // 是否是情侣会话
}>()

const emit = defineEmits<{
  send: [message: string]
}>()

const { user: currentUser } = useAuth()
const input = ref('')
const textareaRef = ref<any>()

// @ 提及菜单状态
const showMentionMenu = ref(false)
const mentionQuery = ref('')
const selectedIndex = ref(0)
const mentionTriggerPos = ref(0)

// 提及选项
const mentionOptions = computed(() => {
  const options = [
    {
      id: 'ai',
      name: 'AI',  // 去掉 @ 符号
      displayName: 'AI',
      icon: '🤖',
      description: '调用 AI 助手',
      avatar: null,
    },
  ]

  // TODO: 添加伴侣提及选项（需要后端 API 提供伴侣信息）
  // if (props.isCoupleConversation && currentUser?.partner) {
  //   options.push({
  //     id: 'partner',
  //     name: currentUser.partner.nickName,  // 去掉 @ 符号
  //     displayName: currentUser.partner.nickName,
  //     icon: null,
  //     description: '提及你的伴侣',
  //     avatar: currentUser.partner.avatarUrl,
  //   })
  // }

  // 根据查询过滤
  if (mentionQuery.value) {
    return options.filter(item =>
      item.displayName.toLowerCase().includes(mentionQuery.value.toLowerCase())
    )
  }

  return options
})

// 检测 @AI 提及（仅情侣会话）
const hasAIMention = computed(() => {
  if (!props.isCoupleConversation) return false
  const trimmed = input.value.trimStart()
  return trimmed.startsWith('@AI ') ||
         trimmed.startsWith('@ai ') ||
         trimmed.startsWith('@AI') ||
         trimmed.startsWith('@ai')
})

const dialog = useAppDialog()

async function handleSend() {
  const message = input.value.trim()
  if (!message || props.disabled)
    return
  if (message.length > 2000) {
    await dialog.alert('消息过长，请控制在 2000 字以内')
    return
  }

  emit('send', message)
  input.value = ''

  // 重置高度并聚焦
  nextTick(() => {
    const textarea = textareaRef.value?.$el as HTMLTextAreaElement
    console.log({ textarea });
    
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.focus()
    }
  })
}

function handleKeydown(e: KeyboardEvent) {
  // 如果提及菜单打开，处理键盘导航
  if (showMentionMenu.value) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      selectedIndex.value = (selectedIndex.value + 1) % mentionOptions.value.length
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      selectedIndex.value = (selectedIndex.value - 1 + mentionOptions.value.length) % mentionOptions.value.length
    } else if (e.key === 'Enter') {
      e.preventDefault()
      selectMention(mentionOptions.value[selectedIndex.value])
    } else if (e.key === 'Escape') {
      e.preventDefault()
      closeMentionMenu()
    }
    return
  }

  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

function handleInput(e: Event) {
  adjustHeight(e)

  const target = e.target as HTMLTextAreaElement
  const value = input.value
  const cursorPosition = target.selectionStart

  // 检测是否刚刚输入了 @
  if (value[cursorPosition - 1] === '@') {
    // 检查是否已经在消息开头，或前面有空格（避免在邮箱中间触发）
    const beforeAt = value.slice(0, cursorPosition - 1)
    if (beforeAt === '' || beforeAt.endsWith(' ')) {
      openMentionMenu(cursorPosition - 1)
      return
    }
  }

  // 如果菜单已打开，更新查询
  if (showMentionMenu.value) {
    const textAfterTrigger = value.slice(mentionTriggerPos.value + 1, cursorPosition)
    if (!textAfterTrigger.includes(' ')) {
      mentionQuery.value = textAfterTrigger
    } else {
      // 用户输入了空格，关闭菜单但保留 @
      closeMentionMenu()
    }
  }
}

function openMentionMenu(position: number) {
  showMentionMenu.value = true
  mentionQuery.value = ''
  selectedIndex.value = 0
  mentionTriggerPos.value = position
}

function closeMentionMenu() {
  showMentionMenu.value = false
  mentionQuery.value = ''
  selectedIndex.value = 0
}

function selectMention(item: any) {
  console.log('[ChatInput] selectMention called:', {
    item,
    inputValue: input.value,
    inputValueLength: input.value.length,
    mentionTriggerPos: mentionTriggerPos.value,
  })

  // 关键修复：使用输入值的长度而不是光标位置
  // 因为用户点击选项时，光标可能不在输入框末尾
  const inputLength = input.value.length

  console.log('[ChatInput] Input length:', inputLength)
  console.log('[ChatInput] Input value chars:', Array.from(input.value).map((c, i) => `${i}:'${c}'`).join(', '))

  // 替换整个 @符号 + 查询文本为选中的提及
  const beforeMention = input.value.slice(0, mentionTriggerPos.value)
  const afterCursor = input.value.slice(inputLength)  // 使用输入长度，这样就是空字符串

  console.log('[ChatInput] Text parts:', {
    beforeMention: `"${beforeMention}"`,
    beforeMentionLength: beforeMention.length,
    mentionName: item.name,
    afterCursor: `"${afterCursor}"`,
    afterCursorLength: afterCursor.length,
  })

  // 拼接：@符号前的部分 + @ + 提及名称 + 空格 + 光标后的内容
  const mention = '@' + item.name
  const newValue = beforeMention + mention + ' ' + afterCursor
  console.log('[ChatInput] New value:', `"${newValue}"`)
  console.log('[ChatInput] New value length:', newValue.length)
  input.value = newValue

  closeMentionMenu()

  // 将光标移动到提及后面
  nextTick(() => {
    const textarea = textareaRef.value?.$el?.querySelector('textarea') as HTMLTextAreaElement
    if (textarea) {
      const newPosition = beforeMention.length + mention.length + 1
      console.log('[ChatInput] Setting cursor position to:', newPosition)
      textarea.setSelectionRange(newPosition, newPosition)
      textarea.focus()
    }
  })
}

function adjustHeight(e: Event) {
  const target = e.target as HTMLTextAreaElement
  target.style.height = 'auto'
  const newHeight = Math.min(target.scrollHeight, 200)
  target.style.height = `${newHeight}px`
}

// 外部聚焦输入
function focusInput() {
  const textarea = textareaRef.value?.$el?.querySelector('textarea')
  if (textarea) {
    textarea.focus()
  }
}

// 外部清空输入
function clearInput() {
  input.value = ''
  const textarea = textareaRef.value?.$el?.querySelector('textarea')
  if (textarea) {
    textarea.style.height = 'auto'
  }
}

// 插入提及文本（用于右键菜单等功能）
function insertMention(text: string) {
  input.value += text
  const textarea = textareaRef.value?.$el?.querySelector('textarea')
  if (textarea) {
    // 调整高度
    textarea.style.height = 'auto'
    const newHeight = Math.min(textarea.scrollHeight, 200)
    textarea.style.height = `${newHeight}px`

    // 移动光标到末尾并聚焦
    const length = input.value.length
    textarea.setSelectionRange(length, length)
    textarea.focus()
  }
}

defineExpose({
  clearInput,
  focusInput,
  insertMention,
})
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
