<template>
  <article class="rounded-xl bg-white p-5 shadow-sm hover:shadow-md border border-#ece7e1 transition-all duration-300 ease-out">
    <div class="flex items-center gap-2 text-sm text-#999 mb-2">
      <span>{{ dateLabel }}</span>
      <span v-if="tags?.length" class="ml-auto inline-flex flex-wrap gap-1.5">
        <span v-for="t in tags" :key="t" class="px-2.5 py-1 rounded-full bg-#f3efe9 text-#666 text-xs font-medium hover:bg-#e9e4de transition-colors duration-200">{{ t }}</span>
      </span>
    </div>
    <div class="mt-2 text-#333 leading-relaxed whitespace-pre-wrap break-words">{{ content }}</div>
    <div v-if="mediaUrls?.length" class="mt-3 grid grid-cols-3 gap-2">
      <div
        v-for="(u, i) in mediaUrls"
        :key="i"
        class="relative cursor-pointer overflow-hidden rounded-lg group shadow-sm hover:shadow-md transition-all duration-300"
        @click="openPreview(i)"
      >
        <!-- 图片 -->
        <img
          v-if="isImage(u)"
          :src="getThumbnailUrl(u)"
          :data-original="u"
          loading="lazy"
          class="w-full h-28 object-cover transition-transform duration-300 group-hover:scale-110"
          @error="handleThumbnailError"
        />
        <!-- 视频 -->
        <div
          v-else-if="isVideo(u)"
          class="w-full h-28 bg-#f0f0f0 flex items-center justify-center relative group-hover:bg-#e8e8e8 transition-colors duration-300"
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
        <div v-else class="w-full h-28 bg-#f0f0f0 flex items-center justify-center">
          <span class="text-xs text-#999">未知类型</span>
        </div>
      </div>
    </div>
    
    <!-- 预览模态框 -->
    <Teleport to="body">
      <div
        v-if="previewIndex !== null"
        class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
        @click.self="closePreview"
        @keydown.esc="closePreview"
      >
        <!-- 关闭按钮 -->
        <button
          class="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center z-10 transition-all duration-200 hover:scale-110 active:scale-95"
          @click="closePreview"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <!-- 上一张按钮 -->
        <button
          v-if="mediaUrls && mediaUrls.length > 1 && previewIndex !== null && previewIndex > 0"
          class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center z-20 cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95"
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
          class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center z-20 cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95"
          @click.stop.prevent="nextMedia"
          type="button"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        <!-- 媒体内容 -->
        <div class="max-w-[90vw] max-h-[90vh] flex items-center justify-center" @click.stop>
          <!-- 图片预览 -->
          <img
            v-if="currentMedia && isImage(currentMedia)"
            :src="currentMedia"
            class="max-w-full max-h-[90vh] object-contain"
            alt="预览"
          />
          <!-- 视频预览 -->
          <video
            v-else-if="currentMedia && isVideo(currentMedia)"
            :src="currentMedia"
            class="max-w-full max-h-[90vh]"
            controls
            autoplay
          />
        </div>
        
        <!-- 页码指示器 -->
        <div
          v-if="mediaUrls && mediaUrls.length > 1"
          class="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/70 backdrop-blur-sm text-white text-sm font-medium shadow-lg"
        >
          {{ previewIndex + 1 }} / {{ mediaUrls.length }}
        </div>
      </div>
    </Teleport>
    <div class="mt-4 flex items-center gap-3 text-sm border-t border-#f0f0f0 pt-3">
      <button class="text-#666 hover:text-#333 transition-colors duration-200 font-medium" @click="toggleComments">{{ showComments ? '收起评论' : `查看评论${displayCount}` }}</button>
      <span class="text-#ddd">|</span>
      <button class="text-#666 hover:text-#333 transition-colors duration-200 font-medium" @click="toggleInput">{{ showInput ? '收起输入' : '写评论' }}</button>
      <span v-if="canDelete" class="text-#ddd">|</span>
      <button v-if="canDelete" class="text-#b42318 hover:text-#d92d20 transition-colors duration-200 font-medium" @click="handleDelete">删除</button>
    </div>
    <div v-if="showInput" class="mt-3 flex items-center gap-2 animate-fade-in">
      <input v-model="comment" placeholder="写点评论…" class="input flex-1 text-sm" @keydown.enter.prevent="submit" />
      <button class="px-4 py-2 rounded-lg bg-#e9e4de hover:bg-#e1dbd4 transition-colors duration-200 font-medium" @click="submit">发布</button>
    </div>
    <div class="mt-2">
      <div v-if="showComments" class="mt-2 space-y-2">
        <div v-if="loading" class="text-sm text-#999">加载中…</div>
        <div v-else-if="comments.length===0" class="text-sm text-#999">暂无评论</div>
        <div v-else class="space-y-2">
          <div v-for="c in comments" :key="c.id" class="space-y-1">
            <div class="flex items-start gap-2">
              <img :src="c.author.avatarUrl || '/assets/images/xiaobai/xiaobai-2.png'" class="w-6 h-6 rounded-full object-cover"/>
              <div class="flex-1">
                <div class="text-xs text-#777">{{ c.author.nickName }} · {{ new Date(c.createdAt).toLocaleString() }}</div>
                <div class="text-sm">{{ c.content }}</div>
                <button class="text-xs underline mt-1" @click="toggleReply(c.id)">{{ replyOpenId===c.id ? '收起回复' : '回复' }}</button>
                <div v-if="replyOpenId===c.id" class="mt-1 flex items-center gap-2">
                  <input v-model="replyContent" placeholder="回复…" class="border rounded px-2 py-1 flex-1 text-sm" @keydown.enter.prevent="submitReply(c.id)" />
                  <button class="px-2 py-1 rounded bg-#e9e4de text-xs" @click="submitReply(c.id)">发送</button>
                </div>
              </div>
            </div>
            <div v-if="(c as any).replies?.length" class="pl-8 space-y-1">
              <div v-for="r in (c as any).replies" :key="r.id" class="space-y-1">
                <div class="flex items-start gap-2">
                  <img :src="r.author.avatarUrl || '/assets/images/xiaobai/xiaobai-2.png'" class="w-5 h-5 rounded-full object-cover"/>
                  <div class="flex-1">
                    <div class="text-xs text-#777">{{ r.author.nickName }} · {{ new Date(r.createdAt).toLocaleString() }}</div>
                    <div class="text-sm">{{ r.content }}</div>
                    <button class="text-xs underline mt-1" @click="toggleReply(r.id)">{{ replyOpenId===r.id ? '收起回复' : '回复' }}</button>
                    <div v-if="replyOpenId===r.id" class="mt-1 flex items-center gap-2">
                      <input v-model="replyContent" placeholder="回复…" class="border rounded px-2 py-1 flex-1 text-sm" @keydown.enter.prevent="submitReply(r.id)" />
                      <button class="px-2 py-1 rounded bg-#e9e4de text-xs" @click="submitReply(r.id)">发送</button>
                    </div>
                  </div>
                </div>
                <div v-if="(r as any).replies?.length" class="pl-6 space-y-1">
                  <div v-for="z in (r as any).replies" :key="z.id" class="flex items-start gap-2">
                    <img :src="z.author.avatarUrl || '/assets/images/xiaobai/xiaobai-2.png'" class="w-5 h-5 rounded-full object-cover"/>
                    <div class="flex-1">
                      <div class="text-xs text-#777">{{ z.author.nickName }} · {{ new Date(z.createdAt).toLocaleString() }}</div>
                      <div class="text-sm">{{ z.content }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { createDailyComment, useDailyPostComments, deleteDailyPost } from '@/services/api/daily'
import { useAuthMe } from '@/services/api/auth'
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
  // 匹配扩展名后跟着查询参数、哈希或字符串末尾
  return lowerUrl.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?|#|$)/i) !== null ||
         lowerUrl.includes('image/') ||
         lowerUrl.startsWith('data:image/')
}

