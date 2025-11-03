<template>
  <div class="min-h-screen bg-#f7f6f3">
    <DogHeader />
    <div class="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <div class="rounded-xl bg-white p-4 shadow">
        <!-- 错误提示 -->
        <div v-if="errorMessage" class="mb-3 text-#b42318 bg-#fdecea border border-#f5c2c7 rounded px-3 py-2 text-sm">
          {{ errorMessage }}
          <NuxtLink v-if="errorMessage.includes('情侣')" to="/user/couple" class="underline ml-1">去绑定</NuxtLink>
        </div>
        
        <form class="flex gap-2" @submit.prevent="submit">
          <input v-model="content" placeholder="留下想说的话…" class="border border-#ece7e1 rounded px-3 py-2 flex-1 bg-white text-#333 placeholder:text-gray-400" />
          <button class="px-4 py-2 rounded bg-#e9e4de" :disabled="submitting">
            {{ submitting ? '发布中...' : '发布' }}
          </button>
        </form>
      </div>
      <div v-if="loading">
        <SkeletonList :count="3" />
      </div>
      <div v-else-if="items.length===0">
        <EmptyState text="还没有留言" img="/assets/images/xiaobai/xiaobai-3.png" cta-text="去发表第一条" cta-to="/messages" />
      </div>
      <div v-else class="space-y-3">
        <div v-for="m in items" :key="m.id" class="rounded-xl bg-white p-4 shadow">
          <div class="flex items-start gap-3">
            <img 
              :src="m.author?.avatarUrl || '/assets/images/xiaobai/xiaobai-2.png'" 
              :alt="m.author?.nickName || '用户头像'"
              class="w-10 h-10 rounded-full object-cover border border-#ece7e1 flex-shrink-0"
              @error="handleImageError"
            />
            <div class="flex-1 min-w-0">
              <div class="text-sm text-#777 mb-0.5">{{ m.author?.nickName || '匿名' }} · {{ new Date(m.createdAt).toLocaleString() }}</div>
              <div class="text-#333 whitespace-pre-wrap break-words">{{ m.content }}</div>
              <div class="mt-2 flex items-center gap-3 text-sm">
                <button class="underline" @click="toggleComments(m.id)">{{ openId===m.id ? '收起评论' : `查看评论${formatCount(m.commentCount)}` }}</button>
                <span class="text-#ccc">|</span>
                <button class="underline" @click="toggleInput(m.id)">{{ inputOpenId===m.id ? '收起输入' : '写评论' }}</button>
              </div>
              <div v-if="inputOpenId===m.id" class="mt-2 flex items-center gap-2">
                <input v-model="comment" placeholder="写点评论…" class="border rounded px-3 py-1.5 flex-1" @keydown.enter.prevent="submitComment(m.id)" />
                <button class="px-3 py-1.5 rounded bg-#e9e4de" @click="submitComment(m.id)">发布</button>
              </div>
              <div v-if="openId===m.id" class="mt-2">
                <div v-if="loadingComments" class="text-sm text-#999">加载中…</div>
                <div v-else-if="comments.length===0" class="text-sm text-#999">暂无评论</div>
                <div v-else class="space-y-2">
                  <div v-for="c in comments" :key="c.id" class="space-y-1">
                    <div class="flex items-start gap-2">
                      <img 
                        :src="c.author?.avatarUrl || '/assets/images/xiaobai/xiaobai-2.png'" 
                        :alt="c.author?.nickName || '用户头像'"
                        class="w-7 h-7 rounded-full object-cover border border-#ece7e1 flex-shrink-0"
                        @error="handleImageError"
                      />
                      <div class="flex-1 min-w-0">
                        <div class="text-xs text-#777">{{ c.author?.nickName || '匿名' }} · {{ new Date(c.createdAt).toLocaleString() }}</div>
                        <div class="text-sm text-#333 whitespace-pre-wrap break-words">{{ c.content }}</div>
                        <button class="text-xs underline mt-1" @click="toggleReply(c.id)">{{ replyOpenId===c.id ? '收起回复' : '回复' }}</button>
                        <div v-if="replyOpenId===c.id" class="mt-1 flex items-center gap-2">
                          <input v-model="replyContent" placeholder="回复…" class="border rounded px-2 py-1 flex-1 text-sm" @keydown.enter.prevent="submitReply(c.id)" />
                          <button class="px-2 py-1 rounded bg-#e9e4de text-xs" @click="submitReply(c.id)">发送</button>
                        </div>
                      </div>
                    </div>
                    <div v-if="(c as any).replies?.length" class="pl-8 space-y-1">
                      <div v-for="r in (c as any).replies" :key="r.id" class="flex items-start gap-2">
                        <img 
                          :src="r.author?.avatarUrl || '/assets/images/xiaobai/xiaobai-2.png'" 
                          :alt="r.author?.nickName || '用户头像'"
                          class="w-6 h-6 rounded-full object-cover border border-#ece7e1 flex-shrink-0"
                          @error="handleImageError"
                        />
                        <div class="flex-1 min-w-0">
                          <div class="text-xs text-#777">{{ r.author?.nickName || '匿名' }} · {{ new Date(r.createdAt).toLocaleString() }}</div>
                          <div class="text-sm text-#333 whitespace-pre-wrap break-words">{{ r.content }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DogHeader from '@/components/ui/DogHeader.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { ref, onMounted } from 'vue'
import SkeletonList from '@/components/ui/SkeletonList.vue'
import { createMessage, createMessageComment, replyToComment } from '@/services/api/messages'
import { apiFetch, handleApiError } from '@/services/api'

// 检查登录状态，未登录会自动跳转到登录页
definePageMeta({
  middleware: 'auth',
})

interface Message { id: string; content: string; createdAt: string; commentCount?: number; author?: { id: string; nickName: string; avatarUrl?: string } }
const items = ref<Message[]>([])
const content = ref('')
const loading = ref(true)
const comment = ref('')
const openId = ref<string | null>(null)
const inputOpenId = ref<string | null>(null)
const comments = ref<Array<{ id: string; content: string; createdAt: string; author?: { id: string; nickName: string; avatarUrl?: string } }>>([])
const loadingComments = ref(false)
const replyOpenId = ref<string | null>(null)
const replyContent = ref('')

function formatCount(n?: number) {
  return n && n > 0 ? `（${n}）` : ''
}

// 头像加载失败时使用默认头像
function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement
  if (img.src !== '/assets/images/xiaobai/xiaobai-2.png') {
    img.src = '/assets/images/xiaobai/xiaobai-2.png'
  }
}

