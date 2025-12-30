# 本地构建 + Git 部署方案

由于服务器构建环境不稳定，采用**本地构建 + Git 部署**的方式。

## 工作流程

```
本地构建 → 提交到 Git → 服务器 git pull → 运行部署脚本
```

1. **本地构建** - 在本地（Mac）执行构建，生成 `.output` 目录
2. **提交到 Git** - 将 `.output` 目录提交到 Git 仓库
3. **服务器拉取** - 在服务器上 `git pull` 拉取最新代码（包括构建产物）
4. **服务器部署** - 在服务器上运行部署脚本，自动部署应用

## 快速开始

### 第一次使用

#### 1. 创建生产环境配置文件

```bash
# 在本地
cp .env.production.example .env.production
vim .env.production

# 填写生产环境数据库连接等信息
```

#### 2. 在服务器上首次部署

```bash
# SSH 到服务器
ssh user@server

# 克隆或拉取代码
cd /var/www/my-doggy-love
git pull

# 创建生产环境变量（如果本地有 .env.production，会自动复制）
# 或者手动创建
cp .env.production.example .env
vim .env  # 填写实际的生产环境配置

# 运行部署脚本
bash server-pull-deploy.sh
```

### 日常部署流程

#### 本地操作

```bash
# 1. 本地构建
./build-local.sh

# 2. 提交到 Git（脚本会提示）
git add .output
git commit -m "chore: 更新构建产物"
git push
```

#### 服务器操作

```bash
# SSH 到服务器
ssh user@server

# 进入项目目录
cd /var/www/my-doggy-love

# 拉取最新代码（包括构建产物）
git pull

# 运行部署脚本
bash server-pull-deploy.sh
```

## 脚本说明

### build-local.sh（本地运行）

本地构建脚本，执行以下操作：
1. 检查 `.env.production` 文件是否存在
2. 清理旧的构建产物
3. 执行 `pnpm build` 生成 `.output` 目录
4. 显示构建产物大小
5. 询问是否提交到 Git

### server-pull-deploy.sh（服务器运行）

服务器部署脚本，执行以下操作：
1. 检查 `.output` 目录是否存在
2. 停止旧应用（PM2）
3. 备份旧版本到 `/var/backups/my-doggy-love/`
4. 复制新的 `.output` 到应用目录
5. 设置权限
6. 启动新应用（PM2）
7. 清理临时文件

## 注意事项

### 1. .output 目录大小

构建产物约 50-100MB，提交到 Git 会增加仓库大小。

**优点**：
- ✅ 服务器不需要构建，直接拉取即可
- ✅ 版本可追溯，可以快速回滚
- ✅ 部署速度快

**缺点**：
- ❌ Git 仓库体积会变大
- ❌ clone/pull 时间会增加

### 2. Git LFS 方案（可选）

如果不想将二进制文件提交到 Git，可以使用 Git LFS：

```bash
# 安装 Git LFS
git lfs install

# 跟踪 .output 目录
git lfs track ".output/**"
git add .gitattributes
git commit -m "chore: 添加 Git LFS 配置"
```

### 3. 备份策略

部署脚本会自动备份旧版本，保留最近 5 个版本：

```bash
# 查看备份
ls -lh /var/backups/my-doggy-love/

# 手动回滚
cd /var/www/my-doggy-love
pm2 stop my-doggy-love
rm -rf .output
cp -r /var/backups/my-doggy-love/.output.20251230_120000 .output
pm2 restart my-doggy-love
```

### 4. 环境变量

- `.env.production` - 本地构建时使用的配置（不提交到 Git）
- `.env` - 服务器运行时的配置（需要手动创建）

两者应该保持一致，但注意不要将敏感信息提交到 Git。

## 常见问题

### Q: 构建失败怎么办？

A:
1. 确保 Node.js 版本为 20.x
2. 删除 `node_modules` 重新安装：`rm -rf node_modules && pnpm install`
3. 检查 `.env.production` 文件格式是否正确
4. 查看构建错误日志

### Q: 服务器拉取后找不到 .output？

A:
1. 检查本地是否已提交 `.output` 到 Git
2. 在服务器上运行 `git status` 查看是否有未追踪的文件
3. 确保 `.gitignore` 没有忽略 `.output` 目录

### Q: PM2 命令找不到？

A: 在服务器上安装 PM2：
```bash
npm install -g pm2
```

### Q: 部署后应用无法启动？

A: 查看应用日志：
```bash
# 在服务器上
pm2 logs my-doggy-love

# 或直接查看日志文件
tail -f /var/www/my-doggy-love/logs/*.log
```

常见原因：
- 数据库连接失败：检查 `.env` 中的 `DATABASE_URL`
- 端口被占用：`lsof -i :3000`
- 环境变量缺失：检查服务器上的 `.env` 文件

### Q: 如何回滚到旧版本？

A:
```bash
# 在服务器上
cd /var/www/my-doggy-love

# 查看备份版本
ls -lh /var/backups/my-doggy-love/

# 停止应用
pm2 stop my-doggy-love

# 恢复旧版本
rm -rf .output
cp -r /var/backups/my-doggy-love/.output.YYYYMMDD_HHMMSS .output

# 重启应用
pm2 restart my-doggy-love
```

或者通过 Git 回滚：
```bash
# 查看历史版本
git log --oneline

# 回滚到指定版本
git checkout <commit-hash>
bash server-pull-deploy.sh
```

## 优化建议

### 1. 自动化部署（可选）

可以在本地创建一键部署脚本：

```bash
#!/bin/bash
# quick-deploy.sh - 本地一键部署脚本

echo "🚀 开始一键部署..."

# 本地构建
./build-local.sh

# 提交到 Git
git add .output
git commit -m "chore: 更新构建产物"
git push

# 在服务器上拉取并部署
ssh user@server 'cd /var/www/my-doggy-love && git pull && bash server-pull-deploy.sh'

echo "✅ 部署完成！"
```

### 2. 使用 Git Hooks（可选）

配置 Git push 后自动在服务器上部署：

```bash
# 在服务器的 Git 仓库中配置 post-merge hook
cd /var/www/my-doggy-love/.git/hooks
cat > post-merge << 'EOF'
#!/bin/bash
bash /var/www/my-doggy-love/server-pull-deploy.sh
EOF
chmod +x post-merge
```

### 3. 多环境支持

可以为不同环境创建不同的配置：

```bash
.env.local      # 本地开发环境
.env.staging    # 测试环境
.env.production # 生产环境
```

## 总结

使用本地构建 + Git 部署的方式可以：
- ✅ 避免服务器构建卡住的问题
- ✅ 本地资源充足，构建快速稳定
- ✅ 服务器只需要拉取和部署，速度快
- ✅ 支持版本回滚
- ✅ 部署流程简单清晰

**推荐工作流**：
1. 本地开发和测试
2. 运行 `./build-local.sh` 构建
3. 提交到 Git：`git push`
4. 服务器上运行：`git pull && bash server-pull-deploy.sh`
5. 验证应用运行状态
