<template>
  <div class="min-h-screen bg-gradient-to-br from-#f7f6f3 via-#faf9f7 to-#f7f6f3">
    <DogHeader />
    <div class="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <Card>
        <CardContent class="px-4">
          <form class="flex flex-col sm:flex-row gap-3 mb-4" @submit.prevent="addWish">
            <Input v-model="title" placeholder="添加一个愿望…" class="flex-1" />
            <Button type="submit" class="sm:w-auto">添加</Button>
          </form>
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div class="text-sm text-muted-foreground text-center sm:text-left">
              共 {{ items.length }} 个愿望 · 已完成 {{ doneList.length }} 个
            </div>
            <Tabs :model-value="filter" @update:model-value="(val) => filter = val as 'all' | 'todo' | 'done'" class="w-full sm:w-auto">
              <TabsList class="grid w-full grid-cols-3">
                <TabsTrigger value="all">全部</TabsTrigger>
                <TabsTrigger value="todo">未完成</TabsTrigger>
                <TabsTrigger value="done">已完成</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      <div v-if="loading">
        <SkeletonList :count="3" />
      </div>

      <div v-else-if="filteredList.length === 0">
        <EmptyState text="还没有愿望，添加一个吧" img="/assets/images/xiaobai/xiaobai-1.png" cta-text="添加愿望" cta-to="/wishes" />
      </div>

      <div v-else class="space-y-3">
        <Card v-for="w in filteredList" :key="w.id">
          <CardContent>
            <div class="flex items-start gap-3 flex-1 min-w-0">
              <Checkbox :checked="w.status === 'done'" @update:checked="toggle(w)" class="mt-1" />
              <div class="flex-1 min-w-0">
                <div class="text-base font-medium break-words" :class="w.status === 'done' ? 'line-through text-muted-foreground' : ''">
                  {{ w.title }}
                </div>
                <div v-if="w.status === 'done' && w.finishedAt" class="flex items-center gap-2 mt-2">
                  <Badge variant="default" class="text-xs">已完成</Badge>
                  <span class="text-xs text-muted-foreground">{{ new Date(w.finishedAt).toLocaleString() }}</span>
                </div>
              </div>
              <div class="flex-shrink-0">
                <Button v-if="w.status === 'todo'" variant="outline" size="sm" @click="markDone(w.id)">标记完成</Button>
                <Button v-else variant="outline" size="sm" @click="markTodo(w.id)">重置</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DogHeader from '@/components/DogHeader.vue'
import { computed, ref, onMounted } from 'vue'
import SkeletonList from '@/components/SkeletonList.vue'
import EmptyState from '@/components/EmptyState.vue'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
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


