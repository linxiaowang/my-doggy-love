<template>
  <div ref="treeContainer" class="relative w-full h-full min-h-[500px] overflow-hidden rounded-xl bg-gradient-to-b from-sky-900/20 to-sky-700/30 border border-surface-200 shadow-inner group cursor-pointer" @click="togglePause">
    <!-- Christmas Tree SVG Background -->
    <svg class="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-0 overflow-visible" :viewBox="`0 0 500 ${treeHeight}`" preserveAspectRatio="xMidYMax meet">
      <!-- Ground/Snow -->
      <rect :x="0" :y="treeHeight - 50" width="500" height="50" class="fill-white/80" />
      
      <!-- Tree Trunk -->
      <rect x="235" :y="treeHeight - 100" width="30" height="50" class="fill-amber-800/90" />
      
      <!-- Christmas Tree Layers -->
      <!-- Bottom Layer -->
      <polygon :points="`250,${treeHeight - 100} 120,${treeHeight} 380,${treeHeight}`" class="fill-green-700" />
      <!-- Middle-Low Layer -->
      <polygon :points="`250,${treeHeight * 0.85} 150,${treeHeight - 100} 350,${treeHeight - 100}`" class="fill-green-600" />
      <!-- Middle Layer -->
      <polygon :points="`250,${treeHeight * 0.65} 180,${treeHeight * 0.85} 320,${treeHeight * 0.85}`" class="fill-green-600" />
      <!-- Middle-High Layer -->
      <polygon :points="`250,${treeHeight * 0.5} 200,${treeHeight * 0.65} 300,${treeHeight * 0.65}`" class="fill-green-500" />
      <!-- Top Layer -->
      <polygon :points="`250,${treeHeight * 0.35} 220,${treeHeight * 0.5} 280,${treeHeight * 0.5}`" class="fill-green-400" />
      <!-- Tree Top -->
      <polygon :points="`250,${treeHeight * 0.25} 230,${treeHeight * 0.35} 270,${treeHeight * 0.35}`" class="fill-green-300" />
      
      <!-- Christmas Tree Ornaments -->
      <circle :cx="180" :cy="treeHeight * 0.78" r="10" class="fill-red-500 animate-pulse" style="animation-duration: 2s;" />
      <circle :cx="320" :cy="treeHeight * 0.73" r="10" class="fill-blue-400 animate-pulse" style="animation-duration: 1.8s;" />
      <circle :cx="250" :cy="treeHeight * 0.65" r="10" class="fill-yellow-400 animate-pulse" style="animation-duration: 2.2s;" />
      <circle :cx="200" :cy="treeHeight * 0.58" r="10" class="fill-purple-500 animate-pulse" style="animation-duration: 1.5s;" />
      <circle :cx="300" :cy="treeHeight * 0.58" r="10" class="fill-pink-500 animate-pulse" style="animation-duration: 2.5s;" />
      <circle :cx="220" :cy="treeHeight * 0.48" r="10" class="fill-green-400 animate-pulse" style="animation-duration: 1.7s;" />
      <circle :cx="280" :cy="treeHeight * 0.48" r="10" class="fill-orange-500 animate-pulse" style="animation-duration: 2.3s;" />
      <circle :cx="250" :cy="treeHeight * 0.4" r="10" class="fill-cyan-400 animate-pulse" style="animation-duration: 1.9s;" />
      <circle :cx="230" :cy="treeHeight * 0.32" r="12" class="fill-gold-400 animate-pulse" style="animation-duration: 1.6s;" />
      <circle :cx="270" :cy="treeHeight * 0.32" r="12" class="fill-emerald-400 animate-pulse" style="animation-duration: 2.1s;" />
      
      <!-- Christmas Tree Star -->
      <polygon :points="`250,${treeHeight * 0.23} 242,${treeHeight * 0.25} 230,${treeHeight * 0.25} 238,${treeHeight * 0.28} 235,${treeHeight * 0.3} 250,${treeHeight * 0.29} 265,${treeHeight * 0.3} 262,${treeHeight * 0.28} 270,${treeHeight * 0.25} 258,${treeHeight * 0.25}`" 
               class="fill-yellow-300 animate-pulse" style="animation-duration: 1.4s;" />
               
      <!-- Christmas Tree Lights -->
      <circle :cx="250" :cy="treeHeight * 0.8" r="4" class="fill-yellow-300 animate-ping" style="animation-duration: 1.5s;" />
      <circle :cx="200" :cy="treeHeight * 0.75" r="4" class="fill-red-400 animate-ping" style="animation-duration: 1.8s;" />
      <circle :cx="300" :cy="treeHeight * 0.75" r="4" class="fill-blue-400 animate-ping" style="animation-duration: 1.6s;" />
      <circle :cx="220" :cy="treeHeight * 0.65" r="4" class="fill-green-400 animate-ping" style="animation-duration: 2.0s;" />
      <circle :cx="280" :cy="treeHeight * 0.65" r="4" class="fill-purple-400 animate-ping" style="animation-duration: 1.7s;" />
      <circle :cx="250" :cy="treeHeight * 0.55" r="4" class="fill-yellow-400 animate-ping" style="animation-duration: 1.9s;" />
      <circle :cx="230" :cy="treeHeight * 0.45" r="4" class="fill-red-400 animate-ping" style="animation-duration: 1.5s;" />
      <circle :cx="270" :cy="treeHeight * 0.45" r="4" class="fill-blue-400 animate-ping" style="animation-duration: 2.2s;" />
    </svg>

    <!-- Falling Snowflakes Layer -->
    <div class="absolute inset-0 z-10 overflow-hidden pointer-events-none">
      <TransitionGroup
        tag="div"
        enter-active-class="falling-enter-active"
        leave-active-class="falling-leave-active"
      >
        <div
          v-for="item in activeItems"
          :key="item.id"
          class="absolute -translate-x-1/2 origin-top transform-gpu"
          :class="item.type === 'photo' ? 'w-20 md:w-32 lg:w-40 p-1.5 md:p-2 bg-white shadow-lg' : 'w-6 h-6 md:w-8 md:h-8'"
          :style="{
            top: '0%',
            left: `${item.leftPosition}%`,
            '--sway': `${item.swayAmplitude}px`,
            transform: `rotate(${item.rotation}deg) scale(${item.scale})`,
            animationDuration: `${item.animationDuration}s`,
            animationDelay: '0s'
          }"
        >
          <!-- Snowflake Content -->
          <template v-if="item.type === 'snowflake'">
            <svg viewBox="0 0 24 24" class="w-full h-full text-sky-200 drop-shadow-sm fill-current">
              <path d="M12,2 L13.5,5.5 L17,7 L13.5,8.5 L12,12 L10.5,8.5 L7,7 L10.5,5.5 Z
                       M12,22 L10.5,18.5 L7,17 L10.5,15.5 L12,12 L13.5,15.5 L17,17 L13.5,18.5 Z
                       M2,12 L5.5,10.5 L7,7 L8.5,10.5 L12,12 L8.5,13.5 L7,17 L5.5,13.5 Z
                       M22,12 L18.5,13.5 L17,17 L15.5,13.5 L12,12 L15.5,10.5 L17,7 L18.5,10.5 Z
                       M6,6 L9,9 L6,12 L3,9 Z
                       M18,6 L21,9 L18,12 L15,9 Z
                       M6,18 L9,15 L12,18 L9,21 Z
                       M18,18 L15,15 L18,12 L21,15 Z" />
            </svg>
          </template>

          <!-- Photo Content (kept for compatibility) -->
          <template v-else-if="item.type === 'photo'">
            <div class="relative aspect-square overflow-hidden bg-gradient-to-br from-red-100 to-green-100 border border-red-200/50 rounded-sm">
               <img 
                 :src="item.src" 
                 class="w-full h-full object-cover" 
                 alt="Memory"
                 draggable="false"
               />
            </div>
            <!-- Christmas Ornament decoration -->
            <div class="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-2 bg-gradient-to-r from-red-400 to-red-500 rounded-full shadow-sm"></div>
          </template>
        </div>
      </TransitionGroup>

      <!-- Ground Pile Layer -->
      <TransitionGroup name="fade">
        <div v-for="item in fallenItems" :key="'fallen-' + item.id"
             class="absolute -translate-x-1/2 origin-center transition-all duration-700 opacity-90 hover:opacity-100 hover:scale-110 hover:z-30 cursor-pointer"
             :class="item.type === 'photo' ? 'w-16 md:w-24 p-1 bg-gradient-to-br from-red-50 to-green-50 shadow-sm z-10 border border-red-200/30 rounded-sm' : 'w-5 h-5 md:w-6 md:h-6 z-0'"
             :style="{
               bottom: item.type === 'photo' ? '20px' : '25px',
               left: `${item.leftPosition}%`,
               transform: `rotate(${item.rotation}deg) scale(${item.scale})`
             }"
        >
            <!-- Static Photo -->
            <template v-if="item.type === 'photo'">
              <div class="relative aspect-square overflow-hidden bg-gradient-to-br from-red-100 to-green-100 border border-red-200/50 rounded-sm">
                 <img :src="item.src" class="w-full h-full object-cover" draggable="false" />
              </div>
            </template>
            <!-- Static Snowflake -->
            <template v-else-if="item.type === 'snowflake'">
               <svg viewBox="0 0 24 24" class="w-full h-full text-sky-200 drop-shadow-sm fill-current">
                 <path d="M12,2 L13.5,5.5 L17,7 L13.5,8.5 L12,12 L10.5,8.5 L7,7 L10.5,5.5 Z
                          M12,22 L10.5,18.5 L7,17 L10.5,15.5 L12,12 L13.5,15.5 L17,17 L13.5,18.5 Z
                          M2,12 L5.5,10.5 L7,7 L8.5,10.5 L12,12 L8.5,13.5 L7,17 L5.5,13.5 Z
                          M22,12 L18.5,13.5 L17,17 L15.5,13.5 L12,12 L15.5,10.5 L17,7 L18.5,10.5 Z
                          M6,6 L9,9 L6,12 L3,9 Z
                          M18,6 L21,9 L18,12 L15,9 Z
                          M6,18 L9,15 L12,18 L9,21 Z
                          M18,18 L15,15 L18,12 L21,15 Z" />
               </svg>
            </template>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  images: string[]
}>()

