#!/bin/bash
# API 500 错误修复脚本

set -e

echo "🔍 诊断 API 500 错误..."
echo ""

# 1. 检查 PM2 应用状态和日志
echo "1️⃣ 检查应用日志（查看具体错误）..."
if command -v pm2 &> /dev/null; then
    echo "📋 PM2 错误日志："
    pm2 logs my-doggy-love --lines 50 --err --nostream || echo "无法获取日志"
    echo ""
    echo "📋 PM2 输出日志："
    pm2 logs my-doggy-love --lines 50 --nostream || echo "无法获取日志"
else
    echo "⚠️  PM2 未安装"
fi
echo ""

# 2. 检查环境变量
echo "2️⃣ 检查环境变量..."
if [ -f .env ]; then
    echo "✅ .env 文件存在"
    
    if grep -q "DATABASE_URL" .env; then
        DB_URL=$(grep "^DATABASE_URL=" .env | cut -d'=' -f2- | tr -d '"')
        if echo "$DB_URL" | grep -q "%40"; then
            echo "✅ DATABASE_URL 中的密码已正确编码"
        else
            echo "⚠️  DATABASE_URL 中可能包含未编码的特殊字符"
        fi
        echo "   DATABASE_URL: ${DB_URL:0:50}..." # 只显示前50个字符
    else
        echo "❌ DATABASE_URL 未配置"
    fi
    
    if grep -q "AUTH_SECRET" .env; then
        echo "✅ AUTH_SECRET 已配置"
    else
        echo "⚠️  AUTH_SECRET 未配置（使用默认值）"
    fi
else
    echo "❌ .env 文件不存在"
fi
echo ""

# 3. 测试数据库连接
echo "3️⃣ 测试数据库连接..."
if command -v docker &> /dev/null; then
    if docker ps | grep -q my_doggy_love_mysql; then
        echo "✅ MySQL 容器正在运行"
        
        # 读取密码
        MYSQL_PASSWORD=$(grep "MYSQL_ROOT_PASSWORD:" docker-compose.yml | sed 's/.*MYSQL_ROOT_PASSWORD: //' | tr -d ' ' || echo "")
        
        if [ -n "$MYSQL_PASSWORD" ]; then
            if docker exec -e MYSQL_PWD="$MYSQL_PASSWORD" my_doggy_love_mysql mysqladmin ping -h localhost --silent -uroot 2>/dev/null; then
                echo "✅ MySQL 服务正常"
            else
                echo "❌ MySQL 服务无响应"
            fi
        fi
        
        # 测试数据库是否存在
        if [ -n "$MYSQL_PASSWORD" ]; then
            DB_EXISTS=$(docker exec -e MYSQL_PWD="$MYSQL_PASSWORD" my_doggy_love_mysql mysql -uroot -e "SHOW DATABASES LIKE 'my_doggy_love';" 2>/dev/null | grep -c "my_doggy_love" || echo "0")
            if [ "$DB_EXISTS" -gt 0 ]; then
                echo "✅ 数据库 'my_doggy_love' 存在"
            else
                echo "❌ 数据库 'my_doggy_love' 不存在"
                echo "   运行: pnpm prisma migrate deploy"
            fi
        fi
    else
        echo "❌ MySQL 容器未运行"
        echo "   启动: docker compose up -d"
    fi
else
    echo "⚠️  Docker 未安装"
fi
echo ""

# 4. 测试 Prisma 连接
echo "4️⃣ 测试 Prisma 连接..."
if command -v pnpm &> /dev/null; then
    if pnpm prisma migrate status 2>&1 | grep -q "Database schema is up to date\|All migrations have been applied"; then
        echo "✅ Prisma 连接正常，数据库已迁移"
    elif pnpm prisma migrate status 2>&1 | grep -q "P1000\|P1001"; then
        echo "❌ Prisma 数据库连接失败"
        echo "   检查 .env 文件中的 DATABASE_URL"
    else
        echo "⚠️  Prisma 迁移状态未知"
        pnpm prisma migrate status 2>&1 | head -5
    fi
else
    echo "⚠️  pnpm 未安装"
fi
echo ""

# 5. 检查应用端口
echo "5️⃣ 检查应用端口..."
if curl -s http://127.0.0.1:3000 > /dev/null 2>&1; then
    echo "✅ 应用本地访问正常"
else
    echo "❌ 应用本地无法访问"
    echo "   检查 PM2 状态: pm2 status"
fi
echo ""

# 6. 测试 API 端点
echo "6️⃣ 测试 API 端点..."
if curl -s -X POST http://127.0.0.1:3000/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"nickName":"test"}' 2>&1 | grep -q "error\|Error\|500"; then
    echo "❌ API 返回错误"
    echo "   详细响应:"
    curl -s -X POST http://127.0.0.1:3000/api/auth/register \
        -H "Content-Type: application/json" \
        -d '{"nickName":"test"}' || true
else
    echo "✅ API 端点响应正常"
fi
echo ""

# 7. 检查 Nginx 配置
echo "7️⃣ 检查 Nginx 配置..."
if [ -f "/etc/nginx/conf.d/my-doggy-love.conf" ]; then
    if sudo nginx -t 2>&1 | grep -q "successful"; then
        echo "✅ Nginx 配置正确"
    else
        echo "❌ Nginx 配置有误"
        sudo nginx -t
    fi
else
    echo "⚠️  Nginx 配置文件不存在"
fi
echo ""

# 总结和建议
echo "📋 修复建议："
echo ""
echo "1. 如果数据库连接失败："
echo "   检查 .env 文件: cat .env | grep DATABASE_URL"
echo "   确保密码已 URL 编码（@ -> %40）"
echo ""
echo "2. 如果数据库未创建："
echo "   pnpm prisma migrate deploy"
echo ""
echo "3. 如果应用未启动："
echo "   pm2 restart my-doggy-love"
echo "   pm2 logs my-doggy-love --err"
echo ""
echo "4. 如果 Prisma Client 未生成："
echo "   pnpm prisma generate"
echo ""
echo "5. 查看详细错误："
echo "   pm2 logs my-doggy-love --lines 100"
echo ""

