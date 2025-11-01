# 部署指南 - Alibaba Cloud Linux 2

## 前置要求

- Alibaba Cloud Linux 2 服务器
- 至少 2GB RAM（推荐 4GB+）
- 已开放 3000 端口（应用）和 3306 端口（MySQL，仅内网访问）

## 一、服务器环境准备

### 1. 安装 Node.js 和 pnpm

```bash
# 安装 Node.js 20.x
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
yum install -y nodejs

# 验证安装
node -v  # 应显示 v20.x.x
npm -v

# 启用 pnpm corepack
corepack enable
pnpm -v  # 应显示版本号
```

### 2. 安装 Docker 和 Docker Compose（用于 MySQL）

```bash
# 安装 Docker
yum install -y docker
systemctl start docker
systemctl enable docker

# 配置 Docker 镜像加速器（解决国内拉取镜像慢的问题）
mkdir -p /etc/docker
cat > /etc/docker/daemon.json << 'EOF'
{
  "registry-mirrors": [
    "https://registry.cn-hangzhou.aliyuncs.com",
    "https://docker.mirrors.ustc.edu.cn",
    "https://dockerhub.azk8s.cn"
  ]
}
EOF
systemctl daemon-reload
systemctl restart docker

# 验证镜像加速器配置
docker info | grep -A 10 "Registry Mirrors"

# 安装 Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
docker-compose --version
```

### 3. 安装 PM2（进程管理器）

```bash
npm install -g pm2
```

### 4. 安装 Nginx（反向代理）

```bash
yum install -y nginx
systemctl start nginx
systemctl enable nginx
```

## 二、项目部署

### 1. 上传项目代码

```bash
# 在服务器上创建项目目录
mkdir -p /opt/my-doggy-love
cd /opt/my-doggy-love

# 使用 git 或 scp 上传代码
# 方式1：如果使用 git
# git clone <your-repo-url> .

# 方式2：本地打包后上传
# 在本地：tar -czf my-doggy-love.tar.gz --exclude=node_modules --exclude=.nuxt .
# 在服务器：scp my-doggy-love.tar.gz user@server:/opt/my-doggy-love/
# tar -xzf my-doggy-love.tar.gz
```

### 2. 配置环境变量

```bash
cd /opt/my-doggy-love
cp .env.example .env  # 如果存在
nano .env  # 或使用 vi
```

`.env` 文件内容：
```env
# Database
DATABASE_URL="mysql://root:YOUR_MYSQL_PASSWORD@127.0.0.1:3306/my_doggy_love"

# Uploads
UPLOAD_DIR="public/uploads"

# Auth
AUTH_SECRET="请生成一个随机字符串，至少32位"
```

**⚠️ 重要提示：密码 URL 编码**

如果 MySQL 密码中包含特殊字符，必须在 `DATABASE_URL` 中进行 URL 编码：

- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `=` → `%3D`
- `:` → `%3A`
- `/` → `%2F`
- `?` → `%3F`
- ` ` (空格) → `%20` 或 `+`

**示例**：
- 如果密码是 `Lxw@199802`，则应该写成：`mysql://root:Lxw%40199802@127.0.0.1:3306/my_doggy_love`
- 如果密码是 `pass#123`，则应该写成：`mysql://root:pass%23123@127.0.0.1:3306/my_doggy_love`

生成 AUTH_SECRET：
```bash
openssl rand -base64 32
```

### 3. 启动 MySQL

```bash
cd /opt/my-doggy-love

# 修改 docker-compose.yml 中的密码（如果还没改）
# 编辑 MYSQL_ROOT_PASSWORD 和 MYSQL_PASSWORD

# 启动 MySQL
docker-compose up -d

# 验证 MySQL 运行
docker ps | grep mysql
```

### 4. 初始化数据库

```bash
cd /opt/my-doggy-love

# 安装依赖
pnpm install

# 执行数据库迁移
pnpm prisma migrate deploy

# 生成 Prisma Client
pnpm prisma generate
```

### 5. 构建生产版本

```bash
cd /opt/my-doggy-love
pnpm build
```

### 6. 创建上传目录

```bash
mkdir -p /opt/my-doggy-love/public/uploads
chmod -R 755 /opt/my-doggy-love/public/uploads
```

## 三、启动应用

### 使用 PM2 启动（推荐）

```bash
cd /opt/my-doggy-love

# 创建 PM2 配置文件
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'my-doggy-love',
    script: '.output/server/index.mjs',
    cwd: '/opt/my-doggy-love',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/opt/my-doggy-love/logs/pm2-error.log',
    out_file: '/opt/my-doggy-love/logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '500M'
  }]
}
EOF

# 创建日志目录
mkdir -p /opt/my-doggy-love/logs

# 启动应用
pm2 start ecosystem.config.js

# 查看状态
pm2 status

# 设置开机自启
pm2 startup
pm2 save
```

