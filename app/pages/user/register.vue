<template>
  <div class="min-h-screen bg-#f7f6f3">
    <DogHeader />
    <div class="max-w-md mx-auto px-4 py-10">
      <DogLoginAnimation class="mb-4" />
      <div class="card">
        <div class="mb-3 text-sm text-#777">只需填写昵称即可完成注册；邮箱和密码可稍后在“用户资料”补充。注册成功后将跳转到情侣绑定页。</div>
        <div v-if="error" class="mb-3 text-#b42318 bg-#fdecea border border-#f5c2c7 rounded px-3 py-2 text-sm">{{ error }}</div>
        <form class="flex flex-col gap-3" @submit.prevent="register">
          <input v-model.trim="nickName" placeholder="昵称（必填）" class="input" />
          <input v-model.trim="email" placeholder="邮箱（可选）" class="input" />
          <input v-model.trim="password" type="password" placeholder="密码（可选）" class="input" />
          <button type="submit" class="btn-primary" :disabled="loading">{{ loading ? '注册中…' : '注册' }}</button>
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

const router = useRouter()
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
</script>


