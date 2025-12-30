import nodeCrypto from 'node:crypto';
import { e as getCookie, s as setCookie } from '../nitro/nitro.mjs';

const AUTH_COOKIE = "mdl_token";
function getSecret() {
  return process.env.AUTH_SECRET || "dev-secret";
}
const TOKEN_EXPIRY_SECONDS = 10 * 365 * 24 * 60 * 60;
function hashPassword(password) {
  const salt = "mdl_salt";
  return nodeCrypto.createHmac("sha256", salt).update(password).digest("hex");
}
function signToken(payload) {
  const now = Math.floor(Date.now() / 1e3);
  const tokenPayload = {
    ...payload,
    exp: payload.exp || now + TOKEN_EXPIRY_SECONDS
  };
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify(tokenPayload)).toString("base64url");
  const sig = nodeCrypto.createHmac("sha256", getSecret()).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${sig}`;
}
function verifyToken(token) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, body, sig] = parts;
  const expected = nodeCrypto.createHmac("sha256", getSecret()).update(`${header}.${body}`).digest("base64url");
  if (expected !== sig) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString());
    return payload;
  } catch {
    return null;
  }
}
function setAuthCookie(event, token) {
  setCookie(event, AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: TOKEN_EXPIRY_SECONDS
    // 10 年，实际上永久有效
  });
}
function readAuthFromCookie(event) {
  const token = getCookie(event, AUTH_COOKIE);
  if (!token) return null;
  return verifyToken(token);
}
function getDeviceInfo(event) {
  const headers = event.node.req.headers;
  const userAgent = headers["user-agent"] || "Unknown";
  const ipAddress = headers["x-forwarded-for"]?.toString().split(",")[0] || headers["x-real-ip"]?.toString() || event.node.req.socket.remoteAddress || "Unknown";
  let deviceInfo = "Unknown";
  if (userAgent.includes("Mobile")) {
    deviceInfo = "Mobile";
  } else if (userAgent.includes("Tablet")) {
    deviceInfo = "Tablet";
  } else {
    deviceInfo = "Desktop";
  }
  return { userAgent, ipAddress, deviceInfo };
}

export { TOKEN_EXPIRY_SECONDS as T, setAuthCookie as a, getDeviceInfo as g, hashPassword as h, readAuthFromCookie as r, signToken as s };
