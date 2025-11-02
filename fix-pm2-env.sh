#!/bin/bash
# 修复 PM2 环境变量问题的完整脚本

set -e

echo "🔧 修复 PM2 环境变量问题..."
echo ""

PROJECT_DIR=$(pwd)
echo "📁 项目目录: $PROJECT_DIR"
echo ""

# 1. 检查 .env 文件
echo "1️⃣ 检查 .env 文件..."
if [ ! -f .env ]; then
    echo "❌ .env 文件不存在，请先创建"
    exit 1
fi

if ! grep -q "^DATABASE_URL=" .env; then
    echo "❌ .env 文件中没有 DATABASE_URL"
    exit 1
fi

echo "✅ .env 文件存在且包含 DATABASE_URL"
echo ""

# 2. 更新 ecosystem.config.cjs
echo "2️⃣ 更新 ecosystem.config.cjs..."
cat > ecosystem.config.cjs << 'EOF'
const fs = require('fs')
const path = require('path')

// 读取 .env 文件
function loadEnv() {
  const envPath = path.resolve(__dirname, '.env')
  const env = { NODE_ENV: 'production', PORT: 3000 }
  
  if (fs.existsSync(envPath)) {
    console.log('📄 Loading .env from:', envPath)
    const envFile = fs.readFileSync(envPath, 'utf8')
    envFile.split('\n').forEach((line) => {
      const trimmedLine = line.trim()
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const match = trimmedLine.match(/^([^=]+)=(.*)$/)
        if (match) {
          const key = match[1].trim()
          let value = match[2].trim()
          // 移除引号
          if ((value.startsWith('"') && value.endsWith('"')) || 
              (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1)
          }
          env[key] = value
        }
      }
    })
    console.log('✅ Loaded environment variables:', Object.keys(env).join(', '))
  } else {
    console.warn('⚠️  .env file not found at:', envPath)
  }
  
  return env
}

const env = loadEnv()

// 验证关键环境变量
if (!env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is missing in environment variables!')
  console.error('Please check your .env file.')
  process.exit(1)
}

module.exports = {
  apps: [{
    name: 'my-doggy-love',
    script: '.output/server/index.mjs',
    instances: 1,
    exec_mode: 'fork',
    cwd: __dirname,
    env: env,
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '500M',
    watch: false
  }]
}
EOF

echo "✅ ecosystem.config.cjs 已更新"
echo ""

# 3. 验证配置
echo "3️⃣ 验证配置..."
if node -e "const config = require('./ecosystem.config.cjs'); console.log('DATABASE_URL:', config.apps[0].env.DATABASE_URL ? '✅ Set' : '❌ Missing');" 2>/dev/null; then
    echo "✅ 配置验证通过"
else
    echo "⚠️  配置验证失败，但继续..."
fi
echo ""

# 4. 停止旧进程
echo "4️⃣ 停止旧的 PM2 进程..."
pm2 delete my-doggy-love 2>/dev/null || echo "  进程不存在或已停止"
echo ""

# 5. 重新构建（如果需要）
echo "5️⃣ 检查是否需要重新构建..."
if [ ! -d ".output" ] || [ ".output/server/index.mjs" -ot "server/utils/db.ts" ]; then
    echo "🔨 重新构建项目..."
    pnpm build
else
    echo "✅ 构建文件是最新的"
fi
echo ""

# 6. 启动应用
echo "6️⃣ 启动应用..."
pm2 start ecosystem.config.cjs
pm2 save
echo ""

# 7. 验证环境变量
echo "7️⃣ 验证 PM2 环境变量..."
sleep 2
PM2_ID=$(pm2 jlist | grep -o '"name":"my-doggy-love"[^}]*"pm_id":[0-9]*' | grep -o '"pm_id":[0-9]*' | cut -d':' -f2 | head -1)

if [ -n "$PM2_ID" ]; then
    echo "PM2 进程 ID: $PM2_ID"
    echo "环境变量检查:"
    pm2 env $PM2_ID 2>/dev/null | grep -E "DATABASE_URL|NODE_ENV|PORT" || echo "无法获取环境变量"
else
    echo "⚠️  无法获取 PM2 进程 ID"
fi
echo ""

# 8. 查看日志
echo "8️⃣ 查看应用启动日志..."
echo "等待 3 秒..."
sleep 3
pm2 logs my-doggy-love --lines 30 --nostream || echo "无法获取日志"
echo ""

# 9. 测试 API
echo "9️⃣ 测试 API..."
sleep 2
if curl -s -X POST http://127.0.0.1:3000/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"nickName":"test123"}' 2>&1 | grep -q "error\|Error\|undefined"; then
    echo "⚠️  API 仍有错误，查看详细日志:"
    pm2 logs my-doggy-love --lines 50 --err
else
    echo "✅ API 测试通过"
fi
echo ""

echo "🎉 修复完成！"
echo ""
echo "📋 下一步："
echo "  1. 查看日志: pm2 logs my-doggy-love"
echo "  2. 如果还有问题，运行: pm2 logs my-doggy-love --lines 100 --err"
echo "  3. 验证环境变量: pm2 env 0 | grep DATABASE_URL"
echo ""

