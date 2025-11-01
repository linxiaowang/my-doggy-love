#!/bin/bash
# Docker 镜像拉取问题快速修复脚本

set -e

echo "🔧 Docker 镜像拉取问题修复工具"
echo "================================"
echo ""

# 检查是否已配置镜像加速器
echo "1️⃣ 检查 Docker 镜像加速器配置..."
if docker info 2>/dev/null | grep -q "Registry Mirrors"; then
    echo "✅ 已配置镜像加速器"
    docker info | grep -A 5 "Registry Mirrors"
else
    echo "⚠️  未检测到镜像加速器配置"
    
    # 配置镜像加速器
    echo ""
    echo "2️⃣ 正在配置 Docker 镜像加速器..."
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
    echo "✅ Docker 镜像加速器已配置并重启"
    sleep 2
    
    # 再次验证
    if docker info 2>/dev/null | grep -q "Registry Mirrors"; then
        echo "✅ 配置验证成功"
        docker info | grep -A 5 "Registry Mirrors"
    else
        echo "❌ 配置可能未生效，请检查 Docker 服务"
        exit 1
    fi
fi

echo ""
echo "3️⃣ 尝试拉取 MySQL 镜像..."

# 方案 1: 尝试使用镜像加速器拉取
if docker pull mysql:8.0 2>&1 | tee /tmp/docker-pull.log; then
    echo "✅ 镜像拉取成功！"
    docker images | grep mysql
    exit 0
fi

echo ""
echo "⚠️  镜像加速器拉取失败，尝试使用国内镜像仓库..."

# 方案 2: 使用阿里云镜像仓库
echo ""
echo "4️⃣ 使用阿里云镜像仓库拉取..."
if docker pull registry.cn-hangzhou.aliyuncs.com/library/mysql:8.0; then
    echo "✅ 从阿里云拉取成功，正在打标签..."
    docker tag registry.cn-hangzhou.aliyuncs.com/library/mysql:8.0 mysql:8.0
    docker images | grep mysql
    echo ""
    echo "✅ MySQL 镜像已就绪，可以运行: docker compose up -d"
    exit 0
fi

# 方案 3: 使用华为云镜像仓库
echo ""
echo "5️⃣ 使用华为云镜像仓库拉取..."
if docker pull swr.cn-north-4.myhuaweicloud.com/library/mysql:8.0; then
    echo "✅ 从华为云拉取成功，正在打标签..."
    docker tag swr.cn-north-4.myhuaweicloud.com/library/mysql:8.0 mysql:8.0
    docker images | grep mysql
    echo ""
    echo "✅ MySQL 镜像已就绪，可以运行: docker compose up -d"
    exit 0
fi

# 如果都失败了
echo ""
echo "❌ 所有方案均失败，请检查："
echo "   1. 网络连接是否正常"
echo "   2. Docker 服务是否运行: sudo systemctl status docker"
echo "   3. 防火墙是否阻止了连接"
echo "   4. 查看详细日志: cat /tmp/docker-pull.log"
echo ""
echo "💡 手动操作建议："
echo "   1. 检查 Docker 配置: sudo cat /etc/docker/daemon.json"
echo "   2. 重启 Docker: sudo systemctl restart docker"
echo "   3. 测试网络: curl -I https://registry.cn-hangzhou.aliyuncs.com"
exit 1

