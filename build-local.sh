#!/bin/bash
# 本地构建脚本 - 在本地打包

set -e

echo "🔨 开始本地构建..."
echo ""

# 检查环境变量文件
if [ ! -f ".env.production" ]; then
    echo "❌ 未找到 .env.production 文件"
    echo ""
    echo "请先创建生产环境配置文件："
    echo "  cp .env.production.example .env.production"
    echo "  vim .env.production"
    exit 1
fi

# 清理旧的构建
echo "🧹 清理旧的构建..."
rm -rf .nuxt .output .nitro node_modules/.vite node_modules/.cache

# 设置构建环境变量
export NODE_OPTIONS="--max-old-space-size=4096"
export NODE_ENV=production

# 开始构建
echo "🔧 开始构建..."
echo "   (这可能需要 2-3 分钟)"
echo ""

pnpm build

# 检查构建是否成功
if [ ! -d ".output" ] || [ ! -f ".output/server/index.mjs" ]; then
    echo "❌ 构建失败，未找到构建输出"
    exit 1
fi

echo ""
echo "✅ 构建完成！"
echo ""
echo "📦 构建产物位置: .output/"
echo "📊 构建产物大小:"
du -sh .output 2>/dev/null || echo "   (无法获取大小)"
echo ""

# 询问是否提交到 Git
read -p "是否提交 .output 到 Git? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📤 提交到 Git..."
    git add .output
    git commit -m "chore: 更新构建产物"
    echo ""
    echo "💡 下一步："
    echo "   git push"
    echo ""
    echo "   然后在服务器上："
    echo "   git pull"
    echo "   bash server-pull-deploy.sh"
else
    echo ""
    echo "💡 后续步骤："
    echo "   1. 如果需要提交到 Git："
    echo "      git add .output"
    echo "      git commit -m 'chore: 更新构建产物'"
    echo "      git push"
    echo ""
    echo "   2. 在服务器上拉取并部署："
    echo "      git pull"
    echo "      bash server-pull-deploy.sh"
fi
