<template>
  <div class="min-h-screen bg-#f7f6f3">
    <DogHeader />
    <div class="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <div class="rounded-xl bg-white p-4 shadow">
        <form class="grid md:grid-cols-4 gap-2 items-center" @submit.prevent="create">
          <input v-model="title" placeholder="纪念日标题" class="border border-#ece7e1 rounded px-3 py-2 md:col-span-2 bg-white text-#333 placeholder:text-gray-400" />
          <input v-model="date" type="date" class="border border-#ece7e1 rounded px-3 py-2 bg-white text-#333" />
          <button class="px-4 py-2 rounded bg-#e9e4de">创建</button>
        </form>
      </div>
      <div v-if="loading">
        <SkeletonList :count="2" />
      </div>
      <div v-else-if="items.length===0">
        <EmptyState text="添加一个特别的日子吧" img="/assets/images/couple/couple-1.png" cta-text="创建纪念日" cta-to="/anniversaries" />
      </div>
      <div v-else class="grid md:grid-cols-2 gap-4">
        <div
          v-for="a in items"
          :key="a.id"
          class="rounded-xl p-4 shadow-sm border"
          :class="meta(a).overdue ? 'border-#f3d1d1' : 'border-#e1e9f5'"
          :style="{
            background: meta(a).overdue
              ? 'linear-gradient(180deg, #fff, #fdf4f4)'
              : 'linear-gradient(180deg, #fff, #f6f9fd)'
          }"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="card-heading">{{ a.title }}</div>
              <div class="text-sm text-#777">{{ new Date(a.date).toLocaleDateString() }}</div>
            </div>
            <span
              class="px-2 py-0.5 rounded-full text-xs"
              :class="meta(a).overdue ? 'bg-#fdecec text-#b42318' : (meta(a).days===0 ? 'bg-#e7f6ec text-#127a3e' : 'bg-#e6eef5 text-#335b8c')"
            >
              {{ meta(a).label }}
            </span>
          </div>
          <div class="mt-3 flex items-center gap-3">
            <button class="text-sm underline" @click="openEdit(a)">编辑</button>
            <button class="text-sm underline" @click="remove(a.id)">删除</button>
          </div>
        </div>
      </div>

      <!-- 编辑对话框 -->
      <div v-if="editing" class="fixed inset-0 z-40 bg-black/30 flex items-center justify-center px-4">
        <div class="card w-full max-w-md">
          <div class="card-heading mb-3">编辑纪念日</div>
          <form class="flex flex-col gap-3" @submit.prevent="saveEdit">
            <input v-model="editTitle" placeholder="纪念日标题" class="input" />
            <input v-model="editDate" type="date" class="input" />
            <div class="flex justify-end gap-2 mt-2">
              <button type="button" class="btn-secondary" @click="closeEdit">取消</button>
              <button type="submit" class="btn-primary">保存</button>
            </div>
          </form>
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

interface Anniversary { id: string; title: string; date: string }
const items = ref<Anniversary[]>([])
const title = ref('')
const date = ref('')
const loading = ref(true)
const editing = ref(false)
const editId = ref<string>('')
const editTitle = ref('')
const editDate = ref('')

function meta(a: Anniversary) {
  const today = new Date()
  const d = new Date(a.date)
  // 清零时分秒，避免时区导致的跨天误差
  const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
  const t1 = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  const diffDays = Math.round((t1 - t0) / (24*60*60*1000))
  const overdue = diffDays < 0
  const label = diffDays === 0 ? '就是今天' : (overdue ? `已过 ${Math.abs(diffDays)} 天` : `还有 ${diffDays} 天`)
  return { days: diffDays, overdue, label }
}

async function load() {
  loading.value = true
  const res = await $fetch<{ items: Anniversary[] }>('/api/anniversaries')
  items.value = res.items
  loading.value = false
}
onMounted(load)

async function create() {
  if (!title.value || !date.value) return
  await $fetch('/api/anniversaries', { method: 'POST', body: { title: title.value, date: date.value } })
  title.value = ''
  date.value = ''
  await load()
}

async function remove(id: string) {
  await $fetch(`/api/anniversaries/${id}` as any, { method: 'DELETE' })
  await load()
}

function openEdit(a: Anniversary) {
  editId.value = a.id
  editTitle.value = a.title
  editDate.value = a.date.slice(0,10)
  editing.value = true
}

function closeEdit() {
  editing.value = false
}

async function saveEdit() {
  if (!editId.value) return
  await $fetch(`/api/anniversaries/${editId.value}` as any, { method: 'PATCH', body: { title: editTitle.value, date: editDate.value } })
  editing.value = false
  await load()
}
</script>


