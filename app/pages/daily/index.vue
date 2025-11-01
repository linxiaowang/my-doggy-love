<template>
  <div class="min-h-screen bg-#f7f6f3">
    <DogHeader />
    <div class="max-w-3xl mx-auto px-4 py-6">
      <div class="rounded-xl bg-white p-4 shadow mb-4">
        <form class="flex flex-col gap-2" @submit.prevent="create">
          <input v-model="content" placeholder="今天想记录点什么…" class="input" />
          <input v-model="tagsInput" placeholder="添加标签，用逗号分隔（如 旅游,美食）" class="input" />
          <div class="flex items-center gap-2">
            <input ref="fileRef" type="file" accept="image/*,video/*" multiple @change="onFilesChange" />
            <button class="btn-primary">发布</button>
          </div>
          <div v-if="filePreviews.length" class="text-xs text-#777">已选择 {{ filePreviews.length }} 个文件</div>
        </form>
      </div>
      <div class="rounded-xl bg-white p-4 shadow mb-4 space-y-3">
        <div class="flex flex-col md:flex-row gap-2 md:items-center">
          <div class="text-sm text-#777">筛选</div>
          <input v-model="start" type="date" class="border border-#ece7e1 rounded px-2 py-1 bg-white text-#333" />
          <input v-model="end" type="date" class="border border-#ece7e1 rounded px-2 py-1 bg-white text-#333" />
          <div class="flex gap-1 text-xs">
            <button class="btn-secondary px-2 py-1" @click="presetDays(0)">今天</button>
            <button class="btn-secondary px-2 py-1" @click="presetDays(7)">近7天</button>
            <button class="btn-secondary px-2 py-1" @click="presetDays(30)">近30天</button>
          </div>
          <button class="btn-secondary ml-auto" @click="clearFilters">清空</button>
        </div>
        <div class="flex flex-wrap gap-2">
          <span class="text-sm text-#777">标签</span>
          <button
            v-for="t in allTags" :key="t"
            class="chip"
            :class="selectedTags.includes(t) ? 'ring-2 ring-#e6eef5' : ''"
            @click="toggleTag(t)">{{ t }}</button>
          <input v-model="tag" placeholder="输入关键字回车添加新标签" class="input md:w-48" @keyup.enter="addTagFromInput" />
        </div>
      </div>
      <div v-if="loading">
        <SkeletonList :count="3" />
      </div>
      <div v-else-if="items.length === 0">
        <EmptyState text="暂无日常记录" img="/assets/images/xiaojimao/xiaojimao-4.png" cta-text="去发布一条" cta-to="/daily" />
      </div>
      <Timeline v-else>
        <template v-for="group in grouped" :key="group.label">
          <div class="pl-14 text-sm muted mb-2">{{ group.label }}</div>
          <TimelineItem v-for="it in group.items" :key="it.id">
            <PostCard :id="it.id" :content="it.content" :createdAt="it.createdAt" :media-urls="asArray(it.mediaUrls)" :tags="(it as any).tags || []" @commented="reloadOne(it.id)" />
          </TimelineItem>
        </template>
      </Timeline>
      <div v-if="hasMore && !loading" class="mt-4 flex justify-center">
        <button class="btn-secondary" @click="loadMore" :disabled="loadingMore">{{ loadingMore ? '加载中…' : '加载更多' }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DogHeader from '@/components/ui/DogHeader.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import SkeletonList from '@/components/ui/SkeletonList.vue'
import PostCard from '@/components/ui/PostCard.vue'
import Timeline from '@/components/ui/Timeline.vue'
import TimelineItem from '@/components/ui/TimelineItem.vue'
import { ref, onMounted, computed } from 'vue'

interface Post { id: string; content: string; mediaUrls: any; createdAt: string }
const items = ref<Post[]>([])
const loading = ref(true)
const content = ref('')
const fileRef = ref<HTMLInputElement | null>(null)
const start = ref('')
const end = ref('')
const tag = ref('')
const tagsInput = ref('')
const filePreviews = ref<any[]>([])
const pageSize = 10
const loadingMore = ref(false)
const selectedTags = ref<string[]>([])

async function load() {
  loading.value = true
  const res = await $fetch<{ items: Post[] }>(`/api/daily?take=${pageSize}`)
  items.value = res.items
  loading.value = false
}
onMounted(load)

async function create() {
  if (!content.value) return
  let mediaUrls: string[] = []
  if (fileRef.value?.files && fileRef.value.files.length) {
    const fd = new FormData()
    Array.from(fileRef.value.files).forEach(f => fd.append('file', f))
    const up = await $fetch<{ urls: string[] }>('/api/upload', { method: 'POST', body: fd })
    mediaUrls = up.urls
  }
  const tags = tagsInput.value
    ? tagsInput.value.split(',').map(s => s.trim()).filter(Boolean)
    : []
  await $fetch('/api/daily', { method: 'POST', body: { content: content.value, mediaUrls, tags } })
  content.value = ''
  tagsInput.value = ''
  if (fileRef.value) fileRef.value.value = ''
  filePreviews.value = []
  await load()
}

function asArray(v: any): string[] {
  if (Array.isArray(v)) return v
  return []
}

const filtered = computed(() => {
  const s = start.value ? new Date(start.value) : null
  const e = end.value ? new Date(end.value) : null
  const t = tag.value.trim()
  return items.value.filter((it: any) => {
    const d = new Date(it.createdAt)
    if (s && d < s) return false
    if (e && d > new Date(e.getTime() + 24*60*60*1000 - 1)) return false
    if (t) {
      const tagsArr = Array.isArray(it.tags) ? it.tags : []
      if (!tagsArr.some((x: string) => String(x).includes(t))) return false
    }
    if (selectedTags.value.length) {
      const tagsArr = Array.isArray(it.tags) ? it.tags : []
      const hasAny = selectedTags.value.some(st => tagsArr.includes(st))
      if (!hasAny) return false
    }
    return true
  })
})

const grouped = computed(() => {
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const startOfWeek = new Date(startOfToday - (now.getDay() || 7 - 1) * 24*60*60*1000).getTime()
  const today: Post[] = []
  const thisWeek: Post[] = []
  const earlier: Post[] = []
  for (const it of filtered.value) {
    const t = new Date(it.createdAt).getTime()
    if (t >= startOfToday) today.push(it)
    else if (t >= startOfWeek) thisWeek.push(it)
    else earlier.push(it)
  }
  const groups: Array<{ label: string; items: Post[] }> = []
  if (today.length) groups.push({ label: '今天', items: today })
  if (thisWeek.length) groups.push({ label: '本周', items: thisWeek })
  if (earlier.length) groups.push({ label: '更早', items: earlier })
  return groups
})

const hasMore = computed(() => items.value.length > 0 && items.value.length % pageSize === 0)

async function loadMore() {
  if (!items.value.length) return
  loadingMore.value = true
  const last = items.value[items.value.length - 1] as Post
  const res = await $fetch<{ items: Post[] }>(`/api/daily?take=${pageSize}&cursor=${encodeURIComponent(last.id)}`)
  const toAppend = res.items.filter(p => !items.value.find(i => i.id === p.id))
  items.value = items.value.concat(toAppend)
  loadingMore.value = false
}

function onFilesChange() {
  if (!fileRef.value?.files) { filePreviews.value = []; return }
  filePreviews.value = Array.from(fileRef.value.files)
}

async function reloadOne(id: string) {
  // 简易刷新：整体重载，避免复杂局部状态同步
  await load()
}

const allTags = computed(() => {
  const set = new Set<string>()
  for (const it of items.value) {
    const arr = Array.isArray((it as any).tags) ? (it as any).tags as string[] : []
    for (const t of arr) set.add(t)
  }
  return Array.from(set)
})

function toggleTag(t: string) {
  const i = selectedTags.value.indexOf(t)
  if (i >= 0) selectedTags.value.splice(i, 1)
  else selectedTags.value.push(t)
}

function addTagFromInput() {
  const v = tag.value.trim()
  if (!v) return
  if (!selectedTags.value.includes(v)) selectedTags.value.push(v)
  tag.value = ''
}

function presetDays(days: number) {
  const today = new Date()
  const ymd = (d: Date) => d.toISOString().slice(0,10)
  if (days === 0) {
    start.value = ymd(today)
    end.value = ymd(today)
  } else {
    const from = new Date(today.getTime() - (days-1) * 24*60*60*1000)
    start.value = ymd(from)
    end.value = ymd(today)
  }
}

function clearFilters() {
  start.value = ''
  end.value = ''
  tag.value = ''
  selectedTags.value = []
}
</script>


