<template>
  <footer border="t base" py-6>
    <div class="max-w-6xl mx-auto px-4" flex="~ col md:row gap3" items-center justify-between>
      <div text="sm gray6" flex="~ wrap gap2" items-center justify-center md:justify-start>
        <span>© {{ new Date().getFullYear() }} My Doggy Love</span>
        <span text="gray4">·</span>
        <span>以爱为名，记录每一帧心动</span>
      </div>

      <div flex="~ items-center gap3">
        <a i-carbon-logo-github href="https://github.com/linxiaowang/my-doggy-love" target="_blank" rel="noopener" title="GitHub" />
        <a href="https://github.com/linxiaowang/my-doggy-love/issues" target="_blank" rel="noopener" text="sm gray6 hover:gray8 underline" title="反馈">反馈</a>
        <a href="https://github.com/linxiaowang/my-doggy-love/blob/main/LICENSE" target="_blank" rel="noopener" text="sm gray6 hover:gray8 underline" title="许可证">许可证</a>
        <!-- <DarkToggle /> -->
      </div>
    </div>
  </footer>
</template>
