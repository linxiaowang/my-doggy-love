#!/bin/bash
# 调试构建脚本 - 显示详细信息

set -e

echo "🔍 开始调试构建..."

# 设置环境变量
export NODE_OPTIONS="--max-old-space-size=4096"
export NODE_ENV=production
export DEBUG="vite:*"

# 清理
echo "🧹 清理缓存..."
rm -rf .nuxt
rm -rf .output
rm -rf node_modules/.vite

# 构建并显示详细信息
echo "🔧 开始构建（显示详细日志）..."
NODE_OPTIONS="--max-old-space-size=4096" pnpm build --debug 2>&1 | tee build-debug.log

echo ""
echo "✅ 构建完成或已中断"
echo "📝 日志已保存到 build-debug.log"
