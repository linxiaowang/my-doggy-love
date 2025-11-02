# My Doggy Love 💕

> 情侣专属的纪念日与日常记录网站

基于"线条小狗"IP（韩国画师 moonlab_studio 笔下的马尔济斯犬"小白"和小金毛"小鸡毛"）设计的温柔记录空间，以简约线条手绘风格与留白构图，帮助情侣记录每一个心动瞬间。

<p align="center">
  <img src="/public/assets/images/couple/couple-1.png" width="200" alt="Lines Dog Couple" />
</p>

## ✨ 主要功能

- 👫 **情侣绑定** - 通过邀请码快速绑定，共享专属记录空间，支持切换绑定
- 📝 **日常记录** - 记录文字、上传图片/视频，支持预设标签选择与自定义标签，时间轴展示
- 🏷️ **标签系统** - 预设标签快速选择，支持自定义添加，标签筛选功能
- 📸 **媒体管理** - 支持多张图片/视频上传，实时预览，可单独删除
- 💬 **评论互动** - 支持多级评论回复，记录互动时光
- 🎯 **愿望清单** - 共同管理愿望，标记完成状态与完成时间，筛选功能
- 💌 **留言板** - 专属留言空间，记录想说的话，支持评论互动
- 📅 **纪念日** - 记录重要日子，自动计算倒计时与已完成天数，渐变卡片展示
- 😊 **每日状态** - 类似微信状态的每日心情展示，支持预设和自定义状态
- 🔐 **安全认证** - 邮箱密码登录，支持微信登录（可配置），登录状态全局管理
- 🎨 **温柔设计** - 简约线条手绘风格，软色调背景，治愈系体验

## 🛠 技术栈

