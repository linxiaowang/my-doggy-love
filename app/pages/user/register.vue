<template>
  <div class="min-h-screen bg-#f7f6f3">
    <DogHeader />
    <div class="max-w-md mx-auto px-4 py-10">
      <DogLoginAnimation class="mb-4" />
      <div class="card">
        <h2 class="text-xl font-semibold mb-2">注册</h2>
        <div class="mb-3 text-sm text-#777">使用邮箱和密码注册，昵称可选（不填写将从邮箱自动生成）</div>
        <div v-if="error" class="mb-3 text-#b42318 bg-#fdecea border border-#f5c2c7 rounded px-3 py-2 text-sm">{{ error }}</div>
        <form class="flex flex-col gap-3" @submit.prevent="register">
          <input 
            v-model.trim="email" 
            type="email"
            placeholder="邮箱" 
            class="input" 
            required
            autocomplete="email"
          />
          <input 
            v-model.trim="password" 
            type="password" 
            placeholder="密码（至少6位）" 
            class="input" 
            required
            autocomplete="new-password"
            minlength="6"
          />
          <input 
            v-model.trim="nickName" 
            placeholder="昵称（可选，不填将从邮箱自动生成）" 
            class="input"
            autocomplete="nickname"
          />
          <button type="submit" class="btn-primary" :disabled="loading || !email || !password || password.length < 6">
            {{ loading ? '注册中…' : '注册' }}
          </button>
        </form>
        <div class="mt-3 text-sm">
          已有账号？
          <NuxtLink class="underline" to="/user/login">去登录</NuxtLink>
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
import { register as apiRegister } from '@/services/api/auth'
import { handleApiError } from '@/services/api'

const router = useRouter()
const email = ref('')
const nickName = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function register() {
  error.value = ''
  
  // 前端验证
  if (!email.value.trim()) {
    error.value = '请输入邮箱'
    return
  }
  
  if (!password.value) {
    error.value = '请输入密码'
    return
  }
  
  // 密码长度验证
  if (password.value.length < 6) {
    error.value = '密码长度至少需要6位'
    return
  }
  
  // 简单的邮箱格式验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value.trim())) {
    error.value = '邮箱格式不正确'
    return
  }
  
  loading.value = true
  try {
    await apiRegister({
      email: email.value.trim(),
      password: password.value,
      nickName: nickName.value.trim() || undefined,
    })
    await router.push('/user/couple')
  } catch (e: any) {
    error.value = e?.friendlyMessage || handleApiError(e)
  } finally {
    loading.value = false
  }
}
</script>


