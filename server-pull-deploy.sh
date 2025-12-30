#!/bin/bash
# 服务器部署脚本 - 在服务器上运行
# 使用方法：在服务器上 git pull 后运行此脚本

set -e

echo "🚀 服务器部署脚本"
echo "=================="
echo ""

# 配置
APP_NAME="my-doggy-love"
APP_DIR="/var/www/$APP_NAME"
BACKUP_DIR="/var/backups/$APP_NAME"

# 检查是否在正确的目录
if [ ! -f "server-deploy.sh" ]; then
    echo "❌ 请在项目根目录运行此脚本"
    echo "   cd /var/www/my-doggy-love"
    exit 1
fi

# 检查是否有本地构建产物
if [ ! -d ".output" ]; then
    echo "❌ 未找到 .output 目录"
    echo ""
    echo "请先在本地构建并提交："
    echo "  1. 在本地运行: ./build-local.sh"
    echo "  2. 提交 .output 目录到 Git（如果需要）"
    echo "     或者手动上传 .output 目录到服务器"
    echo ""
    exit 1
fi

# 检查构建产物是否完整
if [ ! -f ".output/server/index.mjs" ]; then
    echo "❌ 构建产物不完整，缺少 server/index.mjs"
    exit 1
fi

echo "✅ 找到构建产物: .output/"
echo ""

# 创建应用目录
echo "📁 创建应用目录..."
mkdir -p "$APP_DIR"
mkdir -p "$BACKUP_DIR"

# 停止应用
if command -v pm2 &> /dev/null; then
    if pm2 list | grep -q "$APP_NAME"; then
        echo "🛑 停止应用..."
        pm2 stop "$APP_NAME" 2>/dev/null || true
    fi
fi

# 备份旧版本
if [ -d "$APP_DIR/.output" ]; then
    echo "💾 备份旧版本..."
    BACKUP_NAME="$BACKUP_DIR/.output.$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    mv "$APP_DIR/.output" "$BACKUP_NAME"
    echo "   已备份到: $BACKUP_NAME"

    # 只保留最近 5 个备份
    ls -t "$BACKUP_DIR"/.output.* 2>/dev/null | tail -n +6 | xargs rm -rf 2>/dev/null || true
fi

# 部署新版本
echo "📦 部署新版本..."
rm -rf "$APP_DIR/.output"
cp -r .output "$APP_DIR/.output"

# 复制生产环境变量（如果存在）
if [ ! -f "$APP_DIR/.env" ]; then
    if [ -f ".env.production" ]; then
        echo "📋 复制环境变量..."
        cp .env.production "$APP_DIR/.env"
    else
        echo "⚠️  警告: 未找到 .env 文件"
        echo "   请手动创建 $APP_DIR/.env 文件"
    fi
fi

# 设置权限
echo "🔐 设置权限..."
chmod -R 755 "$APP_DIR/.output"

# 创建上传目录
mkdir -p "$APP_DIR/public/uploads"
chmod 755 "$APP_DIR/public/uploads"

# 启动应用
if command -v pm2 &> /dev/null; then
    echo "🚀 启动应用..."
    cd "$APP_DIR"

    # 删除旧的进程（如果存在）
    pm2 delete "$APP_NAME" 2>/dev/null || true

    # 启动新进程
    pm2 start ".output/server/index.mjs" \
        --name "$APP_NAME" \
        --env production \
        --max-memory-restart 1G

    # 保存 PM2 配置
    pm2 save

    echo ""
    echo "✅ 应用已启动"
    echo ""
    echo "📋 应用状态:"
    pm2 status "$APP_NAME"
else
    echo "⚠️  PM2 未安装，请手动启动应用："
    echo "   cd $APP_DIR"
    echo "   NODE_ENV=production node .output/server/index.mjs"
fi

echo ""
echo "🎉 部署完成！"
echo ""
echo "📝 查看日志:"
if command -v pm2 &> /dev/null; then
    echo "   pm2 logs $APP_NAME"
fi
echo ""
echo "📊 监控:"
if command -v pm2 &> /dev/null; then
    echo "   pm2 monit"
fi
echo ""
echo "🌐 应用地址:"
echo "   http://localhost:3000"
