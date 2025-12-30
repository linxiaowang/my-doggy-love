# 快速开始 - GitHub Actions CI/CD

## 一键配置（推荐）

运行配置助手：

```bash
./setup-ci-cd.sh
```

脚本会自动：
1. 生成 SSH 密钥
2. 测试服务器连接
3. 显示需要配置的 GitHub Secrets

## 手动配置

### 步骤 1: 生成 SSH 密钥

```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions
```

### 步骤 2: 添加公钥到服务器

```bash
ssh-copy-id -i ~/.ssh/github_actions.pub user@your-server-ip
```

### 步骤 3: 配置 GitHub Secrets

访问：`https://github.com/你的用户名/你的仓库/settings/secrets/actions`

添加以下 Secrets：

| 名称 | 值 |
|------|-----|
| `SERVER_HOST` | 服务器 IP |
| `SERVER_USER` | 用户名 |
| `SSH_PRIVATE_KEY` | 私钥内容 (`cat ~/.ssh/github_actions`) |
| `DATABASE_URL` | 数据库连接 |
| `AUTH_SECRET` | 认证密钥 |
| `NUXT_PUBLIC_VAPID_KEY` | VAPID 公钥 |
| `NUXT_VAPID_PRIVATE_KEY` | VAPID 私钥 |
| `NUXT_VAPID_SUBJECT` | VAPID 主题 |

### 步骤 4: 推送代码

```bash
git add .github/workflows/deploy.yml
git commit -m "chore: 添加 CI/CD 配置"
git push origin main
```

GitHub Actions 会自动构建和部署！

## 查看部署状态

访问：`https://github.com/你的用户名/你的仓库/actions`

## 日常使用

```bash
# 1. 开发代码
vim app/pages/index.vue

# 2. 提交代码
git add .
git commit -m "feat: 新功能"
git push origin main

# 3. GitHub Actions 自动构建和部署
```

就这么简单！推送即部署。🚀

## 详细文档

查看 [CI_CD_SETUP.md](CI_CD_SETUP.md) 了解更多详情。
