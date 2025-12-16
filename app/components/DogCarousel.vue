<template>
  <div class="relative w-full">
    <Carousel
      class="w-full relative"
      @init-api="setApi"
      :opts="{
        loop: true,
      }"
    >
      <CarouselContent>
        <CarouselItem v-for="(img, i) in images" :key="i">
          <div class="p-1">
             <div class="flex items-center justify-center">
                <img 
                  :src="img" 
                  :loading="i === 0 ? 'eager' : 'lazy'" 
                  decoding="async" 
                  class="w-full h-56 md:h-80 object-contain rounded-xl bg-muted/20" 
                  :alt="`slide-${i}`" 
                />
             </div>
          </div>
        </CarouselItem>
      </CarouselContent>
      <!-- Indicators -->
      <div class="absolute bottom-2 left-0 right-0 flex justify-center gap-2 py-2">
        <button 
          v-for="(_, i) in images" 
          :key="i" 
          class="w-2 h-2 rounded-full transition-colors duration-200" 
          :class="i === current ? 'bg-primary' : 'bg-muted-foreground/30'" 
          @click="api?.scrollTo(i)" 
        />
      </div>
    </Carousel>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import type { CarouselApi } from '@/components/ui/carousel'

const props = defineProps<{ images: string[] }>()
const api = ref<CarouselApi>()
const current = ref(0)
const count = ref(0)
let autoplayTimer: any = null

function setApi(val: CarouselApi) {
  api.value = val
}

watch(api, (api) => {
  if (!api) return

  count.value = api.scrollSnapList().length
  current.value = api.selectedScrollSnap()

  api.on('select', () => {
    current.value = api.selectedScrollSnap()
  })
})

function startAutoplay() {
  stopAutoplay()
  autoplayTimer = setInterval(() => {
    if (api.value) {
      api.value.scrollNext()
    }
  }, 4000)
}

function stopAutoplay() {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

onMounted(() => {
  startAutoplay()
})

onUnmounted(() => {
  stopAutoplay()
})
</script>


