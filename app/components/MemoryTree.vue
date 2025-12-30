<template>
  <div ref="treeContainer" class="relative w-full h-full min-h-[600px] overflow-hidden rounded-2xl bg-gradient-to-b from-rose-50 via-pink-50 to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border border-rose-200/30 dark:border-slate-700/50 shadow-xl">
    <!-- Memory Tree SVG Background -->
    <svg class="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-0" :viewBox="`0 0 500 ${treeHeight}`" preserveAspectRatio="xMidYMax meet">
      <defs>
        <!-- Gradient for trunk -->
        <linearGradient id="trunkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#8B4513;stop-opacity:0.9" />
          <stop offset="50%" style="stop-color:#A0522D;stop-opacity:0.95" />
          <stop offset="100%" style="stop-color:#8B4513;stop-opacity:0.9" />
        </linearGradient>

        <!-- Gradient for leaves -->
        <linearGradient id="leafGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#90EE90;stop-opacity:0.95" />
          <stop offset="100%" style="stop-color:#228B22;stop-opacity:0.9" />
        </linearGradient>

        <!-- Glow effect -->
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        <!-- Shadow filter -->
        <filter id="shadow">
          <feDropShadow dx="2" dy="4" stdDeviation="3" flood-opacity="0.2"/>
        </filter>
      </defs>

      <!-- Ground -->
      <ellipse cx="250" :cy="treeHeight - 20" rx="180" ry="25" class="fill-amber-200/60 dark:fill-amber-900/40" />

      <!-- Tree Trunk with texture -->
      <path :d="`M 235,${treeHeight - 100} Q 233,${treeHeight * 0.75} 230,${treeHeight * 0.5} L 235,${treeHeight * 0.45} Q 237,${treeHeight * 0.5} 240,${treeHeight * 0.5} Q 242,${treeHeight * 0.75} 250,${treeHeight - 100} Z`"
            fill="url(#trunkGradient)" filter="url(#shadow)" />

      <!-- Main Tree Crown - Organic flowing shape -->
      <!-- Bottom large branches -->
      <ellipse cx="180" :cy="treeHeight * 0.6" rx="70" ry="50" class="fill-emerald-500/90" filter="url(#shadow)" />
      <ellipse cx="320" :cy="treeHeight * 0.6" rx="70" ry="50" class="fill-emerald-500/90" filter="url(#shadow)" />
      <ellipse cx="250" :cy="treeHeight * 0.55" rx="80" ry="55" class="fill-emerald-400/95" filter="url(#shadow)" />

      <!-- Middle branches -->
      <ellipse cx="200" :cy="treeHeight * 0.45" rx="60" ry="45" class="fill-green-500/90" filter="url(#shadow)" />
      <ellipse cx="300" :cy="treeHeight * 0.45" rx="60" ry="45" class="fill-green-500/90" filter="url(#shadow)" />
      <ellipse cx="250" :cy="treeHeight * 0.42" rx="65" ry="48" class="fill-green-400/95" filter="url(#shadow)" />

      <!-- Top branches -->
      <ellipse cx="220" :cy="treeHeight * 0.33" rx="50" ry="38" class="fill-lime-500/90" filter="url(#shadow)" />
      <ellipse cx="280" :cy="treeHeight * 0.33" rx="50" ry="38" class="fill-lime-500/90" filter="url(#shadow)" />
      <ellipse cx="250" :cy="treeHeight * 0.3" rx="55" ry="40" class="fill-lime-400/95" filter="url(#shadow)" />

      <!-- Topmost -->
      <ellipse cx="250" :cy="treeHeight * 0.22" rx="35" ry="28" class="fill-teal-300/95" filter="url(#shadow)" />

      <!-- Floating hearts decoration -->
      <g class="animate-pulse" style="animation-duration: 3s;">
        <path :d="`M 170,${treeHeight * 0.52} C 170,${treeHeight * 0.51} 173,${treeHeight * 0.49} 176,${treeHeight * 0.52} C 179,${treeHeight * 0.55} 182,${treeHeight * 0.52} 182,${treeHeight * 0.52} C 182,${treeHeight * 0.52} 179,${treeHeight * 0.56} 176,${treeHeight * 0.58} C 173,${treeHeight * 0.56} 170,${treeHeight * 0.52} 170,${treeHeight * 0.52} Z`"
              class="fill-pink-400/80" />
      </g>
      <g class="animate-pulse" style="animation-duration: 2.5s;">
        <path :d="`M 320,${treeHeight * 0.38} C 320,${treeHeight * 0.37} 323,${treeHeight * 0.35} 326,${treeHeight * 0.38} C 329,${treeHeight * 0.41} 332,${treeHeight * 0.38} 332,${treeHeight * 0.38} C 332,${treeHeight * 0.38} 329,${treeHeight * 0.42} 326,${treeHeight * 0.44} C 323,${treeHeight * 0.42} 320,${treeHeight * 0.38} 320,${treeHeight * 0.38} Z`"
              class="fill-rose-400/80" />
      </g>
      <g class="animate-pulse" style="animation-duration: 3.5s;">
        <path :d="`M 245,${treeHeight * 0.26} C 245,${treeHeight * 0.255} 247,${treeHeight * 0.24} 249,${treeHeight * 0.26} C 251,${treeHeight * 0.28} 253,${treeHeight * 0.26} 253,${treeHeight * 0.26} C 253,${treeHeight * 0.26} 251,${treeHeight * 0.29} 249,${treeHeight * 0.3} C 247,${treeHeight * 0.29} 245,${treeHeight * 0.26} 245,${treeHeight * 0.26} Z`"
              class="fill-red-400/90" filter="url(#glow)" />
      </g>

      <!-- Sparkles -->
      <g class="animate-pulse" style="animation-duration: 2s;">
        <circle cx="200" :cy="treeHeight * 0.5" r="3" class="fill-yellow-300/90" />
      </g>
      <g class="animate-pulse" style="animation-duration: 2.3s;">
        <circle cx="290" :cy="treeHeight * 0.35" r="3" class="fill-yellow-300/90" />
      </g>
      <g class="animate-pulse" style="animation-duration: 1.8s;">
        <circle cx="250" :cy="treeHeight * 0.48" r="2.5" class="fill-amber-300/90" />
      </g>
    </svg>

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
          <!-- Heart Decoration -->
          <template v-if="item.type === 'heart'">
            <svg viewBox="0 0 24 24" class="w-full h-full drop-shadow-md">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    class="fill-pink-400/80" />
            </svg>
          </template>

          <!-- Photo Content -->
          <template v-else-if="item.type === 'photo'">
            <div class="relative p-2 bg-white dark:bg-slate-800 shadow-xl rounded-xl transform transition-transform hover:scale-105">
              <div class="relative aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-rose-100 to-pink-100 dark:from-slate-700 dark:to-slate-600">
                <img
                  :src="item.src"
                  class="w-full h-full object-cover"
                  alt="Memory"
                  draggable="false"
                />
              </div>
              <!-- Photo corner decorations -->
              <div class="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-rose-400 rounded-tr-sm"></div>
              <div class="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-rose-400 rounded-bl-sm"></div>
            </div>
          </template>
        </div>
      </TransitionGroup>

      <!-- Ground Pile Layer -->
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
          <!-- Fallen Photo -->
          <template v-if="item.type === 'photo'">
            <div class="relative p-1.5 bg-white dark:bg-slate-800 shadow-lg rounded-lg">
              <div class="relative aspect-square overflow-hidden rounded-md bg-gradient-to-br from-rose-100 to-pink-100 dark:from-slate-700 dark:to-slate-600">
                <img :src="item.src" class="w-full h-full object-cover" draggable="false" />
              </div>
            </div>
          </template>

          <!-- Fallen Heart -->
          <template v-else-if="item.type === 'heart'">
            <svg viewBox="0 0 24 24" class="w-full h-full drop-shadow-sm">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    class="fill-pink-400/70" />
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
</style>
