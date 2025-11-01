#!/bin/bash
# 停止占用 3306 端口的 MySQL 服务

set -e

echo "🛑 停止占用 3306 端口的服务..."
echo "================================"
echo ""

# 1. 检查端口占用
echo "1️⃣ 检查 3306 端口占用情况..."
if command -v lsof &> /dev/null; then
    PORT_USERS=$(sudo lsof -i :3306 2>/dev/null || echo "")
elif command -v netstat &> /dev/null; then
    PORT_USERS=$(sudo netstat -tlnp 2>/dev/null | grep ':3306 ' || echo "")
elif command -v ss &> /dev/null; then
    PORT_USERS=$(sudo ss -tlnp 2>/dev/null | grep ':3306 ' || echo "")
else
    PORT_USERS=""
fi

if [ -z "$PORT_USERS" ]; then
    echo "✅ 3306 端口未被占用"
    exit 0
fi

echo "发现以下进程占用 3306 端口："
echo "$PORT_USERS"
echo ""

# 2. 停止 Docker 容器（如果有）
echo "2️⃣ 检查 Docker MySQL 容器..."
if docker ps -a | grep -q mysql; then
    echo "发现 MySQL 容器："
    docker ps -a | grep mysql
    echo ""
    read -p "是否停止并删除这些容器？(y/N) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "停止并删除 MySQL 容器..."
        docker ps -a | grep mysql | awk '{print $1}' | xargs -r docker rm -f
        echo "✅ Docker MySQL 容器已删除"
    fi
fi

# 3. 停止系统 MySQL 服务
echo ""
echo "3️⃣ 检查系统 MySQL 服务..."
if systemctl list-units --type=service --state=running 2>/dev/null | grep -qE 'mysql|mysqld'; then
    echo "发现系统 MySQL 服务正在运行"
    
    # 尝试不同的服务名
    if systemctl is-active --quiet mysqld 2>/dev/null; then
        echo "停止 mysqld 服务..."
        sudo systemctl stop mysqld
        echo "✅ mysqld 服务已停止"
        read -p "是否禁用 mysqld 服务自启动？(y/N) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            sudo systemctl disable mysqld
            echo "✅ mysqld 服务自启动已禁用"
        fi
    elif systemctl is-active --quiet mysql 2>/dev/null; then
        echo "停止 mysql 服务..."
        sudo systemctl stop mysql
        echo "✅ mysql 服务已停止"
        read -p "是否禁用 mysql 服务自启动？(y/N) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            sudo systemctl disable mysql
            echo "✅ mysql 服务自启动已禁用"
        fi
    fi
else
    echo "未发现运行中的系统 MySQL 服务"
fi

# 4. 验证端口是否释放
echo ""
echo "4️⃣ 验证 3306 端口是否已释放..."
sleep 2
if command -v lsof &> /dev/null; then
    PORT_CHECK=$(sudo lsof -i :3306 2>/dev/null || echo "")
elif command -v netstat &> /dev/null; then
    PORT_CHECK=$(sudo netstat -tlnp 2>/dev/null | grep ':3306 ' || echo "")
elif command -v ss &> /dev/null; then
    PORT_CHECK=$(sudo ss -tlnp 2>/dev/null | grep ':3306 ' || echo "")
else
    PORT_CHECK=""
fi

if [ -z "$PORT_CHECK" ]; then
    echo "✅ 3306 端口已成功释放！"
    echo ""
    echo "现在可以运行："
    echo "  docker compose up -d"
    echo "  或重新运行部署脚本："
    echo "  ./deploy.sh"
else
    echo "⚠️  3306 端口仍被占用："
    echo "$PORT_CHECK"
    echo ""
    echo "请手动检查并停止相关进程"
fi

