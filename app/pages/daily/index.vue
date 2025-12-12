<template>
  <div class="min-h-screen bg-gradient-to-br from-#f7f6f3 via-#faf9f7 to-#f7f6f3">
    <DogHeader />
    <div class="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <Card>
        <CardContent class="px-4">
          <!-- 错误提示 -->
          <div v-if="errorMessage" class="mb-4 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg animate-fade-in">
            {{ errorMessage }}
            <NuxtLink v-if="errorMessage.includes('情侣')" to="/user/couple" class="underline ml-1 font-medium hover:opacity-80">去绑定</NuxtLink>
          </div>
          
          <form class="flex flex-col gap-4" @submit.prevent="create">
            <div class="space-y-2">
              <Label for="content">记录内容</Label>
              <Textarea id="content" v-model="content" placeholder="今天想记录点什么…" class="min-h-[100px]" />
            </div>
          
            <!-- 标签选择区域 -->
            <div class="space-y-2">
              <Label>选择标签</Label>
              <div class="flex flex-wrap gap-2">
                <!-- 预设标签 -->
                <Badge
                  v-for="tag in presetTags"
                  :key="tag"
                  variant="outline"
                  class="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  :class="selectedTagsForPost.includes(tag) ? 'bg-primary text-primary-foreground' : ''"
                  @click="togglePostTag(tag)"
                >
                  {{ tag }}
                </Badge>
                
                <!-- 自定义标签输入 -->
                <Badge
                  v-if="!showCustomTagInput"
                  variant="outline"
                  class="cursor-pointer hover:bg-muted"
                  @click="startCustomTag"
                >
                  <span class="mr-1">+</span>
                  <span>自定义</span>
                </Badge>
                
                <!-- 自定义标签输入框 -->
                <div v-else class="flex items-center gap-2">
                  <Input
                    ref="customTagInputRef"
                    v-model="customTagInput"
                    type="text"
                    placeholder="输入标签名称"
                    maxlength="10"
                    class="h-8 w-32"
                    @keyup.enter="addCustomTag"
                    @keyup.esc="cancelCustomTag"
                    @blur="handleCustomTagBlur"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="default"
                    class="h-8 px-3"
                    @click="addCustomTag"
                  >
                    添加
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    class="h-8 px-3"
                    @click="cancelCustomTag"
                  >
                    取消
                  </Button>
                </div>
              </div>
              
              <!-- 已选标签显示 -->
              <div v-if="selectedTagsForPost.length > 0" class="flex flex-wrap gap-2 items-center">
                <span class="text-xs text-muted-foreground">已选：</span>
                <Badge
                  v-for="tag in selectedTagsForPost"
                  :key="tag"
                  class="gap-1"
                >
                  {{ tag }}
                  <button
                    type="button"
                    class="ml-1 hover:opacity-70"
                    @click="removePostTag(tag)"
                  >
                    ×
                  </button>
                </Badge>
              </div>
            </div>
          
            <!-- 文件上传区域 -->
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <Button variant="outline" as-child class="flex-1">
                  <label class="cursor-pointer">
                    <input 
                      ref="fileRef" 
                      type="file" 
                      accept="image/*,video/*" 
                      multiple 
                      class="hidden"
                      @change="onFilesChange" 
                    />
                    <div class="flex items-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>添加图片/视频</span>
                      <Badge v-if="filePreviews.length > 0" variant="secondary" class="ml-auto">{{ filePreviews.length }}</Badge>
                    </div>
                  </label>
                </Button>
                <Button type="submit" class="flex-1" :disabled="creating">
                  {{ creating ? '发布中...' : '发布' }}
                </Button>
              </div>
            
            <!-- 文件预览区域 -->
            <draggable
              v-if="filePreviews.length > 0"
              v-model="filePreviews"
              :animation="200"
              :item-key="(item: FilePreview) => `${item.name}-${item.size}`"
              class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3"
              @end="onDragEnd"
            >
              <template #item="{ element: preview, index }">
                <div
                  class="relative group aspect-square rounded-lg overflow-hidden bg-#f7f6f3 border border-#ece7e1 cursor-move"
                >
                  <!-- 图片预览 -->
                  <img
                    v-if="preview.type.startsWith('image/')"
                    :src="preview.url"
                    :alt="preview.name"
                    class="w-full h-full object-cover"
                  />
                  
                  <!-- 视频预览 -->
                  <div
                    v-else-if="preview.type.startsWith('video/')"
                    class="w-full h-full flex flex-col items-center justify-center bg-#f0f0f0 relative"
                  >
                    <!-- 如果有缩略图，显示缩略图 -->
                    <img
                      v-if="preview.url && preview.url.startsWith('data:image')"
                      :src="preview.url"
                      class="w-full h-full object-cover"
                      alt="视频预览"
                    />
                    <!-- 否则显示占位符 -->
                    <template v-else>
                      <svg class="w-12 h-12 text-#999 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span class="text-xs text-#777 px-2 text-center truncate w-full">{{ preview.name }}</span>
                    </template>
                    <!-- 视频播放图标覆盖层 -->
                    <div class="absolute inset-0 flex items-center justify-center bg-black/20">
                      <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  
                  <!-- 删除按钮 -->
                  <button
                    type="button"
                    class="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-10"
                    @click.stop="removeFile(index)"
                    title="删除"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  
                  <!-- 文件类型标识 -->
                  <div class="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-xs">
                    {{ preview.type.startsWith('image/') ? '图片' : '视频' }}
                  </div>
                </div>
              </template>
            </draggable>
          </div>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="space-y-4">
          <div class="flex flex-wrap items-center gap-3">
            <Label class="text-sm font-medium">筛选</Label>
            <div class="grid grid-cols-2 sm:flex sm:flex-row gap-2 sm:items-center flex-1 min-w-0 w-full sm:w-auto">
              <Input v-model="start" type="date" class="h-9 text-sm" />
              <span class="hidden sm:block text-muted-foreground">—</span>
              <Input v-model="end" type="date" class="h-9 text-sm" />
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" @click="presetDays(0)">今天</Button>
              <Button variant="outline" size="sm" @click="presetDays(7)">近7天</Button>
              <Button variant="outline" size="sm" @click="presetDays(30)">近30天</Button>
            </div>
            <Button variant="outline" size="sm" class="md:ml-auto" @click="clearFilters">清空</Button>
          </div>
          <div v-if="allTags.length > 0" class="flex flex-wrap gap-2 items-center">
            <Label class="text-sm">标签</Label>
            <Badge
              v-for="t in allTags" :key="t"
              variant="outline"
              class="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              :class="selectedTags.includes(t) ? 'bg-primary text-primary-foreground' : ''"
              @click="toggleTag(t)"
            >{{ t }}</Badge>
          </div>
        </CardContent>
      </Card>
      <div v-if="loading">
        <SkeletonList :count="3" />
      </div>
      <div v-else-if="items.length === 0">
        <EmptyState text="暂无日常记录" img="/assets/images/xiaojimao/xiaojimao-4.png" cta-text="去发布一条" cta-to="/daily" />
      </div>
      <Timeline v-else>
        <template v-for="group in grouped" :key="group.label">
          <div class="pl-14 text-sm muted mb-2">{{ group.label }}</div>
          <TimelineItem v-for="it in group.items" :key="it.id">
            <PostCard 
              :id="it.id" 
              :content="it.content" 
              :createdAt="it.createdAt" 
              :media-urls="asArray(it.mediaUrls)" 
              :comment-count="(it as any).commentCount || 0"
              :tags="(it as any).tags || []" 
              :authorId="it.authorId || it.author?.id"
              @commented="reloadOne(it.id)"
              @deleted="handleDelete(it.id)"
            />
          </TimelineItem>
        </template>
      </Timeline>
      <div v-if="hasMore && !loading" class="mt-4 flex justify-center">
        <Button variant="outline" @click="loadMore" :disabled="loadingMore">{{ loadingMore ? '加载中…' : '加载更多' }}</Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DogHeader from '@/components/ui/DogHeader.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import SkeletonList from '@/components/ui/SkeletonList.vue'