### 查看日志

```bash
pm2 logs my-doggy-love
# 或
tail -f /opt/my-doggy-love/logs/pm2-out.log
```

## 四、配置 Nginx 反向代理

### 编辑 Nginx 配置

```bash
nano /etc/nginx/conf.d/my-doggy-love.conf
```

添加以下内容：

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 替换为你的域名或 IP

    # 上传文件大小限制
    client_max_body_size 50M;

    # 静态文件（上传的图片等）
    location /uploads {
        alias /opt/my-doggy-love/public/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Nuxt 应用
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
}
```

### 测试并重启 Nginx

```bash
nginx -t
systemctl reload nginx
```

## 五、防火墙配置

```bash
# 如果使用 firewalld
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload

# 如果使用 iptables
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
service iptables save
```

## 六、SSL 证书（可选，使用 HTTPS）

如果使用域名，建议配置 Let's Encrypt SSL：

```bash
# 安装 certbot
yum install -y certbot python3-certbot-nginx

# 获取证书（替换为你的域名）
certbot --nginx -d your-domain.com

# 自动续期测试
certbot renew --dry-run
```

## 七、常用维护命令

```bash
# 重启应用
pm2 restart my-doggy-love

# 停止应用
pm2 stop my-doggy-love

# 查看应用状态
pm2 status
pm2 monit

# 查看日志
pm2 logs my-doggy-love --lines 100

# 更新代码后重新部署
cd /opt/my-doggy-love
git pull  # 或重新上传代码
pnpm install
pnpm prisma migrate deploy
pnpm prisma generate
pnpm build
pm2 restart my-doggy-love

# 备份数据库
docker exec my_doggy_love_mysql mysqldump -uroot -pYOUR_PASSWORD my_doggy_love > backup_$(date +%Y%m%d).sql

# 恢复数据库
docker exec -i my_doggy_love_mysql mysql -uroot -pYOUR_PASSWORD my_doggy_love < backup_20241030.sql
```

## 八、故障排查

### 数据库认证失败

**问题**：`Error: P1000: Authentication failed against database server, the provided database credentials for 'root' are not valid.`

#### 可能的原因和解决方案

##### 1. 密码中的特殊字符未进行 URL 编码（最常见）

MySQL 连接字符串中的密码如果包含特殊字符（如 `@`、`#`、`%` 等），需要进行 URL 编码。

**检查 `.env` 文件**：
```bash
cat .env | grep DATABASE_URL
```

**修复方法**：
1. 编辑 `.env` 文件
2. 将密码中的特殊字符进行 URL 编码：
   - `@` → `%40`
   - `#` → `%23`
   - `%` → `%25`
   - 其他特殊字符参见上述列表

**示例**：
- ❌ 错误：`DATABASE_URL="mysql://root:Lxw@199802@127.0.0.1:3306/my_doggy_love"`
- ✅ 正确：`DATABASE_URL="mysql://root:Lxw%40199802@127.0.0.1:3306/my_doggy_love"`

##### 2. MySQL 容器未启动或未就绪

**检查 MySQL 容器状态**：
```bash
docker ps | grep mysql
docker compose logs mysql
```

**如果容器未运行**：
```bash
docker compose up -d
# 等待 MySQL 就绪（可能需要 10-30 秒）
docker exec my_doggy_love_mysql mysqladmin ping -h localhost
```

##### 3. 密码不匹配

**检查 `docker-compose.yml` 中的密码**：
```bash
cat docker-compose.yml | grep MYSQL_ROOT_PASSWORD
```

**检查 `.env` 中的密码是否与 `docker-compose.yml` 一致**（注意 URL 编码）：
```bash
cat .env | grep DATABASE_URL
```

**如果密码不一致**：
- 修改 `docker-compose.yml` 中的 `MYSQL_ROOT_PASSWORD`
- 重启 MySQL 容器：`docker compose down && docker compose up -d`
- 更新 `.env` 中的 `DATABASE_URL`（注意 URL 编码）

##### 4. 测试数据库连接

**使用 Docker 命令测试**：
```bash
docker exec -it my_doggy_love_mysql mysql -uroot -p
# 输入密码：Lxw@199802（不编码，原密码）
```

**使用 Prisma 测试**：
```bash
pnpm prisma migrate status
```

##### 5. 重置 MySQL 密码（最后手段）

如果以上方法都不行，可以重置 MySQL：

```bash
# 停止并删除容器（⚠️ 会删除数据）
docker compose down -v

# 修改 docker-compose.yml 中的密码

# 重新启动
docker compose up -d

# 等待就绪后更新 .env 文件
```

### Docker 镜像拉取超时

**问题**：`Error Get "https://registry-1.docker.io/v2/": net/http: request canceled`

#### 方案 1：配置并验证 Docker 镜像加速器

