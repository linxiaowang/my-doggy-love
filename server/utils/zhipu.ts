/**
 * 智谱 AI API 调用工具
 * 文档: https://open.bigmodel.cn/dev/api
 */

const ZHIPU_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'

export interface ZhipuMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ZhipuStreamOptions {
  model?: string
  messages: ZhipuMessage[]
  temperature?: number
  maxTokens?: number
  topP?: number
}

export interface ZhipuStreamChunk {
  content: string
  done: boolean
}

/**
 * 智谱 AI 流式聊天
 * 使用 async generator 逐步返回 AI 响应内容
 */
export async function* streamZhipuChat(options: ZhipuStreamOptions): AsyncGenerator<string, void, unknown> {
  const apiKey = process.env.ZHIPU_API_KEY
  if (!apiKey) {
    throw new Error('ZHIPU_API_KEY not configured')
  }

  const response = await fetch(ZHIPU_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: options.model || 'glm-4-flash',
      messages: options.messages,
      stream: true,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens,
      top_p: options.topP,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error')
    throw new Error(`Zhipu API error: ${response.status} - ${errorText}`)
  }

  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmedLine = line.trim()
        if (!trimmedLine.startsWith('data: ')) continue

        const data = trimmedLine.slice(6).trim()
        if (data === '[DONE]') return

        try {
          const parsed = JSON.parse(data)
          const content = parsed.choices?.[0]?.delta?.content
          if (content) {
            yield content
          }
        } catch (e) {
          // Skip invalid JSON lines
          console.debug('[Zhipu] Skipping invalid JSON line:', data)
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}

/**
 * 智谱 AI 非流式聊天（用于测试或特殊场景）
 */
export async function zhipuChat(options: ZhipuStreamOptions): Promise<string> {
  const apiKey = process.env.ZHIPU_API_KEY
  if (!apiKey) {
    throw new Error('ZHIPU_API_KEY not configured')
  }

  const response = await fetch(ZHIPU_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: options.model || 'glm-4-flash',
      messages: options.messages,
      stream: false,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens,
      top_p: options.topP,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error')
    throw new Error(`Zhipu API error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || ''
}

/**
 * 获取支持的模型列表
 */
export const ZHIPU_MODELS = {
  FLASH: 'glm-4-flash',
  PLUS: 'glm-4-plus',
  AIR: 'glm-4-air',
  GLM_4: 'glm-4',
} as const

export type ZhipuModel = typeof ZHIPU_MODELS[keyof typeof ZHIPU_MODELS]
