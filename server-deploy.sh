#!/bin/bash
# 服务器部署脚本 - 在服务器上运行，拉取并部署本地构建的产物
# 使用方法：在本地先构建，然后将 .output 目录上传到服务器的 /tmp/output/
# 然后在服务器上运行此脚本

set -e

echo "🚀 服务器部署脚本"
echo "=================="
echo ""

# 配置
APP_NAME="my-doggy-love"
APP_DIR="/var/www/$APP_NAME"
BACKUP_DIR="/var/backups/$APP_NAME"
TEMP_DIR="/tmp/output"

# 检查临时构建产物是否存在
if [ ! -d "$TEMP_DIR" ]; then
    echo "❌ 未找到构建产物目录: $TEMP_DIR"
    echo ""
    echo "请先在本地构建并上传："
    echo "  1. 在本地运行: ./build-local.sh"
    echo "  2. 上传 .output 目录到服务器的 $TEMP_DIR"
    echo "     例如: scp -r .output user@server:/tmp/output/"
    echo ""
    exit 1
fi

# 检查构建产物是否完整
if [ ! -f "$TEMP_DIR/server/index.mjs" ]; then
    echo "❌ 构建产物不完整，缺少 server/index.mjs"
    exit 1
fi

echo "✅ 找到构建产物: $TEMP_DIR"
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
cp -r "$TEMP_DIR" "$APP_DIR/.output"

# 复制生产环境变量（如果存在）
if [ ! -f "$APP_DIR/.env" ]; then
    if [ -f "$TEMP_DIR/../.env.production" ]; then
        echo "📋 复制环境变量..."
        cp "$TEMP_DIR/../.env.production" "$APP_DIR/.env"
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

# 清理临时文件
echo ""
echo "🧹 清理临时文件..."
rm -rf "$TEMP_DIR"

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
