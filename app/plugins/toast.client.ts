/**
 * Toast 提示插件
 * 在应用启动时注册 Toast 组件
 */
export default defineNuxtPlugin(() => {
  // 只在客户端执行
  if (!process.client) {
    return
  }
  
  // Toast 组件会在需要时自动注册，这里可以做一些初始化工作
  // 组件通过全局注册或直接在页面中使用即可
})
