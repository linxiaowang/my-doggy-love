<template>
  <Card class="mb-4">
    <CardContent>
      <div class="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <span>{{ dateLabel }}</span>
        <span v-if="tags?.length" class="ml-auto inline-flex flex-wrap gap-1.5">
          <Badge v-for="t in tags" :key="t" variant="secondary" class="hover:bg-secondary/80">
            {{ t }}
          </Badge>
        </span>
      </div>
      <div class="mt-2 text-foreground leading-relaxed whitespace-pre-wrap break-words">{{ content }}</div>
      <div v-if="mediaUrls?.length" class="mt-4 grid grid-cols-3 gap-2">
        <div
          v-for="(u, i) in mediaUrls"
          :key="i"
          class="relative cursor-pointer overflow-hidden rounded-lg group shadow-sm hover:shadow-md transition-all duration-300 aspect-square"
          @click="openPreview(i)"
        >
          <!-- 图片 -->
          <div v-if="isImage(u)" class="relative w-full h-full bg-muted">
            <img
              :src="getThumbnailUrl(u)"
              :data-original="u"
              loading="lazy"
              decoding="async"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-0 transition-opacity duration-300"
              @error="handleThumbnailError"
              @load="(e) => (e.target as HTMLElement).classList.remove('opacity-0')"
            />
          </div>
          <!-- 视频 -->
          <div
            v-else-if="isVideo(u)"
            class="w-full h-full bg-muted flex items-center justify-center relative group-hover:bg-muted/80 transition-colors duration-300"
          >
            <video
              :src="u"
              class="w-full h-full object-cover"
              preload="metadata"
              muted
              @loadedmetadata="handleVideoMetadata"
            />
            <div class="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors duration-300">
              <svg class="w-10 h-10 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          <!-- 其他类型 -->
          <div v-else class="w-full h-full bg-muted flex items-center justify-center">
            <span class="text-xs text-muted-foreground">未知类型</span>
          </div>
        </div>
      </div>
      
      <!-- 预览模态框 -->
      <Teleport to="body">
        <div
          v-if="previewIndex !== null"
          class="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-sm"
          @click.self="closePreview"
          @keydown.esc="closePreview"
        >
          <!-- 关闭按钮 -->
          <button
            class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-50 transition-all duration-200 hover:scale-110 active:scale-95 border-none cursor-pointer"
            @click="closePreview"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <!-- 上一张按钮 -->
          <button
            v-if="mediaUrls && mediaUrls.length > 1 && previewIndex !== null && previewIndex > 0"
            class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-50 cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 border-none"
            @click.stop.prevent="prevMedia"
            type="button"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <!-- 下一张按钮 -->
          <button
            v-if="mediaUrls && mediaUrls.length > 1 && previewIndex !== null && previewIndex < mediaUrls.length - 1"
            class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-50 cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 border-none"
            @click.stop.prevent="nextMedia"
            type="button"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <!-- 媒体内容 -->
          <div class="max-w-[90vw] max-h-[90vh] flex items-center justify-center w-full h-full p-4" @click.stop>
            <!-- 图片预览 -->
            <img
              v-if="currentMedia && isImage(currentMedia)"
              :src="currentMedia"
              class="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-sm select-none"
              alt="预览"
            />
            <!-- 视频预览 -->
            <video
              v-else-if="currentMedia && isVideo(currentMedia)"
              :src="currentMedia"
              class="max-w-full max-h-[85vh] shadow-2xl rounded-sm"
              controls
              autoplay
            />
          </div>
          
          <!-- 页码指示器 -->
          <div
            v-if="mediaUrls && mediaUrls.length > 1"
            class="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-sm font-medium border border-white/5"
          >
            {{ previewIndex + 1 }} / {{ mediaUrls.length }}
          </div>
        </div>
      </Teleport>

      <div class="mt-4 flex items-center gap-2 text-sm border-t pt-1">
        <Button variant="ghost" size="sm" class="h-8 px-2 text-muted-foreground hover:text-foreground" @click="toggleComments">
          {{ showComments ? '收起评论' : `查看评论${displayCount}` }}
        </Button>
        <span class="text-border h-4 w-px bg-border"></span>
        <Button variant="ghost" size="sm" class="h-8 px-2 text-muted-foreground hover:text-foreground" @click="toggleInput">
          {{ showInput ? '收起输入' : '写评论' }}
        </Button>
        
        <template v-if="canDelete">
          <span class="text-border h-4 w-px bg-border"></span>
          <Button variant="ghost" size="sm" class="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10" @click="handleDelete">
            删除
          </Button>
        </template>
      </div>

      <div v-if="showInput" class="mt-4 flex gap-2 animate-fade-in items-end">
        <Input 
          v-model="comment" 
          placeholder="写点评论…" 
          class="flex-1" 
          @keydown.enter.prevent="submit" 
        />
        <Button @click="submit" :disabled="!comment.trim()">发布</Button>
      </div>

      <div class="mt-2">
        <div v-if="showComments" class="mt-4 space-y-4">
          <div v-if="loading" class="text-sm text-muted-foreground py-2 text-center">加载中…</div>
          <div v-else-if="comments.length === 0" class="text-sm text-muted-foreground py-2 text-center">暂无评论</div>
          <div v-else class="space-y-4 pl-1">
            <div v-for="c in comments" :key="c.id" class="space-y-2">
              <div class="flex items-start gap-3">
                <Avatar class="w-8 h-8">
                  <AvatarImage :src="c.author.avatarUrl || '/assets/images/xiaobai/xiaobai-2.png'" />
                  <AvatarFallback>{{ c.author.nickName?.slice(0, 2) || '用户' }}</AvatarFallback>
                </Avatar>
                <div class="flex-1 space-y-1">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-foreground">{{ c.author.nickName }}</span>
                    <span class="text-xs text-muted-foreground">{{ new Date(c.createdAt).toLocaleString() }}</span>
                  </div>
                  <div class="text-sm text-foreground/90">{{ c.content }}</div>
                  
                  <div class="flex items-center gap-2 pt-1">
                    <Button variant="link" size="sm" class="h-auto p-0 text-muted-foreground text-xs" @click="toggleReply(c.id)">
                      {{ replyOpenId === c.id ? '收起回复' : '回复' }}
                    </Button>
                  </div>
                  
                  <div v-if="replyOpenId === c.id" class="mt-2 flex items-center gap-2">
                    <Input 
                      v-model="replyContent" 
                      placeholder="回复…" 
                      class="h-8 text-sm" 
                      @keydown.enter.prevent="submitReply(c.id)" 
                    />
                    <Button size="sm" class="h-8" @click="submitReply(c.id)" :disabled="!replyContent.trim()">发送</Button>
                  </div>
                </div>
              </div>

              <!-- Replies -->
              <div v-if="(c as any).replies?.length" class="pl-11 space-y-3">
                <div v-for="r in (c as any).replies" :key="r.id" class="space-y-2">
                  <div class="flex items-start gap-3">
                    <Avatar class="w-6 h-6">
                      <AvatarImage :src="r.author.avatarUrl || '/assets/images/xiaobai/xiaobai-2.png'" />
                      <AvatarFallback>{{ r.author.nickName?.slice(0, 2) }}</AvatarFallback>
                    </Avatar>
                    <div class="flex-1 space-y-1">
                      <div class="flex items-center justify-between">
                        <span class="text-sm font-medium text-foreground">{{ r.author.nickName }}</span>
                        <span class="text-xs text-muted-foreground">{{ new Date(r.createdAt).toLocaleString() }}</span>
                      </div>
                      <div class="text-sm text-foreground/90">{{ r.content }}</div>
                      
                      <div class="flex items-center gap-2 pt-1">
                        <Button variant="link" size="sm" class="h-auto p-0 text-muted-foreground text-xs" @click="toggleReply(r.id)">
                          {{ replyOpenId === r.id ? '收起回复' : '回复' }}
                        </Button>
                      </div>

                      <div v-if="replyOpenId === r.id" class="mt-2 flex items-center gap-2">
                        <Input 
                          v-model="replyContent" 
                          placeholder="回复…" 
                          class="h-8 text-sm" 
                          @keydown.enter.prevent="submitReply(r.id)" 
                        />
                        <Button size="sm" class="h-8" @click="submitReply(r.id)" :disabled="!replyContent.trim()">发送</Button>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Nested Replies (Level 3) -->
                  <div v-if="(r as any).replies?.length" class="pl-9 space-y-2">
                    <div v-for="z in (r as any).replies" :key="z.id" class="flex items-start gap-3">
                       <Avatar class="w-6 h-6">
                        <AvatarImage :src="z.author.avatarUrl || '/assets/images/xiaobai/xiaobai-2.png'" />
                        <AvatarFallback>{{ z.author.nickName?.slice(0, 2) }}</AvatarFallback>
                      </Avatar>
                      <div class="flex-1 space-y-1">
                        <div class="flex items-center justify-between">
                          <span class="text-sm font-medium text-foreground">{{ z.author.nickName }}</span>
                          <span class="text-xs text-muted-foreground">{{ new Date(z.createdAt).toLocaleString() }}</span>
                        </div>
                        <div class="text-sm text-foreground/90">{{ z.content }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createDailyComment, useDailyPostComments, deleteDailyPost } from '@/services/api/daily'
