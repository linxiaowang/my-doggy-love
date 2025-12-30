import { d as defineEventHandler, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const vapidPublicKey_get = defineEventHandler((event) => {
  const config = useRuntimeConfig();
  return { key: config.public.vapidPublicKey };
});

export { vapidPublicKey_get as default };
