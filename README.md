# My Doggy Love

> 情侣专属的纪念日与日常记录空间

用「线条小狗」气质串起恋爱里的小事：日常、愿望、留言、纪念日，还有一只能一起聊天的小狗。

<p align="center">
  <img src="public/assets/stickers/line-dog/love.gif" width="160" alt="Line Dog" />
</p>

## 功能

- **情侣绑定** — 邀请码绑定，共享记录空间
- **日常记录** — 文字 / 图片 / 视频，标签与时间轴
- **愿望清单** — 共同许愿，标记完成
- **留言板** — 想说的话与多级评论
- **纪念日** — 倒计时 / 已过天数，首页提醒卡片
- **黄历日历** — 农历节气、法定节假日（休/班），支持双休与大小周
- **实时聊天** — WebSocket 聊天，支持 AI 助手
- **每日状态** — 类似微信状态的心情展示
- **账号体系** — 邮箱登录，可选微信登录；PWA 可离线访问

## 技术栈

| 层 | 选型 |
| --- | --- |
| 前端 | Nuxt 4 · Vue 3 · TypeScript · Tailwind CSS 4 · shadcn-nuxt / Reka UI |
| 状态 | Pinia · VueUse |
| 后端 | Nitro · Prisma · MySQL 8 |
| 存储 | 本地上传 / 阿里云 OSS（可选） |
| 部署 | GitHub Actions · PM2 · Nginx · Docker（MySQL） |

## 快速开始

**环境**：Node.js 20+ · pnpm 12+ · Docker（可选，跑 MySQL）

```bash
git clone https://github.com/linxiaowang/my-doggy-love.git
cd my-doggy-love
pnpm install

# 配置环境变量（见下方）
cp .env.production .env   # 或自行新建 .env

docker compose up -d      # 启动 MySQL
pnpm prisma migrate dev
pnpm prisma generate

pnpm dev                  # http://localhost:3001
```

### 环境变量

最低需要：

```env
DATABASE_URL="mysql://root:password@localhost:3306/my_doggy_love"
AUTH_SECRET="至少 32 位的随机串"
UPLOAD_DIR="public/uploads"
```

常用可选项：

```env
# Web Push
NUXT_PUBLIC_VAPID_KEY=
NUXT_VAPID_PRIVATE_KEY=
NUXT_VAPID_SUBJECT=mailto:you@example.com

# 微信登录
WECHAT_APPID=
WECHAT_SECRET=
WECHAT_REDIRECT_URI=https://doggylove.fun/api/auth/wechat/callback

# 阿里云 OSS（不配则用本地上传）
OSS_ACCESS_KEY_ID=
OSS_ACCESS_KEY_SECRET=
OSS_BUCKET=
OSS_REGION=oss-cn-hangzhou
OSS_ENDPOINT=oss-cn-hangzhou.aliyuncs.com

# AI 聊天（智谱）
ZHIPU_API_KEY=
```

生成 `AUTH_SECRET`：

```bash
openssl rand -base64 32
```

## 部署

推送到 `main` 会触发 GitHub Actions 构建并部署到服务器。

首次请配置 Secrets，详见 [QUICK_START.md](./QUICK_START.md)，或运行：

```bash
./setup-ci-cd.sh
```

部署状态：[Actions](https://github.com/linxiaowang/my-doggy-love/actions)

手动部署概要：

1. 服务器准备 Node 20、pnpm、Docker、PM2、Nginx
2. 配置 `.env`，`docker compose up -d`
3. `pnpm prisma migrate deploy && pnpm build`
4. `pm2 start ecosystem.config.cjs`

## 目录结构

```
app/
  components/     # 业务组件 + ui（shadcn）
  pages/          # 路由页面（daily / wishes / chat / …）
  services/api/   # 前端 API 封装
  composables/
server/
  api/            # Nitro 接口
  utils/          # db、auth 等
prisma/           # schema + migrations
public/assets/    # 贴纸、插画等静态资源
.github/workflows # CI/CD
```

## 开发约定

```bash
pnpm typecheck
pnpm lint
```

- 新增接口：优先在 `app/services/api/` 封装，统一走错误处理
- 需登录页面：`definePageMeta({ middleware: 'auth' })`
- 数据库变更：`pnpm prisma migrate dev --name xxx`

更多 API 用法见 [app/services/api/README.md](./app/services/api/README.md)

## License

[MIT](./LICENSE) © [linxiaowang](https://github.com/linxiaowang)

## 致谢

- 线条小狗气质参考自 moonlab_studio 笔下的小白 / 小鸡毛
- [Nuxt](https://nuxt.com/) · [Prisma](https://www.prisma.io/) · [Reka UI](https://reka-ui.com/) · [Tailwind CSS](https://tailwindcss.com/)

---

<p align="center">爱的小事，值得被温柔记录</p>
