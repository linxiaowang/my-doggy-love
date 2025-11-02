<template>
  <div class="min-h-screen bg-#f7f6f3">
    <DogHeader />
    <div class="max-w-md mx-auto px-4 py-10">
      <DogLoginAnimation class="mb-4" />
      <div class="card">
        <h2 class="text-xl font-semibold mb-2">登录</h2>
        <div class="mb-3 text-sm text-#777">使用邮箱和密码登录</div>
        <div v-if="error" class="mb-3 text-#b42318 bg-#fdecea border border-#f5c2c7 rounded px-3 py-2 text-sm">{{ error }}</div>
        <form class="flex flex-col gap-3" @submit.prevent="onSubmit">
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
            placeholder="密码" 
            class="input" 
            required
            autocomplete="current-password"
          />
          <button type="submit" class="btn-primary" :disabled="loading || !email || !password">
            {{ loading ? '登录中…' : '登录' }}
          </button>
        </form>
        
        <!-- 微信登录（暂时隐藏） -->
        <!-- <div class="mt-4">
          <div class="relative flex items-center justify-center my-4">
            <div class="h-0.5 bg-#e5e5e5 flex-1"></div>
            <span class="px-3 text-sm text-#999 bg-#f7f6f3">或</span>
            <div class="h-0.5 bg-#e5e5e5 flex-1"></div>
          </div>
          <button 
            @click="wechatLogin"
            class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-#07c160 hover:bg-#06ad56 text-white rounded-lg transition font-medium"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.042-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.35-8.596-6.35zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm7.494 3.336c-2.396 0-4.512 1.172-5.832 2.965-.579.785-.936 1.71-.936 2.743 0 .614.134 1.198.373 1.732.693 1.533 2.066 2.708 3.723 3.218.228.078.467.14.712.19.52.105 1.066.16 1.627.16 2.395 0 4.51-1.17 5.832-2.963.578-.785.936-1.71.936-2.742 0-1.033-.358-1.958-.936-2.743-1.32-1.793-3.437-2.965-5.831-2.965zm-2.92 3.777c.457 0 .828.376.828.84a.835.835 0 0 1-.828.839.835.835 0 0 1-.828-.84c0-.463.37-.839.828-.839zm5.049 0c.457 0 .828.376.828.84a.835.835 0 0 1-.828.839.835.835 0 0 1-.828-.84c0-.463.37-.839.828-.839z"/>
            </svg>
            <span>微信登录</span>
          </button>
        </div> -->
        
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
import { login } from '@/services/api/auth'
import { handleApiError } from '@/services/api'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function onSubmit() {
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
  
  // 简单的邮箱格式验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value.trim())) {
    error.value = '邮箱格式不正确'
    return
  }
  
  loading.value = true
  try {
    await login({
      email: email.value.trim(),
      password: password.value,
    })
    // 检查是否有重定向参数
    const route = useRoute()
    const redirectTo = route.query.redirect as string || '/'
    await router.push(redirectTo)
  } catch (e: any) {
    error.value = e?.friendlyMessage || handleApiError(e)
  } finally {
    loading.value = false
  }
}

function wechatLogin() {
  // 跳转到微信授权页面
  window.location.href = '/api/auth/wechat/authorize'
}
</script>


