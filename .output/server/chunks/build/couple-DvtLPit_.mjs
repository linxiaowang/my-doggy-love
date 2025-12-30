import { defineComponent, ref, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { u as useAuthStore, D as DogHeader } from './DogHeader-WAUZOG8S.mjs';
import { u as useCouple } from './couple-MECkzIa4.mjs';
import './nuxt-link-qMRI1Itf.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'pinia';
import 'vue-router';
import 'clsx';
import 'reka-ui';
import 'tailwind-merge';
import 'lucide-vue-next';
import '@vue/shared';
import 'perfect-debounce';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "couple",
  __ssrInlineRender: true,
  setup(__props) {
    const code = ref("");
    const switchCode = ref("");
    const copied = ref(false);
    const { data: coupleData, pending } = useCouple();
    const couple = computed(() => coupleData.value?.couple || null);
    const loading = computed(() => pending.value);
    const authStore = useAuthStore();
    const currentUserId = computed(() => authStore.user?.id || null);
    function formatStatusTime(time) {
      if (!time) return "";
      const date = new Date(time);
      const now = /* @__PURE__ */ new Date();
      const diff = now.getTime() - date.getTime();
      const minutes = Math.floor(diff / 6e4);
      const hours = Math.floor(diff / 36e5);
      const days = Math.floor(diff / 864e5);
      if (minutes < 1) return "刚刚";
      if (minutes < 60) return `${minutes}分钟前`;
      if (hours < 24) return `${hours}小时前`;
      if (days < 7) return `${days}天前`;
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${month}月${day}日`;
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-50 dark:bg-slate-900" }, _attrs))}>`);
      _push(ssrRenderComponent(DogHeader, null, null, _parent));
      _push(`<div class="max-w-xl mx-auto px-4 py-8"><div class="card space-y-4"><div class="text-lg">情侣绑定</div>`);
      if (loading.value) {
        _push(`<div class="text-sm text-slate-500 dark:text-slate-400">加载中…</div>`);
      } else if (couple.value) {
        _push(`<div class="space-y-4"><div class="flex items-center justify-between"><div>邀请码：<span class="font-mono">${ssrInterpolate(couple.value.code)}</span></div><button class="btn-secondary text-xs">${ssrInterpolate(copied.value ? "已复制" : "复制")}</button></div><div class="space-y-3"><!--[-->`);
        ssrRenderList(couple.value.members, (m) => {
          _push(`<div class="flex items-start gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 transition"><img${ssrRenderAttr("src", m.avatarUrl || "/assets/images/xiaojimao/xiaojimao-2.png")}${ssrRenderAttr("alt", m.nickName)} loading="lazy" class="w-12 h-12 rounded-full border-2 border-white object-cover flex-shrink-0"><div class="flex-1 min-w-0"><div class="flex items-center gap-2 mb-1"><span class="font-medium text-slate-900 dark:text-slate-100">${ssrInterpolate(m.nickName)}</span><span class="text-xs text-slate-400 dark:text-slate-500">（${ssrInterpolate(m.role === "A" ? "发起者" : "伴侣")}）</span></div>`);
          if (m.status) {
            _push(`<div class="flex items-center gap-2 mb-2"><span class="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400 text-sm">${ssrInterpolate(m.status)}</span>`);
            if (m.statusUpdatedAt) {
              _push(`<span class="text-xs text-slate-400 dark:text-slate-500">${ssrInterpolate(formatStatusTime(m.statusUpdatedAt))}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          } else {
            _push(`<div class="text-xs text-slate-400 dark:text-slate-500 mb-2">暂无状态</div>`);
          }
          _push(`<div class="flex items-center gap-2"><button class="text-xs text-amber-600 hover:text-amber-700 dark:text-amber-500 dark:hover:text-amber-400 underline">${ssrInterpolate(m.id === currentUserId.value ? "查看我的主页" : "查看主页")}</button></div></div></div>`);
        });
        _push(`<!--]--></div>`);
        if (couple.value.members.length === 1) {
          _push(`<div class="space-y-2"><div class="text-xs text-slate-500 dark:text-slate-400">已创建情侣：等待对方加入。你也可以直接加入对方的情侣（将切换绑定）。</div><form class="flex gap-2"><input${ssrRenderAttr("value", switchCode.value)} placeholder="输入对方的邀请码切换绑定" class="input"><button class="btn-secondary">切换加入</button></form></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<div class="space-y-4"><div class="text-sm text-slate-500 dark:text-slate-400">你还没有绑定情侣。可以创建情侣，或直接输入对方的邀请码加入。</div><div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center"><button class="btn-primary">创建情侣</button><form class="flex gap-2 w-full sm:w-auto"><input${ssrRenderAttr("value", code.value)} placeholder="输入邀请码（如 ABC123）" class="input w-full sm:w-56"><button class="btn-secondary">加入</button></form></div></div>`);
      }
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/user/couple.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
