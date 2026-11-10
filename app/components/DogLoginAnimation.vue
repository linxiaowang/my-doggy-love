<template>
  <div class="relative w-full h-44 md:h-56 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
    <div class="absolute inset-0 diary-dots pointer-events-none" />

    <LineDogSticker
      slug="come"
      size="lg"
      eager
      class="abs-dog left-dog"
    />
    <LineDogSticker
      slug="love"
      size="lg"
      eager
      class="abs-dog right-dog"
    />

    <div class="absolute inset-x-0 bottom-3 text-center">
      <p class="font-display text-sm text-muted-foreground">
        两只小狗一起登录中…
      </p>
    </div>
  </div>
</template>

<style scoped>
.diary-dots {
  background-image: radial-gradient(color-mix(in oklch, var(--foreground) 10%, transparent) 1px, transparent 1px);
  background-size: 14px 14px;
}

.abs-dog {
  position: absolute;
  bottom: 36px;
}

.left-dog {
  left: -96px;
  animation: slideInLeft 2.6s ease-in-out infinite;
}

.right-dog {
  right: -96px;
  animation: slideInRight 2.6s ease-in-out infinite;
}

@keyframes slideInLeft {
  0% { transform: translateX(0) rotate(0deg); opacity: .55; }
  35% { transform: translateX(132px) rotate(-4deg); opacity: 1; }
  55% { transform: translateX(118px) rotate(3deg); }
  75% { transform: translateX(132px) rotate(-2deg); }
  100% { transform: translateX(0) rotate(0deg); opacity: .55; }
}

@keyframes slideInRight {
  0% { transform: translateX(0) rotate(0deg); opacity: .55; }
  35% { transform: translateX(-132px) rotate(4deg); opacity: 1; }
  55% { transform: translateX(-118px) rotate(-3deg); }
  75% { transform: translateX(-132px) rotate(2deg); }
  100% { transform: translateX(0) rotate(0deg); opacity: .55; }
}

@media (min-width: 768px) {
  .abs-dog { bottom: 44px; }
  .left-dog { left: -120px; }
  .right-dog { right: -120px; }
}

@media (prefers-reduced-motion: reduce) {
  .left-dog,
  .right-dog {
    animation: none;
    transform: translateX(120px);
    opacity: 1;
  }
  .right-dog {
    transform: translateX(-120px);
  }
}
</style>
