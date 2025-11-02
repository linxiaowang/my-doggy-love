const fs = require('fs')
const path = require('path')

// 读取 .env 文件
function loadEnv() {
  const envPath = path.resolve(__dirname, '.env')
  const env = { NODE_ENV: 'production', PORT: 3000 }
  
  if (fs.existsSync(envPath)) {
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
  }
  
  return env
}

module.exports = {
  apps: [{
    name: 'my-doggy-love',
    script: '.output/server/index.mjs',
    instances: 1,
    exec_mode: 'fork',
    cwd: __dirname,
    env: loadEnv(),
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '500M',
    watch: false
  }]
}