import PostCard from '@/components/ui/PostCard.vue'
import Timeline from '@/components/ui/Timeline.vue'
import TimelineItem from '@/components/ui/TimelineItem.vue'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ref, onMounted, computed, nextTick } from 'vue'
import { createDailyPost } from '@/services/api/daily'
import { uploadFiles } from '@/services/api/upload'
import { apiFetch, handleApiError } from '@/services/api'
import draggable from 'vuedraggable'
import { compressImages, shouldCompress } from '@/utils/imageCompress'

// 检查登录状态，未登录会自动跳转到登录页
definePageMeta({
  middleware: 'auth',
})

interface Post { id: string; content: string; mediaUrls: any; createdAt: string; commentCount?: number; authorId?: string; author?: { id: string; nickName: string; avatarUrl?: string | null } }
const items = ref<Post[]>([])
const loading = ref(true)
const content = ref('')
const fileRef = ref<HTMLInputElement | null>(null)
const start = ref('')
const end = ref('')
const tag = ref('')
type FilePreview = {
  file: File
  name: string
  type: string
  size: number
  url: string
}

const filePreviews = ref<FilePreview[]>([])
const pageSize = 10
const loadingMore = ref(false)
const selectedTags = ref<string[]>([])

// 发布时的标签选择
const selectedTagsForPost = ref<string[]>([])
const presetTags = ref([
  '旅游', '美食', '约会', '购物', '电影', 
  '运动', '学习', '工作', '休息', '惊喜',
  '纪念日', '日常', '开心', '感动'
])
const showCustomTagInput = ref(false)
const customTagInput = ref('')
const customTagInputRef = ref<HTMLInputElement | null>(null)
const errorMessage = ref('')
const creating = ref(false)

