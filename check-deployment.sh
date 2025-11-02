#!/bin/bash
# 部署检查脚本 - 排查无法访问的问题

set -e

echo "🔍 开始检查部署状态..."
echo ""

# 1. 检查 PM2 应用状态
echo "1️⃣ 检查 PM2 应用状态..."
if command -v pm2 &> /dev/null; then
    pm2 status
    echo ""
    
    APP_STATUS=$(pm2 jlist | grep -o '"status":"[^"]*"' | head -1 | cut -d'"' -f4 || echo "unknown")
    if [ "$APP_STATUS" = "online" ]; then
        echo "✅ PM2 应用运行正常"
    else
        echo "❌ PM2 应用未运行，状态: $APP_STATUS"
        echo "   查看日志: pm2 logs my-doggy-love"
    fi
else
    echo "⚠️  PM2 未安装"
fi
echo ""

# 2. 检查应用端口
echo "2️⃣ 检查应用端口 (3000)..."
if command -v netstat &> /dev/null; then
    PORT_3000=$(netstat -tlnp 2>/dev/null | grep ':3000 ' || echo "")
elif command -v ss &> /dev/null; then
    PORT_3000=$(ss -tlnp 2>/dev/null | grep ':3000 ' || echo "")
else
    PORT_3000=$(lsof -i :3000 2>/dev/null || echo "")
fi

if [ -n "$PORT_3000" ]; then
    echo "✅ 端口 3000 正在监听"
    echo "   $PORT_3000"
else
    echo "❌ 端口 3000 未监听"
    echo "   应用可能未启动"
fi
echo ""

# 3. 测试本地应用
echo "3️⃣ 测试本地应用连接..."
if curl -s http://127.0.0.1:3000 > /dev/null 2>&1; then
    echo "✅ 本地应用可以访问"
else
    echo "❌ 本地应用无法访问"
    echo "   请检查 PM2 日志: pm2 logs my-doggy-love --err"
fi
echo ""

# 4. 检查 Nginx 状态
echo "4️⃣ 检查 Nginx 状态..."
if command -v nginx &> /dev/null; then
    if systemctl is-active --quiet nginx; then
        echo "✅ Nginx 服务运行中"
    else
        echo "❌ Nginx 服务未运行"
        echo "   启动命令: sudo systemctl start nginx"
    fi
    
    # 检查配置文件
    if sudo nginx -t 2>&1 | grep -q "successful"; then
        echo "✅ Nginx 配置正确"
    else
        echo "❌ Nginx 配置有误"
        sudo nginx -t
    fi
    
    # 检查配置文件是否存在
    if [ -f "/etc/nginx/conf.d/my-doggy-love.conf" ]; then
        echo "✅ Nginx 配置文件存在"
        echo "   配置文件: /etc/nginx/conf.d/my-doggy-love.conf"
    else
        echo "⚠️  Nginx 配置文件不存在"
        echo "   运行配置脚本: ./setup-nginx.sh"
    fi
else
    echo "⚠️  Nginx 未安装"
fi
echo ""

# 5. 检查 Nginx 端口
echo "5️⃣ 检查 Nginx 端口 (80)..."
if command -v netstat &> /dev/null; then
    PORT_80=$(netstat -tlnp 2>/dev/null | grep ':80 ' || echo "")
elif command -v ss &> /dev/null; then
    PORT_80=$(ss -tlnp 2>/dev/null | grep ':80 ' || echo "")
else
    PORT_80=$(lsof -i :80 2>/dev/null || echo "")
fi

if [ -n "$PORT_80" ]; then
    echo "✅ 端口 80 正在监听"
    echo "   $PORT_80"
else
    echo "❌ 端口 80 未监听"
    echo "   Nginx 可能未正常启动"
fi
echo ""

