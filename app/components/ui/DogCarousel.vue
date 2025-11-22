<template>
  <div class="relative w-full overflow-hidden rounded-xl shadow-sm">
    <div class="flex transition-transform duration-500" :style="{ transform: `translateX(-${index * 100}%)` }">
      <div v-for="(img, i) in images" :key="i" class="min-w-full">
        <img :src="img" :loading="i === 0 ? 'eager' : 'lazy'" decoding="async" class="w-full h-56 md:h-80 object-contain bg-#f7f6f3" :alt="`slide-${i}`" />
      </div>
    </div>
    <div class="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
      <button v-for="(img, i) in images" :key="i" class="w-2 h-2 rounded-full" :class="i===index ? 'bg-#333' : 'bg-#c9c8c4'" @click="index=i" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{ images: string[] }>()
const index = ref(0)

onMounted(() => {
  // 预加载第二张图片
  if (props.images && props.images.length > 1) {
    const nextImg = props.images[1]
    if (nextImg) {
      const img = new Image()
      img.src = nextImg
    }
  }

  setInterval(() => {
    index.value = (index.value + 1) % (props.images?.length || 1)
  }, 4000)
})
</script>


