#!/bin/bash
# 快速部署脚本 - 仅部署应用，不执行数据库迁移

set -e

echo "🚀 开始快速部署 My Doggy Love..."

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
    echo "❌ 未找到 .env 文件，请先配置环境变量"
    exit 1
fi

echo "✅ 环境检查通过"
echo ""

# 拉取最新代码（如果使用 git）
if [ -d .git ]; then
    echo "📥 拉取最新代码..."
    git pull || echo "⚠️  Git pull 失败，继续部署..."
    echo ""
fi

# 安装依赖（如果需要）
if [ -n "$1" ] && [ "$1" = "--install" ]; then
    echo "📦 安装依赖..."
    pnpm install --frozen-lockfile
    echo ""
fi

# 构建项目
echo "🔨 构建项目..."
pnpm build

if [ ! -d ".output" ] || [ ! -f ".output/server/index.mjs" ]; then
    echo "❌ 构建失败，未找到构建输出"
    exit 1
fi

echo "✅ 构建完成"
echo ""

# 使用 PM2 启动（如果已安装）
if command -v pm2 &> /dev/null; then
    echo "🚀 使用 PM2 重启应用..."
    
    # 检查应用是否在运行
    if pm2 list | grep -q "my-doggy-love"; then
        echo "🔄 重启现有应用..."
        pm2 restart my-doggy-love
    else
        echo "🆕 启动新应用..."
        # 优先使用 .cjs 文件（支持 ES 模块项目）
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
    echo "✅ 应用已部署"
    echo ""
    echo "📋 状态信息："
    pm2 status my-doggy-love
    echo ""
    echo "📝 查看日志: pm2 logs my-doggy-love"
    echo "📊 监控: pm2 monit"
else
    echo "⚠️  PM2 未安装，请使用 PM2 运行应用"
    echo "   安装 PM2: npm install -g pm2"
    echo "   启动应用: pm2 start ecosystem.config.cjs"
    exit 1
fi

echo ""
echo "🎉 部署完成！"
echo "   应用运行在: http://localhost:3000"