import { apiFetch } from '@/services/api'
import { getThumbnailUrl } from '@/utils/imageUrl'

const props = defineProps<{ 
  id: string
  content: string
  createdAt: string | Date
  mediaUrls?: string[]
  commentCount?: number
  tags?: string[]
  authorId?: string
}>()

const emit = defineEmits<{ 
  (e: 'commented'): void
  (e: 'deleted'): void
}>()

const dateLabel = computed(() => new Date(props.createdAt).toLocaleString())
const comment = ref('')
const showComments = ref(false)
const comments = ref<Array<any>>([])
// 评论数量展示：优先使用后端传入的统计，其次根据已加载的评论树计算
const totalCount = computed(() => {
  const sumReplies = (list: any[]): number => list.reduce((sum, c) => sum + 1 + (Array.isArray(c.replies) ? sumReplies(c.replies) : 0), 0)
  return comments.value.length ? sumReplies(comments.value) : (props.commentCount || 0)
})
const displayCount = computed(() => totalCount.value > 0 ? `(${totalCount.value})` : '')
const showInput = ref(false)
const replyOpenId = ref<string | null>(null)
const replyContent = ref('')

// 预览相关状态
const previewIndex = ref<number | null>(null)
const currentMedia = computed(() => {
  if (previewIndex.value === null || !props.mediaUrls) return null
  return props.mediaUrls[previewIndex.value]
})

