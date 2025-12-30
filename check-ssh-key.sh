#!/bin/bash
# SSH 密钥诊断和修复工具

echo "🔍 SSH 密钥诊断工具"
echo "=================="
echo ""

# 检查是否存在密钥
SSH_KEY_FILE="$HOME/.ssh/github_actions"

if [ ! -f "$SSH_KEY_FILE" ]; then
    echo "❌ 未找到 SSH 密钥: $SSH_KEY_FILE"
    echo ""
    echo "正在生成新密钥..."
    ssh-keygen -t ed25519 -C "github-actions" -f "$SSH_KEY_FILE" -N ""
    echo "✅ 新密钥已生成"
    echo ""
fi

echo "📋 密钥信息："
echo "============"
echo ""

# 检查密钥文件权限
PERMS=$(stat -c "%a" "$SSH_KEY_FILE" 2>/dev/null || stat -f "%A" "$SSH_KEY_FILE")
echo "文件权限: $PERMS (应该是 600)"

if [ "$PERMS" != "600" ]; then
    echo "🔧 修复权限..."
    chmod 600 "$SSH_KEY_FILE"
    echo "✅ 权限已修复为 600"
fi

echo ""
echo "公钥文件: $SSH_KEY_FILE.pub"
if [ -f "$SSH_KEY_FILE.pub" ]; then
    echo "✅ 公钥存在"
    echo ""
    echo "公钥内容："
    cat "$SSH_KEY_FILE.pub"
else
    echo "❌ 公钥不存在"
fi

echo ""
echo "私钥文件: $SSH_KEY_FILE"
echo ""

# 检查私钥内容
if grep -q "BEGIN OPENSSH PRIVATE KEY" "$SSH_KEY_FILE" || grep -q "BEGIN RSA PRIVATE KEY" "$SSH_KEY_FILE" || grep -q "BEGIN EC PRIVATE KEY" "$SSH_KEY_FILE"; then
    echo "✅ 私钥格式正确"
    echo ""
    echo "私钥内容（用于 GitHub Secrets）："
    echo "=================================="
    echo ""
    cat "$SSH_KEY_FILE"
    echo ""
    echo "=================================="
    echo ""
    echo "💡 复制上面整个私钥内容（包括 BEGIN 和 END 行）"
else
    echo "❌ 私钥格式不正确"
    echo ""
    echo "正在重新生成密钥..."
    rm -f "$SSH_KEY_FILE" "$SSH_KEY_FILE.pub"
    ssh-keygen -t ed25519 -C "github-actions" -f "$SSH_KEY_FILE" -N ""
    chmod 600 "$SSH_KEY_FILE"
    echo "✅ 新密钥已生成"
    echo ""
    echo "新的私钥内容："
    echo "=================================="
    echo ""
    cat "$SSH_KEY_FILE"
    echo ""
    echo "=================================="
fi

echo ""
echo "📋 下一步："
echo "=========="
echo ""
echo "1. 复制上面的私钥内容"
echo "2. 访问 GitHub Secrets 页面添加 SSH_PRIVATE_KEY"
echo "3. 添加公钥到服务器："
echo ""
echo "   ssh-copy-id -i $SSH_KEY_FILE.pub user@your-server-ip"
echo ""
echo "   或手动添加："
echo "   cat $SSH_KEY_FILE.pub | ssh user@your-server-ip 'cat >> ~/.ssh/authorized_keys'"
echo ""
