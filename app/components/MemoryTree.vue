<template>
  <div
    ref="treeContainer"
    class="relative w-full h-full min-h-[420px] md:min-h-[500px] overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
  >
    <!-- Sticker diary wall -->
    <div class="absolute inset-0 z-0 pointer-events-none diary-wall" />

    <div class="absolute inset-x-0 top-4 z-20 flex justify-center pointer-events-none">
      <div class="px-4 py-1.5 rounded-full bg-background/85 border border-border backdrop-blur-sm shadow-sm">
        <span class="font-display text-sm text-foreground/80">回忆便签墙</span>
      </div>
    </div>

    <!-- Corner stickers -->
    <LineDogSticker slug="love" size="sm" wobble eager class="absolute top-5 left-4 z-20 -rotate-6" />
    <LineDogSticker slug="flower" size="sm" wobble class="absolute top-8 right-5 z-20 rotate-8" />
    <LineDogSticker slug="yay" size="xs" class="absolute bottom-24 left-6 z-20 rotate-[-10deg] opacity-90" />
    <LineDogSticker slug="heart" size="xs" class="absolute bottom-28 right-8 z-20 rotate-12 opacity-90" />

    <!-- Falling Photos Layer -->
    <div class="absolute inset-0 z-10 overflow-hidden pointer-events-none">
      <TransitionGroup
        tag="div"
        enter-active-class="falling-enter-active"
        leave-active-class="falling-leave-active"
      >
        <div
          v-for="item in activeItems"
          :key="item.id"
          class="absolute transform-gpu"
          :class="item.type === 'photo' ? 'w-20 md:w-28 lg:w-32' : 'w-8 h-8 md:w-10 md:h-10'"
          :style="{
            top: '0%',
            left: `${item.leftPosition}%`,
            '--sway': `${item.swayAmplitude}px`,
            transform: `translateX(-50%) rotate(${item.rotation}deg) scale(${item.scale})`,
            animationDuration: `${item.animationDuration}s`,
            animationDelay: '0s'
          }"
        >
          <template v-if="item.type === 'heart'">
            <svg viewBox="0 0 24 24" class="w-full h-full drop-shadow-md">
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill="var(--heart)"
                opacity="0.85"
              />
            </svg>
          </template>

          <template v-else-if="item.type === 'photo'">
            <div class="relative p-1.5 bg-white dark:bg-card shadow-xl rounded-md border border-border/80 rotate-0">
              <div class="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-3 bg-black/80 rounded-[2px]" />
              <div class="relative aspect-square overflow-hidden rounded-sm bg-muted">
                <img
                  :src="item.src"
                  class="w-full h-full object-cover"
                  alt="Memory"
                  draggable="false"
                >
              </div>
            </div>
          </template>
        </div>
      </TransitionGroup>

      <TransitionGroup name="fade">
        <div
          v-for="item in fallenItems"
          :key="'fallen-' + item.id"
          class="absolute -translate-x-1/2 origin-center transition-all duration-700 opacity-90 hover:opacity-100 hover:scale-110 hover:z-30 cursor-pointer pointer-events-auto"
          :class="item.type === 'photo' ? 'w-16 md:w-20 z-10' : 'w-6 h-6 md:w-7 md:h-7 z-0'"
          :style="{
            bottom: item.type === 'photo' ? '30px' : '35px',
            left: `${item.leftPosition}%`,
            transform: `rotate(${item.rotation}deg) scale(${item.scale})`
          }"
          @click.stop="item.type === 'photo' && item.src && handleImageClick(item.src)"
        >
          <template v-if="item.type === 'photo'">
            <div class="relative p-1 bg-white dark:bg-card shadow-lg rounded-md border border-border/70">
              <div class="relative aspect-square overflow-hidden rounded-sm bg-muted">
                <img :src="item.src" class="w-full h-full object-cover" draggable="false">
              </div>
            </div>
          </template>

          <template v-else-if="item.type === 'heart'">
            <svg viewBox="0 0 24 24" class="w-full h-full drop-shadow-sm">
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill="var(--heart)"
                opacity="0.75"
              />
            </svg>
          </template>
        </div>
      </TransitionGroup>
    </div>

    <!-- Image Preview Modal -->
    <Teleport to="body">
      <div
        v-if="previewImage !== null"
        class="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-sm"
        @click.self="closePreview"
        @keydown.esc="closePreview"
        tabindex="-1"
      >
        <!-- Close button -->
        <button
          class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-50 transition-all duration-200 hover:scale-110 active:scale-95 border-none cursor-pointer"
          @click="closePreview"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Previous button -->
        <button
          v-if="previewIndex > 0"
          class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-50 cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 border-none"
          @click.stop.prevent="prevImage"
          type="button"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- Next button -->
        <button
          v-if="previewIndex < images.length - 1"
          class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-50 cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 border-none"
          @click.stop.prevent="nextImage"
          type="button"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- Image content -->
        <div class="max-w-[90vw] max-h-[90vh] flex items-center justify-center w-full h-full p-4" @click.stop>
          <img
            v-if="previewImage !== null"
            :src="previewImage"
            class="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-sm select-none"
            alt="预览"
          />
        </div>

        <!-- Page indicator -->
        <div
          v-if="images.length > 1"
          class="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-sm font-medium border border-white/5"
        >
          {{ previewIndex + 1 }} / {{ images.length }}
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  images: string[]
}>()

interface FallingItem {
  id: number
  type: 'photo' | 'heart'
  src?: string
  rotation: number
  scale: number
  leftPosition: number
  animationDuration: number
  swayAmplitude: number
}

