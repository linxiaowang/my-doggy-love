export const LINE_DOG_BASE = '/assets/stickers/line-dog'

export const lineDogSlugs = [
  'love',
  'yay',
  'come',
  'empty',
  'flower',
  'hug',
  'sad',
  'ok',
  'celebrate',
  'wave',
  'sleep',
  'heart',
  'hi',
  'hehe',
  'happy',
  'like',
  'stick',
  'cheer',
  'thanks',
  'done',
  'what',
  'tired',
  'curious',
  'angry',
  'expect',
  'dance',
  'pet',
  'together',
  'fly',
  'read',
] as const

export type LineDogSlug = (typeof lineDogSlugs)[number]

export type LineDogScene =
  | 'logo'
  | 'home'
  | 'login'
  | 'register'
  | 'cta'
  | 'success'
  | 'empty'
  | 'empty-daily'
  | 'empty-wishes'
  | 'empty-messages'
  | 'empty-anniversaries'
  | 'empty-notifications'
  | 'daily'
  | 'wishes'
  | 'messages'
  | 'anniversaries'
  | 'chat'
  | 'couple'
  | 'error'
  | 'nav-home'
  | 'nav-daily'
  | 'nav-wishes'
  | 'nav-messages'
  | 'nav-chat'

export const lineDogLabels: Record<LineDogSlug, string> = {
  love: '爱你',
  yay: '好耶',
  come: '来了',
  empty: '无聊',
  flower: '送你花花',
  hug: '抱抱',
  sad: '呜呜',
  ok: 'OK',
  celebrate: '庆祝',
  wave: '挥手',
  sleep: '晚安',
  heart: '送你心心',
  hi: '嗨',
  hehe: '嘿嘿',
  happy: '开心',
  like: '喜欢',
  stick: '贴贴',
  cheer: '加油',
  thanks: '谢谢',
  done: '完成',
  what: '什么',
  tired: '瘫',
  curious: '疑问',
  angry: '生气',
  expect: '期待',
  dance: '啦啦啦',
  pet: '摸头',
  together: '一起走',
  fly: '起飞',
  read: '看书',
}

export const lineDogScenes: Record<LineDogScene, LineDogSlug> = {
  logo: 'love',
  home: 'love',
  login: 'come',
  register: 'hi',
  cta: 'yay',
  success: 'celebrate',
  empty: 'empty',
  'empty-daily': 'tired',
  'empty-wishes': 'expect',
  'empty-messages': 'flower',
  'empty-anniversaries': 'hug',
  'empty-notifications': 'curious',
  daily: 'happy',
  wishes: 'flower',
  messages: 'heart',
  anniversaries: 'hug',
  chat: 'hehe',
  couple: 'stick',
  error: 'sad',
  'nav-home': 'love',
  'nav-daily': 'happy',
  'nav-wishes': 'flower',
  'nav-messages': 'heart',
  'nav-chat': 'hehe',
}

export function lineDogSrc(slug: LineDogSlug): string {
  return `${LINE_DOG_BASE}/${slug}.gif`
}

export function lineDogForScene(scene: LineDogScene): { slug: LineDogSlug, src: string, label: string } {
  const slug = lineDogScenes[scene]
  return {
    slug,
    src: lineDogSrc(slug),
    label: lineDogLabels[slug],
  }
}