async function load() {
  loading.value = true
  try {
    const res = await apiFetch<{ items: Message[] }>('/api/messages')
    items.value = res.items
  } catch (e: any) {
    console.error('加载留言失败:', e)
  } finally {
    loading.value = false
  }
}
onMounted(load)

const errorMessage = ref('')
const submitting = ref(false)

async function submit() {
  if (!content.value) return
  
  errorMessage.value = ''
  submitting.value = true
  
  try {
    await createMessage({ content: content.value })
    content.value = ''
    await load()
  } catch (e: any) {
    // 使用统一错误处理
    errorMessage.value = e?.friendlyMessage || handleApiError(e)
    console.error('发布留言失败:', e)
  } finally {
    submitting.value = false
  }
}

function toggleComments(id: string) {
  openId.value = openId.value === id ? null : id
  if (openId.value === id) loadComments(id)
}

async function loadComments(id: string) {
  loadingComments.value = true
  try {
    const res = await apiFetch<{ items: any }>(`/api/messages/${id}/comments`)
    comments.value = res.items
  } catch (e: any) {
    console.error('加载评论失败:', e)
  } finally {
    loadingComments.value = false
  }
}

function toggleInput(id: string) {
  inputOpenId.value = inputOpenId.value === id ? null : id
}

async function submitComment(id: string) {
  if (!comment.value) return
  try {
    await createMessageComment(id, comment.value)
    comment.value = ''
    openId.value = id
    inputOpenId.value = null
    await loadComments(id)
  } catch (e: any) {
    console.error('发布评论失败:', e)
  }
}

function toggleReply(id: string) {
  replyOpenId.value = replyOpenId.value === id ? null : id
}

async function submitReply(commentId: string) {
  if (!replyContent.value) return
  try {
    await replyToComment(commentId, replyContent.value)
    replyContent.value = ''
    if (openId.value) await loadComments(openId.value)
  } catch (e: any) {
    console.error('回复评论失败:', e)
  }
}
</script>


