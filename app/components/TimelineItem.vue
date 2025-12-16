<template>
  <div class="relative pl-14">
    <div class="node">
      <svg viewBox="0 0 24 24" class="paw">
        <circle cx="7.5" cy="7.5" r="2.2" />
        <circle cx="12" cy="6.5" r="2.2" />
        <circle cx="16.5" cy="7.5" r="2.2" />
        <ellipse cx="12" cy="13.5" rx="4.2" ry="3.2" />
      </svg>
    </div>
    <div>
      <slot />
    </div>
  </div>
  
</template>

<script setup lang="ts">
</script>

<style scoped>
.node {
  position: absolute; left: 4px; top: 2px;
  width: 28px; height: 28px;
  border-radius: 9999px;
  background: #fff;
  border: 1px solid #e2ddd7;
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);
  display: flex; align-items: center; justify-content: center;
  transition: transform .2s ease;
}
.node:hover { transform: translateY(-1px) rotate(-1deg); }
.paw {
  width: 18px; height: 18px;
  fill: #d0cac4;
}
</style>


