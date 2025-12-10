<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { apiFetch } from '@/services/api'
import AnniversaryCountdown from '@/components/ui/AnniversaryCountdown.vue'
import Calendar from '@/components/ui/Calendar.vue'

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
      // 获取更多照片以供随机展示
      const res = await apiFetch<{ items: any[] }>('/api/daily?take=100')
      const media = (res.items || []).flatMap(i => Array.isArray(i.mediaUrls) ? i.mediaUrls : [])
      
      if (media.length > 0) {
        // 使用所有获取到的照片，如果数量较少则补充默认照片
        if (media.length < 5) {
          images.value = [...media, ...presetImages]
        } else {
          images.value = media
        }
      } else {
        // 如果没有日常照片，使用默认照片
        images.value = [...presetImages]
      }
    } else {
      // 未登录时使用默认照片
      images.value = [...presetImages]
    }
  } catch (e) {
    console.error('加载首页照片失败', e)
    // 失败时保持默认值或当前值
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
    
    <!-- Main Content Container - ensuring centering -->
    <div class="min-h-screen flex flex-col items-center pt-12 pb-8 px-4 relative">
      
      <!-- Decorative background blooms -->
    <div class="fixed top-20 left-10 w-64 h-64 bg-rose-200/20 rounded-full blur-3xl pointer-events-none z-0"></div>
    <div class="fixed bottom-20 right-10 w-80 h-80 bg-orange-100/20 rounded-full blur-3xl pointer-events-none z-0"></div>

    <div class="w-full max-w-4xl z-10 flex flex-col items-center space-y-8">
        
      <!-- Slogan -->
      <div class="bg-white/40 backdrop-blur-sm px-6 py-2 rounded-full border border-white/50 shadow-sm animate-fade-in shrink-0">
        <h1 class="text-xl md:text-2xl font-serif text-text-secondary tracking-widest text-center opacity-90">
          爱的小事，值得被温柔记录
        </h1>
      </div>

      <!-- Memory Tree Hero - blended (no box) -->
      <div class="w-full animate-fade-in shrink-0" style="animation-delay: 0.2s">
        <MemoryTree :images="images" class="h-[400px] md:h-[500px] !rounded-xl" />
      </div>

      <!-- Action Strip -->
      <div class="flex flex-col items-center space-y-8 w-full animate-slide-up shrink-0" style="animation-delay: 0.4s">
        
        <!-- Buttons (Primary Action) -->
        <div class="flex gap-6">
            <button class="px-8 py-2.5 rounded-full bg-stone-800 text-stone-50 font-medium hover:bg-stone-700 hover:scale-105 transition-all shadow-lg active:scale-95 text-sm md:text-base" @click="goQuickRecord">
              开始记录
            </button>
            <NuxtLink to="/daily" class="px-8 py-2.5 rounded-full bg-white text-stone-600 font-medium border border-stone-200 hover:bg-stone-50 hover:border-stone-300 transition-all shadow-sm text-sm md:text-base">
              查看日常
            </NuxtLink>
        </div>

        <!-- Countdown (Secondary Info) -->
        <div v-if="authStore.user" class="w-full max-w-md opacity-90 hover:opacity-100 transition-opacity">
            <AnniversaryCountdown class="!bg-transparent !shadow-none !backdrop-blur-none" />
        </div>

      </div>

      <!-- Calendar Section -->
        <section v-if="authStore.user" class="w-full pt-4 animate-fade-in opacity-90 shrink-0" style="animation-delay: 0.6s">
        <Calendar />
      </section>

    </div>
  </div>
  </div>
</template>

<script lang="ts">
import DogHeader from '@/components/ui/DogHeader.vue'
// import DogCarousel from '@/components/ui/DogCarousel.vue' // Deprecated
import MemoryTree from '@/components/ui/MemoryTree.vue'
export default {}
</script>
