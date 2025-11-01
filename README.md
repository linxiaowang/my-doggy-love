# My Doggy Love 💕

> 情侣专属的纪念日与日常记录网站

基于"线条小狗"IP（韩国画师 moonlab_studio 笔下的马尔济斯犬"小白"和小金毛"小鸡毛"）设计的温柔记录空间，以简约线条手绘风格与留白构图，帮助情侣记录每一个心动瞬间。

<p align="center">
  <img src="/public/assets/images/couple/couple-1.png" width="200" alt="Lines Dog Couple" />
</p>

## ✨ 主要功能

- 👫 **情侣绑定** - 通过邀请码快速绑定，共享专属记录空间
- 📝 **日常记录** - 记录文字、上传图片/视频，支持标签分类与时间轴展示
- 💬 **评论互动** - 支持多级评论回复，记录互动时光
- 🎯 **愿望清单** - 共同管理愿望，标记完成状态与完成时间
- 💌 **留言板** - 专属留言空间，记录想说的话
- 📅 **纪念日** - 记录重要日子，自动计算倒计时与已完成天数
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

# Uploads
UPLOAD_DIR="public/uploads"

# Auth
AUTH_SECRET="请生成一个随机字符串，至少32位"
```

生成 AUTH_SECRET：
```bash
openssl rand -base64 32
```

## 📦 生产环境部署

详细部署指南请查看 [DEPLOY.md](./DEPLOY.md)

### 快速部署（服务器）

```bash
# 1. 上传代码到服务器
cd /opt/my-doggy-love

# 2. 执行一键部署脚本
chmod +x deploy.sh
./deploy.sh
```

### 手动部署步骤

1. **安装环境依赖**：Node.js、pnpm、Docker、PM2、Nginx
2. **配置环境变量**：创建 `.env` 文件
3. **启动 MySQL**：`docker-compose up -d`
4. **初始化数据库**：`pnpm prisma migrate deploy`
5. **构建项目**：`pnpm build`
6. **启动应用**：`pm2 start ecosystem.config.js`
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
│   │   ├── messages/     # 留言板
│   │   ├── anniversaries/ # 纪念日
│   │   └── user/        # 用户相关（登录、注册、资料、情侣绑定）
│   ├── layouts/         # 布局文件
│   ├── composables/     # 组合式函数
│   └── config/          # 配置文件
├── server/
│   ├── api/             # API 路由
│   │   ├── auth/        # 认证相关
│   │   ├── couple/      # 情侣绑定
│   │   ├── daily/       # 日常记录
│   │   ├── wishes/      # 愿望清单
│   │   ├── messages/    # 留言板
│   │   └── anniversaries/ # 纪念日
│   ├── services/        # 业务服务
│   │   └── storage.ts   # 文件存储服务
│   └── utils/           # 工具函数
│       ├── db.ts        # Prisma 客户端
│       └── auth.ts      # 认证工具
├── prisma/
│   └── schema.prisma    # 数据库模型
├── public/
│   └── assets/
│       └── images/      # 线条小狗 IP 图片资源
├── docker-compose.yml   # MySQL 容器配置
├── ecosystem.config.js  # PM2 配置
└── deploy.sh            # 一键部署脚本
```

## 🎨 设计特色

- **简约线条手绘风** - 温柔留白构图
- **软色调背景** - 米白、浅粉、浅灰蓝
- **可爱互动场景** - 两只小狗（小白 + 小鸡毛）的温馨互动
- **韩系手绘插画** - 线条流畅自然，略有涂鸦感
- **温馨细节** - 时间轴用狗爪连线、空状态用小狗插画、登录页有可爱动画

## 🔐 功能说明

### 用户认证
- 支持邮箱+密码或昵称快捷登录
- 注册仅需昵称，邮箱/密码可后续补充
- 预留微信登录接口（待接入）

### 情侣绑定
- 创建情侣获得邀请码
- 对方输入邀请码加入
- 双方共享所有数据（日常、愿望、留言、纪念日）
- 支持切换绑定（解决双方都创建的情况）

### 日常记录
- 文字 + 图片/视频上传
- 标签分类
- 时间轴展示（今天/本周/更早分组）
- 筛选功能（日期范围 + 标签多选）
- 多级评论与回复

### 愿望清单
- 添加愿望
- 标记完成/重置状态
- 显示完成时间
- 筛选（全部/未完成/已完成）

### 留言板
- 发布留言
- 查看评论与回复
- 支持多级评论互动

### 纪念日
- 创建纪念日
- 自动计算倒计时（今天/还有N天/已过N天）
- 渐变卡片展示
- 编辑与删除

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

### 代码规范

```bash
# 类型检查
pnpm typecheck

# 代码检查
pnpm lint
```

## 📄 License

MIT

## 🙏 致谢

- 线条小狗 IP 设计：moonlab_studio（韩国画师）
- [Nuxt](https://nuxt.com/) - 强大的 Vue 全栈框架
- [UnoCSS](https://github.com/unocss/unocss) - 极速的原子化 CSS 引擎
- [Prisma](https://www.prisma.io/) - 现代数据库工具

---

<p align="center">💕 爱的小事，值得被温柔记录 💕</p>
