# GitHub Actions CI/CD 部署方案

使用 GitHub Actions 自动构建和部署，完全解决本地构建和上传问题。

## 工作流程

```
Git 推送 → GitHub Actions 构建 → 自动部署到服务器
```

1. **推送代码** - `git push` 到 main 分支
2. **自动构建** - GitHub Actions 在云端构建项目
3. **自动部署** - 通过 SSH 自动部署到服务器

## 配置步骤

### 1. 准备服务器

确保服务器已安装：
- Node.js 20.x
- PM2: `npm install -g pm2`
- SSH 服务

### 2. 生成 SSH 密钥

在**本地**生成 SSH 密钥对：

```bash
# 生成密钥（如果没有）
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions

# 查看公钥
cat ~/.ssh/github_actions.pub
```

### 3. 配置服务器 SSH

将公钥添加到服务器：

```bash
# 方式一：使用 ssh-copy-id
ssh-copy-id -i ~/.ssh/github_actions.pub user@server

# 方式二：手动添加
cat ~/.ssh/github_actions.pub | ssh user@server 'cat >> ~/.ssh/authorized_keys'

# 测试连接
ssh -i ~/.ssh/github_actions user@server
```

### 4. 配置 GitHub Secrets

在 GitHub 仓库中配置 Secrets：

**路径**: Settings → Secrets and variables → Actions → New repository secret

#### 需要配置的 Secrets：

| Secret 名称 | 说明 | 示例 |
|------------|------|------|
| `SERVER_HOST` | 服务器 IP 地址 | `123.45.67.89` |
| `SERVER_USER` | SSH 用户名 | `root` |
| `SERVER_PORT` | SSH 端口（可选） | `22` |
| `SSH_PRIVATE_KEY` | SSH 私钥 | 整个私钥文件内容 |
| `DATABASE_URL` | 数据库连接 | `mysql://user:pass@host:3306/db` |
| `AUTH_SECRET` | 认证密钥 | 使用 `openssl rand -base64 32` 生成 |
| `NUXT_PUBLIC_VAPID_KEY` | VAPID 公钥 | 从 .env.production 复制 |
| `NUXT_VAPID_PRIVATE_KEY` | VAPID 私钥 | 从 .env.production 复制 |
| `NUXT_VAPID_SUBJECT` | VAPID 主题 | `mailto:admin@example.com` |

#### SSH_PRIVATE_KEY 获取方法：

```bash
# 查看私钥内容
cat ~/.ssh/github_actions

# 复制整个输出，包括：
# -----BEGIN OPENSSH PRIVATE KEY-----
# ...
# -----END OPENSSH PRIVATE KEY-----
```

### 5. 测试部署

#### 方式一：自动触发

```bash
# 推送代码到 main 分支，自动触发构建和部署
git add .
git commit -m "test deployment"
git push origin main
```

#### 方式二：手动触发

1. 访问 GitHub 仓库
2. 点击 "Actions" 标签
3. 选择 "Build and Deploy" workflow
4. 点击 "Run workflow" 按钮
5. 选择分支并运行

### 6. 监控部署进度

在 GitHub Actions 页面查看：
- 实时日志
- 构建进度
- 部署状态

## 优势

### ✅ 相比本地构建 + 上传

- ✅ 不占用本地资源
- ✅ 不需要手动上传大文件
- ✅ 自动化程度高，推送即部署
- ✅ 构建环境稳定

### ✅ 相比服务器构建

- ✅ 不消耗服务器资源
- ✅ 不会卡住（GitHub Actions 资源充足）
- ✅ 构建速度快
- ✅ 免费额度充足（每月 2000 分钟）

## 工作流说明

### Build Job

1. 检出代码
2. 安装 Node.js 20
3. 安装 pnpm
4. 缓存依赖
5. 安装项目依赖
6. 从 Secrets 创建 `.env.production`
7. 构建项目（`pnpm build`）
8. 打包构建产物
9. 上传 artifact

### Deploy Job

