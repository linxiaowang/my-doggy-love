<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { apiFetch } from '@/services/api'
import AnniversaryCountdown from '@/components/ui/AnniversaryCountdown.vue'

definePageMeta({
  layout: 'home',
})

const presetImages = [
  '/assets/images/couple/couple-1.png',
  '/assets/images/couple/couple-2.png',
  '/assets/images/couple/couple-3.png',
  '/assets/images/couple/couple-4.png'
]

const images = ref<string[]>([...presetImages])

// 使用 Pinia store 获取用户信息
const authStore = useAuthStore()

// 加载日常照片
async function loadDailyImages() {
  try {
    if (authStore.user) {
      const res = await apiFetch<{ items: any[] }>('/api/daily')
      const media = (res.items || []).flatMap(i => Array.isArray(i.mediaUrls) ? i.mediaUrls : [])
      if (media.length > 3) {
        // 如果超过3张，只用日常照片
        images.value = media.slice(0, 6)
      } else if (media.length > 0) {
        // 如果1-3张，日常照片 + 默认照片
        images.value = [...media.slice(0, 6), ...presetImages]
      } else {
        // 如果没有日常照片，使用默认照片
        images.value = [...presetImages]
      }
    } else {
      // 未登录时使用默认照片
      images.value = [...presetImages]
    }
  } catch {
    // ignore
  }
}

// 监听用户数据变化，加载照片
watch(() => authStore.user, (newUser) => {
  if (newUser) {
    loadDailyImages()
  } else {
    images.value = [...presetImages]
  }
}, { immediate: true })

onMounted(() => {
  // 如果用户数据已经加载，立即加载照片
  if (authStore.user) {
    loadDailyImages()
  }
})

function goQuickRecord() {
  navigateTo('/daily')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-surface-100 via-surface-50 to-surface-100">
    <DogHeader />
    <div class="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16 space-y-8">
      <section class="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div class="space-y-6 animate-fade-in">
          <div class="space-y-4">
            <h1 class="text-3xl md:text-5xl font-serif leading-tight text-text-main tracking-tight">
              爱的小事，<br class="hidden md:block" />值得被温柔记录。
            </h1>
            <p class="text-base md:text-lg text-text-secondary leading-relaxed">
              以"线条小狗"为灵感的情侣纪念与日常记录空间。<br class="hidden md:block" />
              以留白与软色调，收纳你们的每一帧心动。
            </p>
          </div>
          <!-- 纪念日倒计时提示 -->
          <div v-if="authStore.user" class="animate-slide-up" style="animation-delay: 0.1s">
            <AnniversaryCountdown />
          </div>
          <div class="flex flex-col sm:flex-row gap-3 animate-slide-up" style="animation-delay: 0.2s">
            <button class="btn-primary" @click="goQuickRecord">开始记录</button>
            <NuxtLink to="/daily" class="btn-secondary text-center">查看日常</NuxtLink>
          </div>
        </div>
        <div class="animate-fade-in" style="animation-delay: 0.15s">
          <DogCarousel :images="images" />
        </div>
      </section>
    </div>
    <QuickRecordButton @click="goQuickRecord" />
  </div>
</template>

<script lang="ts">
import DogHeader from '@/components/ui/DogHeader.vue'
import DogCarousel from '@/components/ui/DogCarousel.vue'
import QuickRecordButton from '@/components/ui/QuickRecordButton.vue'
export default {}
</script>
