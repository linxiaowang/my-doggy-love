import { _ as __nuxt_component_0 } from './nuxt-link-qMRI1Itf.mjs';
import { defineComponent, ref, computed, watch, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderTeleport, ssrRenderList } from 'vue/server-renderer';
import { u as useAuthStore, D as DogHeader } from './DogHeader-WAUZOG8S.mjs';
import { _ as _export_sfc, o as onClickOutside } from './server.mjs';
import { u as useCouple } from './couple-MECkzIa4.mjs';
import { u as useToast } from './useToast-kH6j-iEM.mjs';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const fileRef = ref(null);
    const couple = ref(null);
    const isEditingNickname = ref(false);
    const editingNickname = ref("");
    ref(null);
    const savingNickname = ref(false);
    const showAvatarModal = ref(false);
    const uploadingAvatar = ref(false);
    const selectedFile = ref(null);
    const avatarPreview = ref(null);
    const avatarModalRef = ref(null);
    useToast();
    const authStore = useAuthStore();
    const user = computed(() => authStore.user);
    const { data: coupleData } = useCouple();
    watch(coupleData, (newData) => {
      if (newData?.couple !== void 0) {
        couple.value = newData.couple;
      }
    }, { immediate: true });
    onClickOutside(avatarModalRef, () => {
      if (showAvatarModal.value && !uploadingAvatar.value) {
        cancelUploadAvatar();
      }
    });
    function cancelUploadAvatar() {
      showAvatarModal.value = false;
      uploadingAvatar.value = false;
      selectedFile.value = null;
      avatarPreview.value = null;
      if (fileRef.value) {
        fileRef.value.value = "";
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-50 dark:bg-slate-900" }, _attrs))} data-v-6dcfb87c>`);
      _push(ssrRenderComponent(DogHeader, { "user-override": unref(user) }, null, _parent));
      _push(`<div class="max-w-2xl mx-auto px-4 py-8" data-v-6dcfb87c><div class="card space-y-4" data-v-6dcfb87c><div class="text-lg" data-v-6dcfb87c>\u7528\u6237\u8D44\u6599</div>`);
      if (unref(user)) {
        _push(`<div class="flex items-center gap-4" data-v-6dcfb87c><div class="relative group" data-v-6dcfb87c><img${ssrRenderAttr("src", unref(user).avatarUrl || "/assets/images/xiaobai/xiaobai-2.png")} loading="lazy" class="w-16 h-16 rounded-full object-cover" data-v-6dcfb87c><button class="absolute inset-0 w-16 h-16 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" title="\u4FEE\u6539\u5934\u50CF" data-v-6dcfb87c><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-6dcfb87c><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" data-v-6dcfb87c></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" data-v-6dcfb87c></path></svg></button></div><div class="flex-1" data-v-6dcfb87c><div class="flex items-center gap-2" data-v-6dcfb87c>`);
        if (isEditingNickname.value) {
          _push(`<!--[--><input${ssrRenderAttr("value", editingNickname.value)} type="text" maxlength="20" class="border border-slate-200 dark:border-slate-700 rounded px-2 py-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-600 dark:focus:ring-amber-500 flex-1" data-v-6dcfb87c><button class="px-2 py-1 text-xs rounded bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 transition"${ssrIncludeBooleanAttr(savingNickname.value) ? " disabled" : ""} data-v-6dcfb87c>${ssrInterpolate(savingNickname.value ? "\u4FDD\u5B58\u4E2D..." : "\u4FDD\u5B58")}</button><button class="px-2 py-1 text-xs rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition"${ssrIncludeBooleanAttr(savingNickname.value) ? " disabled" : ""} data-v-6dcfb87c> \u53D6\u6D88 </button><!--]-->`);
        } else {
          _push(`<div class="font-medium flex items-center gap-2" data-v-6dcfb87c><span data-v-6dcfb87c>${ssrInterpolate(unref(user).nickName)}</span><button class="text-xs text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 ml-1 transition p-0.5" title="\u70B9\u51FB\u7F16\u8F91\u6635\u79F0" data-v-6dcfb87c><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-6dcfb87c><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" data-v-6dcfb87c></path></svg></button></div>`);
        }
        _push(`</div><div class="text-sm text-slate-500 dark:text-slate-400" data-v-6dcfb87c>${ssrInterpolate(unref(user).email)}</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      ssrRenderTeleport(_push, (_push2) => {
        if (showAvatarModal.value) {
          _push2(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" data-v-6dcfb87c><div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden" data-v-6dcfb87c><div class="p-6" data-v-6dcfb87c><div class="flex items-center justify-between mb-4" data-v-6dcfb87c><h3 class="text-lg font-semibold" data-v-6dcfb87c>\u4FEE\u6539\u5934\u50CF</h3><button class="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition"${ssrIncludeBooleanAttr(uploadingAvatar.value) ? " disabled" : ""} data-v-6dcfb87c><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-6dcfb87c><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-6dcfb87c></path></svg></button></div><div class="mb-4 flex justify-center" data-v-6dcfb87c><div class="relative" data-v-6dcfb87c><img${ssrRenderAttr("src", avatarPreview.value || unref(user)?.avatarUrl || "/assets/images/xiaobai/xiaobai-2.png")} class="w-32 h-32 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700" alt="\u5934\u50CF\u9884\u89C8" data-v-6dcfb87c></div></div><form class="space-y-4" data-v-6dcfb87c><div data-v-6dcfb87c><label class="block mb-2 text-sm text-slate-600 dark:text-slate-400" data-v-6dcfb87c>\u9009\u62E9\u56FE\u7247</label><input type="file" accept="image/*" class="block w-full text-sm text-slate-600 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-amber-600 file:text-white hover:file:bg-amber-700 dark:file:bg-amber-500 dark:hover:file:bg-amber-600 file:cursor-pointer cursor-pointer" data-v-6dcfb87c><p class="mt-1 text-xs text-slate-400 dark:text-slate-500" data-v-6dcfb87c>\u652F\u6301 JPG\u3001PNG\u3001GIF \u683C\u5F0F\uFF0C\u5EFA\u8BAE\u5C3A\u5BF8 200x200 \u50CF\u7D20</p></div><div class="flex gap-3" data-v-6dcfb87c><button type="button" class="flex-1 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition text-sm"${ssrIncludeBooleanAttr(uploadingAvatar.value) ? " disabled" : ""} data-v-6dcfb87c> \u53D6\u6D88 </button><button type="submit" class="flex-1 px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 transition text-sm"${ssrIncludeBooleanAttr(uploadingAvatar.value || !selectedFile.value) ? " disabled" : ""} data-v-6dcfb87c>${ssrInterpolate(uploadingAvatar.value ? "\u4E0A\u4F20\u4E2D..." : "\u4E0A\u4F20")}</button></div></form></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`<div class="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-3" data-v-6dcfb87c><div class="text-base" data-v-6dcfb87c>\u60C5\u4FA3\u5173\u7CFB</div>`);
      if (couple.value) {
        _push(`<!--[-->`);
        if (couple.value.members?.length >= 2) {
          _push(`<div class="flex items-center justify-between" data-v-6dcfb87c><div class="flex items-center gap-3" data-v-6dcfb87c><div class="text-sm" data-v-6dcfb87c>\u9080\u8BF7\u7801\uFF1A<span class="font-mono" data-v-6dcfb87c>${ssrInterpolate(couple.value.code)}</span></div><div class="flex -space-x-3" data-v-6dcfb87c><!--[-->`);
          ssrRenderList(couple.value.members, (m) => {
            _push(`<img${ssrRenderAttr("src", m.avatarUrl || "/assets/images/couple/couple-2.png")} class="w-8 h-8 rounded-full border-2 border-white" data-v-6dcfb87c>`);
          });
          _push(`<!--]--></div></div>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/user/couple",
            class: "text-sm underline"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`\u7BA1\u7406\u60C5\u4FA3`);
              } else {
                return [
                  createTextVNode("\u7BA1\u7406\u60C5\u4FA3")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<div class="text-sm text-slate-500 dark:text-slate-400" data-v-6dcfb87c> \u5DF2\u521B\u5EFA\u60C5\u4FA3\u4F46\u5C1A\u672A\u5B8C\u6210\u7ED1\u5B9A\uFF0C\u9080\u8BF7\u7801\uFF1A<span class="font-mono" data-v-6dcfb87c>${ssrInterpolate(couple.value.code)}</span>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/user/couple",
            class: "underline ml-1"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`\u53BB\u9080\u8BF7\u5BF9\u65B9`);
              } else {
                return [
                  createTextVNode("\u53BB\u9080\u8BF7\u5BF9\u65B9")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        }
        _push(`<!--]-->`);
      } else {
        _push(`<div class="text-sm text-slate-500 dark:text-slate-400" data-v-6dcfb87c>\u4F60\u8FD8\u6CA1\u6709\u7ED1\u5B9A\u60C5\u4FA3\u3002 `);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/user/couple",
          class: "underline ml-1"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`\u53BB\u7ED1\u5B9A`);
            } else {
              return [
                createTextVNode("\u53BB\u7ED1\u5B9A")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      }
      _push(`</div><div class="flex items-center gap-3 text-sm pt-2" data-v-6dcfb87c>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u8FD4\u56DE\u9996\u9875`);
          } else {
            return [
              createTextVNode("\u8FD4\u56DE\u9996\u9875")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button class="underline" data-v-6dcfb87c>\u9000\u51FA\u767B\u5F55</button></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/user/profile/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-6dcfb87c"]]);

export { index as default };
