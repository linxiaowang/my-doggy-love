<template>
  <div class="relative w-full overflow-hidden rounded-xl bg-sky-50/30 border border-surface-200 shadow-inner group cursor-pointer" @click="togglePause">
    <!-- Majestic Tree SVG Background -->
    <svg class="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-0 overflow-visible" viewBox="0 0 500 600" preserveAspectRatio="xMidYMax meet">
      <!-- Ground -->
      <path d="M0,580 Q250,560 500,580 L500,600 L0,600 Z" class="fill-stone-100" />
      
      <!-- Roots/Base Shadow -->
      <ellipse cx="250" cy="580" rx="80" ry="15" class="fill-stone-200/50" />

      <!-- Main Trunk -->
      <path d="M220,600 
               Q230,550 200,450 
               Q180,380 220,300 
               C180,250 120,280 80,300 
               M220,300 
               C260,250 320,260 380,240 
               M220,300 
               Q240,200 250,150" 
            fill="none" 
            stroke="#8B5E3C" 
            stroke-width="35" 
            stroke-linecap="round"
            stroke-linejoin="round"
            class="drop-shadow-sm" />
            
       <!-- Secondary Branches -->
       <path d="M220,400 Q280,380 320,320 M200,380 Q150,350 120,320"
             fill="none" 
             stroke="#A07250" 
             stroke-width="20" 
             stroke-linecap="round" />

      <!-- Canopy Layers (Back to Front) -->
      <!-- Low Deep Green -->
      <g class="fill-green-800/80">
         <circle cx="150" cy="300" r="60" />
         <circle cx="350" cy="280" r="70" />
         <circle cx="250" cy="250" r="80" />
      </g>
      
      <!-- Mid Vivid Green -->
      <g class="fill-green-600/80">
         <circle cx="100" cy="250" r="50" />
         <circle cx="400" cy="220" r="60" />
         <circle cx="200" cy="180" r="70" />
         <circle cx="300" cy="190" r="75" />
      </g>

      <!-- Highlights/Top Light Green -->
      <g class="fill-green-500/80">
         <circle cx="150" cy="150" r="50" />
         <circle cx="350" cy="140" r="55" />
         <circle cx="250" cy="100" r="60" />
         <circle cx="250" cy="150" r="50" />
         <!-- Scattered highlights -->
         <circle cx="280" cy="120" r="20" class="fill-green-300/60" />
         <circle cx="180" cy="160" r="15" class="fill-green-300/60" />
      </g>
      
      <!-- Falling Petals/Leaves (Decorative) -->
      <circle cx="220" cy="220" r="4" class="fill-pink-200 animate-pulse" />
      <circle cx="280" cy="260" r="3" class="fill-white animate-pulse" style="animation-delay: 1s"/>
    </svg>

    <!-- Falling Photos/Flowers Layer -->
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
            top: '30%',
            left: `${item.leftPosition}%`,
            '--sway': `${item.swayAmplitude}px`,
            transform: `rotate(${item.rotation}deg) scale(${item.scale})`,
            animationDuration: `${item.animationDuration}s`,
            animationDelay: '0s'
          }"
        >
          <!-- Photo Content -->
          <template v-if="item.type === 'photo'">
            <div class="relative aspect-square overflow-hidden bg-gray-100">
               <img 
                 :src="item.src" 
                 class="w-full h-full object-cover" 
                 alt="Memory"
                 draggable="false"
               />
            </div>
            <!-- Tape/Pin decoration -->
            <div class="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-3 bg-red-100/80 -rotate-2 shadow-sm"></div>
          </template>

          <!-- Flower Content -->
          <template v-else>
             <svg viewBox="0 0 24 24" class="w-full h-full text-pink-300 drop-shadow-sm fill-current">
               <path d="M12,2 C14,5 12,8 10,8 C8,8 6,5 8,2 C10,0 12,0 12,2 Z
                        M12,2 C15,4 18,2 20,4 C22,6 20,9 17,9 C15,9 13,6 12,2 Z
                        M12,22 C14,19 12,16 10,16 C8,16 6,19 8,22 C10,24 12,24 12,22 Z
                        M2,12 C4,10 7,12 7,15 C7,17 4,19 2,17 C0,15 0,13 2,12 Z
                        M22,12 C20,10 17,12 17,15 C17,17 20,19 22,17 C24,15 24,13 22,12 Z" />
                <circle cx="12" cy="12" r="2" class="text-yellow-200 fill-current" />
             </svg>
          </template>
        </div>
      </TransitionGroup>

      <!-- Ground Pile Layer -->
      <TransitionGroup name="fade">
        <div v-for="item in fallenItems" :key="'fallen-' + item.id"
             class="absolute -translate-x-1/2 origin-center transition-all duration-700 opacity-90 hover:opacity-100 hover:scale-110 hover:z-30 cursor-pointer"
             :class="item.type === 'photo' ? 'w-16 md:w-24 p-1 bg-white shadow-sm z-10' : 'w-5 h-5 md:w-6 md:h-6 z-0'"
             :style="{
               bottom: item.type === 'photo' ? '20px' : '25px',
               left: `${item.leftPosition}%`,
               transform: `rotate(${item.rotation}deg) scale(${item.scale})`
             }"
        >
            <!-- Static Photo -->
            <template v-if="item.type === 'photo'">
              <div class="relative aspect-square overflow-hidden bg-gray-50">
                 <img :src="item.src" class="w-full h-full object-cover" draggable="false" />
              </div>
            </template>
            <!-- Static Flower -->
            <template v-else>
               <svg viewBox="0 0 24 24" class="w-full h-full text-pink-400/80 drop-shadow-sm fill-current">
                 <path d="M12,2 C14,5 12,8 10,8 C8,8 6,5 8,2 C10,0 12,0 12,2 Z M12,2 C15,4 18,2 20,4 C22,6 20,9 17,9 C15,9 13,6 12,2 Z M12,22 C14,19 12,16 10,16 C8,16 6,19 8,22 C10,24 12,24 12,22 Z M2,12 C4,10 7,12 7,15 C7,17 4,19 2,17 C0,15 0,13 2,12 Z M22,12 C20,10 17,12 17,15 C17,17 20,19 22,17 C24,15 24,13 22,12 Z" />
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
  type: 'photo' | 'flower'
  src?: string
  rotation: number
  scale: number
  leftPosition: number
  animationDuration: number
  swayAmplitude: number
}

