<template>
  <div class="min-h-screen bg-#f7f6f3">
    <DogHeader />
    <div class="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <div class="card">
        <form class="flex gap-2" @submit.prevent="addWish">
          <input v-model="title" placeholder="添加一个愿望…" class="input flex-1" />
          <button class="btn-primary">添加</button>
        </form>
        <div class="mt-3 flex items-center justify-between text-sm">
          <div class="muted">共 {{ items.length }} 个愿望 · 已完成 {{ doneList.length }} 个</div>
          <div class="grid grid-cols-3 border border-#ece7e1 rounded-lg overflow-hidden">
            <button class="py-1 px-3" :class="filter==='all' ? 'bg-#f0e9e2' : 'bg-white'" @click="filter='all'">全部</button>
            <button class="py-1 px-3" :class="filter==='todo' ? 'bg-#f0e9e2' : 'bg-white'" @click="filter='todo'">未完成</button>
            <button class="py-1 px-3" :class="filter==='done' ? 'bg-#f0e9e2' : 'bg-white'" @click="filter='done'">已完成</button>
          </div>
        </div>
      </div>

      <div v-if="loading">
        <SkeletonList :count="3" />
      </div>

      <div v-else-if="filteredList.length === 0">
        <EmptyState text="还没有愿望，添加一个吧" img="/assets/images/xiaobai/xiaobai-1.png" cta-text="添加愿望" cta-to="/wishes" />
      </div>

      <div v-else class="space-y-3">
        <div v-for="w in filteredList" :key="w.id" class="rounded-xl bg-white p-4 shadow flex items-center justify-between gap-3">
          <div class="flex items-start gap-3">
            <input type="checkbox" :checked="w.status==='done'" @change="toggle(w)" class="mt-1" />
            <div>
              <div class="text-base" :class="w.status==='done' ? 'line-through text-#999' : ''">{{ w.title }}</div>
              <div v-if="w.status==='done' && w.finishedAt" class="text-xs text-#999 mt-1">
                <span class="chip-success">已完成</span>
                <span class="ml-2">{{ new Date(w.finishedAt).toLocaleString() }}</span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <button v-if="w.status==='todo'" class="btn-secondary" @click="markDone(w.id)">标记完成</button>
            <button v-else class="btn-secondary" @click="markTodo(w.id)">重置</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DogHeader from '@/components/ui/DogHeader.vue'
import { computed, ref, onMounted } from 'vue'
import SkeletonList from '@/components/ui/SkeletonList.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

interface Wish { id: string; title: string; status: 'todo'|'done'; finishedAt?: string }
const items = ref<Wish[]>([])
const title = ref('')
const loading = ref(true)
const filter = ref<'all'|'todo'|'done'>('all')

const todoList = computed(() => items.value.filter(i => i.status === 'todo'))
const doneList = computed(() => items.value.filter(i => i.status === 'done'))
const filteredList = computed(() => {
  if (filter.value === 'todo') return todoList.value
  if (filter.value === 'done') return doneList.value
  return items.value
})

async function load() {
  loading.value = true
  const res = await $fetch<{ items: Wish[] }>('/api/wishes')
  items.value = res.items
  loading.value = false
}
onMounted(load)

async function addWish() {
  if (!title.value) return
  await $fetch('/api/wishes', { method: 'POST', body: { title: title.value } })
  title.value = ''
  await load()
}

async function markDone(id: string) {
  await $fetch(`/api/wishes/${id}`, { method: 'PATCH', body: { status: 'done' } })
  await load()
}

async function markTodo(id: string) {
  await $fetch(`/api/wishes/${id}`, { method: 'PATCH', body: { status: 'todo' } })
  await load()
}

async function toggle(w: Wish) {
  if (w.status === 'todo') await markDone(w.id)
  else await markTodo(w.id)
}
</script>


