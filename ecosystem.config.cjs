const fs = require('fs')
const path = require('path')

// 读取 .env 文件
function loadEnv() {
  const envPath = path.resolve(__dirname, '.env')
  const env = { NODE_ENV: 'production', PORT: 3000 }
  
  if (fs.existsSync(envPath)) {
    console.log('📄 正在从文件加载环境变量:', envPath)
    const envFile = fs.readFileSync(envPath, 'utf8')
    let loadedCount = 0
    
    envFile.split('\n').forEach((line, index) => {
      let trimmedLine = line.trim()
      
      // 跳过空行和纯注释行
      if (!trimmedLine || trimmedLine.startsWith('#')) {
        return
      }
      
      // 处理行内注释（去除 # 及之后的内容）
      const hashIndex = trimmedLine.indexOf(' #')
      if (hashIndex > 0) {
        trimmedLine = trimmedLine.substring(0, hashIndex).trim()
      }
      
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
        loadedCount++
      }
    })
    
    console.log(`✅ 已加载 ${loadedCount} 个环境变量`)
    console.log('   环境变量键:', Object.keys(env).filter(k => k !== 'NODE_ENV' && k !== 'PORT').join(', '))
  } else {
    console.warn('⚠️  .env 文件不存在:', envPath)
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

