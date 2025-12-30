# 本地构建并部署到服务器

由于服务器构建环境不稳定，推荐使用**本地构建 + 上传部署**的方式。

## 快速开始

### 1. 准备工作

#### 创建生产环境配置文件

```bash
# 复制配置模板
cp .env.production.example .env.production

# 编辑配置文件，填写实际的生产环境信息
vim .env.production
```

需要配置的内容：
- `DATABASE_URL`: 生产环境数据库连接
- `AUTH_SECRET`: 认证密钥（使用 `openssl rand -base64 32` 生成）
- 其他环境变量

#### 配置服务器信息

编辑 `deploy-to-server.sh`，设置服务器连接信息：

```bash
SERVER_USER="root"           # 服务器用户名
SERVER_HOST="your-server-ip"  # 服务器 IP 地址
SERVER_PATH="/var/www/my-doggy-love"  # 应用部署路径
```

### 2. 本地构建

```bash
# 方式一：构建并询问是否部署
./build-local.sh

# 方式二：只构建，不部署
./build-local.sh
# 选择 'n' 不立即部署
```

构建过程：
1. 检查 `.env.production` 文件是否存在
2. 清理旧的构建产物
3. 使用生产环境配置进行构建
4. 生成 `.output` 目录

### 3. 部署到服务器

```bash
# 部署构建产物到服务器
./deploy-to-server.sh
```

部署过程：
1. 检查本地 `.output` 目录是否存在
2. 压缩构建产物为 `output.tar.gz`
3. 通过 SCP 上传到服务器
4. 在服务器上：
   - 停止旧应用（PM2）
   - 备份旧版本
   - 解压新版本
   - 启动新应用（PM2）
5. 清理临时文件

## 手动部署

如果自动部署脚本不适用，可以手动上传：

### 使用 SCP 上传

```bash
# 压缩构建产物
tar -czf output.tar.gz .output

# 上传到服务器
scp output.tar.gz user@server:/tmp/

# 在服务器上解压
ssh user@server
cd /var/www/my-doggy-love
tar -xzf /tmp/output.tar.gz
rm /tmp/output.tar.gz

# 重启应用
pm2 restart my-doggy-love
```

### 使用 SFTP 客户端

使用 FileZilla、WinSCP 等工具：
1. 连接到服务器
2. 上传 `.output` 目录到服务器指定位置
3. SSH 到服务器重启应用

## 常见问题

### Q: 构建失败怎么办？

A:
1. 确保 Node.js 版本为 20.x
2. 删除 `node_modules` 重新安装：`rm -rf node_modules && pnpm install`
3. 检查 `.env.production` 文件格式是否正确
4. 查看构建错误日志

### Q: 无法连接到服务器怎么办？

A:
1. 检查服务器 IP 和端口是否正确
2. 确保 SSH 服务已启动：`systemctl status sshd`
3. 检查防火墙规则
4. 确认 SSH 密钥或密码配置正确

### Q: PM2 命令找不到怎么办？

A: 在服务器上安装 PM2：
```bash
npm install -g pm2
```

### Q: 部署后应用无法启动怎么办？

A: 查看应用日志：
```bash
# 在服务器上
pm2 logs my-doggy-love

# 或直接查看日志文件
tail -f /var/www/my-doggy-love/logs/*.log
```

常见原因：
- 数据库连接失败：检查 `DATABASE_URL` 配置
- 端口被占用：`lsof -i :3000`
- 环境变量缺失：检查 `.env.production` 文件

### Q: 如何回滚到旧版本？

A: 脚本会自动备份旧版本，可以手动恢复：
```bash
# 在服务器上
cd /var/www/my-doggy-love
ls -la .output.backup.*
pm2 stop my-doggy-love
rm -rf .output
mv .output.backup.YYYYMMDD_HHMMSS .output
pm2 restart my-doggy-love
```

## 工作流程对比

### 服务器构建（旧方式，不推荐）

```
本地代码 → Git 推送 → 服务器拉取 → 服务器构建（容易卡住）→ 启动应用
```

问题：
- 服务器资源有限，构建容易卡住
- 构建时间长，容易超时
- 难以调试构建问题

### 本地构建（新方式，推荐）

```
本地代码 → 本地构建 → 压缩上传 → 服务器解压 → 启动应用
```

优势：
- 本地资源充足，构建快速稳定
- 构建失败容易调试
- 服务器只需要解压和启动，速度快
- 可以保留多个历史版本便于回滚

## 优化建议

### 1. 使用 CI/CD 自动化

可以配置 GitHub Actions 或其他 CI 工具自动构建：
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install pnpm
        uses: pnpm/action-setup@v2
      - name: Install dependencies
        run: pnpm install
      - name: Build
        run: pnpm build
      - name: Deploy to server
        uses: easingthemes/ssh-deploy@main
        env:
          SSH_PRIVATE_KEY: ${{ secrets.SERVER_SSH_KEY }}
          REMOTE_HOST: ${{ secrets.SERVER_HOST }}
          REMOTE_USER: ${{ secrets.SERVER_USER }}
          SOURCE: ".output/"
          TARGET: "/var/www/my-doggy-love/"
```

### 2. 增量部署

如果项目很大，可以只上传变更的文件：
```bash
# 使用 rsync 同步
rsync -avz --delete .output/ user@server:/var/www/my-doggy-love/.output/
pm2 restart my-doggy-love -u
```

### 3. 版本管理

建议使用 Git tag 管理版本：
```bash
# 创建版本标签
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# 构建时带上版本信息
./build-local.sh $(git describe --tags)
```

## 监控和日志

### 查看应用状态

```bash
# SSH 到服务器
ssh user@server

# 查看 PM2 状态
pm2 status

# 查看实时日志
pm2 logs my-doggy-love

# 查看资源占用
pm2 monit
```

### 设置日志自动清理

```bash
# 安装 logrotate
sudo apt install logrotate

# 配置 PM2 日志轮转
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

## 总结

使用本地构建 + 上传部署的方式可以：
- ✅ 避免服务器构建卡住的问题
- ✅ 加快部署速度
- ✅ 方便调试和回滚
- ✅ 减少服务器资源消耗

推荐工作流：
1. 本地开发和测试
2. 运行 `./build-local.sh` 构建
3. 运行 `./deploy-to-server.sh` 部署
4. 在服务器上验证应用运行状态
