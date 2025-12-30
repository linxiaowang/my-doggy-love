#!/bin/bash
# 清理卡住的构建进程和缓存
# 用于解决构建卡住问题

echo "🧹 清理构建相关进程和缓存..."

# 杀掉可能卡住的 Node.js 进程
echo "🔥 停止构建进程..."
pkill -9 -f "node.*nuxt" 2>/dev/null || true
pkill -9 -f "node.*vite" 2>/dev/null || true
pkill -9 -f "node.*nitro" 2>/dev/null || true
pkill -9 -f "npx.*prisma" 2>/dev/null || true

# 等待进程完全停止
sleep 2

# 清理所有构建缓存
echo "🗑️  清理构建缓存..."
rm -rf .nuxt
rm -rf .output
rm -rf node_modules/.vite
rm -rf .nitro
rm -rf node_modules/.cache

# 清理 Nuxt 持久化缓存
rm -rf ~/.nuxt 2>/dev/null || true

echo ""
echo "✅ 清理完成！"
echo ""
echo "💡 现在可以重新运行构建："
echo "   - 使用 build.sh: ./build.sh"
echo "   - 使用 quick-deploy.sh: ./quick-deploy.sh"
echo "   - 使用 deploy.sh: ./deploy.sh"
echo ""
echo "🔍 检查是否还有残留的 node 进程："
ps aux | grep -E "(nuxt|vite|nitro)" | grep -v grep || echo "   ✓ 没有发现残留进程"
