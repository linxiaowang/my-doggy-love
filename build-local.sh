#!/bin/bash
# 本地构建脚本 - 在本地打包后上传到服务器

set -e

echo "🔨 开始本地构建..."
echo ""

# 检查环境变量文件
if [ ! -f ".env.production" ]; then
    echo "❌ 未找到 .env.production 文件"
    echo "   请先创建生产环境配置文件"
    exit 1
fi

# 清理旧的构建
echo "🧹 清理旧的构建..."
rm -rf .nuxt .output .nitro node_modules/.vite node_modules/.cache

# 复制生产环境变量
echo "📋 使用生产环境配置..."
cp .env.production .env.tmp

# 设置构建环境变量
export NODE_OPTIONS="--max-old-space-size=4096"
export NODE_ENV=production

# 开始构建
echo "🔧 开始构建..."
pnpm build

# 检查构建是否成功
if [ ! -d ".output" ] || [ ! -f ".output/server/index.mjs" ]; then
    echo "❌ 构建失败，未找到构建输出"
    rm -f .env.tmp
    exit 1
fi

# 清理临时环境变量文件
rm -f .env.tmp

echo ""
echo "✅ 构建完成！"
echo ""
echo "📦 构建产物位置: .output/"
echo "📊 构建产物大小:"
du -sh .output 2>/dev/null || echo "   (无法获取大小)"
echo ""

# 询问是否立即部署
read -p "是否立即部署到服务器? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [ -f "./deploy-to-server.sh" ]; then
        ./deploy-to-server.sh
    else
        echo "⚠️  未找到 deploy-to-server.sh 脚本"
        echo "   请手动上传 .output 目录到服务器"
    fi
else
    echo ""
    echo "💡 后续步骤："
    echo "   1. 将 .output 目录上传到服务器"
    echo "   2. 运行 ./deploy-to-server.sh 自动部署"
    echo "   3. 或手动将 .output 目录复制到服务器指定位置"
fi