```bash
# 1. 创建或编辑 Docker daemon 配置
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json > /dev/null << 'EOF'
{
  "registry-mirrors": [
    "https://registry.cn-hangzhou.aliyuncs.com",
    "https://docker.mirrors.ustc.edu.cn",
    "https://dockerhub.azk8s.cn"
  ]
}
EOF

# 2. 重启 Docker
sudo systemctl daemon-reload
sudo systemctl restart docker

# 3. 验证配置是否生效（必须能看到 Registry Mirrors）
docker info | grep -A 10 "Registry Mirrors"

# 4. 如果看不到 Registry Mirrors，检查配置文件
sudo cat /etc/docker/daemon.json

# 5. 手动拉取镜像测试
docker pull mysql:8.0
```

#### 方案 2：直接使用国内镜像仓库（推荐）

如果镜像加速器配置后仍无法拉取，直接使用国内镜像仓库：

```bash
# 使用阿里云镜像仓库
docker pull registry.cn-hangzhou.aliyuncs.com/library/mysql:8.0
docker tag registry.cn-hangzhou.aliyuncs.com/library/mysql:8.0 mysql:8.0

# 或者使用华为云镜像仓库
docker pull swr.cn-north-4.myhuaweicloud.com/library/mysql:8.0
docker tag swr.cn-north-4.myhuaweicloud.com/library/mysql:8.0 mysql:8.0

# 验证镜像已存在
docker images | grep mysql

# 然后启动容器
docker compose up -d
```

#### 方案 3：使用快速修复脚本（推荐）

项目提供了自动修复脚本，会自动尝试多种方案：

```bash
# 在项目根目录执行
chmod +x fix-docker-mirror.sh
./fix-docker-mirror.sh
```

脚本会自动：
1. 检查并配置 Docker 镜像加速器
2. 尝试从镜像加速器拉取
3. 如果失败，自动尝试从阿里云镜像仓库拉取
4. 如果仍失败，尝试从华为云镜像仓库拉取
5. 自动打标签，确保镜像可用

#### 方案 4：诊断 Docker 配置

```bash
# 1. 检查 Docker 服务状态
sudo systemctl status docker

# 2. 检查 Docker 配置
sudo cat /etc/docker/daemon.json

# 3. 检查 Docker 信息（查看是否有镜像加速器）
docker info

# 4. 测试网络连接
curl -I https://registry-1.docker.io/v2/

# 5. 如果网络不通，可能需要配置代理或使用方案 2
```

### 检查应用是否运行

```bash
curl http://localhost:3000
```

### MySQL 端口被占用

**问题**：`Error starting userland proxy: listen tcp4 0.0.0.0:3306: bind: address already in use`

**解决方案**：

#### 方案 1：检查并停止占用端口的服务

```bash
# 1. 检查 3306 端口占用情况
sudo lsof -i :3306
# 或
sudo netstat -tlnp | grep 3306
# 或
sudo ss -tlnp | grep 3306

# 2. 如果是旧的 Docker 容器
docker ps -a | grep mysql
docker rm -f $(docker ps -a | grep mysql | awk '{print $1}')

# 3. 如果是系统 MySQL 服务
sudo systemctl stop mysqld  # CentOS/RHEL
sudo systemctl stop mysql    # Ubuntu/Debian

# 4. 重新启动 Docker MySQL
docker compose up -d
```

#### 方案 2：修改为其他端口

如果 3306 端口必须被其他服务使用，可以修改 `docker-compose.yml`：

```yaml
services:
  mysql:
    # ... 其他配置 ...
    ports:
      - "3307:3306"  # 改为 3307（外部端口）:3306（容器内部端口）
```

然后更新 `.env` 文件中的 `DATABASE_URL`：

```env
DATABASE_URL="mysql://root:YOUR_PASSWORD@127.0.0.1:3307/my_doggy_love"
```

### 检查端口占用

```bash
# 检查应用端口
netstat -tlnp | grep 3000
ss -tlnp | grep 3000

# 检查 MySQL 端口
netstat -tlnp | grep 3306
ss -tlnp | grep 3306
```

### 检查 MySQL 连接

```bash
docker exec -it my_doggy_love_mysql mysql -uroot -p
```

### 查看详细错误

```bash
pm2 logs my-doggy-love --err
```

## 九、性能优化建议

1. **开启 Nginx 缓存**（在配置文件中添加）
2. **使用 CDN** 加速静态资源
3. **定期清理日志**：
   ```bash
   pm2 flush  # 清空 PM2 日志
   ```
4. **监控磁盘空间**（上传文件会占用空间）

## 十、安全建议

1. 定期更新系统和依赖
2. 使用强密码（MySQL、AUTH_SECRET）
3. 限制 MySQL 3306 端口仅内网访问
4. 定期备份数据库
5. 监控异常访问日志

