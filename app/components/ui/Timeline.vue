<template>
  <div class="timeline relative">
    <div class="rail"></div>
    <div class="space-y-6">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.timeline { position: relative; }
.rail {
  position: absolute;
  left: 16px; /* 对齐节点 */
  top: 0; bottom: 0;
  width: 10px; /* 用更宽的区域以放置爪印 */
  pointer-events: none;
  /* 竖直细线底色 */
  background: linear-gradient(90deg, #e6e1db 0, #e6e1db 2px, transparent 2px);
}

/* 叠加爪印图样（data-uri SVG） */
.rail::after {
  content: '';
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='40' viewBox='0 0 10 40'%3E%3Cg fill='%23d8d3cd'%3E%3Ccircle cx='5' cy='6' r='1.5'/%3E%3Ccircle cx='2.5' cy='8.5' r='1.2'/%3E%3Ccircle cx='7.5' cy='8.5' r='1.2'/%3E%3Cellipse cx='5' cy='12.5' rx='2' ry='1.5'/%3E%3C/g%3E%3C/svg%3E");
  background-repeat: repeat-y;
  background-position: left 0 top 8px;
}
</style>


