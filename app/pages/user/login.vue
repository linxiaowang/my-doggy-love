<template>
  <div class="min-h-screen bg-muted/30">
    <DogHeader />
    <div class="max-w-md mx-auto px-4 py-10">
      <DogLoginAnimation class="mb-4" />
      
      <Card>
        <CardHeader>
          <CardTitle>登录</CardTitle>
          <CardDescription>使用邮箱和密码登录</CardDescription>
        </CardHeader>
        <CardContent>
          <div v-if="error" class="mb-4 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            {{ error }}
          </div>
          
          <form class="space-y-4" @submit.prevent="onSubmit">
            <div class="space-y-2">
              <Label htmlFor="email" class="sr-only">邮箱</Label>
              <Input 
                id="email"
                v-model.trim="email" 
                type="email"
                placeholder="邮箱" 
                required
                autocomplete="email"
              />
            </div>
            <div class="space-y-2">
              <Label htmlFor="password" class="sr-only">密码</Label>
              <Input 
                id="password"
                v-model.trim="password" 
                type="password" 
                placeholder="密码" 
                required
                autocomplete="current-password"
              />
            </div>
            <Button type="submit" class="w-full" :disabled="loading || !email || !password">
              {{ loading ? '登录中…' : '登录' }}
            </Button>
          </form>

          <div class="mt-6 flex items-center justify-between">
            <span class="text-sm text-muted-foreground">还没有账号？</span>
            <Button variant="link" class="p-0 h-auto" as-child>
              <NuxtLink to="/user/register">去注册</NuxtLink>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import DogHeader from '@/components/ui/DogHeader.vue'
import DogLoginAnimation from '@/components/ui/DogLoginAnimation.vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ref, nextTick } from 'vue'
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
    // 触发登录成功事件，通知 Header 刷新
    if (process.client) {
      window.dispatchEvent(new Event('user-login-success'))
    }
    // 检查是否有重定向参数
    const route = useRoute()
    const redirectTo = route.query.redirect as string || '/'
    // 延迟一下确保事件已处理
    await nextTick()
    setTimeout(async () => {
      await router.push(redirectTo)
    }, 100)
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


