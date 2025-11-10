<template>
  <div class="min-h-screen bg-gradient-to-br from-#f7f6f3 via-#faf9f7 to-#f7f6f3">
    <DogHeader />
    <div class="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <div class="card animate-fade-in">
        <form class="flex flex-col sm:flex-row gap-2" @submit.prevent="addWish">
          <input v-model="title" placeholder="添加一个愿望…" class="input flex-1 w-full" />
          <button class="btn-primary w-full sm:w-auto">添加</button>
        </form>
        <div class="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm">
          <div class="muted font-medium text-center sm:text-left">共 {{ items.length }} 个愿望 · 已完成 {{ doneList.length }} 个</div>
          <div class="grid grid-cols-3 border border-#ece7e1 rounded-lg overflow-hidden shadow-sm text-sm">
            <button class="py-2 px-3 font-medium transition-colors duration-200" :class="filter==='all' ? 'bg-#f0e9e2 text-#333' : 'bg-white text-#666 hover:bg-#f7f6f3'" @click="filter='all'">全部</button>
            <button class="py-2 px-3 font-medium transition-colors duration-200" :class="filter==='todo' ? 'bg-#f0e9e2 text-#333' : 'bg-white text-#666 hover:bg-#f7f6f3'" @click="filter='todo'">未完成</button>
            <button class="py-2 px-3 font-medium transition-colors duration-200" :class="filter==='done' ? 'bg-#f0e9e2 text-#333' : 'bg-white text-#666 hover:bg-#f7f6f3'" @click="filter='done'">已完成</button>
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
        <div v-for="w in filteredList" :key="w.id" class="rounded-xl bg-white p-5 shadow-sm hover:shadow-md border border-#ece7e1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all duration-300 animate-fade-in">
          <div class="flex items-start gap-3 flex-1 min-w-0">
            <input type="checkbox" :checked="w.status==='done'" @change="toggle(w)" class="mt-1 w-5 h-5 cursor-pointer" />
            <div class="flex-1 min-w-0">
              <div class="text-base font-medium break-words" :class="w.status==='done' ? 'line-through text-#999' : 'text-#333'">{{ w.title }}</div>
              <div v-if="w.status==='done' && w.finishedAt" class="text-xs text-#999 mt-2 flex items-center gap-2">
                <span class="chip-success">已完成</span>
                <span>{{ new Date(w.finishedAt).toLocaleString() }}</span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2 text-sm flex-shrink-0 w-full sm:w-auto">
            <button v-if="w.status==='todo'" class="btn-secondary text-sm flex-1 sm:flex-none" @click="markDone(w.id)">标记完成</button>
            <button v-else class="btn-secondary text-sm flex-1 sm:flex-none" @click="markTodo(w.id)">重置</button>
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
import { useWishes, createWish, updateWish } from '@/services/api/wishes'
import { apiFetch } from '@/services/api'

// 检查登录状态，未登录会自动跳转到登录页
definePageMeta({
  middleware: 'auth',
})

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
  try {
    const res = await apiFetch<{ items: Wish[] }>('/api/wishes')
    items.value = res.items
  } catch (e: any) {
    console.error('加载愿望列表失败:', e)
  } finally {
    loading.value = false
  }
}
onMounted(load)

async function addWish() {
  if (!title.value) return
  try {
    await createWish({ title: title.value })
    title.value = ''
    await load()
  } catch (e: any) {
    console.error('添加愿望失败:', e)
  }
}

async function markDone(id: string) {
  try {
    await updateWish(id, { status: 'done' })
    await load()
  } catch (e: any) {
    console.error('标记完成失败:', e)
  }
}

async function markTodo(id: string) {
  try {
    await updateWish(id, { status: 'todo' })
    await load()
  } catch (e: any) {
    console.error('重置愿望失败:', e)
  }
}

async function toggle(w: Wish) {
  if (w.status === 'todo') await markDone(w.id)
  else await markTodo(w.id)
}
</script>