const activeItems = ref<FallingItem[]>([])
const fallenItems = ref<FallingItem[]>([])
let nextId = 0
let timer: any = null

function spawnItems() {
  const spawnFlower = Math.random() > 0.3
  if (spawnFlower) createItem('flower')
  
  if (props.images && props.images.length > 0 && Math.random() > 0.5) {
     createItem('photo')
  }
}

function createItem(type: 'photo' | 'flower') {
  const isPhoto = type === 'photo'
  
  const item: FallingItem = {
    id: nextId++,
    type,
    src: isPhoto ? props.images[Math.floor(Math.random() * props.images.length)] : undefined,
    rotation: (Math.random() - 0.5) * (isPhoto ? 30 : 180),
    scale: isPhoto ? (0.8 + Math.random() * 0.3) : (0.5 + Math.random() * 0.5),
    leftPosition: 10 + Math.random() * 80,
    animationDuration: isPhoto ? (4 + Math.random() * 2) : (6 + Math.random() * 4), // Photos fall faster
    swayAmplitude: isPhoto ? (10 + Math.random() * 20) : (30 + Math.random() * 40) // Flowers sway more
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

onMounted(() => {
  spawnItems()
  timer = setInterval(spawnItems, 1500)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  activeItems.value = []
  fallenItems.value = []
})
</script>

<style scoped>
@keyframes fall-in {
  0% { opacity: 0; transform: translateY(-200px) rotate(-10deg) scale(0.6) translateX(0); }
  20% { opacity: 1; transform: translateY(0px) rotate(5deg) scale(0.9) translateX(calc(var(--sway) * 0.5)); }
  40% { transform: translateY(150px) rotate(-5deg) scale(1.0) translateX(calc(var(--sway) * -0.5)); }
  60% { transform: translateY(300px) rotate(3deg) scale(1.0) translateX(calc(var(--sway) * 0.3)); }
  80% { transform: translateY(320px) rotate(-2deg) scale(1.0) translateX(calc(var(--sway) * -0.2)); }
  100% { transform: translateY(350px) rotate(0deg) scale(1.0) translateX(0); } /* Land on ground visible */
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