// 使用统一的 API 管理（可选，保留原有方式作为备用）
async function load() {
  loading.value = true
  try {
    const res = await apiFetch<{ items: Post[] }>(`/api/daily?take=${pageSize}`)
    items.value = res.items
  } catch (e: any) {
    // 错误已在 apiFetch 中统一处理
    console.error('加载日常记录失败:', e)
  } finally {
    loading.value = false
  }
}
onMounted(load)

async function create() {
  if (!content.value) return
  
  errorMessage.value = ''
  creating.value = true
  
  try {
    let mediaUrls: string[] = []
    if (fileRef.value?.files && fileRef.value.files.length) {
      const files = Array.from(fileRef.value.files)
      
      // 压缩图片（仅压缩需要压缩的图片）
      // 使用 compressorjs，会自动将大于 5MB 的 PNG 转换为 JPEG
      const filesToUpload = await compressImages(files, {
        maxWidth: 1920,
        maxHeight: 1920,
        quality: 0.8, // compressorjs 推荐值
        checkOrientation: true, // 自动纠正图片方向
        retainExif: false, // 不保留 EXIF 以减小体积
        convertTypes: ['image/png'], // 大 PNG 自动转 JPEG
        convertSize: 5 * 1024 * 1024, // 5MB 阈值
        keepOriginalFormat: false, // 统一转换为 JPEG 以减小体积
      })
      
      const up = await uploadFiles(filesToUpload)
      // 处理新的返回格式（可能包含缩略图）
      mediaUrls = up.urls.map(item => {
        if (typeof item === 'string') {
          return item
        }
        return item.url // 使用原图 URL
      })
    }
    
    await createDailyPost({
      content: content.value,
      mediaUrls,
      tags: selectedTagsForPost.value,
    })
    
    // 清理
    content.value = ''
    selectedTagsForPost.value = []
    showCustomTagInput.value = false
    customTagInput.value = ''
    
    // 清理文件预览并释放 URL
    filePreviews.value.forEach((preview) => {
      if (preview.url) {
        URL.revokeObjectURL(preview.url)
      }
    })
    filePreviews.value = []
    
    if (fileRef.value) fileRef.value.value = ''
    await load()
  } catch (e: any) {
    // 使用统一错误处理
    errorMessage.value = e?.friendlyMessage || handleApiError(e)
    
    // 如果是未绑定情侣的错误，显示特殊提示
    if (errorMessage.value.includes('情侣')) {
      // 错误信息已经包含友好提示，可以直接显示
    }
    
    console.error('发布日常记录失败:', e)
  } finally {
    creating.value = false
  }
}

function asArray(v: any): string[] {
  if (Array.isArray(v)) return v
  return []
}

