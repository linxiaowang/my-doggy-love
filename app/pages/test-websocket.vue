<template>
  <div class="p-4">
    <h1>WebSocket Test (参考 nuxt-chat)</h1>
    <div class="space-y-2">
      <p>Status: {{ status }}</p>
      <button @click="connect" class="px-4 py-2 bg-blue-500 text-white rounded">Connect</button>
      <button @click="disconnect" class="px-4 py-2 bg-red-500 text-white rounded">Disconnect</button>
      <button @click="joinRoom" class="px-4 py-2 bg-green-500 text-white rounded">Join Room</button>
      <button @click="ping" class="px-4 py-2 bg-yellow-500 text-white rounded">Ping</button>
    </div>
    <div class="mt-4 p-4 bg-gray-100 rounded">
      <h2>Messages:</h2>
      <div v-for="(msg, index) in messages" :key="index" class="p-2 border-b">
        {{ msg }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const status = ref<'disconnected' | 'connecting' | 'connected'>('disconnected')
const messages = ref<string[]>([])
let ws: WebSocket | null = null

function connect() {
  if (ws?.readyState === WebSocket.OPEN) {
    messages.value.push('Already connected')
    return
  }

  status.value = 'connecting'
  const isSecure = location.protocol === 'https:'
  const url = (isSecure ? 'wss://' : 'ws://') + location.host + '/api/chat-ws'
  messages.value.push(`Connecting to ${url}`)

  ws = new WebSocket(url)

  ws.onopen = () => {
    console.log('WebSocket connection opened')
    status.value = 'connected'
    messages.value.push('✅ Connected!')
  }

  ws.onmessage = async (event) => {
    console.log('WebSocket message received:', event.data)
    // 处理 Blob 类型消息
    let data
    if (event.data instanceof Blob) {
      const text = await event.data.text()
      data = JSON.parse(text)
    } else if (typeof event.data === 'string' && event.data.startsWith('{')) {
      data = JSON.parse(event.data)
    } else {
      data = { event: 'message', data: event.data }
    }

    messages.value.push(`📩 Received: ${JSON.stringify(data)}`)
  }

  ws.onerror = (error) => {
    console.error('WebSocket error:', error)
    messages.value.push(`❌ Error: ${JSON.stringify(error)}`)
  }

  ws.onclose = (event) => {
    console.log('WebSocket connection closed:', event)
    status.value = 'disconnected'
    messages.value.push(`🔌 Closed: ${event.code} - ${event.reason}`)
  }
}

function disconnect() {
  if (ws) {
    ws.close()
    ws = null
  }
}

function joinRoom() {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    messages.value.push('❌ Not connected')
    return
  }

  const payload = JSON.stringify({
    event: 'join_room',
    data: { roomId: 'conversation:test123' }
  })
  ws.send(payload)
  messages.value.push(`📤 Sent: ${payload}`)
}

function ping() {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    messages.value.push('❌ Not connected')
    return
  }

  const payload = JSON.stringify({
    event: 'ping',
    data: { timestamp: Date.now() }
  })
  ws.send(payload)
  messages.value.push(`📤 Sent: ${payload}`)
}
</script>
