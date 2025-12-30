#!/bin/bash
# Node.js 安装脚本

echo "🔍 检查 Node.js 安装状态..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js 已安装: $NODE_VERSION"
    echo ""
    node --version
    npm --version
    echo ""
    echo "无需重新安装"
    exit 0
fi

echo "❌ Node.js 未安装"
echo ""
echo "开始安装 Node.js 20..."
echo ""

# 检测操作系统
if [ -f /etc/debian_version ]; then
    echo "检测到 Debian/Ubuntu 系统"
    echo ""

    # 使用 NodeSource 官方脚本安装 Node.js 20
    echo "📦 下载并安装 Node.js 20..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

    if [ $? -ne 0 ]; then
        echo "❌ 下载安装脚本失败"
        exit 1
    fi

    echo ""
    echo "📦 安装 nodejs 包..."
    sudo apt-get install -y nodejs

    if [ $? -ne 0 ]; then
        echo "❌ 安装失败"
        exit 1
    fi

    echo ""
    echo "✅ Node.js 安装成功"
    echo ""
    node --version
    npm --version

elif [ -f /etc/redhat-release ]; then
    echo "检测到 RedHat/CentOS 系统"
    echo ""

    curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
    sudo yum install -y nodejs

    if [ $? -ne 0 ]; then
        echo "❌ 安装失败"
        exit 1
    fi

    echo ""
    echo "✅ Node.js 安装成功"
    echo ""
    node --version
    npm --version
else
    echo "⚠️  未识别的系统，请手动安装 Node.js"
    echo ""
    echo "推荐使用 nvm 安装："
    echo ""
    echo "  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    echo "  source ~/.bashrc"
    echo "  nvm install 20"
    echo ""
    exit 1
fi

echo ""
echo "🎉 安装完成！"
