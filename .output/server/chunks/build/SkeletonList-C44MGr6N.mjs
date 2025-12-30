import { defineComponent, mergeProps, unref, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _sfc_main$7, d as _sfc_main$5 } from './Input-KB5-SBeR.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SkeletonList",
  __ssrInlineRender: true,
  props: {
    count: { default: 3 }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><!--[-->`);
      ssrRenderList(__props.count, (i) => {
        _push(ssrRenderComponent(unref(_sfc_main$7), {
          key: i,
          class: "animate-pulse"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(_sfc_main$5), { class: "space-y-3" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="flex items-center gap-2"${_scopeId2}><div class="h-4 w-24 bg-muted rounded"${_scopeId2}></div><div class="ml-auto h-3 w-16 bg-muted/60 rounded"${_scopeId2}></div></div><div class="space-y-2"${_scopeId2}><div class="h-4 w-full bg-muted rounded"${_scopeId2}></div><div class="h-4 w-4/5 bg-muted rounded"${_scopeId2}></div><div class="h-4 w-3/5 bg-muted rounded"${_scopeId2}></div></div><div class="grid grid-cols-3 gap-2"${_scopeId2}><div class="aspect-square bg-muted rounded-lg"${_scopeId2}></div><div class="aspect-square bg-muted rounded-lg"${_scopeId2}></div><div class="aspect-square bg-muted rounded-lg"${_scopeId2}></div></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "flex items-center gap-2" }, [
                        createVNode("div", { class: "h-4 w-24 bg-muted rounded" }),
                        createVNode("div", { class: "ml-auto h-3 w-16 bg-muted/60 rounded" })
                      ]),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode("div", { class: "h-4 w-full bg-muted rounded" }),
                        createVNode("div", { class: "h-4 w-4/5 bg-muted rounded" }),
                        createVNode("div", { class: "h-4 w-3/5 bg-muted rounded" })
                      ]),
                      createVNode("div", { class: "grid grid-cols-3 gap-2" }, [
                        createVNode("div", { class: "aspect-square bg-muted rounded-lg" }),
                        createVNode("div", { class: "aspect-square bg-muted rounded-lg" }),
                        createVNode("div", { class: "aspect-square bg-muted rounded-lg" })
                      ])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(_sfc_main$5), { class: "space-y-3" }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "flex items-center gap-2" }, [
                      createVNode("div", { class: "h-4 w-24 bg-muted rounded" }),
                      createVNode("div", { class: "ml-auto h-3 w-16 bg-muted/60 rounded" })
                    ]),
                    createVNode("div", { class: "space-y-2" }, [
                      createVNode("div", { class: "h-4 w-full bg-muted rounded" }),
                      createVNode("div", { class: "h-4 w-4/5 bg-muted rounded" }),
                      createVNode("div", { class: "h-4 w-3/5 bg-muted rounded" })
                    ]),
                    createVNode("div", { class: "grid grid-cols-3 gap-2" }, [
                      createVNode("div", { class: "aspect-square bg-muted rounded-lg" }),
                      createVNode("div", { class: "aspect-square bg-muted rounded-lg" }),
                      createVNode("div", { class: "aspect-square bg-muted rounded-lg" })
                    ])
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/SkeletonList.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const SkeletonList = Object.assign(_sfc_main, { __name: "SkeletonList" });

export { SkeletonList as S };
