/**
 * WebSocket 处理器 - 参考 nuxt-chat 实现
 * 使用 Nitro 内置的 defineWebSocketHandler API
 */

import type { Peer } from 'crossws'
import { verifyToken } from '../utils/auth'

// 存储所有连接的用户信息
const connections = new Map<string, { peer: Peer; userId: string }>()
const roomUsers = new Map<string, Set<string>>() // roomId -> Set of userIds

export default defineWebSocketHandler({
  open(peer) {
    console.log('[WebSocket] Connection opened:', peer.id)

    // 从请求中获取 token 并验证
    const request = peer.request
    const cookieHeader = request.headers.get('cookie')
    let userId: string | null = null

    if (cookieHeader) {
      const cookies = cookieHeader.split(';').map(c => c.trim())
      const tokenCookie = cookies.find(c => c.startsWith('mdl_token='))
      if (tokenCookie) {
        const token = tokenCookie.slice('mdl_token='.length)
        const payload = verifyToken(token)
        if (payload) {
          userId = payload.userId
        }
      }
    }

    if (!userId) {
      console.log('[WebSocket] Unauthorized connection, closing...')
      peer.close()
      return
    }

    // 存储连接
    connections.set(peer.id, { peer, userId })

    console.log(`[WebSocket] User ${userId} connected (peer: ${peer.id})`)

    // 发送连接成功消息
    peer.send({
      event: 'connected',
      data: { connectionId: peer.id, userId },
    })
  },

  message(peer, message) {
    console.log('[WebSocket] Message from peer:', peer.id)

    try {
      const text = message.text()
      const data = JSON.parse(text)
      const { event, data: msgData } = data

      console.log('[WebSocket] Parsed event:', event, 'data:', msgData)

      const conn = connections.get(peer.id)
      if (!conn) {
        console.log('[WebSocket] No connection found for peer:', peer.id)
        return
      }

      switch (event) {
        case 'join_room':
          // 加入房间
          const roomId = msgData.roomId
          console.log('[WebSocket] User', conn.userId, 'joining room:', roomId)

          if (roomId) {
            // 使用 peer.subscribe 订阅房间频道
            peer.subscribe(roomId)

            // 记录房间用户
            if (!roomUsers.has(roomId)) {
              roomUsers.set(roomId, new Set())
            }
            roomUsers.get(roomId)!.add(conn.userId)

            console.log('[WebSocket] Room users:', Array.from(roomUsers.get(roomId) || []))
          }
          break

        case 'leave_room':
          // 离开房间
          const leaveRoomId = msgData.roomId
          if (leaveRoomId) {
            peer.unsubscribe(leaveRoomId)

            const roomUsersSet = roomUsers.get(leaveRoomId)
            if (roomUsersSet) {
              roomUsersSet.delete(conn.userId)
              if (roomUsersSet.size === 0) {
                roomUsers.delete(leaveRoomId)
              }
            }

            console.log('[WebSocket] User', conn.userId, 'left room:', leaveRoomId)
          }
          break

        case 'ping':
          // 心跳响应
          peer.send({
            event: 'pong',
            data: { timestamp: Date.now() },
          })
          break
      }
    } catch (error) {
      console.error('[WebSocket] Message handling error:', error)
    }
  },

  close(peer, details) {
    const conn = connections.get(peer.id)
    if (conn) {
      console.log(`[WebSocket] User ${conn.userId} disconnected (peer: ${peer.id})`)

      // 从所有房间中移除
      for (const [roomId, userIds] of roomUsers.entries()) {
        if (userIds.has(conn.userId)) {
          userIds.delete(conn.userId)
          if (userIds.size === 0) {
            roomUsers.delete(roomId)
          }
        }
      }

      connections.delete(peer.id)
    }
  },

  error(peer, error) {
    console.error('[WebSocket] Error:', peer, error)
  },
})

/**
 * 广播消息到指定房间的所有用户
 * 参考 nuxt-chat：使用 peer.publish 自动只发送给订阅了该房间的 peers
 */
export function broadcastToRoom(roomId: string, event: string, data: any) {
  console.log('[WebSocket] Broadcasting to room:', roomId, 'event:', event, 'data:', data)

  const message = { event, data }
  let sentCount = 0

  // 遍历所有连接，只向订阅了该房间的 peers 发送
  for (const [peerId, conn] of connections.entries()) {
    try {
      // peer.publish 会自动只发送给订阅了该频道的 peers
      conn.peer.publish(roomId, message)
      sentCount++
      console.log(`[WebSocket] Published to peer ${peerId} (user: ${conn.userId})`)
    } catch (error) {
      console.error(`[WebSocket] Failed to publish to ${peerId}:`, error)
    }
  }

  console.log(`[WebSocket] Broadcasted to ${sentCount} peers in room ${roomId}`)
}

/**
 * 获取连接统计信息
 */
export function getConnectionStats() {
  const userCount = new Set(Array.from(connections.values()).map(c => c.userId)).size
  const roomCount = roomUsers.size

  return {
    connections: connections.size,
    users: userCount,
    rooms: roomCount,
  }
}