const activeItems = ref<FallingItem[]>([])
const fallenItems = ref<FallingItem[]>([])
const treeContainer = ref<HTMLElement | null>(null)
const treeHeight = ref(700)
let nextId = 0
let timer: any = null
let resizeObserver: ResizeObserver | null = null

// Preview state
const previewIndex = ref<number>(0)
const previewImage = ref<string | null>(null)

function spawnItems() {
  // Always spawn hearts as decorative elements
  if (Math.random() > 0.4) {
    createItem('heart')
  }

  // Spawn photos occasionally
  if (props.images && props.images.length > 0 && Math.random() > 0.6) {
    createItem('photo')
  }
}

function createItem(type: 'photo' | 'heart') {
  const isPhoto = type === 'photo'

  const item: FallingItem = {
    id: nextId++,
    type,
    src: isPhoto ? props.images[Math.floor(Math.random() * props.images.length)] : undefined,
    rotation: (Math.random() - 0.5) * (isPhoto ? 25 : 360),
    scale: isPhoto ? (0.85 + Math.random() * 0.25) : (0.6 + Math.random() * 0.5),
    leftPosition: 15 + Math.random() * 70,
    animationDuration: isPhoto ? (5 + Math.random() * 3) : (7 + Math.random() * 4),
    swayAmplitude: isPhoto ? (15 + Math.random() * 25) : (40 + Math.random() * 50)
  }

  activeItems.value.push(item)

  // Move to ground pile after animation
  setTimeout(() => {
    // Remove from falling
    activeItems.value = activeItems.value.filter(i => i.id !== item.id)

    // Add to pile with new random rotation for landing
    const fallenItem = {
      ...item,
      rotation: (Math.random() - 0.5) * 70,
      scale: item.scale * 0.88
    }

    fallenItems.value.push(fallenItem)

    // Limit pile size
    if (fallenItems.value.length > 25) {
      fallenItems.value.shift()
    }
  }, item.animationDuration * 1000 - 100)
}

// Open preview with specific image
function handleImageClick(src: string) {
  const index = props.images.indexOf(src)
  if (index !== -1) {
    previewIndex.value = index
    previewImage.value = src
    document.body.style.overflow = 'hidden'
  }
}

// Close preview
function closePreview() {
  previewImage.value = null
  document.body.style.overflow = ''
}

// Previous image
function prevImage() {
  if (previewIndex.value > 0) {
    previewIndex.value--
    previewImage.value = props.images[previewIndex.value] || null
  }
}

// Next image
function nextImage() {
  if (previewIndex.value < props.images.length - 1) {
    previewIndex.value++
    previewImage.value = props.images[previewIndex.value] || null
  }
}

// Keyboard shortcuts
function handleKeydown(event: KeyboardEvent) {
  if (previewImage.value === null) return

  if (event.key === 'Escape') {
    closePreview()
  } else if (event.key === 'ArrowLeft') {
    prevImage()
  } else if (event.key === 'ArrowRight') {
    nextImage()
  }
}

function updateTreeHeight() {
  if (treeContainer.value) {
    const height = treeContainer.value.clientHeight
    if (height > 0) {
      treeHeight.value = height
    }
  }
}

onMounted(() => {
  // Set initial height
  updateTreeHeight()

  // Use ResizeObserver to watch for size changes
  if (treeContainer.value) {
    resizeObserver = new ResizeObserver(updateTreeHeight)
    resizeObserver.observe(treeContainer.value)
  }

  // Listen for keyboard events
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeydown)
  }

  spawnItems()
  timer = setInterval(spawnItems, 1800)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  if (resizeObserver) resizeObserver.disconnect()
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeydown)
  }
  activeItems.value = []
  fallenItems.value = []
  document.body.style.overflow = ''
})
</script>

<style scoped>
@keyframes fall-in {
  0% {
    opacity: 0;
    transform: translateY(-60px) translateX(-50%) rotate(-15deg) scale(0.5);
  }
  10% {
    opacity: 0.8;
    transform: translateY(50px) translateX(calc(-50% + var(--sway) * 0.3)) rotate(8deg) scale(0.85);
  }
  30% {
    transform: translateY(180px) translateX(calc(-50% + var(--sway) * -0.4)) rotate(-6deg) scale(0.95);
  }
  50% {
    transform: translateY(300px) translateX(calc(-50% + var(--sway) * 0.2)) rotate(4deg) scale(1.0);
  }
  70% {
    transform: translateY(400px) translateX(calc(-50% + var(--sway) * -0.15)) rotate(-3deg) scale(1.0);
  }
  85% {
    transform: translateY(480px) translateX(calc(-50% + var(--sway) * 0.1)) rotate(2deg) scale(1.0);
  }
  100% {
    opacity: 1;
    transform: translateY(520px) translateX(-50%) rotate(0deg) scale(1.0);
  }
}

.falling-enter-active {
  animation: fall-in linear forwards;
}

.falling-leave-active {
  display: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) scale(0.8);
}

.diary-wall {
  background:
    radial-gradient(circle at 20% 20%, color-mix(in oklch, var(--heart) 12%, transparent), transparent 35%),
    radial-gradient(circle at 80% 15%, color-mix(in oklch, var(--foreground) 4%, transparent), transparent 30%),
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 27px,
      color-mix(in oklch, var(--foreground) 4%, transparent) 27px,
      color-mix(in oklch, var(--foreground) 4%, transparent) 28px
    ),
    linear-gradient(180deg, color-mix(in oklch, var(--background) 92%, white), var(--muted));
}
</style>
