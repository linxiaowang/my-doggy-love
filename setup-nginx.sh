#!/bin/bash
# Nginx 配置脚本 - 自动配置反向代理

set -e

echo "🔧 配置 Nginx 反向代理..."

# 检查 Nginx 是否安装
if ! command -v nginx &> /dev/null; then
    echo "⚠️  Nginx 未安装，正在安装..."
    if command -v yum &> /dev/null; then
        sudo yum install -y nginx
    elif command -v apt-get &> /dev/null; then
        sudo apt-get update
        sudo apt-get install -y nginx
    else
        echo "❌ 无法自动安装 Nginx，请手动安装"
        exit 1
    fi
fi

# 获取项目路径（假设在 /opt/my-doggy-love 或当前目录）
if [ -f "/opt/my-doggy-love/package.json" ]; then
    PROJECT_PATH="/opt/my-doggy-love"
elif [ -f "$(pwd)/package.json" ]; then
    PROJECT_PATH="$(pwd)"
else
    read -p "请输入项目路径: " PROJECT_PATH
    if [ ! -f "$PROJECT_PATH/package.json" ]; then
        echo "❌ 无效的项目路径"
        exit 1
    fi
fi

echo "📁 项目路径: $PROJECT_PATH"

# 获取域名或 IP
read -p "请输入域名或 IP 地址（直接回车使用 IP）: " SERVER_NAME
if [ -z "$SERVER_NAME" ]; then
    # 尝试获取服务器公网 IP
    SERVER_NAME=$(curl -s ifconfig.me 2>/dev/null || curl -s ipinfo.io/ip 2>/dev/null || echo "localhost")
    echo "🌐 自动检测到 IP: $SERVER_NAME"
fi

# 检查是否需要 HTTPS
read -p "是否需要配置 HTTPS/SSL？(y/n，默认 n): " USE_HTTPS
USE_HTTPS=${USE_HTTPS:-n}

# 生成 Nginx 配置
NGINX_CONF="/etc/nginx/conf.d/my-doggy-love.conf"
echo "📝 生成 Nginx 配置文件: $NGINX_CONF"

if [ "$USE_HTTPS" = "y" ] || [ "$USE_HTTPS" = "Y" ]; then
    # HTTPS 配置
    sudo tee "$NGINX_CONF" > /dev/null << EOF
# HTTP 重定向到 HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name $SERVER_NAME;
    return 301 https://\$server_name\$request_uri;
}

# HTTPS 配置
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name $SERVER_NAME;

    # SSL 证书配置（使用 Let's Encrypt）
    ssl_certificate /etc/letsencrypt/live/$SERVER_NAME/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$SERVER_NAME/privkey.pem;
    
    # SSL 配置优化
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # 上传文件大小限制
    client_max_body_size 50M;

    # 静态文件（上传的图片等）
    location /uploads {
        alias $PROJECT_PATH/public/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
        
        # 安全头部
        add_header X-Content-Type-Options "nosniff";
    }

    # Nuxt 应用
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header X-Forwarded-Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
        
        # 缓冲设置
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
    }

    # 安全头部
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
EOF
    echo "✅ HTTPS 配置已生成"
    echo "⚠️  注意：请先配置 SSL 证书，然后运行: sudo certbot --nginx -d $SERVER_NAME"
else
    # HTTP 配置
    sudo tee "$NGINX_CONF" > /dev/null << EOF
server {
    listen 80;
    listen [::]:80;
    server_name $SERVER_NAME;

    # 上传文件大小限制
    client_max_body_size 50M;

    # 静态文件（上传的图片等）
    location /uploads {
        alias $PROJECT_PATH/public/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
        
        # 安全头部
        add_header X-Content-Type-Options "nosniff";
    }

    # Nuxt 应用
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header X-Forwarded-Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
        
        # 缓冲设置
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
    }

    # 安全头部
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
EOF
    echo "✅ HTTP 配置已生成"
fi

# 测试 Nginx 配置
echo "🧪 测试 Nginx 配置..."
if sudo nginx -t; then
    echo "✅ Nginx 配置测试通过"
    
    # 重启 Nginx
    echo "🔄 重新加载 Nginx..."
    sudo systemctl reload nginx
    
    # 检查 Nginx 状态
    if sudo systemctl is-active --quiet nginx; then
        echo "✅ Nginx 运行正常"
    else
        echo "⚠️  启动 Nginx..."
        sudo systemctl start nginx
        sudo systemctl enable nginx
    fi
    
    echo ""
    echo "🎉 Nginx 配置完成！"
    echo ""
    echo "📋 配置信息："
    echo "   配置文件: $NGINX_CONF"
    echo "   域名/IP: $SERVER_NAME"
    echo "   项目路径: $PROJECT_PATH"
    echo ""
    
    if [ "$USE_HTTPS" = "y" ] || [ "$USE_HTTPS" = "Y" ]; then
        echo "🔒 HTTPS 配置已生成，但需要配置 SSL 证书："
        echo "   1. 安装 certbot: sudo yum install -y certbot python3-certbot-nginx"
        echo "   2. 获取证书: sudo certbot --nginx -d $SERVER_NAME"
        echo "   3. 测试续期: sudo certbot renew --dry-run"
    else
        echo "🌐 应用可通过以下地址访问："
        echo "   http://$SERVER_NAME"
        echo ""
        echo "💡 如需配置 HTTPS，运行此脚本并选择 'y'"
    fi
    
    echo ""
    echo "📝 常用命令："
    echo "   查看 Nginx 状态: sudo systemctl status nginx"
    echo "   查看 Nginx 日志: sudo tail -f /var/log/nginx/error.log"
    echo "   重新加载配置: sudo nginx -s reload"
else
    echo "❌ Nginx 配置测试失败，请检查配置文件"
    exit 1
fi

