#!/bin/bash
# 一键构建并部署脚本

set -e

echo "🚀 一键构建并部署"
echo "=================="
echo ""

# 检查配置文件
if [ ! -f ".env.production" ]; then
    echo "❌ 未找到 .env.production 文件"
    echo ""
    echo "请先创建生产环境配置："
    echo "  1. cp .env.production.example .env.production"
    echo "  2. 编辑 .env.production 填写实际配置"
    echo ""
    exit 1
fi

# 检查服务器配置
if grep -q "SERVER_HOST=\"your-server-ip\"" deploy-to-server.sh 2>/dev/null; then
    echo "⚠️  请先配置服务器信息"
    echo ""
    echo "编辑 deploy-to-server.sh 文件，设置以下变量："
    echo "   SERVER_USER=\"your-username\""
    echo "   SERVER_HOST=\"your-server-ip\""
    echo "   SERVER_PATH=\"/path/to/app\""
    echo ""
    exit 1
fi

# 执行构建
./build-local.sh <<EOF
n
EOF

if [ ! -d ".output" ]; then
    echo "❌ 构建失败"
    exit 1
fi

# 执行部署
echo ""
echo "📤 开始部署..."
./deploy-to-server.sh

echo ""
echo "🎉 完成！"
