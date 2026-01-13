/**
 * WebSocket 客户端 Composable
 * 参考 nuxt-chat 实现，使用原生 WebSocket API
 */

export type WebSocketStatus = 'CONNECTING' | 'OPEN' | 'CLOSED'
type WebSocketEventHandler = (data: any) => void

interface WebSocketOptions {
  autoReconnect?: boolean
  reconnectInterval?: number
}

// 事件处理器存储
const eventHandlers = new Map<string, Set<WebSocketEventHandler>>()

export function useWebSocketClient(options: WebSocketOptions = {}) {
  const {
    autoReconnect = true,
    reconnectInterval = 3000,
  } = options

  const status = ref<WebSocketStatus>('CLOSED')
  const ws = ref<WebSocket | null>(null)
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null
  let manualClose = false

  /**
   * 构建 WebSocket URL
   */
  function getWsUrl() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const host = window.location.host
    return `${protocol}//${host}/api/chat-ws`
  }

  /**
   * 连接 WebSocket
   */
  function connect() {
    if (ws.value?.readyState === WebSocket.OPEN) {
      console.log('[WebSocket] Already connected')
      return
    }

    manualClose = false
    status.value = 'CONNECTING'

    const url = getWsUrl()
    console.log('[WebSocket] Connecting to:', url)

    ws.value = new WebSocket(url)

    ws.value.onopen = () => {
      console.log('[WebSocket] Connected')
      status.value = 'OPEN'

      // 清除重连定时器
      if (reconnectTimer) {
        clearTimeout(reconnectTimer)
        reconnectTimer = null
      }
    }

    ws.value.onmessage = async (event) => {
      console.log('[WebSocket] Received raw message:', event.data)
      try {
        // 处理 Blob 类型消息（Nitro WebSocket 默认格式）
        let message: any
        if (event.data instanceof Blob) {
          const text = await event.data.text()
          console.log('[WebSocket] Blob text:', text)
          message = JSON.parse(text)
        } else if (typeof event.data === 'string' && event.data.startsWith('{')) {
          message = JSON.parse(event.data)
        } else {
          message = { event: 'message', data: event.data }
        }

        const { event: eventType, data } = message
        console.log('[WebSocket] Parsed message:', { eventType, data })

        // 调用所有注册的事件处理器
        const handlers = eventHandlers.get(eventType)
        if (handlers) {
          console.log(`[WebSocket] Found ${handlers.size} handlers for event: ${eventType}`)
          handlers.forEach(handler => {
            try {
              handler(data)
            } catch (error) {
              console.error(`[WebSocket] Error in handler for ${eventType}:`, error)
            }
          })
        } else {
          console.log(`[WebSocket] No handlers found for event: ${eventType}`)
        }

        // 触发通用消息处理器
        const allHandlers = eventHandlers.get('*')
        if (allHandlers) {
          allHandlers.forEach(handler => {
            try {
              handler({ event: eventType, data })
            } catch (error) {
              console.error('[WebSocket] Error in * handler:', error)
            }
          })
        }
      } catch (error) {
        console.error('[WebSocket] Failed to parse message:', error)
      }
    }

    ws.value.onclose = (event) => {
      console.log('[WebSocket] Disconnected:', event.code, event.reason)
      status.value = 'CLOSED'

      // 自动重连
      if (autoReconnect && !manualClose) {
        console.log('[WebSocket] Reconnecting in', reconnectInterval, 'ms...')
        reconnectTimer = setTimeout(() => {
          connect()
        }, reconnectInterval)
      }
    }

    ws.value.onerror = (error) => {
      console.error('[WebSocket] Error:', error)
    }
  }

  /**
   * 断开连接
   */
  function close() {
    manualClose = true
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
    if (ws.value) {
      ws.value.close()
      ws.value = null
    }
    status.value = 'CLOSED'
  }

  /**
   * 发送事件消息
   */
  function sendEvent(event: string, data: any) {
    if (ws.value?.readyState === WebSocket.OPEN) {
      const payload = JSON.stringify({ event, data })
      console.log('[WebSocket] Sending:', { event, data })
      ws.value.send(payload)
    } else {
      console.warn('[WebSocket] Cannot send, not connected')
    }
  }

  /**
   * 加入房间
   */
  function joinRoom(roomId: string) {
    console.log('[WebSocket] Joining room:', roomId)
    sendEvent('join_room', { roomId })
  }

  /**
   * 离开房间
   */
  function leaveRoom(roomId: string) {
    console.log('[WebSocket] Leaving room:', roomId)
    sendEvent('leave_room', { roomId })
  }

  /**
   * 注册事件监听器
   */
  function on(eventType: string, handler: WebSocketEventHandler) {
    if (!eventHandlers.has(eventType)) {
      eventHandlers.set(eventType, new Set())
    }
    eventHandlers.get(eventType)!.add(handler)

    // 返回取消订阅函数
    return () => {
      off(eventType, handler)
    }
  }

  /**
   * 取消事件监听器
   */
  function off(eventType: string, handler: WebSocketEventHandler) {
    const handlers = eventHandlers.get(eventType)
    if (handlers) {
      handlers.delete(handler)
      if (handlers.size === 0) {
        eventHandlers.delete(eventType)
      }
    }
  }

  /**
   * 发送心跳
   */
  function ping() {
    sendEvent('ping', { timestamp: Date.now() })
  }

  // 组件卸载时自动断开
  onUnmounted(() => {
    close()
  })

  return {
    status,
    send: sendEvent,
    connect,
    close,
    joinRoom,
    leaveRoom,
    on,
    off,
    ping,
    ws,
  }
}

// 创建全局单例
let globalWs: ReturnType<typeof useWebSocketClient> | null = null

export function useGlobalWebSocket() {
  if (!globalWs) {
    globalWs = useWebSocketClient({
      autoReconnect: true,
    })
    // 自动连接
    globalWs.connect()
  }
  return globalWs
}
