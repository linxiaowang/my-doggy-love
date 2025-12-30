<template>
  <Teleport to="body">
    <div class="new-year-decorations pointer-events-none fixed inset-0 z-40 overflow-hidden">
      <!-- 顶部装饰横幅 - 简化版 -->
      <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 shadow-lg">
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
      </div>

      <!-- 左上角灯笼 -->
      <div class="absolute top-16 left-4 md:top-20 md:left-8 animate-swing">
        <svg class="w-16 h-20 md:w-20 md:h-24 drop-shadow-lg" viewBox="0 0 80 100">
          <!-- 挂绳 -->
          <line x1="40" y1="0" x2="40" y2="15" stroke="#d4a574" stroke-width="2"/>
          <!-- 灯笼主体 -->
          <ellipse cx="40" cy="45" rx="28" ry="32" fill="#dc2626" stroke="#b91c1c" stroke-width="2"/>
          <!-- 灯笼金色装饰 -->
          <ellipse cx="40" cy="45" rx="20" ry="24" fill="none" stroke="#fbbf24" stroke-width="2"/>
          <rect x="20" y="42" width="40" height="6" fill="#fbbf24" rx="2"/>
          <!-- 灯须 -->
          <line x1="15" y1="75" x2="15" y2="95" stroke="#dc2626" stroke-width="3"/>
          <line x1="30" y1="78" x2="30" y2="92" stroke="#dc2626" stroke-width="3"/>
          <line x1="40" y1="79" x2="40" y2="90" stroke="#dc2626" stroke-width="3"/>
          <line x1="50" y1="78" x2="50" y2="92" stroke="#dc2626" stroke-width="3"/>
          <line x1="65" y1="75" x2="65" y2="95" stroke="#dc2626" stroke-width="3"/>
          <!-- "马"字 -->
          <text x="40" y="52" text-anchor="middle" fill="#fbbf24" font-size="24" font-weight="bold">马</text>
        </svg>
      </div>

      <!-- 右上角灯笼 -->
      <div class="absolute top-16 right-4 md:top-20 md:right-8 animate-swing" style="animation-delay: 0.5s;">
        <svg class="w-16 h-20 md:w-20 md:h-24 drop-shadow-lg" viewBox="0 0 80 100">
          <line x1="40" y1="0" x2="40" y2="15" stroke="#d4a574" stroke-width="2"/>
          <ellipse cx="40" cy="45" rx="28" ry="32" fill="#dc2626" stroke="#b91c1c" stroke-width="2"/>
          <ellipse cx="40" cy="45" rx="20" ry="24" fill="none" stroke="#fbbf24" stroke-width="2"/>
          <rect x="20" y="42" width="40" height="6" fill="#fbbf24" rx="2"/>
          <line x1="15" y1="75" x2="15" y2="95" stroke="#dc2626" stroke-width="3"/>
          <line x1="30" y1="78" x2="30" y2="92" stroke="#dc2626" stroke-width="3"/>
          <line x1="40" y1="79" x2="40" y2="90" stroke="#dc2626" stroke-width="3"/>
          <line x1="50" y1="78" x2="50" y2="92" stroke="#dc2626" stroke-width="3"/>
          <line x1="65" y1="75" x2="65" y2="95" stroke="#dc2626" stroke-width="3"/>
          <text x="40" y="52" text-anchor="middle" fill="#fbbf24" font-size="24" font-weight="bold">马</text>
        </svg>
      </div>

      <!-- 飘落的金币 -->
      <TransitionGroup name="coin">
        <div
          v-for="coin in coins"
          :key="coin.id"
          class="absolute animate-coin-fall"
          :style="{
            left: coin.left + '%',
            top: coin.top + '%',
            animationDuration: coin.duration + 's',
            animationDelay: coin.delay + 's'
          }"
        >
          <svg class="w-8 h-8 md:w-10 md:h-10 drop-shadow-md" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="18" fill="#fbbf24" stroke="#d4a574" stroke-width="2"/>
            <circle cx="20" cy="20" r="14" fill="none" stroke="#d4a574" stroke-width="1"/>
            <text x="20" y="27" text-anchor="middle" fill="#d4a574" font-size="16" font-weight="bold">财</text>
          </svg>
        </div>
      </TransitionGroup>

      <!-- 烟花效果 (点击时触发) -->
      <TransitionGroup name="firework">
        <div
          v-for="firework in fireworks"
          :key="firework.id"
          class="firework-container pointer-events-none"
          :style="{
            left: firework.left + 'px',
            top: firework.top + 'px'
          }"
        >
          <!-- 粒子 - 24个方向的爆炸 -->
          <div
            v-for="index in 24"
            :key="index"
            class="firework-particle"
            :style="{
              '--rotation': (index * 15) + 'deg',
              background: firework.color,
              boxShadow: `0 0 8px ${firework.color}, 0 0 16px ${firework.color}`
            }"
          />
        </div>
      </TransitionGroup>

      <!-- 底部祝福语 - 马年主题 -->
      <div class="absolute bottom-20 left-0 right-0 text-center md:bottom-4">
        <div class="inline-block px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 rounded-full shadow-xl animate-bounce-slow">
          <span class="text-white text-sm md:text-base font-bold tracking-wider">
            🐴 2026 马年大吉 · 万马奔腾 🐴
          </span>
        </div>
      </div>

      <!-- 左右两侧飘带装饰 -->
      <div class="absolute top-24 left-0 w-16 h-64 md:w-20 md:h-80 opacity-20">
        <svg class="w-full h-full" viewBox="0 0 80 320" preserveAspectRatio="none">
          <path d="M0 0 Q40 160 0 320" fill="none" stroke="#dc2626" stroke-width="2" stroke-dasharray="10,5"/>
        </svg>
      </div>
      <div class="absolute top-24 right-0 w-16 h-64 md:w-20 md:h-80 opacity-20">
        <svg class="w-full h-full" viewBox="0 0 80 320" preserveAspectRatio="none">
          <path d="M80 0 Q40 160 80 320" fill="none" stroke="#dc2626" stroke-width="2" stroke-dasharray="10,5"/>
        </svg>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Coin {
  id: number
  left: number
  top: number
  duration: number
  delay: number
}

