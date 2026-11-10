<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { apiFetch } from '@/services/api'
import AnniversaryCountdown from '@/components/AnniversaryCountdown.vue'
import Calendar from '@/components/ui/CustomCalendar.vue'
import DogHeader from '@/components/DogHeader.vue'
import MemoryTree from '@/components/MemoryTree.vue'
import type { LineDogSlug } from '@/constants/lineDogStickers'

definePageMeta({
  layout: 'home',
})

const presetImages = [
  '/assets/images/couple/couple-1.png',
  '/assets/images/couple/couple-2.png',
  '/assets/images/couple/couple-3.png',
  '/assets/images/couple/couple-4.png',
]

const images = ref<string[]>([...presetImages])
const authStore = useAuthStore()

const floatingStickers: Array<{ slug: LineDogSlug, class: string }> = [
  { slug: 'hi', class: 'top-[12%] left-[4%] md:left-[8%] -rotate-8' },
  { slug: 'dance', class: 'top-[18%] right-[3%] md:right-[7%] rotate-10' },
  { slug: 'pet', class: 'top-[48%] left-[2%] md:left-[5%] rotate-6' },
  { slug: 'wave', class: 'top-[52%] right-[2%] md:right-[6%] -rotate-12' },
]

async function loadDailyImages() {
  try {
    if (authStore.user) {
      const res = await apiFetch<{ items: any[] }>('/api/daily?take=100')
      const media = (res.items || []).flatMap(i => Array.isArray(i.mediaUrls) ? i.mediaUrls : [])

      if (media.length > 0) {
        images.value = media.length < 5 ? [...media, ...presetImages] : media
      }
      else {
        images.value = [...presetImages]
      }
    }
    else {
      images.value = [...presetImages]
    }
  }
  catch (e) {
    console.error('加载首页照片失败', e)
  }
}

watch(() => authStore.user, (newUser) => {
  if (newUser) {
    loadDailyImages()
  }
  else {
    images.value = [...presetImages]
  }
}, { immediate: true })

onMounted(() => {
  if (authStore.user) {
    loadDailyImages()
  }
})

function goQuickRecord() {
  navigateTo('/daily')
}
</script>

<template>
  <div class="min-h-screen">
    <DogHeader />

    <section class="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 pt-6 pb-10 overflow-hidden">
      <LineDogSticker
        v-for="item in floatingStickers"
        :key="item.slug"
        :slug="item.slug"
        size="sm"
        wobble
        class="absolute z-0 opacity-80 hidden sm:inline-flex pointer-events-none"
        :class="item.class"
      />

      <div class="relative z-10 w-full max-w-4xl flex flex-col items-center text-center gap-6 md:gap-8">
        <div class="flex flex-col items-center gap-4 animate-fade-in">
          <LineDogSticker scene="home" size="lg" wobble eager />
          <h1 class="font-display text-4xl md:text-6xl leading-none tracking-wide text-foreground">
            My Doggy Love
          </h1>
          <p class="text-base md:text-lg text-muted-foreground max-w-md">
            爱的小事，值得被温柔记录
          </p>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-3 animate-slide-up" style="animation-delay: 0.15s">
          <button
            class="inline-flex items-center gap-2 px-7 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold hover:scale-[1.03] active:scale-95 transition-all shadow-lg"
            @click="goQuickRecord"
          >
            <LineDogSticker slug="yay" size="xs" class="!w-7 !h-7" />
            开始记录
          </button>
          <NuxtLink
            to="/daily"
            class="inline-flex items-center gap-2 px-7 py-2.5 rounded-full bg-background text-foreground font-semibold border border-border hover:bg-accent transition-all shadow-sm"
          >
            查看日常
          </NuxtLink>
        </div>

        <div class="w-full animate-fade-in" style="animation-delay: 0.28s">
          <MemoryTree :images="images" class="h-[380px] md:h-[480px]" />
        </div>

        <div v-if="authStore.user" class="w-full max-w-md opacity-95">
          <AnniversaryCountdown class="!bg-card/80 !border !border-border !shadow-sm !rounded-2xl !px-4 !py-3" />
        </div>
      </div>
    </section>

    <section v-if="authStore.user" class="w-full max-w-4xl mx-auto px-4 pb-12 animate-fade-in" style="animation-delay: 0.4s">
      <Calendar />
    </section>
  </div>
</template>
