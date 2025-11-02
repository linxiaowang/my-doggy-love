# API 服务统一管理

## 目录结构

```
app/services/api/
├── index.ts          # 统一错误处理和基础工具
├── auth.ts           # 认证相关 API
├── daily.ts          # 日常记录 API
├── couple.ts         # 情侣相关 API
├── messages.ts       # 留言板 API
├── wishes.ts         # 愿望清单 API
├── anniversaries.ts  # 纪念日 API
└── upload.ts         # 文件上传 API
```

## 使用方式

### 1. 使用封装的 apiFetch（推荐用于简单请求）

```typescript
import { apiFetch } from '@/services/api'
import { createDailyPost } from '@/services/api/daily'

// 简单请求
const data = await apiFetch<{ items: any[] }>('/api/daily')

// 使用预定义的 API 函数（推荐）
await createDailyPost({ content: '...', tags: [...] })
```

### 2. 使用 useApiFetch（推荐用于响应式数据）

```typescript
import { useDailyList } from '@/services/api/daily'

const { data, error, errorMessage, refresh } = useDailyList({ take: 10 })

// data 是响应式的，自动更新
watch(data, (newData) => {
  if (newData?.value?.items) {
    // 处理数据
  }
})
```

### 3. 错误处理

所有错误都会自动转换为友好的中文提示：

```typescript
import { apiFetch, handleApiError } from '@/services/api'

try {
  await apiFetch('/api/xxx')
} catch (e: any) {
  // 使用友好错误信息
  const message = e?.friendlyMessage || handleApiError(e)
  console.error(message)
}
```

## 错误信息映射

- `not in couple` → "您还没有绑定情侣，无法执行此操作。"
- `400` → "请求参数错误"
- `401` → "登录已过期，请重新登录"
- `403` → "没有权限执行此操作"
- `404` → "请求的资源不存在"
- `500` → "服务器错误，请稍后再试"

