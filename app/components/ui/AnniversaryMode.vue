<script setup lang="ts">
import confetti from 'canvas-confetti'

const showMessage = ref(true)

onMounted(() => {
  // 1. Confetti Burst
  const duration = 2.5 * 1000
  const animationEnd = Date.now() + duration
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }

  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

  const interval: any = setInterval(function () {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      clearInterval(interval)
      return
    }

    const particleCount = 50 * (timeLeft / duration)
    // since particles fall down, start a bit higher than random
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } })
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } })
  }, 250)
})

const hearts = Array.from({ length: 20 }).map(() => ({
  left: Math.random() * 100,
  animationDuration: 6 + Math.random() * 10,
  delay: Math.random() * 5,
  scale: 0.5 + Math.random() * 1,
}))

function closeMessage() {
  showMessage.value = false
}
</script>

<template>
  <div class="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
    <!-- Floating Hearts -->
    <div
      v-for="(heart, index) in hearts"
      :key="index"
      class="float-heart text-red-500/60"
      :style="{
        left: heart.left + '%',
        animationDuration: heart.animationDuration + 's',
        animationDelay: heart.delay + 's',
        fontSize: (heart.scale * 24) + 'px'
      }"
    >
      ❤️
    </div>

    <!-- Message Modal/Toast -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 scale-90"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-90"
    >
      <div
        v-if="showMessage"
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto px-4 w-full max-w-md"
      >
        <div class="bg-white/95 backdrop-blur-xl dark:bg-black/95 p-8 rounded-2xl shadow-2xl text-center border border-red-200/50 dark:border-red-900/50 relative overflow-hidden group">
          
          <!-- Decorative background glow -->
          <div class="absolute -inset-1 bg-gradient-to-r from-red-400 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
          
          <div class="relative z-10">
             <div class="text-5xl mb-4 animate-bounce inline-block">🎉</div>
             <h2 class="text-3xl md:text-4xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-600 mb-3 font-bold">
               半周年快乐！
             </h2>
             <p class="text-gray-600 dark:text-gray-300 mb-8 font-sans text-lg leading-relaxed">
               和你在一起的每分每秒都是宝藏。<br>为我们干杯！🥂
             </p>
             <button
               @click="closeMessage"
               class="px-8 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium rounded-full shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:-translate-y-0.5 transition-all active:scale-95 duration-200"
             >
               爱你 ❤️
             </button>
          </div>

          <button 
             @click="closeMessage"
             class="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <div class="i-carbon-close text-xl"></div>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.float-heart {
  position: absolute;
  bottom: -100px;
  animation: floatUp linear infinite;
  z-index: -1;
}

@keyframes floatUp {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  90% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(-120vh) rotate(360deg);
    opacity: 0;
  }
}
</style>
