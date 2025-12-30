import { _ as __nuxt_component_0 } from './nuxt-link-qMRI1Itf.mjs';
import { defineComponent, computed, ref, watch, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { D as DogHeader, a as apiFetch } from './DogHeader-WAUZOG8S.mjs';
import { b as useRoute } from './server.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'clsx';
import 'reka-ui';
import 'tailwind-merge';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'lucide-vue-next';
import '@vue/shared';
import 'perfect-debounce';
import 'pinia';
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const userId = computed(() => {
      const params = route.params;
      const id = params.id;
      if (!id) {
        return "";
      }
      const finalId = Array.isArray(id) ? id[0] : id;
      return finalId || "";
    });
    const user = ref(null);
    const loading = ref(true);
    function formatStatusTime(time) {
      if (!time) return "";
      const date = new Date(time);
      const now = /* @__PURE__ */ new Date();
      const diff = now.getTime() - date.getTime();
      const minutes = Math.floor(diff / 6e4);
      const hours = Math.floor(diff / 36e5);
      const days = Math.floor(diff / 864e5);
      if (minutes < 1) return "\u521A\u521A";
      if (minutes < 60) return `${minutes}\u5206\u949F\u524D`;
      if (hours < 24) return `${hours}\u5C0F\u65F6\u524D`;
      if (days < 7) return `${days}\u5929\u524D`;
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${month}\u6708${day}\u65E5`;
    }
    async function loadUser(userIdToLoad) {
      if (!userIdToLoad || userIdToLoad === "undefined") {
        loading.value = false;
        user.value = null;
        return;
      }
      loading.value = true;
      try {
        const res = await apiFetch(`/api/user/${userIdToLoad}`);
        user.value = res.user;
      } catch (e) {
        console.error("\u52A0\u8F7D\u7528\u6237\u4FE1\u606F\u5931\u8D25:", e);
        user.value = null;
      } finally {
        loading.value = false;
      }
    }
    watch(userId, async (newId) => {
      if (newId) {
        await loadUser(newId);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-50 dark:bg-slate-900" }, _attrs))}>`);
      _push(ssrRenderComponent(DogHeader, null, null, _parent));
      _push(`<div class="max-w-2xl mx-auto px-4 py-8"><div class="rounded-xl bg-white dark:bg-slate-800 p-6 shadow space-y-4"><div class="flex items-center gap-2 mb-4">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/user/couple",
        class: "text-sm text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u2190 \u8FD4\u56DE`);
          } else {
            return [
              createTextVNode("\u2190 \u8FD4\u56DE")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="text-lg">\u7528\u6237\u8D44\u6599</div>`);
      if (loading.value) {
        _push(`<div class="text-sm text-slate-500 dark:text-slate-400">\u52A0\u8F7D\u4E2D\u2026</div>`);
      } else if (user.value) {
        _push(`<div class="space-y-4"><div class="flex items-center gap-4"><img${ssrRenderAttr("src", user.value.avatarUrl || "/assets/images/xiaobai/xiaobai-2.png")}${ssrRenderAttr("alt", user.value.nickName)} loading="lazy" class="w-16 h-16 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700"><div class="flex-1"><div class="font-medium text-slate-900 dark:text-slate-100">${ssrInterpolate(user.value.nickName)}</div>`);
        if (user.value.status) {
          _push(`<div class="text-sm text-slate-600 dark:text-slate-400 mt-1"> \u72B6\u6001\uFF1A${ssrInterpolate(user.value.status)} `);
          if (user.value.statusUpdatedAt) {
            _push(`<span class="text-xs text-slate-400 dark:text-slate-500 ml-1"> (${ssrInterpolate(formatStatusTime(user.value.statusUpdatedAt))}) </span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<div class="text-xs text-slate-400 dark:text-slate-500 mt-1">\u6682\u65E0\u72B6\u6001</div>`);
        }
        _push(`</div></div><div class="border-t border-slate-200 dark:border-slate-700 pt-4"><div class="text-sm text-slate-500 dark:text-slate-400"><div class="mb-2">\u8FD9\u662F\u4F60\u7684\u60C5\u4FA3\u4F19\u4F34</div><div>\u4F60\u4EEC\u5171\u540C\u62E5\u6709\uFF1A\u65E5\u5E38\u8BB0\u5F55\u3001\u613F\u671B\u6E05\u5355\u3001\u7559\u8A00\u677F\u548C\u7EAA\u5FF5\u65E5</div></div></div></div>`);
      } else {
        _push(`<div class="text-sm text-slate-500 dark:text-slate-400">\u7528\u6237\u4E0D\u5B58\u5728\u6216\u65E0\u6743\u67E5\u770B</div>`);
      }
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/user/profile/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
