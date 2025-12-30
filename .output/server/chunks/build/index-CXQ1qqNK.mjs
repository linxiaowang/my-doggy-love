import { j as useNotifications, k as useUnreadNotificationCount, D as DogHeader, _ as _sfc_main$v, m as markAllNotificationsAsRead } from './DogHeader-WAUZOG8S.mjs';
import { defineComponent, ref, computed, watch, mergeProps, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { E as EmptyState } from './EmptyState-DZkE9L5G.mjs';
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

const pageSize = 20;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const items = ref([]);
    const loading = ref(true);
    const loadingMore = ref(false);
    const markingAllAsRead = ref(false);
    const cursor = ref(null);
    const hasMore = ref(false);
    const { data: notificationsData, pending } = useNotifications({ take: pageSize });
    const { data: unreadCountData, refresh: refreshUnreadCount } = useUnreadNotificationCount();
    const unreadCount = computed(() => unreadCountData.value?.count || 0);
    watch(notificationsData, (newData) => {
      if (newData?.items) {
        items.value = newData.items;
        hasMore.value = newData.items.length === pageSize;
        if (newData.items.length > 0) {
          cursor.value = newData.items[newData.items.length - 1].id;
        }
        loading.value = false;
      }
    }, { immediate: true });
    watch(pending, (newPending) => {
      if (!newPending && loading.value) {
        loading.value = false;
      }
    });
    async function markAllAsRead() {
      markingAllAsRead.value = true;
      try {
        await markAllNotificationsAsRead();
        items.value.forEach((item) => {
          item.read = true;
        });
        await refreshUnreadCount();
      } catch (e) {
        console.error("全部标记为已读失败:", e);
      } finally {
        markingAllAsRead.value = false;
      }
    }
    function formatTime(time) {
      const date = new Date(time);
      const now = /* @__PURE__ */ new Date();
      const diff = now.getTime() - date.getTime();
      const seconds = Math.floor(diff / 1e3);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      if (seconds < 60) {
        return "刚刚";
      } else if (minutes < 60) {
        return `${minutes}分钟前`;
      } else if (hours < 24) {
        return `${hours}小时前`;
      } else if (days < 7) {
        return `${days}天前`;
      } else {
        return date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Button = _sfc_main$v;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-50 dark:bg-slate-900" }, _attrs))}>`);
      _push(ssrRenderComponent(DogHeader, null, null, _parent));
      _push(`<div class="max-w-3xl mx-auto px-4 py-6"><div class="rounded-xl bg-white dark:bg-slate-800 p-4 shadow mb-4"><div class="flex items-center justify-between mb-4"><h1 class="text-xl font-semibold">通知</h1>`);
      if (unreadCount.value > 0) {
        _push(ssrRenderComponent(_component_Button, {
          size: "sm",
          class: "bg-amber-600 hover:bg-amber-700 text-white",
          onClick: markAllAsRead,
          disabled: markingAllAsRead.value
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(markingAllAsRead.value ? "处理中..." : "全部标记为已读")}`);
            } else {
              return [
                createTextVNode(toDisplayString(markingAllAsRead.value ? "处理中..." : "全部标记为已读"), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (loading.value) {
        _push(`<div class="space-y-3"><!--[-->`);
        ssrRenderList(5, (i) => {
          _push(`<div class="animate-pulse"><div class="h-16 bg-slate-200 dark:bg-slate-700 rounded"></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (items.value.length === 0) {
        _push(`<div class="text-center py-12">`);
        _push(ssrRenderComponent(EmptyState, {
          text: "暂无通知",
          img: "/assets/images/xiaojimao/xiaojimao-4.png"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="space-y-2"><!--[-->`);
        ssrRenderList(items.value, (notification) => {
          _push(`<div class="${ssrRenderClass([{ "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800": !notification.read }, "flex items-start gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"])}"><div class="flex-shrink-0 mt-1"><div class="${ssrRenderClass([notification.read ? "bg-transparent" : "bg-red-600", "w-2 h-2 rounded-full"])}"></div></div><div class="flex-1 min-w-0"><div class="text-sm text-slate-600 dark:text-slate-300">${ssrInterpolate(notification.content)}</div><div class="text-xs text-slate-400 dark:text-slate-500 mt-1">${ssrInterpolate(formatTime(notification.createdAt))}</div></div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      if (hasMore.value && !loading.value) {
        _push(`<div class="mt-4 flex justify-center"><button class="btn-secondary"${ssrIncludeBooleanAttr(loadingMore.value) ? " disabled" : ""}>${ssrInterpolate(loadingMore.value ? "加载中…" : "加载更多")}</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/notifications/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