interface FallingItem {
  id: number
  type: 'photo' | 'snowflake'
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

function spawnItems() {
  const spawnSnowflake = Math.random() > 0.3
  if (spawnSnowflake) createItem('snowflake')
  
  if (props.images && props.images.length > 0 && Math.random() > 0.5) {
     createItem('photo')
  }
}

function createItem(type: 'photo' | 'snowflake') {
  const isPhoto = type === 'photo'
  
  const item: FallingItem = {
    id: nextId++,
    type,
    src: isPhoto ? props.images[Math.floor(Math.random() * props.images.length)] : undefined,
    rotation: (Math.random() - 0.5) * (isPhoto ? 30 : 180),
    scale: isPhoto ? (0.8 + Math.random() * 0.3) : (0.5 + Math.random() * 0.5),
    leftPosition: 10 + Math.random() * 80,
    animationDuration: isPhoto ? (4 + Math.random() * 2) : (6 + Math.random() * 4), // Photos fall faster
    swayAmplitude: isPhoto ? (10 + Math.random() * 20) : (30 + Math.random() * 40) // Snowflakes sway more
  }
  
  activeItems.value.push(item)
  
  // Move to ground pile after animation
  setTimeout(() => {
    // Remove from falling
    activeItems.value = activeItems.value.filter(i => i.id !== item.id)
    
    // Add to pile (with new random rotation for landing)
    const fallenItem = {
        ...item,
        rotation: (Math.random() - 0.5) * 60,
        scale: item.scale * 0.9 // Flatten slightly
    }
    
    fallenItems.value.push(fallenItem)
    
    // Limit pile size
    if (fallenItems.value.length > 20) {
        fallenItems.value.shift()
    }
  }, item.animationDuration * 1000 - 100) // Slightly before end to blend transition
}

function togglePause() {
  // No-op
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
  
  spawnItems()
  timer = setInterval(spawnItems, 1500)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  if (resizeObserver) resizeObserver.disconnect()
  activeItems.value = []
  fallenItems.value = []
})
</script>

<style scoped>
@keyframes fall-in {
  0% { opacity: 0; transform: translateY(-50px) rotate(-10deg) scale(0.6) translateX(0); }
  20% { opacity: 1; transform: translateY(0px) rotate(5deg) scale(0.9) translateX(calc(var(--sway) * 0.5)); }
  40% { transform: translateY(150px) rotate(-5deg) scale(1.0) translateX(calc(var(--sway) * -0.5)); }
  60% { transform: translateY(300px) rotate(3deg) scale(1.0) translateX(calc(var(--sway) * 0.3)); }
  80% { transform: translateY(320px) rotate(-2deg) scale(1.0) translateX(calc(var(--sway) * -0.2)); }
  100% { transform: translateY(350px) rotate(0deg) scale(1.0) translateX(0); /* Land on ground visible */ }
}

/* No float-away needed as they land */

.falling-enter-active {
  animation: fall-in linear forwards;
}
.falling-leave-active {
  /* Identify logic handles removal */
  display: none; 
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
