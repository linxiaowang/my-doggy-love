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

### 检查应用是否运行

```bash
curl http://localhost:3000
```

### 检查端口占用

```bash
netstat -tlnp | grep 3000
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

