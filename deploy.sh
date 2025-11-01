#!/bin/bash
# 快速部署脚本 - 在服务器上执行

set -e

echo "🚀 开始部署 My Doggy Love..."

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未安装 Node.js，请先安装 Node.js 20.x"
    exit 1
fi

# 检查 pnpm
if ! command -v pnpm &> /dev/null; then
    echo "⚠️  启用 pnpm corepack..."
    corepack enable
fi

# 检查 .env 文件
if [ ! -f .env ]; then
    echo "⚠️  未找到 .env 文件，正在创建..."
    cat > .env << EOF
DATABASE_URL="mysql://root:Lxw@199802@127.0.0.1:3306/my_doggy_love"
UPLOAD_DIR="public/uploads"
AUTH_SECRET="$(openssl rand -base64 32)"
EOF
    echo "✅ .env 文件已创建，请检查配置"
fi

# 安装依赖
echo "📦 安装依赖..."
pnpm install --frozen-lockfile

# 配置 Docker 镜像加速器（如果还没配置，解决拉取镜像慢的问题）
if command -v docker &> /dev/null; then
    if [ ! -f /etc/docker/daemon.json ] || ! docker info 2>/dev/null | grep -q "registry.cn-hangzhou.aliyuncs.com"; then
        echo "⚙️  配置 Docker 镜像加速器..."
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
        sudo systemctl daemon-reload
        sudo systemctl restart docker
        echo "✅ Docker 镜像加速器已配置，请重新运行此脚本"
        exit 0
    fi
fi

# 启动 MySQL（如果还没启动）
if ! docker ps | grep -q my_doggy_love_mysql; then
    echo "🐬 启动 MySQL..."
    
    # 先尝试手动拉取镜像（避免 compose 超时）
    if ! docker images | grep -q "mysql.*8.0"; then
        echo "📥 拉取 MySQL 8.0 镜像..."
        if ! docker pull mysql:8.0; then
            echo "❌ 镜像拉取失败，尝试使用国内镜像源..."
            echo "   请手动执行以下命令之一："
            echo ""
            echo "   方案 1: 使用阿里云镜像仓库"
            echo "   docker pull registry.cn-hangzhou.aliyuncs.com/library/mysql:8.0"
            echo "   docker tag registry.cn-hangzhou.aliyuncs.com/library/mysql:8.0 mysql:8.0"
            echo ""
            echo "   方案 2: 检查并修复 Docker 镜像加速器配置"
            echo "   sudo cat /etc/docker/daemon.json"
            echo "   sudo systemctl restart docker"
            echo ""
            echo "   方案 3: 使用华为云镜像仓库"
            echo "   docker pull swr.cn-north-4.myhuaweicloud.com/library/mysql:8.0"
            echo "   docker tag swr.cn-north-4.myhuaweicloud.com/library/mysql:8.0 mysql:8.0"
            exit 1
        fi
    fi
    
    # 启动容器
    docker compose up -d
    
    # 检查容器是否启动成功
    if docker ps | grep -q my_doggy_love_mysql; then
        echo "⏳ 等待 MySQL 就绪..."
        sleep 5
    else
        echo "❌ MySQL 容器启动失败，查看日志："
        docker compose logs mysql
        exit 1
    fi
fi

# 数据库迁移
echo "🗄️  执行数据库迁移..."
pnpm prisma migrate deploy
pnpm prisma generate

# 创建上传目录
echo "📁 创建上传目录..."
mkdir -p public/uploads
chmod -R 755 public/uploads

# 构建项目
echo "🔨 构建项目..."
pnpm build

# 创建日志目录
mkdir -p logs

# 使用 PM2 启动（如果已安装）
if command -v pm2 &> /dev/null; then
    echo "🚀 使用 PM2 启动应用..."
    pm2 delete my-doggy-love 2>/dev/null || true
    pm2 start ecosystem.config.js
    pm2 save
    echo "✅ 应用已启动，使用 'pm2 status' 查看状态"
    echo "📝 查看日志: pm2 logs my-doggy-love"
else
    echo "⚠️  PM2 未安装，使用 node 直接启动..."
    echo "   建议安装 PM2: npm install -g pm2"
    echo "   然后运行: pm2 start ecosystem.config.js"
    NODE_ENV=production node .output/server/index.mjs
fi

echo "🎉 部署完成！"
echo "   应用运行在: http://localhost:3000"
echo "   配置 Nginx 后可通过域名访问"

