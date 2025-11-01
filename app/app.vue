<script setup lang="ts">
import { appName } from '~/constants'

useHead({
  title: appName,
})
</script>

<template>
  <VitePwaManifest />
  <NuxtLayout>
    <NuxtPage />
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
body { color: #333; }
/* 常见表单元素默认文字颜色 */
input, textarea, select, button { color: #333; }
/* 占位符颜色在各页面已单独指定；这里兜底一层 */
::placeholder { color: #9aa0a6; }
</style>
