<template>
  <div class="min-h-screen bg-#f7f6f3">
    <DogHeader :user-override="user" />
    <div class="max-w-2xl mx-auto px-4 py-8">
      <div class="card space-y-4">
        <div class="text-lg">用户资料</div>
        <div v-if="user" class="flex items-center gap-4">
          <div class="relative group">
          <img :src="user.avatarUrl || '/assets/images/xiaobai/xiaobai-2.png'" loading="lazy" class="w-16 h-16 rounded-full object-cover" />
            <button
              class="absolute inset-0 w-16 h-16 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              @click="showAvatarModal = true"
              title="修改头像"
            >
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
          <div class="flex-1">
            <!-- 昵称显示和编辑 -->
            <div class="flex items-center gap-2">
              <template v-if="isEditingNickname">
                <input
                  v-model="editingNickname"
                  ref="nicknameInputRef"
                  type="text"
                  maxlength="20"
                  class="border border-#ece7e1 rounded px-2 py-1 bg-white text-#333 focus:outline-none focus:ring-2 focus:ring-#d4a574 flex-1"
                  @keyup.enter="saveNickname"
                  @keyup.esc="cancelEditNickname"
                />
                <button
                  class="px-2 py-1 text-xs rounded bg-#d4a574 text-white hover:bg-#c49564 transition"
                  @click="saveNickname"
                  :disabled="savingNickname"
                >
                  {{ savingNickname ? '保存中...' : '保存' }}
                </button>
                <button
                  class="px-2 py-1 text-xs rounded bg-#f7f6f3 hover:bg-#e8e8e8 transition"
                  @click="cancelEditNickname"
                  :disabled="savingNickname"
                >
                  取消
                </button>
              </template>
              <div v-else class="font-medium flex items-center gap-2">
                <span>{{ user.nickName }}</span>
                <button
                  class="text-xs text-#999 hover:text-#666 ml-1 transition p-0.5"
                  @click="startEditNickname"
                  title="点击编辑昵称"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
            </div>
            <div class="text-sm text-#777">{{ user.email }}</div>
          </div>
        </div>
        
        <!-- 上传头像弹窗 -->
        <Teleport to="body">
          <transition name="fade">
            <div
              v-if="showAvatarModal"
              class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
              @click.self="cancelUploadAvatar"
            >
              <div ref="avatarModalRef" class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
                <div class="p-6">
                  <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold">修改头像</h3>
                    <button
                      class="text-#999 hover:text-#666 transition"
                      @click="cancelUploadAvatar"
                      :disabled="uploadingAvatar"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <!-- 预览区域 -->
                  <div class="mb-4 flex justify-center">
                    <div class="relative">
                      <img
                        :src="avatarPreview || user?.avatarUrl || '/assets/images/xiaobai/xiaobai-2.png'"
                        class="w-32 h-32 rounded-full object-cover border-2 border-#ece7e1"
                        alt="头像预览"
                      />
                    </div>
                  </div>
                  
                  <!-- 文件选择 -->
                  <form @submit.prevent="onUpload" class="space-y-4">
                    <div>
                      <label class="block mb-2 text-sm text-#666">选择图片</label>
                      <input
                        ref="fileRef"
                        type="file"
                        accept="image/*"
                        class="block w-full text-sm text-#666 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-#d4a574 file:text-white hover:file:bg-#c49564 file:cursor-pointer cursor-pointer"
                        @change="handleFileSelect"
                      />
                      <p class="mt-1 text-xs text-#999">支持 JPG、PNG、GIF 格式，建议尺寸 200x200 像素</p>
                    </div>
                    
                    <div class="flex gap-3">
                      <button
                        type="button"
                        class="flex-1 px-4 py-2 rounded-lg bg-#f7f6f3 hover:bg-#e8e8e8 transition text-sm"
                        @click="cancelUploadAvatar"
                        :disabled="uploadingAvatar"
                      >
                        取消
                      </button>
                      <button
                        type="submit"
                        class="flex-1 px-4 py-2 rounded-lg bg-#d4a574 text-white hover:bg-#c49564 transition text-sm"
                        :disabled="uploadingAvatar || !selectedFile"
                      >
                        {{ uploadingAvatar ? '上传中...' : '上传' }}
                      </button>
                    </div>
        </form>
                </div>
              </div>
            </div>
          </transition>
        </Teleport>
        
        <div class="border-t border-#ece7e1 pt-4 space-y-3">
          <div class="text-base">情侣关系</div>
          <template v-if="couple">
            <div v-if="couple.members?.length >= 2" class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="text-sm">邀请码：<span class="font-mono">{{ couple.code }}</span></div>
                <div class="flex -space-x-3">
                  <img v-for="m in couple.members" :key="m.id" :src="m.avatarUrl || '/assets/images/couple/couple-2.png'" class="w-8 h-8 rounded-full border-2 border-white" />
                </div>
              </div>
              <NuxtLink to="/user/couple" class="text-sm underline">管理情侣</NuxtLink>
            </div>
            <div v-else class="text-sm text-#777">
              已创建情侣但尚未完成绑定，邀请码：<span class="font-mono">{{ couple.code }}</span>
              <NuxtLink to="/user/couple" class="underline ml-1">去邀请对方</NuxtLink>
            </div>
          </template>
          <template v-else>
            <div class="text-sm text-#777">你还没有绑定情侣。
              <NuxtLink to="/user/couple" class="underline ml-1">去绑定</NuxtLink>
            </div>
          </template>
        </div>
        <div class="flex items-center gap-3 text-sm pt-2">
          <NuxtLink to="/" class="underline">返回首页</NuxtLink>
          <button class="underline" @click="doLogout">退出登录</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DogHeader from '@/components/DogHeader.vue'
