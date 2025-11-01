<template>
  <div class="min-h-screen bg-#f7f6f3">
    <DogHeader />
    <div class="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <div class="rounded-xl bg-white p-4 shadow">
        <form class="flex gap-2" @submit.prevent="submit">
          <input v-model="content" placeholder="留下想说的话…" class="border border-#ece7e1 rounded px-3 py-2 flex-1 bg-white text-#333 placeholder:text-gray-400" />
          <button class="px-4 py-2 rounded bg-#e9e4de">发布</button>
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
            <img :src="m.author?.avatarUrl || '/assets/images/xiaobai/xiaobai-2.png'" class="w-8 h-8 rounded-full object-cover" />
            <div class="flex-1">
              <div class="text-sm text-#777 mb-0.5">{{ m.author?.nickName || '匿名' }} · {{ new Date(m.createdAt).toLocaleString() }}</div>
              <div>{{ m.content }}</div>
              <div class="mt-2 flex items-center gap-3 text-sm">
                <button class="underline" @click="toggleComments(m.id)">{{ openId===m.id ? '收起评论' : '查看评论' }}</button>
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
                      <img :src="c.author?.avatarUrl || '/assets/images/xiaobai/xiaobai-2.png'" class="w-6 h-6 rounded-full object-cover"/>
                      <div class="flex-1">
                        <div class="text-xs text-#777">{{ c.author?.nickName || '匿名' }} · {{ new Date(c.createdAt).toLocaleString() }}</div>
                        <div class="text-sm">{{ c.content }}</div>
                        <button class="text-xs underline mt-1" @click="toggleReply(c.id)">{{ replyOpenId===c.id ? '收起回复' : '回复' }}</button>
                        <div v-if="replyOpenId===c.id" class="mt-1 flex items-center gap-2">
                          <input v-model="replyContent" placeholder="回复…" class="border rounded px-2 py-1 flex-1 text-sm" @keydown.enter.prevent="submitReply(c.id)" />
                          <button class="px-2 py-1 rounded bg-#e9e4de text-xs" @click="submitReply(c.id)">发送</button>
                        </div>
                      </div>
                    </div>
                    <div v-if="(c as any).replies?.length" class="pl-8 space-y-1">
                      <div v-for="r in (c as any).replies" :key="r.id" class="flex items-start gap-2">
                        <img :src="r.author?.avatarUrl || '/assets/images/xiaobai/xiaobai-2.png'" class="w-5 h-5 rounded-full object-cover"/>
                        <div class="flex-1">
                          <div class="text-xs text-#777">{{ r.author?.nickName || '匿名' }} · {{ new Date(r.createdAt).toLocaleString() }}</div>
                          <div class="text-sm">{{ r.content }}</div>
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

interface Message { id: string; content: string; createdAt: string; author?: { id: string; nickName: string; avatarUrl?: string } }
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

async function load() {
  loading.value = true
  const res = await $fetch<{ items: Message[] }>('/api/messages')
  items.value = res.items
  loading.value = false
}
onMounted(load)

async function submit() {
  if (!content.value) return
  await $fetch('/api/messages', { method: 'POST', body: { content: content.value } })
  content.value = ''
  await load()
}

function toggleComments(id: string) {
  openId.value = openId.value === id ? null : id
  if (openId.value === id) loadComments(id)
}

async function loadComments(id: string) {
  loadingComments.value = true
  const res = await $fetch<{ items: any }>(`/api/messages/${id}/comments`)
  comments.value = res.items
  loadingComments.value = false
}

function toggleInput(id: string) {
  inputOpenId.value = inputOpenId.value === id ? null : id
}

async function submitComment(id: string) {
  if (!comment.value) return
  await $fetch(`/api/messages/${id}/comment`, { method: 'POST', body: { content: comment.value } })
  comment.value = ''
  openId.value = id
  inputOpenId.value = null
  await loadComments(id)
}

function toggleReply(id: string) {
  replyOpenId.value = replyOpenId.value === id ? null : id
}

async function submitReply(commentId: string) {
  if (!replyContent.value) return
  await $fetch(`/api/messages/comments/${commentId}/reply`, { method: 'POST', body: { content: replyContent.value } })
  replyContent.value = ''
  if (openId.value) await loadComments(openId.value)
}
</script>