// 判断是否为视频
function isVideo(url: string): boolean {
  if (!url) return false
  const lowerUrl = url.toLowerCase()
  // 匹配扩展名后跟着查询参数、哈希或字符串末尾
  return lowerUrl.match(/\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv)(\?|#|$)/i) !== null ||
         lowerUrl.includes('video/') ||
         lowerUrl.startsWith('data:video/')
}

// 处理视频元数据加载
function handleVideoMetadata(event: Event) {
  const video = event.target as HTMLVideoElement
  // 视频加载完成后可以做一些处理
}

// 处理缩略图加载失败，回退到原图
function handleThumbnailError(event: Event) {
  const img = event.target as HTMLImageElement
  const originalUrl = img.getAttribute('data-original')
  if (originalUrl && img.src !== originalUrl) {
    img.src = originalUrl
  }
}

// 打开预览
function openPreview(index: number) {
  previewIndex.value = index
  // 禁用 body 滚动
  document.body.style.overflow = 'hidden'
}

// 关闭预览
function closePreview() {
  previewIndex.value = null
  // 恢复 body 滚动
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
  // 确保卸载时恢复滚动
  document.body.style.overflow = ''
})

// 使用统一的 API
const { data: commentsData, pending: loadingComments, refresh: refreshComments } = useDailyPostComments(() => props.id)

watch(commentsData, (newData) => {
  // commentsData 是 Ref<{ items: any[] } | null>，直接访问 .items
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
const { data: meData } = useAuthMe()
const canDelete = computed(() => {
  const currentUserId = meData.value?.user?.id
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