import { ref, onMounted, nextTick, watch } from 'vue'
import { updateNickname, uploadAvatar, logout } from '@/services/api/auth'
import { useCouple } from '@/services/api/couple'
import { onClickOutside } from '@vueuse/core'
import { useToast } from '@/composables/useToast'

// 检查登录状态，未登录会自动跳转到登录页
definePageMeta({
  middleware: 'auth',
})

const fileRef = ref<HTMLInputElement | null>(null)
const couple = ref<{ id: string; code: string; members: Array<{ id: string; nickName: string; avatarUrl?: string; role: string }> } | null>(null)

// 昵称编辑相关
const isEditingNickname = ref(false)
const editingNickname = ref('')
const nicknameInputRef = ref<HTMLInputElement | null>(null)
const savingNickname = ref(false)

// 头像上传相关
const showAvatarModal = ref(false)
const uploadingAvatar = ref(false)
const selectedFile = ref<File | null>(null)
const avatarPreview = ref<string | null>(null)
const avatarModalRef = ref<HTMLElement | null>(null)

// Toast 提示
const toast = useToast()

// 使用 Pinia store 获取用户信息
const authStore = useAuthStore()
const user = computed(() => authStore.user)

// 使用统一的 API
const { data: coupleData } = useCouple()

watch(coupleData, (newData) => {
  // coupleData 是 Ref<CoupleResponse | null>，直接访问 .couple
  if (newData?.couple !== undefined) {
    couple.value = newData.couple
  }
}, { immediate: true })

onMounted(async () => {
  // 数据会通过 watch 自动更新
})

// 点击外部关闭弹窗
onClickOutside(avatarModalRef, () => {
  if (showAvatarModal.value && !uploadingAvatar.value) {
    cancelUploadAvatar()
  }
})

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件')
      return
    }
    
    // 验证文件大小（限制为 5MB）
    if (file.size > 5 * 1024 * 1024) {
      alert('图片大小不能超过 5MB')
      return
    }
    
    selectedFile.value = file
    
    // 创建预览
    const reader = new FileReader()
    reader.onload = (e) => {
      avatarPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

function cancelUploadAvatar() {
  showAvatarModal.value = false
  uploadingAvatar.value = false
  selectedFile.value = null
  avatarPreview.value = null
  // 清空文件选择
  if (fileRef.value) {
    fileRef.value.value = ''
  }
}

async function onUpload() {
  if (!selectedFile.value) {
    return
  }
  
  uploadingAvatar.value = true
  try {
    await uploadAvatar(selectedFile.value)
    // uploadAvatar 会自动更新 store，无需手动更新
    // 上传成功后关闭弹窗并显示成功提示
    cancelUploadAvatar()
    toast.success('头像上传成功！')
  } catch (e: any) {
    console.error('上传头像失败:', e)
    toast.error(e?.friendlyMessage || '上传头像失败，请稍后再试')
  } finally {
    uploadingAvatar.value = false
  }
}

function startEditNickname() {
  if (!authStore.user) return
  editingNickname.value = authStore.user.nickName
  isEditingNickname.value = true
  // 等待 DOM 更新后聚焦输入框
  nextTick(() => {
    nicknameInputRef.value?.focus()
    nicknameInputRef.value?.select()
  })
}

function cancelEditNickname() {
  isEditingNickname.value = false
  editingNickname.value = ''
}

async function saveNickname() {
  if (savingNickname.value) return
  if (!authStore.user) return

  const trimmed = editingNickname.value.trim()
  if (!trimmed) {
    cancelEditNickname()
    return
  }

  // 如果昵称没有变化，直接取消编辑
  if (trimmed === authStore.user.nickName) {
    cancelEditNickname()
    return
  }

  savingNickname.value = true
  try {
    await updateNickname(trimmed)
    // updateNickname 会自动更新 store，无需手动更新
    isEditingNickname.value = false
    editingNickname.value = ''
    toast.success('昵称修改成功！')
  } catch (e: any) {
    toast.error(e?.friendlyMessage || '修改昵称失败，请稍后再试')
  } finally {
    savingNickname.value = false
  }
}

async function doLogout() {
  try {
    await logout()
    // logout 会自动清空 store，无需手动清空
    navigateTo('/user/login')
  } catch (e: any) {
    console.error('退出登录失败:', e)
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>