interface Firework {
  id: number
  left: number
  top: number
  color: string
}

const coins = ref<Coin[]>([])
const fireworks = ref<Firework[]>([])
let coinInterval: any = null
let coinId = 0
let fireworkId = 0

const colors = ['#ef4444', '#f59e0b', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899']

// 创建飘落金币
function createCoin() {
  const coin: Coin = {
    id: coinId++,
    left: Math.random() * 100,
    top: -10,
    duration: 8 + Math.random() * 6,
    delay: 0
  }
  coins.value.push(coin)

  // 移除已掉落的金币
  setTimeout(() => {
    coins.value = coins.value.filter(c => c.id !== coin.id)
  }, (coin.duration + coin.delay) * 1000)
}

// 创建烟花效果
function createFirework(x: number, y: number) {
  const firework: Firework = {
    id: fireworkId++,
    left: x,
    top: y,
    color: colors[Math.floor(Math.random() * colors.length)]
  }
  fireworks.value.push(firework)

  // 移除烟花 (与动画时长匹配)
  setTimeout(() => {
    fireworks.value = fireworks.value.filter(f => f.id !== firework.id)
  }, 1500)
}

// 点击触发烟花
function handleClick(e: MouseEvent) {
  // 使用像素坐标，确保位置准确
  createFirework(e.clientX, e.clientY)
}

onMounted(() => {
  // 定期生成金币
  createCoin()
  coinInterval = setInterval(createCoin, 3000)

  // 监听点击事件触发烟花
  if (typeof window !== 'undefined') {
    window.addEventListener('click', handleClick, { passive: true })
  }
})

onUnmounted(() => {
  if (coinInterval) clearInterval(coinInterval)
  if (typeof window !== 'undefined') {
    window.removeEventListener('click', handleClick)
  }
})
</script>

<style scoped>
/* 马头摇摆动画 */
@keyframes swing {
  0%, 100% {
    transform: rotate(-2deg);
  }
  50% {
    transform: rotate(2deg);
  }
}

.animate-swing {
  animation: swing 4s ease-in-out infinite;
  transform-origin: top center;
}

/* 顶部横幅闪光动画 */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s ease-in-out infinite;
}

/* 金币掉落动画 */
@keyframes coin-fall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(110vh) rotate(360deg);
    opacity: 0.6;
  }
}

.animate-coin-fall {
  animation: coin-fall linear forwards;
}

/* 烟花容器 */
.firework-container {
  position: absolute;
  width: 0;
  height: 0;
  transform: translate(-50%, -50%);
}

/* 烟花粒子 */
.firework-particle {
  position: absolute;
  top: 0;
  left: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  animation: particle-explode 1s ease-out forwards;
}

/* 粒子爆炸动画 */
@keyframes particle-explode {
  0% {
    opacity: 1;
    transform: rotate(var(--rotation, 0deg)) translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: rotate(var(--rotation, 0deg)) translateY(-120px) scale(0.3);
  }
}

/* 慢速弹跳动画 */
@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}

/* 过渡动画 */
.coin-enter-active,
.coin-leave-active {
  transition: all 0.3s ease;
}

.coin-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.coin-leave-to {
  opacity: 0;
}

.firework-enter-active,
.firework-leave-active {
  transition: all 0.3s ease;
}

.firework-enter-from {
  opacity: 0;
  transform: scale(0);
}

.firework-leave-to {
  opacity: 0;
}
</style>
