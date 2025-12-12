<template>
  <div class="min-h-screen bg-muted/30">
    <DogHeader />
    <div class="max-w-md mx-auto px-4 py-10">
      <DogLoginAnimation class="mb-4" />
      
      <Card>
        <CardHeader>
          <CardTitle>注册</CardTitle>
          <CardDescription>使用邮箱和密码注册，昵称可选（不填写将从邮箱自动生成）</CardDescription>
        </CardHeader>
        <CardContent>
          <div v-if="error" class="mb-4 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            {{ error }}
          </div>
          
          <form class="space-y-4" @submit.prevent="register">
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
                placeholder="密码（至少6位）" 
                required
                autocomplete="new-password"
                minlength="6"
              />
            </div>
            
            <div class="space-y-2">
              <Label htmlFor="nickName" class="sr-only">昵称</Label>
              <Input 
                id="nickName"
                v-model.trim="nickName" 
                placeholder="昵称（可选，不填将从邮箱自动生成）" 
                autocomplete="nickname"
              />
            </div>

            <Button type="submit" class="w-full" :disabled="loading || !email || !password || password.length < 6">
              {{ loading ? '注册中…' : '注册' }}
            </Button>
          </form>
          
          <div class="mt-6 flex items-center justify-between">
            <span class="text-sm text-muted-foreground">已有账号？</span>
            <Button variant="link" class="p-0 h-auto" as-child>
              <NuxtLink to="/user/login">去登录</NuxtLink>
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


