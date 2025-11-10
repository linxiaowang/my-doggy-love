#!/bin/bash
# 重启服务器脚本 - 用于修改 docker-compose.yml 或 db.ts 后重启

set -e

echo "🔄 开始重启服务器..."

# 1. 如果修改了 docker-compose.yml，重启 MySQL 容器
if [ -f docker-compose.yml ]; then
    echo "📦 重启 MySQL 容器..."
    docker-compose down
    docker-compose up -d
    echo "✅ MySQL 容器已重启"
    echo ""
    
    # 等待 MySQL 启动
    echo "⏳ 等待 MySQL 启动..."
    sleep 3
    docker-compose ps
    echo ""
fi

# 2. 如果修改了代码（如 db.ts），需要重新构建并重启 PM2
echo "🔨 重新构建项目..."
pnpm build

if [ ! -d ".output" ] || [ ! -f ".output/server/index.mjs" ]; then
    echo "❌ 构建失败，未找到构建输出"
    exit 1
fi

echo "✅ 构建完成"
echo ""

# 3. 重启 PM2 应用
if command -v pm2 &> /dev/null; then
    echo "🚀 重启 PM2 应用..."
    
    if pm2 list | grep -q "my-doggy-love"; then
        pm2 restart my-doggy-love
        echo "✅ 应用已重启"
    else
        echo "⚠️  应用未运行，正在启动..."
        if [ -f ecosystem.config.cjs ]; then
            pm2 start ecosystem.config.cjs
        elif [ -f ecosystem.config.js ]; then
            pm2 start ecosystem.config.js
        else
            echo "❌ 未找到 PM2 配置文件"
            exit 1
        fi
    fi
    
    pm2 save
    echo ""
    echo "📋 应用状态："
    pm2 status my-doggy-love
    echo ""
    echo "📝 查看日志: pm2 logs my-doggy-love"
else
    echo "❌ PM2 未安装，请先安装: npm install -g pm2"
    exit 1
fi

echo ""
echo "🎉 重启完成！"

