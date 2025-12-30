#!/bin/bash
# GitHub Actions CI/CD 配置助手

echo "🚀 GitHub Actions CI/CD 配置助手"
echo "================================"
echo ""

# 检查是否已生成 SSH 密钥
SSH_KEY_FILE="$HOME/.ssh/github_actions"

if [ -f "$SSH_KEY_FILE" ]; then
    echo "⚠️  检测到已存在的 SSH 密钥: $SSH_KEY_FILE"
    echo ""
    read -p "是否使用现有密钥? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        rm -f "$SSH_KEY_FILE" "$SSH_KEY_FILE.pub"
        echo "🗑️  已删除旧密钥"
    fi
fi

# 生成新的 SSH 密钥
if [ ! -f "$SSH_KEY_FILE" ]; then
    echo "🔑 生成 SSH 密钥..."
    ssh-keygen -t ed25519 -C "github-actions" -f "$SSH_KEY_FILE" -N ""
    echo "✅ 密钥已生成: $SSH_KEY_FILE"
    echo ""
fi

# 显示公钥
echo "📋 步骤 1: 添加公钥到服务器"
echo "================================"
echo ""
echo "复制以下公钥："
echo ""
cat "$SSH_KEY_FILE.pub"
echo ""
echo ""
echo "然后运行以下命令添加到服务器："
echo ""
echo "  ssh-copy-id -i $SSH_KEY_FILE.pub user@your-server-ip"
echo ""
echo "或者手动添加："
echo "  cat $SSH_KEY_FILE.pub | ssh user@your-server-ip 'cat >> ~/.ssh/authorized_keys'"
echo ""
echo "完成后，按 Enter 继续..."
read

# 测试 SSH 连接
echo ""
echo "🔍 测试 SSH 连接..."
echo "================================"
echo ""
read -p "请输入服务器用户名 (例如: root): " SERVER_USER
read -p "请输入服务器 IP 地址 (例如: 123.45.67.89): " SERVER_HOST

echo ""
echo "测试连接..."
if ssh -i "$SSH_KEY_FILE" -o StrictHostKeyChecking=no -o ConnectTimeout=10 "$SERVER_USER@$SERVER_HOST" "echo '✅ SSH 连接成功！'" 2>/dev/null; then
    echo ""
    echo "✅ SSH 连接测试成功！"
else
    echo ""
    echo "❌ SSH 连接失败，请检查："
    echo "   1. 服务器 IP 地址是否正确"
    echo "   2. 用户名是否正确"
    echo "   3. 公钥是否已添加到服务器"
    echo "   4. 服务器 SSH 服务是否运行"
    exit 1
fi

# 显示私钥
echo ""
echo ""
echo "📋 步骤 2: 配置 GitHub Secrets"
echo "================================"
echo ""
echo "需要在 GitHub 仓库中配置以下 Secrets："
echo ""
echo "1. 访问: https://github.com/你的用户名/你的仓库/settings/secrets/actions"
echo ""
echo "2. 点击 'New repository secret' 添加以下 Secrets："
echo ""
echo "   Secrets 配置："
echo "   ┌────────────────────────────────────────────────────────────┐"
echo "   │ Name:              SERVER_HOST                              │"
echo "   │ Value:             $SERVER_HOST                            │"
echo "   ├────────────────────────────────────────────────────────────┤"
echo "   │ Name:              SERVER_USER                              │"
echo "   │ Value:             $SERVER_USER                            │"
echo "   ├────────────────────────────────────────────────────────────┤"
echo "   │ Name:              SERVER_PORT (可选)                       │"
echo "   │ Value:             22                                      │"
echo "   ├────────────────────────────────────────────────────────────┤"
echo "   │ Name:              SSH_PRIVATE_KEY                          │"
echo "   │ Value:             (见下方)                                │"
echo "   └────────────────────────────────────────────────────────────┘"
echo ""
echo "SSH_PRIVATE_KEY 的值："
echo "────────────────────────────────────────────────────────────────"
echo "复制以下内容（包括 BEGIN 和 END 行）："
echo ""
cat "$SSH_KEY_FILE"
echo ""
echo "────────────────────────────────────────────────────────────────"
echo ""

# 检查 .env.production
echo "📋 步骤 3: 配置环境变量 Secrets"
echo "================================"
echo ""

if [ -f ".env.production" ]; then
    echo "✅ 找到 .env.production 文件"
    echo ""
    echo "还需要配置以下 Secrets（从 .env.production 复制）："
    echo ""

    # 提取环境变量
    grep -E "^(DATABASE_URL|AUTH_SECRET|NUXT_)" .env.production | while read line; do
        key=$(echo "$line" | cut -d'=' -f1)
        value=$(echo "$line" | cut -d'=' -f2-)
        echo "   Name: $key"
        echo "   Value: $value"
        echo ""
    done
else
    echo "⚠️  未找到 .env.production 文件"
    echo ""
    echo "请先创建："
    echo "  cp .env.production.example .env.production"
    echo "  vim .env.production"
    echo ""
    echo "然后配置以下 Secrets："
    echo "   - DATABASE_URL"
    echo "   - AUTH_SECRET"
    echo "   - NUXT_PUBLIC_VAPID_KEY"
    echo "   - NUXT_VAPID_PRIVATE_KEY"
    echo "   - NUXT_VAPID_SUBJECT"
fi

echo ""
echo "🎉 配置完成！"
echo ""
echo "📝 下一步："
echo "   1. 确保 .github/workflows/deploy.yml 已提交到 Git"
echo "   2. 推送代码到 main 分支"
echo "   3. 访问 GitHub Actions 页面查看部署状态"
echo ""
echo "   GitHub Actions: https://github.com/你的用户名/你的仓库/actions"
echo ""
