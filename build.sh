#!/bin/bash
# 优化的构建脚本 - 解决构建卡住问题

set -e

echo "🔨 开始优化构建..."

# 🔥 第一步：清理可能卡住的构建进程
echo "🧹 清理可能卡住的构建进程..."
pkill -9 -f "node.*nuxt" || true
pkill -9 -f "node.*vite" || true
pkill -9 -f "node.*nitro" || true
pkill -9 -f "npx.*prisma" || true
sleep 2

# 设置环境变量
export NODE_OPTIONS="--max-old-space-size=4096"
export NODE_ENV=production

# 清理缓存和旧的构建
echo "🧹 清理缓存..."
rm -rf .nuxt
rm -rf .output
rm -rf node_modules/.vite
rm -rf .nitro
rm -rf node_modules/.cache

# 清理 Nuxt 持久化缓存
rm -rf ~/.nuxt 2>/dev/null || true

# 禁用一些不必要的功能
export NITRO_DISABLE_ESBUILD_WRAP=1
export NITRO_UNCROPPED_ESLINT=1

# 显示内存信息
echo "💾 当前内存状态:"
free -h || echo "  (无法获取内存信息)"
echo ""

# 开始构建（带超时和进度显示）
echo "🔧 构建中..."
echo "   如果卡住超过 5 分钟，请按 Ctrl+C 并检查："
echo "   1. 内存是否充足 (建议至少 2GB 可用内存)"
echo "   2. 磁盘空间是否充足"
echo "   3. Swap 是否已启用"
echo "   4. 检查是否有卡住的 node 进程: ps aux | grep node"
echo ""

# 使用 pnpm build，但增加环境变量
NODE_OPTIONS="--max-old-space-size=4096" pnpm build

echo ""
echo "✅ 构建完成！"

# 检查构建输出
if [ ! -d ".output" ]; then
    echo "❌ 构建失败：未找到 .output 目录"
    exit 1
fi

if [ ! -f ".output/server/index.mjs" ]; then
    echo "❌ 构建失败：未找到服务器入口文件"
    exit 1
fi

echo "📦 构建产物大小:"
du -sh .output 2>/dev/null || echo "  (无法获取大小)"

echo ""
echo "🎉 构建成功！"