const filtered = computed(() => {
  const s = start.value ? new Date(start.value) : null
  const e = end.value ? new Date(end.value) : null
  const t = tag.value.trim()
  return items.value.filter((it: any) => {
    const d = new Date(it.createdAt)
    if (s && d < s) return false
    if (e && d > new Date(e.getTime() + 24*60*60*1000 - 1)) return false
    if (t) {
      const tagsArr = Array.isArray(it.tags) ? it.tags : []
      if (!tagsArr.some((x: string) => String(x).includes(t))) return false
    }
    if (selectedTags.value.length) {
      const tagsArr = Array.isArray(it.tags) ? it.tags : []
      const hasAny = selectedTags.value.some(st => tagsArr.includes(st))
      if (!hasAny) return false
    }
    return true
  })
})

const grouped = computed(() => {
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const startOfWeek = new Date(startOfToday - (now.getDay() || 7 - 1) * 24*60*60*1000).getTime()
  const today: Post[] = []
  const thisWeek: Post[] = []
  const earlier: Post[] = []
  for (const it of filtered.value) {
    const t = new Date(it.createdAt).getTime()
    if (t >= startOfToday) today.push(it)
    else if (t >= startOfWeek) thisWeek.push(it)
    else earlier.push(it)
  }
  const groups: Array<{ label: string; items: Post[] }> = []
  if (today.length) groups.push({ label: '今天', items: today })
  if (thisWeek.length) groups.push({ label: '本周', items: thisWeek })
  if (earlier.length) groups.push({ label: '更早', items: earlier })
  return groups
})

const hasMore = computed(() => items.value.length > 0 && items.value.length % pageSize === 0)

async function loadMore() {
  if (!items.value.length) return
  loadingMore.value = true
  try {
    const last = items.value[items.value.length - 1] as Post
    const res = await apiFetch<{ items: Post[] }>(`/api/daily?take=${pageSize}&cursor=${encodeURIComponent(last.id)}`)
    const toAppend = res.items.filter(p => !items.value.find(i => i.id === p.id))
    items.value = items.value.concat(toAppend)
  } catch (e: any) {
    console.error('加载更多失败:', e)
  } finally {
    loadingMore.value = false
  }
}

async function onFilesChange() {
  if (!fileRef.value?.files || !fileRef.value.files.length) {
    return
  }
  
  const newFiles = Array.from(fileRef.value.files)
  const existingFileNames = new Set(filePreviews.value.map(p => `${p.name}-${p.size}`))
  
  // 只处理新文件，避免重复添加
  const filesToAdd = newFiles.filter(file => {
    const fileKey = `${file.name}-${file.size}`
    return !existingFileNames.has(fileKey)
  })
  
  if (filesToAdd.length === 0) {
    return
  }
  
  // 对于图片文件，显示压缩提示
  const imageFiles = filesToAdd.filter(f => f.type.startsWith('image/'))
  const needsCompression = imageFiles.filter(f => shouldCompress(f))
  
  if (needsCompression.length > 0) {
    // 可以在这里显示一个提示，告知用户图片将被压缩
    console.log(`将压缩 ${needsCompression.length} 张图片以优化上传速度`)
  }
  
  filesToAdd.forEach((file) => {
    const preview = {
      file,
      name: file.name,
      type: file.type,
      size: file.size,
      url: '', // 将在下面设置
    }
    
    // 创建预览 URL
    if (file.type.startsWith('image/')) {
      preview.url = URL.createObjectURL(file)
      filePreviews.value.push(preview)
    } else if (file.type.startsWith('video/')) {
      // 为视频创建第一帧预览
      const video = document.createElement('video')
      video.preload = 'metadata'
      const videoUrl = URL.createObjectURL(file)
      video.src = videoUrl
      
      // 先添加到列表，显示占位符
      preview.url = videoUrl
      const previewIndex = filePreviews.value.length
      filePreviews.value.push(preview)
      
      video.onloadedmetadata = () => {
        video.currentTime = 0.1
      }
      
      video.onseeked = () => {
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth || 400
        canvas.height = video.videoHeight || 300
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          // 更新对应预览的 URL
          if (filePreviews.value[previewIndex]) {
            filePreviews.value[previewIndex].url = canvas.toDataURL()
          }
          // 释放视频 URL
          URL.revokeObjectURL(videoUrl)
        }
      }
      
      video.onerror = () => {
        // 如果视频加载失败，保持占位符
        URL.revokeObjectURL(videoUrl)
      }
    } else {
      // 其他文件类型
      filePreviews.value.push(preview)
    }
  })
  
  // 同步更新 input 的 files
  updateFileInput()
}

