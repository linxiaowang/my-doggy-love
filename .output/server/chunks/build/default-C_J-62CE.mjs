import { _ as __nuxt_component_0, B as BottomNav } from './BottomNav-B8eqwSNL.mjs';
import { defineComponent, mergeProps, h, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderComponent, ssrRenderTeleport, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { u as useToast } from './useToast-kH6j-iEM.mjs';
import { _ as _export_sfc } from './server.mjs';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'pinia';
import 'vue-router';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Toast",
  __ssrInlineRender: true,
  setup(__props) {
    const { toasts } = useToast();
    function getToastClass(type) {
      const classes = {
        success: "bg-amber-600 text-white dark:bg-amber-500",
        error: "bg-red-500 text-white dark:bg-red-600",
        warning: "bg-amber-500 text-white dark:bg-amber-600",
        info: "bg-blue-500 text-white dark:bg-blue-600"
      };
      return classes[type] || classes.info;
    }
    function getIconClass(type) {
      const classes = {
        success: "text-white",
        error: "text-white",
        warning: "text-white",
        info: "text-white"
      };
      return classes[type] || classes.info;
    }
    function getCloseButtonClass(type) {
      return "text-white/90 hover:text-white hover:bg-white/10";
    }
    const ToastIcon = defineComponent({
      props: {
        type: {
          type: String,
          required: true
        },
        class: {
          type: String,
          default: ""
        }
      },
      setup(props) {
        const iconPaths = {
          success: "M5 13l4 4L19 7",
          error: "M6 18L18 6M6 6l12 12",
          warning: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
          info: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        };
        return () => h("svg", {
          class: `w-5 h-5 flex-shrink-0 ${props.class}`,
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24"
        }, [
          h("path", {
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "stroke-width": "2.5",
            d: iconPaths[props.type] || iconPaths.info
          })
        ]);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        _push2(`<div class="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none" data-v-dc524403><div${ssrRenderAttrs({ name: "toast" })} data-v-dc524403>`);
        ssrRenderList(unref(toasts), (toast) => {
          _push2(`<div class="${ssrRenderClass([getToastClass(toast.type), "px-6 py-3 rounded-xl shadow-xl flex items-center gap-3 pointer-events-auto min-w-[280px] max-w-[420px] backdrop-blur-sm"])}" role="alert"${ssrRenderAttr("aria-live", toast.type === "error" ? "assertive" : "polite")} data-v-dc524403>`);
          _push2(ssrRenderComponent(unref(ToastIcon), {
            type: toast.type,
            class: getIconClass(toast.type)
          }, null, _parent));
          _push2(`<span class="text-sm font-medium flex-1" data-v-dc524403>${ssrInterpolate(toast.message)}</span>`);
          if (toast.closable) {
            _push2(`<button class="${ssrRenderClass([getCloseButtonClass(toast.type), "flex-shrink-0 hover:opacity-70 transition-opacity rounded-md p-0.5 -mr-1"])}" aria-label="\u5173\u95ED\u901A\u77E5" data-v-dc524403><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-dc524403><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-dc524403></path></svg></button>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div>`);
        });
        _push2(`</div></div>`);
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Toast.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const Toast = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__scopeId", "data-v-dc524403"]]), { __name: "Toast" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Footer = __nuxt_component_0;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 pb-20 md:pb-0" }, _attrs))}><div class="max-w-6xl mx-auto px-4 md:px-6">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(ssrRenderComponent(_component_Footer, null, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(BottomNav, null, null, _parent));
      _push(ssrRenderComponent(Toast, null, null, _parent));
      _push(`</main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