// 判断是否为图片
function isImage(url: string): boolean {
  if (!url) return false
  const lowerUrl = url.toLowerCase()
  return lowerUrl.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?|#|$)/i) !== null ||
         lowerUrl.includes('image/') ||
         lowerUrl.startsWith('data:image/')
}

// 判断是否为视频
function isVideo(url: string): boolean {
  if (!url) return false
  const lowerUrl = url.toLowerCase()
  return lowerUrl.match(/\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv)(\?|#|$)/i) !== null ||
         lowerUrl.includes('video/') ||
         lowerUrl.startsWith('data:video/')
}

// 处理视频元数据加载
function handleVideoMetadata(event: Event) {
  const video = event.target as HTMLVideoElement
}

// 处理缩略图加载失败，回退到原图
function handleThumbnailError(event: Event) {
  const img = event.target as HTMLImageElement
  const originalUrl = img.getAttribute('data-original')

  // 标记该图片已尝试加载失败，避免重复触发
  if (img.hasAttribute('data-error-handled')) {
    return
  }

  // 如果原图 URL 存在且当前 src 不是原图，则尝试加载原图
  if (originalUrl && img.src !== originalUrl) {
    img.setAttribute('data-error-handled', 'true')
    img.src = originalUrl
  }

  // 如果原图也加载失败，移除 opacity-0 类以显示错误占位符
  img.classList.remove('opacity-0')
}

// 打开预览
function openPreview(index: number) {
  previewIndex.value = index
  document.body.style.overflow = 'hidden'
}

// 关闭预览
function closePreview() {
  previewIndex.value = null
  document.body.style.overflow = ''
}

// 上一张
function prevMedia() {
  if (previewIndex.value !== null && previewIndex.value > 0) {
    previewIndex.value--
  }
}

// 下一张
function nextMedia() {
  if (previewIndex.value !== null && props.mediaUrls && previewIndex.value < props.mediaUrls.length - 1) {
    previewIndex.value++
  }
}

// 键盘快捷键支持
function handleKeydown(event: KeyboardEvent) {
  if (previewIndex.value === null) return
  
  if (event.key === 'Escape') {
    closePreview()
  } else if (event.key === 'ArrowLeft') {
    prevMedia()
  } else if (event.key === 'ArrowRight') {
    nextMedia()
  }
}

// 监听键盘事件
onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeydown)
  }
  document.body.style.overflow = ''
})

// 使用统一的 API
const { data: commentsData, pending: loadingComments, refresh: refreshComments } = useDailyPostComments(() => props.id)

watch(commentsData, (newData) => {
  if (newData?.items) {
    comments.value = newData.items as any
  }
}, { immediate: true })

const loading = computed(() => loadingComments.value)

async function submit() {
  if (!comment.value) return
  try {
    await createDailyComment(props.id, comment.value)
    comment.value = ''
    showInput.value = false
    showComments.value = true
    await refreshComments()
    emit('commented')
  } catch (e: any) {
    console.error('发布评论失败:', e)
  }
}

async function toggleComments() {
  showComments.value = !showComments.value
  if (showComments.value && comments.value.length === 0) {
    await refreshComments()
  }
}

function toggleInput() {
  showInput.value = !showInput.value
}

async function submitReply(parentId: string) {
  if (!replyContent.value) return
  try {
    await apiFetch(`/api/daily/comments/${parentId}/reply`, {
      method: 'POST',
      body: { content: replyContent.value },
    })
    replyContent.value = ''
    replyOpenId.value = null
    showComments.value = true
    if (showComments.value) {
      await refreshComments()
    }
  } catch (e: any) {
    console.error('回复评论失败:', e)
  }
}

function toggleReply(id: string) {
  replyOpenId.value = replyOpenId.value === id ? null : id
}

// 删除功能
const authStore = useAuthStore()
const canDelete = computed(() => {
  const currentUserId = authStore.user?.id
  return props.authorId && currentUserId && props.authorId === currentUserId
})

async function handleDelete() {
  if (!confirm('确定要删除这条日常记录吗？')) {
    return
  }
  
  try {
    await deleteDailyPost(props.id)
    emit('deleted')
  } catch (e: any) {
    console.error('删除失败:', e)
    alert(e?.friendlyMessage || '删除失败，请稍后再试')
  }
}
</script>


