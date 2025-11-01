import { defineEventHandler } from 'h3'
import { setCookie } from 'h3'

export default defineEventHandler(async (event) => {
  setCookie(event, 'mdl_token', '', { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 0 })
  return { ok: true }
})