- **前端框架**: [Nuxt 4](https://nuxt.com/) + Vue 3 + TypeScript
- **构建工具**: Vite
- **样式方案**: [UnoCSS](https://github.com/unocss/unocss) - 原子化 CSS
- **状态管理**: Pinia
- **工具库**: VueUse
- **后端**: Nitro (Nuxt Server Engine)
- **数据库**: MySQL 8.0
- **ORM**: Prisma
- **文件存储**: 本地存储 / 阿里云 OSS（可配置）
- **认证**: JWT Cookie 认证
- **API 管理**: 统一的 API 服务层，自动错误处理
- **PWA**: 支持离线访问
- **部署**: Docker + PM2 + Nginx

## 🚀 快速开始

### 前置要求

- Node.js 20.x+
- pnpm 10.x+
- Docker & Docker Compose (用于 MySQL)
- MySQL 8.0 (或使用 Docker)

### 本地开发

```bash
# 1. 克隆项目
git clone <your-repo-url>
cd my-doggy-love

# 2. 安装依赖
pnpm install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env，设置 DATABASE_URL 等

# 4. 启动 MySQL（使用 Docker）
docker-compose up -d

# 5. 执行数据库迁移
pnpm prisma migrate dev
pnpm prisma generate

# 6. 启动开发服务器
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000)

### 环境变量配置

创建 `.env` 文件：

```env
# Database
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/my_doggy_love"

# Uploads (本地存储)
UPLOAD_DIR="public/uploads"

# Auth
AUTH_SECRET="请生成一个随机字符串，至少32位"

# 微信登录（可选）
WECHAT_APPID="your_wechat_appid"
WECHAT_SECRET="your_wechat_secret"
WECHAT_REDIRECT_URI="https://your-domain.com/api/auth/wechat/callback"

# 阿里云 OSS（可选，配置后使用 OSS 存储，否则使用本地存储）
OSS_ACCESS_KEY_ID="your_access_key_id"
OSS_ACCESS_KEY_SECRET="your_access_key_secret"
OSS_BUCKET="your_bucket_name"
OSS_REGION="oss-cn-hangzhou"
OSS_ENDPOINT="oss-cn-hangzhou.aliyuncs.com"
OSS_CUSTOM_DOMAIN="https://your-domain.com"
OSS_SIGN_URL_EXPIRES=3600
```

生成 AUTH_SECRET：
```bash
openssl rand -base64 32
```

## 📦 生产环境部署

详细部署指南请查看 [DEPLOY.md](./DEPLOY.md)

### 快速部署（服务器）

#### 首次部署（完整设置）

```bash
# 1. 上传代码到服务器
cd /opt/my-doggy-love

# 2. 执行完整部署脚本（包含数据库迁移、环境初始化）
chmod +x deploy.sh
./deploy.sh
```

#### 日常更新部署（推荐）

```bash
# 1. 进入项目目录
cd /opt/my-doggy-love

# 2. 执行快速部署脚本（仅构建和重启应用）
chmod +x quick-deploy.sh
./quick-deploy.sh

# 如果需要安装新的依赖
./quick-deploy.sh --install
```

### 手动部署步骤

1. **安装环境依赖**：Node.js、pnpm、Docker、PM2、Nginx
2. **配置环境变量**：创建 `.env` 文件
3. **启动 MySQL**：`docker-compose up -d`
4. **初始化数据库**：`pnpm prisma migrate deploy`
5. **构建项目**：`pnpm build`
6. **启动应用**：`pm2 start ecosystem.config.cjs`
7. **配置 Nginx**：参考 `nginx.example.conf`

## 📁 项目结构

```
my-doggy-love/
├── app/
│   ├── components/       # Vue 组件
│   │   └── ui/          # UI 组件（Header、卡片、时间轴等）
│   ├── pages/           # 页面路由
│   │   ├── index.vue    # 首页
│   │   ├── daily/       # 日常记录
│   │   ├── wishes/      # 愿望清单
│   │   ├── messages/    # 留言板
│   │   ├── anniversaries/ # 纪念日
│   │   └── user/        # 用户相关（登录、注册、资料、情侣绑定）
│   ├── layouts/         # 布局文件
│   ├── composables/     # 组合式函数
│   ├── middleware/      # 路由中间件（认证检查等）
│   ├── services/        # 服务层
│   │   └── api/        # 统一的 API 管理
│   │       ├── index.ts # 统一错误处理
│   │       ├── auth.ts  # 认证 API
│   │       ├── daily.ts # 日常记录 API
│   │       ├── couple.ts # 情侣 API
│   │       └── ...      # 其他 API 模块
│   └── config/          # 配置文件
├── server/
│   ├── api/             # API 路由
│   │   ├── auth/        # 认证相关（登录、注册、状态、头像等）
│   │   ├── couple/      # 情侣绑定
│   │   ├── daily/       # 日常记录
│   │   ├── wishes/      # 愿望清单
│   │   ├── messages/    # 留言板
│   │   ├── anniversaries/ # 纪念日
│   │   └── upload/      # 文件上传
│   ├── services/        # 业务服务
│   │   └── storage.ts   # 文件存储服务（本地/OSS）
│   └── utils/           # 工具函数
│       ├── db.ts        # Prisma 客户端
│       └── auth.ts      # 认证工具
├── prisma/
│   ├── schema.prisma    # 数据库模型
│   └── migrations/      # 数据库迁移
├── public/
│   ├── assets/
│   │   └── images/      # 线条小狗 IP 图片资源
│   └── uploads/         # 本地文件上传目录（可选，使用 OSS 时不需要）
├── docker-compose.yml   # MySQL 容器配置
├── ecosystem.config.cjs # PM2 配置
├── deploy.sh            # 完整部署脚本
└── quick-deploy.sh      # 快速部署脚本
```

## 🎨 设计特色

- **简约线条手绘风** - 温柔留白构图
- **软色调背景** - 米白、浅粉、浅灰蓝
- **可爱互动场景** - 两只小狗（小白 + 小鸡毛）的温馨互动
- **韩系手绘插画** - 线条流畅自然，略有涂鸦感
- **温馨细节** - 时间轴用狗爪连线、空状态用小狗插画、登录页有可爱动画

## 🔐 功能说明

### 用户认证
- **邮箱密码登录** - 安全的邮箱+密码认证方式
- **注册功能** - 邮箱和密码必填，昵称可选（不填自动生成）
- **微信登录** - 支持微信扫码登录（可配置启用/禁用）
- **登录状态管理** - 全局登录状态检查，未登录自动跳转
- **会话保持** - 使用 Cookie 存储 JWT token

### 用户资料
- **个人信息** - 查看和编辑昵称、头像
- **每日状态** - 类似微信的"我的状态"功能，支持预设和自定义
- **头像上传** - 支持图片上传，自动适配本地存储或 OSS

### 情侣绑定
- **创建情侣** - 创建情侣关系获得邀请码
- **加入情侣** - 输入对方邀请码加入情侣关系
- **切换绑定** - 支持切换绑定到其他情侣（解决双方都创建的情况）
- **邀请码复制** - 一键复制邀请码，支持多种复制方式降级
- **数据共享** - 双方共享所有数据（日常、愿望、留言、纪念日）

### 日常记录
- **内容记录** - 文字 + 多张图片/视频上传
- **媒体预览** - 上传前实时预览，可单独删除
- **标签系统** - 预设标签快速选择，支持自定义添加标签
- **时间轴展示** - 按时间分组（今天/本周/更早）
- **筛选功能** - 日期范围筛选 + 标签多选筛选
- **评论互动** - 支持多级评论与回复

### 愿望清单
- **添加愿望** - 快速添加愿望事项
- **状态管理** - 标记完成/重置状态，显示完成时间
- **筛选功能** - 全部/未完成/已完成三种筛选模式
- **统计显示** - 显示总数量和完成数量

### 留言板
- **发布留言** - 专属留言空间，记录想说的话
- **评论互动** - 支持查看评论与多级回复
- **实时更新** - 评论和回复实时加载

### 纪念日
- **创建纪念日** - 记录重要日子和标题
- **倒计时计算** - 自动计算倒计时（今天/还有N天/已过N天）
- **视觉展示** - 渐变卡片展示，过期纪念日特殊标识
- **编辑删除** - 支持编辑和删除纪念日

## 🏗️ 架构设计

### 统一的 API 管理
所有 API 请求统一管理在 `app/services/api/` 目录下：

- **统一错误处理** - 自动将技术错误转换为友好的中文提示
- **类型安全** - 完整的 TypeScript 类型定义
- **自动认证** - 所有请求自动包含认证 Cookie
- **响应式数据** - 使用 `useApiFetch` 时自动获得响应式状态

### 认证中间件
- **路由保护** - 需要登录的页面自动检查认证状态
- **开发模式优化** - 开发模式下避免热更新导致的频繁跳转
- **友好提示** - 未绑定情侣时显示友好的错误提示

### 文件存储
- **灵活配置** - 支持本地存储和阿里云 OSS
- **自动切换** - 根据环境变量自动选择存储方式
- **签名 URL** - OSS 模式下自动生成签名 URL 保证安全访问

## 📝 开发说明

### 数据库迁移

```bash
# 创建新迁移
pnpm prisma migrate dev --name migration_name

# 生产环境应用迁移
pnpm prisma migrate deploy

# 生成 Prisma Client
pnpm prisma generate
```

### API 开发

所有 API 调用都应通过 `app/services/api/` 目录统一管理：

```typescript
// 使用预定义的 API 函数（推荐）
import { createDailyPost } from '@/services/api/daily'
import { handleApiError } from '@/services/api'

try {
  await createDailyPost({ content: '...', tags: [...] })
} catch (e: any) {
  const message = e?.friendlyMessage || handleApiError(e)
  // 显示友好的错误提示
}
```

详细文档请查看 [app/services/api/README.md](./app/services/api/README.md)

### 代码规范

```bash
# 类型检查
pnpm typecheck

# 代码检查
pnpm lint
```

### 功能开发建议

1. **新增 API** - 在 `app/services/api/` 目录下创建对应的模块文件
2. **页面保护** - 使用 `definePageMeta({ middleware: 'auth' })` 保护需要登录的页面
3. **错误处理** - 使用统一的 `apiFetch` 或 `useApiFetch`，自动获得友好错误提示
4. **响应式数据** - 使用 `useApiFetch` 获取响应式数据，自动管理加载状态

## 📄 License

MIT

## 🙏 致谢

- 线条小狗 IP 设计：moonlab_studio（韩国画师）
- [Nuxt](https://nuxt.com/) - 强大的 Vue 全栈框架
- [UnoCSS](https://github.com/unocss/unocss) - 极速的原子化 CSS 引擎
- [Prisma](https://www.prisma.io/) - 现代数据库工具

---

<p align="center">💕 爱的小事，值得被温柔记录 💕</p>
