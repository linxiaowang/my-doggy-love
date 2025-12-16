<template>
  <div class="relative w-full h-40 md:h-56 overflow-hidden rounded-xl bg-#f7f6f3 border border-#ece7e1">
    <img :src="leftDog" alt="xiaobai" class="abs-dog left-dog" />
    <img :src="rightDog" alt="xiaojimao" class="abs-dog right-dog" />
    <div class="absolute inset-x-0 bottom-2 text-center text-#777 text-sm">两只小狗一起登录中…</div>
  </div>
</template>

<script setup lang="ts">
const leftDog = '/assets/images/xiaobai/xiaobai-3.png'
const rightDog = '/assets/images/xiaojimao/xiaojimao-3.png'
</script>

<style scoped>
.abs-dog {
  position: absolute;
  bottom: 24px;
  height: 80px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.08));
}
.left-dog {
  left: -120px;
  animation: slideInLeft 2.4s ease-in-out infinite;
}
.right-dog {
  right: -120px;
  animation: slideInRight 2.4s ease-in-out infinite;
}
@keyframes slideInLeft {
  0% { transform: translateX(0) rotate(0deg); opacity: .6; }
  30% { transform: translateX(140px) rotate(-3deg); opacity: 1; }
  50% { transform: translateX(120px) rotate(3deg); }
  70% { transform: translateX(140px) rotate(-2deg); }
  100% { transform: translateX(0) rotate(0deg); opacity: .6; }
}
@keyframes slideInRight {
  0% { transform: translateX(0) rotate(0deg); opacity: .6; }
  30% { transform: translateX(-140px) rotate(3deg); opacity: 1; }
  50% { transform: translateX(-120px) rotate(-3deg); }
  70% { transform: translateX(-140px) rotate(2deg); }
  100% { transform: translateX(0) rotate(0deg); opacity: .6; }
}
@media (min-width: 768px) {
  .abs-dog { height: 120px; bottom: 32px; }
  .left-dog { left: -160px; }
  .right-dog { right: -160px; }
}
</style>


