<template>
  <div class="min-h-screen bg-#f7f6f3">
    <DogHeader />
    <div class="max-w-md mx-auto px-4 py-10">
      <DogLoginAnimation class="mb-4" />
      <div class="card">
        <div class="mb-3 text-sm text-#777">邮箱+密码 或 昵称快捷登录</div>
        <div v-if="error" class="mb-3 text-#b42318 bg-#fdecea border border-#f5c2c7 rounded px-3 py-2 text-sm">{{ error }}</div>
        <form class="flex flex-col gap-3" @submit.prevent="onSubmit">
          <input v-model.trim="email" placeholder="邮箱（可选）" class="input" />
          <input v-model.trim="password" type="password" placeholder="密码（可选）" class="input" />
          <div class="h-0.5 bg-#f4f2ef my-1"></div>
          <input v-model.trim="nickName" placeholder="昵称（可选）" class="input" />
          <button type="submit" class="btn-primary" :disabled="loading">{{ loading ? '登录中…' : '登录' }}</button>
        </form>
        <div class="mt-4 flex items-center justify-between">
          <span class="text-sm text-#777">还没有账号？</span>
          <NuxtLink to="/user/register" class="btn-secondary text-sm">去注册</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DogHeader from '@/components/ui/DogHeader.vue'
import DogLoginAnimation from '@/components/ui/DogLoginAnimation.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const mode = ref<'login'|'register'>('login')
const email = ref('')
const nickName = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function register() {
  error.value = ''
  if (!nickName.value.trim()) { error.value = '请填写昵称'; return }
  loading.value = true
  try {
    await $fetch('/api/auth/register', { method: 'POST', body: { email: email.value || undefined, nickName: nickName.value, password: password.value || undefined } })
    await router.push('/user/couple')
  } catch (e: any) {
    error.value = e?.data?.message || '注册失败，请稍后再试'
  } finally {
    loading.value = false
  }
}

async function onSubmit() {
  error.value = ''
  if (!email.value.trim() && !nickName.value.trim()) { error.value = '请填写邮箱+密码或昵称'; return }
  loading.value = true
  try {
    await $fetch('/api/auth/login', { method: 'POST', body: { email: email.value || undefined, nickName: nickName.value || undefined, password: password.value || undefined } })
    await router.push('/')
  } catch (e: any) {
    error.value = e?.data?.message || '登录失败，请检查信息'
  } finally {
    loading.value = false
  }
}

function switchMode(m: 'login'|'register') {
  mode.value = m
  error.value = ''
}
</script>


