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
            <button class="btn-primary" @click="createCoupleHandler">创建情侣</button>
            <form class="flex gap-2 w-full sm:w-auto" @submit.prevent="joinCoupleHandler">
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
import { useCouple, createCouple, joinCouple, switchCouple } from '@/services/api/couple'
import { computed } from 'vue'

// 检查登录状态，未登录会自动跳转到登录页
definePageMeta({
  middleware: 'auth',
})

const code = ref('')
const switchCode = ref('')

// 使用统一的 API
const { data: coupleData, pending, refresh } = useCouple()
// coupleData 是 Ref<CoupleResponse | null>，直接访问 .couple
const couple = computed(() => coupleData.value?.couple || null)
const loading = computed(() => pending.value)

onMounted(async () => {
  await refresh()
})

async function createCoupleHandler() {
  try {
    await createCouple()
    await refresh()
  } catch (e: any) {
    console.error('创建情侣失败:', e)
    alert(e?.friendlyMessage || '创建情侣失败，请稍后再试')
  }
}

async function joinCoupleHandler() {
  if (!code.value) return
  try {
    await joinCouple(code.value)
    code.value = ''
    await refresh()
  } catch (e: any) {
    console.error('加入情侣失败:', e)
    alert(e?.friendlyMessage || '加入情侣失败，请检查邀请码是否正确')
  }
}

async function copyCode() {
  if (!couple.value?.code) return
  try {
    await navigator.clipboard.writeText(couple.value.code)
  } catch {}
}

async function switchToCode() {
  if (!switchCode.value) return
  try {
    await switchCouple(switchCode.value)
    switchCode.value = ''
    await refresh()
  } catch (e: any) {
    console.error('切换情侣失败:', e)
    alert(e?.friendlyMessage || '切换情侣失败，请检查邀请码是否正确')
  }
}
</script>


