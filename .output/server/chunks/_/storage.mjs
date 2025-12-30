import { promises } from 'node:fs';
import { join, dirname } from 'node:path';
import { f as readMultipartFormData } from '../nitro/nitro.mjs';
import OSS from 'ali-oss';

class LocalStorageService {
  constructor(baseDir = globalThis.process?.env?.UPLOAD_DIR || "public/uploads") {
    this.baseDir = baseDir;
  }
  async save(file, opts) {
    const now = /* @__PURE__ */ new Date();
    const yyyy = String(now.getFullYear());
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const prefix = opts?.prefix ? `${opts.prefix}/` : "";
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.filename.replace(/[^a-zA-Z0-9_.-]/g, "_")}`;
    const relPath = `${prefix}${yyyy}/${mm}/${dd}/${safeName}`;
    const absPath = join(this.baseDir, relPath);
    await promises.mkdir(dirname(absPath), { recursive: true });
    await promises.writeFile(absPath, file.data);
    const publicUrl = `/uploads/${relPath}`;
    const result = { url: publicUrl, path: absPath };
    if (opts?.generateThumbnail && file.type?.startsWith("image/")) {
      try {
        const sharp = await import('sharp');
        const thumbnailName = `thumb_${safeName}`;
        const thumbnailRelPath = `${prefix}${yyyy}/${mm}/${dd}/${thumbnailName}`;
        const thumbnailAbsPath = join(this.baseDir, thumbnailRelPath);
        const thumbnailBuffer = await sharp.default(file.data).resize(400, 400, {
          fit: "inside",
          withoutEnlargement: true
        }).jpeg({ quality: 80 }).toBuffer();
        await promises.writeFile(thumbnailAbsPath, thumbnailBuffer);
        result.thumbnailUrl = `/uploads/${thumbnailRelPath}`;
        result.thumbnailPath = thumbnailAbsPath;
      } catch (error) {
        console.warn("\u751F\u6210\u7F29\u7565\u56FE\u5931\u8D25:", error);
      }
    }
    return result;
  }
}
class OSSStorageService {
  client;
  customDomain;
  signUrlExpires;
  OSS_PREFIX = "oss:";
  constructor() {
    const env = globalThis.process?.env;
    const accessKeyId = env?.OSS_ACCESS_KEY_ID;
    const accessKeySecret = env?.OSS_ACCESS_KEY_SECRET;
    const bucket = env?.OSS_BUCKET;
    const region = env?.OSS_REGION;
    const endpoint = env?.OSS_ENDPOINT;
    this.customDomain = env?.OSS_CUSTOM_DOMAIN;
    this.signUrlExpires = parseInt(env?.OSS_SIGN_URL_EXPIRES || "31536000", 10);
    if (!accessKeyId || !accessKeySecret || !bucket) {
      console.error("[OSS Storage] \u914D\u7F6E\u7F3A\u5931!");
      throw new Error("OSS configuration is missing. Please set OSS_ACCESS_KEY_ID, OSS_ACCESS_KEY_SECRET, and OSS_BUCKET environment variables.");
    }
    const ossConfig = {
      accessKeyId,
      accessKeySecret,
      bucket,
      region: region || "oss-cn-hangzhou"
    };
    if (endpoint && endpoint.trim()) {
      let endpointValue = endpoint.trim();
      if (!endpointValue.startsWith("http://") && !endpointValue.startsWith("https://")) {
        endpointValue = `https://${endpointValue}`;
      }
      ossConfig.endpoint = endpointValue;
    }
    try {
      this.client = new OSS(ossConfig);
    } catch (error) {
      console.error("[OSS Storage] OSS \u5BA2\u6237\u7AEF\u521D\u59CB\u5316\u5931\u8D25:", error.message);
      console.error("[OSS Storage] \u9519\u8BEF\u8BE6\u60C5:", error);
      throw error;
    }
  }
  async save(file, opts) {
    const now = /* @__PURE__ */ new Date();
    const yyyy = String(now.getFullYear());
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const prefix = opts?.prefix ? `${opts.prefix}/` : "";
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.filename.replace(/[^a-zA-Z0-9_.-]/g, "_")}`;
    const objectName = `${prefix}${yyyy}/${mm}/${dd}/${safeName}`;
    await this.client.put(objectName, file.data, {
      mime: file.type || "application/octet-stream"
    });
    const storedUrl = `${this.OSS_PREFIX}${objectName}`;
    const result = {
      url: storedUrl,
      path: objectName
    };
    if (opts?.generateThumbnail && file.type?.startsWith("image/")) {
      try {
        const sharp = await import('sharp');
        const thumbnailName = `thumb_${safeName}`;
        const thumbnailObjectName = `${prefix}${yyyy}/${mm}/${dd}/${thumbnailName}`;
        const thumbnailBuffer = await sharp.default(file.data).resize(400, 400, {
          fit: "inside",
          withoutEnlargement: true
        }).jpeg({ quality: 80 }).toBuffer();
        await this.client.put(thumbnailObjectName, thumbnailBuffer, {
          mime: "image/jpeg"
        });
        result.thumbnailUrl = `${this.OSS_PREFIX}${thumbnailObjectName}`;
        result.thumbnailPath = thumbnailObjectName;
      } catch (error) {
        console.warn("\u751F\u6210\u7F29\u7565\u56FE\u5931\u8D25:", error);
      }
    }
    return result;
  }
  getSignedUrl(path, expires = 3600) {
    if (this.customDomain) {
      return this.client.signatureUrl(path, {
        expires,
        domain: this.customDomain
      });
    }
    return this.client.signatureUrl(path, {
      expires
    });
  }
  // 检查是否是 OSS 路径
  isOSSPath(url) {
    return url.startsWith(this.OSS_PREFIX);
  }
  // 从存储的 URL 中提取 OSS 对象路径
  getOSSPath(url) {
    if (this.isOSSPath(url)) {
      return url.substring(this.OSS_PREFIX.length);
    }
    return null;
  }
  // 将存储的 URL 转换为可访问的签名 URL
  toAccessibleUrl(storedUrl, expires) {
    const ossPath = this.getOSSPath(storedUrl);
    if (ossPath) {
      return this.getSignedUrl(ossPath, expires || this.signUrlExpires);
    }
    return storedUrl;
  }
}
function createStorageService() {
  const env = globalThis.process?.env;
  const useOSS = env?.OSS_ACCESS_KEY_ID && env?.OSS_ACCESS_KEY_SECRET && env?.OSS_BUCKET;
  if (useOSS) {
    return new OSSStorageService();
  }
  return new LocalStorageService();
}
async function parseMultipartToFileLikes(event) {
  const parts = await readMultipartFormData(event);
  if (!parts) return [];
  const files = [];
  for (const p of parts) {
    if (p && p.filename && p.data) {
      files.push({ filename: p.filename, type: p.type, data: p.data });
    }
  }
  return files;
}

export { createStorageService as c, parseMultipartToFileLikes as p };
