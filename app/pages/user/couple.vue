<template>
  <div class="min-h-screen bg-#f7f6f3">
    <DogHeader />
    <div class="max-w-xl mx-auto px-4 py-8">
      <div class="rounded-xl bg-white p-6 shadow space-y-4">
        <div class="text-lg">情侣绑定</div>
        <div v-if="loading" class="text-sm text-#777">加载中…</div>
        <div v-else-if="couple" class="space-y-4">
          <div class="flex items-center justify-between">
            <div>邀请码：<span class="font-mono">{{ couple.code }}</span></div>
            <button class="btn-secondary text-xs" @click="copyCode">复制</button>
          </div>
          <div class="flex items-center gap-3">
            <div class="flex -space-x-3">
              <img v-for="m in couple.members" :key="m.id" :src="m.avatarUrl || '/assets/images/xiaojimao/xiaojimao-2.png'" loading="lazy" class="w-10 h-10 rounded-full border-2 border-white" />
            </div>
            <div class="text-sm text-#777">
              <div v-for="m in couple.members" :key="m.id">{{ m.nickName }}（{{ m.role==='A' ? '发起者' : '伴侣' }}）</div>
            </div>
          </div>
          <div v-if="couple.members.length === 1" class="space-y-2">
            <div class="text-xs text-#777">已创建情侣：等待对方加入。你也可以直接加入对方的情侣（将切换绑定）。</div>
            <form class="flex gap-2" @submit.prevent="switchToCode">
              <input v-model="switchCode" placeholder="输入对方的邀请码切换绑定" class="input" />
              <button class="btn-secondary">切换加入</button>
            </form>
          </div>
        </div>
        <div v-else class="space-y-4">
          <div class="text-sm text-#777">你还没有绑定情侣。可以创建情侣，或直接输入对方的邀请码加入。</div>
          <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <button class="btn-primary" @click="createCouple">创建情侣</button>
            <form class="flex gap-2 w-full sm:w-auto" @submit.prevent="joinCouple">
              <input v-model="code" placeholder="输入邀请码（如 ABC123）" class="input w-full sm:w-56" />
              <button class="btn-secondary">加入</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DogHeader from '@/components/ui/DogHeader.vue'
import { ref, onMounted } from 'vue'

const couple = ref<any | null>(null)
const code = ref('')
const loading = ref(true)
const switchCode = ref('')

async function load() {
  loading.value = true
  const res = await $fetch('/api/couple/me')
  couple.value = res.couple
  loading.value = false
}

onMounted(load)

async function createCouple() {
  await $fetch('/api/couple/create', { method: 'POST' })
  await load()
}

async function joinCouple() {
  if (!code.value) return
  await $fetch('/api/couple/join', { method: 'POST', body: { code: code.value } })
  await load()
}

async function copyCode() {
  if (!couple.value?.code) return
  try {
    await navigator.clipboard.writeText(couple.value.code)
  } catch {}
}

async function switchToCode() {
  if (!switchCode.value) return
  await $fetch('/api/couple/switch', { method: 'POST', body: { code: switchCode.value } })
  switchCode.value = ''
  await load()
}
</script>


