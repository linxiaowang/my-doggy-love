# 快速开始 - GitHub Actions CI/CD

## ❗ 重要：配置 GitHub Secrets

在第一次部署前，**必须**配置 GitHub Secrets。否则会报错 `missing server host`。

### 配置步骤

1. **访问 Secrets 配置页面**

   ```
   https://github.com/你的用户名/my-doggy-love/settings/secrets/actions
   ```

2. **点击 "New repository secret" 添加以下 Secrets**

### 必需的 Secrets 配置

| Secret 名称 | 说明 | 如何获取 | 示例值 |
|------------|------|----------|--------|
| `SERVER_HOST` | 服务器 IP 地址 | 你的服务器 IP | `123.45.67.89` |
| `SERVER_USER` | SSH 用户名 | 服务器用户名 | `root` |
| `SSH_PRIVATE_KEY` | SSH 私钥 | 见下方说明 | `-----BEGIN...` |
| `DATABASE_URL` | 数据库连接 | 从 .env.production 复制 | `mysql://...` |
| `AUTH_SECRET` | 认证密钥 | 从 .env.production 复制 | `abc123...` |
| `NUXT_PUBLIC_VAPID_KEY` | VAPID 公钥 | 从 .env.production 复制 | `BBGh...` |
| `NUXT_VAPID_PRIVATE_KEY` | VAPID 私钥 | 从 .env.production 复制 | `5lMK...` |
| `NUXT_VAPID_SUBJECT` | VAPID 主题 | 从 .env.production 复制 | `mailto:...` |

### 如何获取 SSH_PRIVATE_KEY

**⚠️ 重要提示：SSH 私钥必须完整且格式正确**

**方式一：使用诊断脚本（推荐）**

```bash
./check-ssh-key.sh
```

脚本会：
- 检查并修复密钥权限
- 验证密钥格式
- 显示完整的私钥内容（可直接复制到 GitHub Secrets）

**方式二：手动生成**

```bash
# 1. 生成密钥（使用 ED25519 算法）
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions

# 2. 设置正确的权限
chmod 600 ~/.ssh/github_actions

# 3. 查看私钥（完整复制，包括 BEGIN 和 END 行）
cat ~/.ssh/github_actions

# 输出示例：
# -----BEGIN OPENSSH PRIVATE KEY-----
# b3BlbnNzaC1rZXktdjEAAAAABG5vbmUA...
# ...
# -----END OPENSSH PRIVATE KEY-----

# 4. 添加公钥到服务器
ssh-copy-id -i ~/.ssh/github_actions.pub user@your-server-ip
```

**⚠️ 常见错误和解决方法：**

❌ 错误：`ssh: no key found`
- **原因**：SSH_PRIVATE_KEY 内容不完整或格式错误
- **解决**：确保复制了完整的私钥，包括 `-----BEGIN` 和 `-----END` 行

❌ 错误：`ssh: unable to authenticate`
- **原因**：公钥未添加到服务器或私钥权限错误
- **解决**：
  ```bash
  # 确保私钥权限正确
  chmod 600 ~/.ssh/github_actions

  # 重新添加公钥到服务器
  ssh-copy-id -i ~/.ssh/github_actions.pub user@your-server-ip
  ```

### 如何获取环境变量

如果已有 `.env.production` 文件：

```bash
# 查看环境变量
cat .env.production

# 复制对应的值到 GitHub Secrets
```

### 可选的 Secrets

| Secret 名称 | 说明 | 默认值 |
|------------|------|--------|
| `SERVER_PORT` | SSH 端口 | `22` |

## 一键配置（推荐）

```bash
./setup-ci-cd.sh
```

脚本会自动：
1. 生成 SSH 密钥
2. 测试服务器连接
3. 显示需要配置的 GitHub Secrets

## 配置完成后

### 测试配置

1. 访问 Actions 页面
2. 选择 "Check Secrets" workflow
3. 点击 "Run workflow"
4. 查看结果，确认所有 Secrets 都已配置

### 开始部署

```bash
git add .github/workflows/
git commit -m "chore: 添加 CI/CD 配置"
git push origin main
```

GitHub Actions 会自动构建和部署！

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

## 查看部署状态

访问：`https://github.com/你的用户名/my-doggy-love/actions`

## 详细文档

查看 [CI_CD_SETUP.md](CI_CD_SETUP.md) 了解更多详情。
