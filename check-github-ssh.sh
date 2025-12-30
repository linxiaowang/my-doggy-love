#!/bin/bash
# GitHub Actions SSH 诊断脚本

echo "🔍 GitHub Actions SSH 诊断工具"
echo "================================"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. 检查是否有现有的 GitHub Actions 密钥
echo "📋 步骤 1: 检查现有密钥"
echo "----------------------------"
if [ -f ~/.ssh/github_actions ]; then
    echo -e "${GREEN}✅ 找到 github_actions 密钥${NC}"
    ls -lh ~/.ssh/github_actions
    echo ""
else
    echo -e "${YELLOW}⚠️  未找到 github_actions 密钥${NC}"
    echo "是否要生成新的密钥？(y/n)"
    read -r answer
    if [ "$answer" = "y" ]; then
        ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions -N ""
        chmod 600 ~/.ssh/github_actions
        echo -e "${GREEN}✅ 密钥已生成${NC}"
    else
        echo "退出..."
        exit 1
    fi
fi
echo ""

# 2. 显示私钥（用于 GitHub Secrets）
echo "📋 步骤 2: 显示私钥（复制到 GitHub Secrets）"
echo "----------------------------"
echo -e "${YELLOW}请复制下面的完整内容（包括 BEGIN 和 END 行）${NC}"
echo "========================================"
cat ~/.ssh/github_actions
echo "========================================"
echo ""
echo "已复制到剪贴板（如果支持），请粘贴到 GitHub Secrets → SSH_PRIVATE_KEY"
echo ""

# 3. 显示公钥
echo "📋 步骤 3: 显示公钥（需要添加到服务器）"
echo "----------------------------"
echo "公钥内容："
echo "========================================"
cat ~/.ssh/github_actions.pub
echo "========================================"
echo ""

# 4. 测试本地连接
echo "📋 步骤 4: 测试 SSH 连接"
echo "----------------------------"
echo "请输入服务器信息："
read -p "服务器地址 (SERVER_HOST): " SERVER_HOST
read -p "用户名 (SERVER_USER): " SERVER_USER
read -p "SSH 端口 (默认 22): " SERVER_PORT
SERVER_PORT=${SERVER_PORT:-22}

echo ""
echo "测试连接..."
ssh -i ~/.ssh/github_actions -o ConnectTimeout=10 -o StrictHostKeyChecking=no \
    -p "$SERVER_PORT" "$SERVER_USER@$SERVER_HOST" \
    "echo -e '${GREEN}✅ 连接成功！${NC}'; hostname; whoami" 2>&1

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ SSH 连接测试成功！${NC}"
    echo ""
    echo "下一步："
    echo "1. 将上面显示的私钥复制到 GitHub Secrets: SSH_PRIVATE_KEY"
    echo "2. 如果公钥还未添加到服务器，运行以下命令："
    echo ""
    echo "   ssh-copy-id -i ~/.ssh/github_actions.pub $SERVER_USER@$SERVER_HOST"
    echo ""
else
    echo ""
    echo -e "${RED}❌ SSH 连接失败${NC}"
    echo ""
    echo "可能的原因："
    echo "1. 公钥未添加到服务器的 ~/.ssh/authorized_keys"
    echo "2. 服务器地址、用户名或端口不正确"
    echo "3. 服务器防火墙阻止了连接"
    echo ""
    echo "解决方法："
    echo "手动添加公钥到服务器："
    echo "  ssh-copy-id -i ~/.ssh/github_actions.pub $SERVER_USER@$SERVER_HOST"
    echo ""
    echo "或者手动复制："
    echo "  cat ~/.ssh/github_actions.pub | ssh $SERVER_USER@$SERVER_HOST 'cat >> ~/.ssh/authorized_keys'"
    echo ""
fi
