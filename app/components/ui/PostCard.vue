<template>
  <article class="rounded-xl bg-white p-4 shadow">
    <div class="flex items-center gap-2 text-sm text-#999">
      <span>{{ dateLabel }}</span>
      <span v-if="tags?.length" class="ml-auto inline-flex flex-wrap gap-1">
        <span v-for="t in tags" :key="t" class="px-2 py-0.5 rounded-full bg-#f3efe9 text-#666 text-xs">{{ t }}</span>
      </span>
    </div>
    <div class="mt-1">{{ content }}</div>
    <div v-if="mediaUrls?.length" class="mt-2 grid grid-cols-3 gap-2">
      <img v-for="(u, i) in mediaUrls" :key="i" :src="u" loading="lazy" class="w-full h-28 object-cover rounded" />
    </div>
    <div class="mt-3 flex items-center gap-3 text-sm">
      <button class="underline" @click="toggleComments">{{ showComments ? '收起评论' : '查看评论' }}</button>
      <span class="text-#ccc">|</span>
      <button class="underline" @click="toggleInput">{{ showInput ? '收起输入' : '写评论' }}</button>
      <span v-if="canDelete" class="text-#ccc">|</span>
      <button v-if="canDelete" class="underline text-#b42318 hover:text-#d92d20" @click="handleDelete">删除</button>
    </div>
    <div v-if="showInput" class="mt-2 flex items-center gap-2">
      <input v-model="comment" placeholder="写点评论…" class="border rounded px-3 py-1.5 flex-1" @keydown.enter.prevent="submit" />
      <button class="px-3 py-1.5 rounded bg-#e9e4de" @click="submit">发布</button>
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
import { computed, ref, watch } from 'vue'
import { createDailyComment, useDailyPostComments, deleteDailyPost } from '@/services/api/daily'
import { useAuthMe } from '@/services/api/auth'
import { apiFetch } from '@/services/api'

const props = defineProps<{ 
  id: string
  content: string
  createdAt: string | Date
  mediaUrls?: string[]
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
const showInput = ref(false)
const replyOpenId = ref<string | null>(null)
const replyContent = ref('')

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


