<template>
  <div class="min-h-screen bg-#f7f6f3">
    <DogHeader />
    <div class="max-w-2xl mx-auto px-4 py-8">
      <div class="rounded-xl bg-white p-6 shadow space-y-4">
        <div class="text-lg">用户资料</div>
        <div v-if="user" class="flex items-center gap-4">
          <img :src="user.avatarUrl || '/assets/images/xiaobai/xiaobai-2.png'" loading="lazy" class="w-16 h-16 rounded-full object-cover" />
          <div>
            <div class="font-medium">{{ user.nickName }}</div>
            <div class="text-sm text-#777">{{ user.email }}</div>
          </div>
        </div>
        <form class="flex items-center gap-3" @submit.prevent="onUpload">
          <input ref="fileRef" type="file" accept="image/*" />
          <button class="px-3 py-1 rounded bg-#e9e4de">上传头像</button>
        </form>
        <div class="border-t border-#ece7e1 pt-4 space-y-3">
          <div class="text-base">情侣关系</div>
          <template v-if="couple">
            <div v-if="couple.members?.length >= 2" class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="text-sm">邀请码：<span class="font-mono">{{ couple.code }}</span></div>
                <div class="flex -space-x-3">
                  <img v-for="m in couple.members" :key="m.id" :src="m.avatarUrl || '/assets/images/couple/couple-2.png'" class="w-8 h-8 rounded-full border-2 border-white" />
                </div>
              </div>
              <NuxtLink to="/user/couple" class="text-sm underline">管理情侣</NuxtLink>
            </div>
            <div v-else class="text-sm text-#777">
              已创建情侣但尚未完成绑定，邀请码：<span class="font-mono">{{ couple.code }}</span>
              <NuxtLink to="/user/couple" class="underline ml-1">去邀请对方</NuxtLink>
            </div>
          </template>
          <template v-else>
            <div class="text-sm text-#777">你还没有绑定情侣。
              <NuxtLink to="/user/couple" class="underline ml-1">去绑定</NuxtLink>
            </div>
          </template>
        </div>
        <div class="flex items-center gap-3 text-sm pt-2">
          <NuxtLink to="/" class="underline">返回首页</NuxtLink>
          <button class="underline" @click="logout">退出登录</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DogHeader from '@/components/ui/DogHeader.vue'
import { ref, onMounted } from 'vue'

const user = ref<{ id: string; nickName: string; email?: string; avatarUrl?: string } | null>(null)
const fileRef = ref<HTMLInputElement | null>(null)
const couple = ref<{ id: string; code: string; members: Array<{ id: string; nickName: string; avatarUrl?: string; role: string }> } | null>(null)

onMounted(async () => {
  const res = await $fetch('/api/auth/me')
  user.value = res.user
  const c = await $fetch('/api/couple/me')
  couple.value = c.couple
})

async function onUpload() {
  if (!fileRef.value?.files?.length) return
  const fd = new FormData()
  const f = fileRef.value.files[0] as File
  fd.append('file', f, f.name)
  await $fetch('/api/auth/avatar', { method: 'POST', body: fd })
  const res = await $fetch('/api/auth/me')
  user.value = res.user
}

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  user.value = null
  navigateTo('/user/login')
}
</script>