function updateFileInput() {
  if (!fileRef.value) return
  
  const dt = new DataTransfer()
  filePreviews.value.forEach((preview) => {
    dt.items.add(preview.file)
  })
  fileRef.value.files = dt.files
}

function removeFile(index: number) {
  // 释放 URL 对象
  if (filePreviews.value[index]?.url) {
    URL.revokeObjectURL(filePreviews.value[index].url)
  }
  
  filePreviews.value.splice(index, 1)
  
  // 同步更新 input 的 files
  updateFileInput()
}

// 拖拽结束事件处理
function onDragEnd() {
  // 拖拽后同步更新 input 的 files
  updateFileInput()
}

async function reloadOne(id: string) {
  // 简易刷新：整体重载，避免复杂局部状态同步
  await load()
}

async function handleDelete(id: string) {
  // 从列表中移除该项
  const index = items.value.findIndex(item => item.id === id)
  if (index >= 0) {
    items.value.splice(index, 1)
  }
  // 如果需要，也可以重新加载整个列表
  // await load()
}

const allTags = computed(() => {
  const set = new Set<string>()
  for (const it of items.value) {
    const arr = Array.isArray((it as any).tags) ? (it as any).tags as string[] : []
    for (const t of arr) set.add(t)
  }
  return Array.from(set)
})

function toggleTag(t: string) {
  const i = selectedTags.value.indexOf(t)
  if (i >= 0) selectedTags.value.splice(i, 1)
  else selectedTags.value.push(t)
}

// 发布时标签操作
function togglePostTag(tagName: string) {
  const index = selectedTagsForPost.value.indexOf(tagName)
  if (index >= 0) {
    selectedTagsForPost.value.splice(index, 1)
  } else {
    selectedTagsForPost.value.push(tagName)
  }
}

function removePostTag(tagName: string) {
  const index = selectedTagsForPost.value.indexOf(tagName)
  if (index >= 0) {
    selectedTagsForPost.value.splice(index, 1)
  }
}

function addCustomTag() {
  const trimmed = customTagInput.value.trim()
  if (!trimmed) {
    cancelCustomTag()
    return
  }
  
  // 检查是否已存在
  if (!selectedTagsForPost.value.includes(trimmed)) {
    selectedTagsForPost.value.push(trimmed)
  }
  
  // 如果是新的预设标签，也添加到预设列表（但不持久化，只是当前会话）
  if (!presetTags.value.includes(trimmed)) {
    presetTags.value.push(trimmed)
  }
  
  customTagInput.value = ''
  showCustomTagInput.value = false
}

function startCustomTag() {
  showCustomTagInput.value = true
  nextTick(() => {
    customTagInputRef.value?.focus()
  })
}

function cancelCustomTag() {
  showCustomTagInput.value = false
  customTagInput.value = ''
}

function handleCustomTagBlur() {
  // 延迟取消，避免点击添加按钮时触发 blur
  setTimeout(() => {
    if (customTagInput.value.trim()) {
      addCustomTag()
    } else {
      cancelCustomTag()
    }
  }, 200)
}

// 筛选时标签操作（保留原有功能）
function addTagFromInput() {
  const v = tag.value.trim()
  if (!v) return
  if (!selectedTags.value.includes(v)) selectedTags.value.push(v)
  tag.value = ''
}

function presetDays(days: number) {
  const today = new Date()
  const ymd = (d: Date) => d.toISOString().slice(0,10)
  if (days === 0) {
    start.value = ymd(today)
    end.value = ymd(today)
  } else {
    const from = new Date(today.getTime() - (days-1) * 24*60*60*1000)
    start.value = ymd(from)
    end.value = ymd(today)
  }
}

function clearFilters() {
  start.value = ''
  end.value = ''
  tag.value = ''
  selectedTags.value = []
}
</script>


