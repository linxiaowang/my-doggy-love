<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useAuthMe } from '@/services/api/auth'
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

// 使用统一的 API
const { data: meData } = useAuthMe()

// 加载日常照片
async function loadDailyImages() {
  try {
    if (meData.value?.user) {
      const res = await apiFetch<{ items: any[] }>('/api/daily')
      const media = (res.items || []).flatMap(i => Array.isArray(i.mediaUrls) ? i.mediaUrls : [])
      if (media.length) images.value = [...media.slice(0, 6), ...presetImages]
    }
  } catch {
    // ignore
  }
}

// 监听用户数据变化，加载照片
watch(meData, (newData) => {
  if (newData?.user) {
    loadDailyImages()
  }
}, { immediate: true })

onMounted(() => {
  // 如果用户数据已经加载，立即加载照片
  if (meData.value?.user) {
    loadDailyImages()
  }
})

function goQuickRecord() {
  navigateTo('/daily')
}
</script>

<template>
  <div class="min-h-screen bg-#f7f6f3">
    <DogHeader />
    <div class="max-w-6xl mx-auto px-4 md:px-6 py-10 space-y-8">
      <section class="grid md:grid-cols-2 gap-8 items-center">
        <div class="space-y-6">
          <div>
            <h1 class="text-3xl md:text-4xl font-serif leading-tight">爱的小事，值得被温柔记录。</h1>
            <p class="mt-3 text-#6b7280">以"线条小狗"为灵感的情侣纪念与日常记录空间。以留白与软色调，收纳你们的每一帧心动。</p>
          </div>
          <!-- 纪念日倒计时提示 -->
          <AnniversaryCountdown v-if="meData?.user" />
          <div class="flex gap-3">
            <button class="btn-primary" @click="goQuickRecord">开始记录</button>
            <NuxtLink to="/daily" class="btn-secondary">查看日常</NuxtLink>
          </div>
        </div>
        <DogCarousel :images="images" />
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
