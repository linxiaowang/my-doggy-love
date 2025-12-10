<script setup lang="ts">
import { appName } from '~/constants'

useHead({
  title: appName,
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover' }
  ]
})
</script>

<template>
  <VitePwaManifest />
  <NuxtLayout>
    <NuxtPage />
    <!-- <UiAnniversaryMode /> -->
  </NuxtLayout>
</template>

<style>
html,
body,
#__nuxt {
  height: 100vh;
  margin: 0;
  padding: 0;
}

html.dark {
  color-scheme: dark;
}

/* 全局基础文本颜色，避免白底白字不可见 */
/* 全局基础文本颜色，避免白底白字不可见 */
body { 
  color: theme('colors.text.main'); 
  background-color: theme('colors.surface.100');
  font-family: 'DM Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
/* 常见表单元素默认文字颜色 */
input, textarea, select, button { color: theme('colors.text.main'); }
/* 占位符颜色在各页面已单独指定；这里兜底一层 */
::placeholder { color: theme('colors.text.muted'); }

/* 页面过渡动画 */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* 平滑滚动 */
html {
  scroll-behavior: smooth;
}

/* 优化图片加载 */
img {
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}

/* 淡入动画 */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}

/* 上滑动画 */
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-up 0.6s ease-out forwards;
}

/* 弹入动画 */
@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(10px);
  }
  50% {
    transform: scale(1.05) translateY(-2px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-bounce-in {
  animation: bounce-in 0.5s ease-out forwards;
}
</style>
