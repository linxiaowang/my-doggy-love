import prisma from './db'

/**
 * 创建通知
 */
export async function createNotification(data: {
  userId: string
  type: string
  relatedId?: string | null
  content: string
}) {
  return await prisma.notification.create({
    data: {
      userId: data.userId,
      type: data.type,
      relatedId: data.relatedId,
      content: data.content,
    },
  })
}

/**
 * 获取情侣中的另一个成员
 */
export async function getPartner(coupleId: string, currentUserId: string) {
  const members = await prisma.coupleMember.findMany({
    where: { coupleId },
    include: { user: true },
  })
  
  // 找到不是当前用户的另一个成员
  const partner = members.find(m => m.userId !== currentUserId)
  return partner?.user || null
}

/**
 * 获取评论的作者（如果是回复，返回被回复的评论作者）
 */
export async function getCommentAuthor(commentId: string) {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: { author: true, parent: { include: { author: true } } },
  })
  
  if (!comment) return null
  
  // 如果是回复，返回被回复的评论作者；否则返回评论所属的帖子/留言的作者
  if (comment.parentId && comment.parent) {
    return comment.parent.author
  }
  
  // 如果是日常评论，返回日常作者
  if (comment.postId) {
    const post = await prisma.dailyPost.findUnique({
      where: { id: comment.postId },
      include: { author: true },
    })
    return post?.author || null
  }
  
  // 如果是留言评论，返回留言作者
  if (comment.messageId) {
    const message = await prisma.message.findUnique({
      where: { id: comment.messageId },
      include: { author: true },
    })
    return message?.author || null
  }
  
  return null
}

