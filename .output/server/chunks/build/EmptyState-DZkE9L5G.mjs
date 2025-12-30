import { _ as __nuxt_component_0 } from './nuxt-link-qMRI1Itf.mjs';
import { defineComponent, mergeProps, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "EmptyState",
  __ssrInlineRender: true,
  props: {
    text: { default: "\u6682\u65E0\u8BB0\u5F55" },
    img: { default: "/assets/images/xiaobai/xiaobai-4.png" },
    ctaText: {},
    ctaTo: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full py-16 flex flex-col items-center justify-center text-center animate-fade-in" }, _attrs))}><div class="relative mb-6"><img${ssrRenderAttr("src", __props.img)} loading="lazy" alt="empty" class="w-40 h-40 object-contain opacity-80 hover:opacity-100 transition-opacity duration-300 rounded-lg shadow-sm"><div class="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-background/30 pointer-events-none rounded-lg"></div></div><div class="text-base font-medium text-muted-foreground mb-4">${ssrInterpolate(__props.text)}</div>`);
      if (__props.ctaTo && __props.ctaText) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: __props.ctaTo,
          class: "inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-md transition-colors shadow-sm hover:shadow-md"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(__props.ctaText)}`);
            } else {
              return [
                createTextVNode(toDisplayString(__props.ctaText), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/EmptyState.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const EmptyState = Object.assign(_sfc_main, { __name: "EmptyState" });

export { EmptyState as E };
