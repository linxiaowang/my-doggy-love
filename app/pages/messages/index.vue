<template>
  <div class="min-h-screen bg-gradient-to-br from-#f7f6f3 via-#faf9f7 to-#f7f6f3">
    <DogHeader />
    <div class="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <Card>
        <CardContent class="px-4">
          <!-- 错误提示 -->
          <div v-if="errorMessage" class="mb-4 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
            {{ errorMessage }}
            <NuxtLink v-if="errorMessage.includes('情侣')" to="/user/couple" class="underline ml-1 font-medium hover:opacity-80">去绑定</NuxtLink>
          </div>
          <!-- 底部对齐 -->
          <form class="flex gap-2 items-center" @submit.prevent="submit">
            <Textarea v-model="content" placeholder="留下想说的话…" class="flex-1 min-h-[80px]" />
            <Button type="submit" :disabled="submitting">
              {{ submitting ? '发布中...' : '发布' }}
            </Button>
          </form>
        </CardContent>
      </Card>
      <div v-if="loading">
        <SkeletonList :count="3" />
      </div>
      <div v-else-if="items.length===0">
        <EmptyState text="还没有留言" img="/assets/images/xiaobai/xiaobai-3.png" cta-text="去发表第一条" cta-to="/messages" />
      </div>
      <div v-else class="space-y-3">
        <Card v-for="m in items" :key="m.id">
          <CardContent class="px-4">
            <div class="flex items-start gap-3">
              <Avatar>
                <AvatarImage :src="m.author?.avatarUrl || '/assets/images/xiaobai/xiaobai-2.png'" :alt="m.author?.nickName || '用户头像'" />
                <AvatarFallback>{{ (m.author?.nickName || '匿名').charAt(0) }}</AvatarFallback>
              </Avatar>
              <div class="flex-1 min-w-0">
                <div class="text-sm text-muted-foreground mb-1.5 font-medium">{{ m.author?.nickName || '匿名' }} · {{ new Date(m.createdAt).toLocaleString() }}</div>
                <div class="text-foreground whitespace-pre-wrap break-words leading-relaxed">{{ m.content }}</div>
                <div class="mt-3 flex items-center gap-3 text-sm border-t border-border pt-3">
                  <Button variant="ghost" size="sm" @click="toggleComments(m.id)">{{ openId===m.id ? '收起评论' : `查看评论${formatCount(m.commentCount)}` }}</Button>
                  <span class="text-muted-foreground/30">|</span>
                  <Button variant="ghost" size="sm" @click="toggleInput(m.id)">{{ inputOpenId===m.id ? '收起输入' : '写评论' }}</Button>
                </div>
                <div v-if="inputOpenId===m.id" class="mt-3 flex items-center gap-2 animate-fade-in">
                  <Input v-model="comment" placeholder="写点评论…" class="flex-1" @keydown.enter.prevent="submitComment(m.id)" />
                  <Button size="sm" @click="submitComment(m.id)">发布</Button>
                </div>
                <div v-if="openId===m.id" class="mt-2">
                  <div v-if="loadingComments" class="text-sm text-muted-foreground">加载中…</div>
                  <div v-else-if="comments.length===0" class="text-sm text-muted-foreground">暂无评论</div>
                  <div v-else class="space-y-2">
                    <div v-for="c in comments" :key="c.id" class="space-y-1">
                      <div class="flex items-start gap-2">
                        <Avatar class="w-7 h-7">
                          <AvatarImage :src="c.author?.avatarUrl || '/assets/images/xiaobai/xiaobai-2.png'" :alt="c.author?.nickName || '用户头像'" />
                          <AvatarFallback class="text-xs">{{ (c.author?.nickName || '匿名').charAt(0) }}</AvatarFallback>
                        </Avatar>
                        <div class="flex-1 min-w-0">
                          <div class="text-xs text-muted-foreground">{{ c.author?.nickName || '匿名' }} · {{ new Date(c.createdAt).toLocaleString() }}</div>
                          <div class="text-sm text-foreground whitespace-pre-wrap break-words">{{ c.content }}</div>
                          <Button variant="link" size="sm" class="h-auto p-0 text-xs" @click="toggleReply(c.id)">{{ replyOpenId===c.id ? '收起回复' : '回复' }}</Button>
                          <div v-if="replyOpenId===c.id" class="mt-1 flex items-center gap-2">
                            <Input v-model="replyContent" placeholder="回复…" class="flex-1 h-8 text-sm" @keydown.enter.prevent="submitReply(c.id)" />
                            <Button size="sm" class="h-8" @click="submitReply(c.id)">发送</Button>
                          </div>
                        </div>
                      </div>
                      <div v-if="(c as any).replies?.length" class="pl-8 space-y-1">
                        <div v-for="r in (c as any).replies" :key="r.id" class="flex items-start gap-2">
                          <Avatar class="w-6 h-6">
                            <AvatarImage :src="r.author?.avatarUrl" :alt="r.author?.nickName || '用户头像'" />
                            <AvatarFallback class="text-[10px]">{{ (r.author?.nickName || '匿名').charAt(0) }}</AvatarFallback>
                          </Avatar>
                          <div class="flex-1 min-w-0">
                            <div class="text-xs text-muted-foreground">{{ r.author?.nickName || '匿名' }} · {{ new Date(r.createdAt).toLocaleString() }}</div>
                            <div class="text-sm text-foreground whitespace-pre-wrap break-words">{{ r.content }}</div>
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DogHeader from '@/components/ui/DogHeader.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { ref, onMounted } from 'vue'
import SkeletonList from '@/components/ui/SkeletonList.vue'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
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
  return n && n > 0 ? `(${n})` : ''
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


