#!/bin/bash
# 验证 PM2 环境变量配置脚本

echo "🔍 验证 PM2 环境变量配置..."
echo ""

# 1. 检查 .env 文件
echo "1️⃣ 检查 .env 文件..."
if [ -f .env ]; then
    echo "✅ .env 文件存在"
    if grep -q "DATABASE_URL" .env; then
        DB_URL=$(grep "^DATABASE_URL=" .env | cut -d'=' -f2- | tr -d '"')
        echo "✅ DATABASE_URL 在 .env 中: ${DB_URL:0:50}..."
    else
        echo "❌ DATABASE_URL 不在 .env 中"
    fi
else
    echo "❌ .env 文件不存在"
fi
echo ""

# 2. 检查 ecosystem.config.cjs
echo "2️⃣ 检查 ecosystem.config.cjs..."
if [ -f ecosystem.config.cjs ]; then
    echo "✅ ecosystem.config.cjs 存在"
    if grep -q "loadEnv" ecosystem.config.cjs; then
        echo "✅ 包含 loadEnv 函数"
    else
        echo "⚠️  不包含 loadEnv 函数，环境变量可能无法加载"
    fi
else
    echo "❌ ecosystem.config.cjs 不存在"
fi
echo ""

# 3. 测试 PM2 环境变量加载
echo "3️⃣ 测试 PM2 环境变量..."
if command -v pm2 &> /dev/null; then
    # 创建一个测试脚本来验证环境变量
    cat > /tmp/test-pm2-env.js << 'TESTEOF'
const fs = require('fs')
const path = require('path')

function loadEnv() {
  const envPath = path.resolve(__dirname, '.env')
  const env = {}
  
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8')
    envFile.split('\n').forEach((line) => {
      const trimmedLine = line.trim()
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const match = trimmedLine.match(/^([^=]+)=(.*)$/)
        if (match) {
          const key = match[1].trim()
          let value = match[2].trim()
          if ((value.startsWith('"') && value.endsWith('"')) || 
              (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1)
          }
          env[key] = value
        }
      }
    })
  }
  
  return env
}

const env = loadEnv()
console.log('Loaded environment variables:')
console.log(JSON.stringify(env, null, 2))
TESTEOF

    cd "$(pwd)"
    node /tmp/test-pm2-env.js
    rm /tmp/test-pm2-env.js
else
    echo "⚠️  PM2 未安装"
fi
echo ""

# 4. 检查 PM2 进程的环境变量
echo "4️⃣ 检查运行中的 PM2 进程环境变量..."
if pm2 list | grep -q "my-doggy-love"; then
    echo "PM2 进程环境变量:"
    pm2 env $(pm2 jlist | grep -o '"name":"my-doggy-love"[^}]*"pm_id":[0-9]*' | grep -o '"pm_id":[0-9]*' | cut -d':' -f2) 2>/dev/null | grep -E "DATABASE_URL|NODE_ENV|PORT" || echo "无法获取环境变量"
else
    echo "⚠️  PM2 进程未运行"
fi
echo ""

# 5. 建议
echo "📋 修复建议："
echo ""
echo "如果环境变量未加载，执行："
echo "  1. 确保 ecosystem.config.cjs 已更新（包含 loadEnv 函数）"
echo "  2. 删除旧进程: pm2 delete my-doggy-love"
echo "  3. 重新启动: pm2 start ecosystem.config.cjs"
echo "  4. 验证: pm2 env 0 | grep DATABASE_URL"
echo ""

