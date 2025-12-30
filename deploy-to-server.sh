#!/bin/bash
# 部署到服务器脚本 - 上传本地构建产物到服务器

set -e

# 配置服务器信息（请根据实际情况修改）
SERVER_USER="root"
SERVER_HOST="your-server-ip"
SERVER_PATH="/var/www/my-doggy-love"

# 检查本地构建产物
if [ ! -d ".output" ]; then
    echo "❌ 未找到构建产物 .output 目录"
    echo "   请先运行 ./build-local.sh 进行本地构建"
    exit 1
fi

echo "🚀 开始部署到服务器..."
echo ""

# 检查是否配置了服务器信息
if [ "$SERVER_HOST" = "your-server-ip" ]; then
    echo "⚠️  请先配置服务器信息"
    echo ""
    echo "编辑 deploy-to-server.sh 文件，设置以下变量："
    echo "   SERVER_USER=\"your-username\""
    echo "   SERVER_HOST=\"your-server-ip\""
    echo "   SERVER_PATH=\"/path/to/app\""
    echo ""
    exit 1
fi

# 压缩构建产物
echo "📦 压缩构建产物..."
tar -czf output.tar.gz .output

# 上传到服务器
echo "📤 上传到服务器 $SERVER_USER@$SERVER_HOST..."
scp output.tar.gz $SERVER_USER@$SERVER_HOST:/tmp/

# 在服务器上执行部署
echo "🔧 在服务器上部署..."
ssh $SERVER_USER@$SERVER_HOST << 'ENDSSH'
set -e

# 停止应用
if command -v pm2 &> /dev/null; then
    echo "🛑 停止应用..."
    pm2 stop my-doggy-love 2>/dev/null || true
    pm2 delete my-doggy-love 2>/dev/null || true
fi

# 备份旧版本
if [ -d "$SERVER_PATH/.output" ]; then
    echo "💾 备份旧版本..."
    mv $SERVER_PATH/.output $SERVER_PATH/.output.backup.$(date +%Y%m%d_%H%M%S) 2>/dev/null || true
fi

# 解压新版本
echo "📂 解压新版本..."
mkdir -p $SERVER_PATH
tar -xzf /tmp/output.tar.gz -C $SERVER_PATH
rm /tmp/output.tar.gz

# 启动应用
if command -v pm2 &> /dev/null; then
    echo "🚀 启动应用..."
    cd $SERVER_PATH
    pm2 start .output/server/index.mjs --name my-doggy-love
    pm2 save
    echo "✅ 应用已启动"
else
    echo "⚠️  PM2 未安装，请手动启动应用"
    echo "   cd $SERVER_PATH"
    echo "   NODE_ENV=production node .output/server/index.mjs"
fi

echo "🎉 部署完成！"
ENDSSH

# 清理本地压缩包
rm output.tar.gz

echo ""
echo "✅ 部署成功完成！"
echo "   应用已部署到: $SERVER_HOST:$SERVER_PATH"
echo ""
echo "📝 查看应用状态:"
echo "   ssh $SERVER_USER@$SERVER_HOST 'pm2 status'"
echo ""
echo "📝 查看应用日志:"
echo "   ssh $SERVER_USER@$SERVER_HOST 'pm2 logs my-doggy-love'"