# 6. 检查防火墙 (firewalld)
echo "6️⃣ 检查防火墙 (firewalld)..."
if systemctl is-active --quiet firewalld 2>/dev/null; then
    echo "⚠️  firewalld 正在运行"
    HTTP_ENABLED=$(sudo firewall-cmd --list-services 2>/dev/null | grep -q http && echo "yes" || echo "no")
    HTTPS_ENABLED=$(sudo firewall-cmd --list-services 2>/dev/null | grep -q https && echo "yes" || echo "no")
    
    if [ "$HTTP_ENABLED" = "yes" ]; then
        echo "✅ HTTP (80) 端口已开放"
    else
        echo "❌ HTTP (80) 端口未开放"
        echo "   开放命令: sudo firewall-cmd --permanent --add-service=http"
        echo "   重新加载: sudo firewall-cmd --reload"
    fi
    
    if [ "$HTTPS_ENABLED" = "yes" ]; then
        echo "✅ HTTPS (443) 端口已开放"
    else
        echo "⚠️  HTTPS (443) 端口未开放（如果使用 HTTPS）"
    fi
else
    echo "ℹ️  firewalld 未运行或未安装"
fi
echo ""

# 7. 检查 iptables
echo "7️⃣ 检查 iptables..."
if command -v iptables &> /dev/null; then
    HTTP_RULE=$(sudo iptables -L -n 2>/dev/null | grep -E "ACCEPT.*80|ACCEPT.*tcp.*dpt:80" || echo "")
    if [ -n "$HTTP_RULE" ]; then
        echo "✅ iptables 中 80 端口已开放"
    else
        echo "⚠️  iptables 中 80 端口可能未开放"
        echo "   开放命令: sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT"
    fi
else
    echo "ℹ️  iptables 未安装"
fi
echo ""

# 8. 检查服务器监听地址
echo "8️⃣ 检查服务器监听地址..."
if command -v ss &> /dev/null; then
    LISTEN_80=$(ss -tlnp | grep ':80 ' || echo "")
    if echo "$LISTEN_80" | grep -q "0.0.0.0"; then
        echo "✅ Nginx 监听在所有接口 (0.0.0.0:80)"
    elif echo "$LISTEN_80" | grep -q "127.0.0.1"; then
        echo "❌ Nginx 只监听本地 (127.0.0.1:80)，无法外部访问"
        echo "   请检查 Nginx 配置中的 listen 指令"
    else
        echo "⚠️  无法确定监听地址: $LISTEN_80"
    fi
else
    echo "ℹ️  无法检查监听地址（ss 命令不可用）"
fi
echo ""

# 9. 测试本地 Nginx
echo "9️⃣ 测试本地 Nginx..."
if curl -s http://127.0.0.1 > /dev/null 2>&1; then
    echo "✅ 本地 Nginx 可以访问"
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1)
    echo "   HTTP 状态码: $HTTP_CODE"
else
    echo "❌ 本地 Nginx 无法访问"
    echo "   检查 Nginx 日志: sudo tail -f /var/log/nginx/error.log"
fi
echo ""

# 10. 显示配置摘要
echo "🔟 配置摘要..."
if [ -f "/etc/nginx/conf.d/my-doggy-love.conf" ]; then
    echo "Nginx 配置内容:"
    sudo grep -E "server_name|proxy_pass|listen" /etc/nginx/conf.d/my-doggy-love.conf | head -5
fi
echo ""

# 总结和建议
echo "📋 排查建议："
echo ""
echo "1. 如果 PM2 应用未运行："
echo "   pm2 start ecosystem.config.cjs"
echo ""
echo "2. 如果 Nginx 未运行："
echo "   sudo systemctl start nginx"
echo "   sudo systemctl enable nginx"
echo ""
echo "3. 如果防火墙未开放："
echo "   sudo firewall-cmd --permanent --add-service=http"
echo "   sudo firewall-cmd --reload"
echo ""
echo "4. 如果云服务器安全组未开放："
echo "   登录云服务器控制台，在安全组中开放 80 端口（入站规则）"
echo ""
echo "5. 查看详细日志："
echo "   pm2 logs my-doggy-love"
echo "   sudo tail -f /var/log/nginx/error.log"
echo "   sudo tail -f /var/log/nginx/access.log"
echo ""