1. 下载构建产物
2. 通过 SSH 连接到服务器
3. 停止旧应用
4. 备份旧版本
5. 解压新版本
6. 设置权限
7. 启动新应用（PM2）

## 本地开发流程

### 日常开发

```bash
# 1. 开发代码
vim app/pages/index.vue

# 2. 本地测试
pnpm dev

# 3. 提交代码
git add .
git commit -m "feat: 新功能"

# 4. 推送到 GitHub
git push origin main

# 5. GitHub Actions 自动构建和部署
# 访问 https://github.com/your-repo/actions 查看
```

### 查看部署状态

```bash
# 命令行查看
gh run list

# 查看最新运行
gh run view

# 查看实时日志
gh run watch
```

## 常见问题

### Q: 构建失败怎么办？

A:
1. 检查 GitHub Actions 日志
2. 确认所有 Secrets 已正确配置
3. 检查 `DATABASE_URL` 格式是否正确
4. 查看 Build Job 的错误信息

### Q: 部署失败怎么办？

A:
1. 检查 SSH 连接是否正常
2. 确认 `SSH_PRIVATE_KEY` 正确
3. 检查服务器 PM2 是否已安装
4. 查看 Deploy Job 的错误信息

### Q: 如何手动部署？

A:
1. 访问 GitHub Actions 页面
2. 点击 "Run workflow"
3. 选择分支并运行

### Q: 如何回滚？

A:
```bash
# 在服务器上
cd /var/www/my-doggy-love

# 查看备份
ls -lh /var/backups/my-doggy-love/

# 回滚到指定版本
pm2 stop my-doggy-love
rm -rf .output
cp -r /var/backups/my-doggy-love/.output.YYYYMMDD_HHMMSS .output
pm2 restart my-doggy-love
```

或者通过 Git 回滚：
```bash
# 回滚到指定 commit
git revert <commit-hash>
git push origin main
# GitHub Actions 会自动部署回滚版本
```

### Q: 如何调试 SSH 连接？

A:
```bash
# 在本地测试 SSH 连接
ssh -i ~/.ssh/github_actions user@server

# 如果连接成功，检查密钥权限
chmod 600 ~/.ssh/github_actions
```

### Q: 免费额度够用吗？

A:
GitHub Actions 免费额度：
- Public 仓库：无限制
- Private 仓库：每月 2000 分钟
- 本项目构建约需 5-10 分钟
- 每月可部署约 200-400 次

## 进阶配置

### 1. 多环境部署

创建多个 workflow 文件：
- `.github/workflows/deploy-staging.yml` - 测试环境
- `.github/workflows/deploy-production.yml` - 生产环境

### 2. 手动批准部署

```yaml
deploy:
  needs: build
  runs-on: ubuntu-latest
  environment:
    name: production
    url: https://your-domain.com
  # ... 其余配置
```

### 3. 通知部署结果

添加 Slack/Email 通知：
```yaml
- name: Send notification
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: '部署完成'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### 4. 并行部署到多台服务器

```yaml
deploy:
  strategy:
    matrix:
      server: [server1, server2, server3]
  steps:
    - name: Deploy to ${{ matrix.server }}
      uses: appleboy/ssh-action@v1.0.0
      with:
        host: ${{ secrets[format('SERVER_{0}_HOST', matrix.server)] }
        # ...
```

## 文件说明

- `.github/workflows/deploy.yml` - GitHub Actions 工作流配置
- `build-local.sh` - 本地构建脚本（保留用于本地测试）
- `server-pull-deploy.sh` - 服务器部署脚本（保留用于手动部署）

## 总结

使用 GitHub Actions CI/CD 可以：
- ✅ 完全自动化构建和部署
- ✅ 不占用本地和服务器资源
- ✅ 推送代码即可部署
- ✅ 可视化部署状态
- ✅ 自动备份和回滚
- ✅ 免费额度充足

**推荐工作流**：
1. 本地开发测试
2. 推送到 GitHub
3. 自动构建和部署
4. 访问网站验证
