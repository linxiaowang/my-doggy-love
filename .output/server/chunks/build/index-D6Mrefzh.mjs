import { defineComponent, ref, mergeProps, unref, withCtx, createTextVNode, createVNode, withModifiers, toDisplayString, renderSlot, createBlock, createCommentVNode, openBlock, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
import { D as DogHeader, _ as _sfc_main$v, d as _sfc_main$2$1, c as cn, a as apiFetch } from './DogHeader-WAUZOG8S.mjs';
import { E as EmptyState } from './EmptyState-DZkE9L5G.mjs';
import { S as SkeletonList } from './SkeletonList-C44MGr6N.mjs';
import { _ as _sfc_main$7$1, d as _sfc_main$5$1, e as _sfc_main$b } from './Input-KB5-SBeR.mjs';
import { _ as _sfc_main$c } from './Label-2yaGIUAD.mjs';
import { useForwardPropsEmits, DialogRoot, DialogPortal, DialogContent, DialogClose, useForwardProps, DialogTitle, DialogOverlay, DialogDescription, DialogTrigger } from 'reka-ui';
import { X } from 'lucide-vue-next';
import { r as reactiveOmit } from './server.mjs';
import { c as createAnniversary, d as deleteAnniversary, a as updateAnniversary } from './anniversaries-Gt0Z5ZnN.mjs';
import dayjs from 'dayjs';
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
import 'clsx';
import 'tailwind-merge';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import '@vue/shared';
import 'perfect-debounce';
import 'pinia';
import 'vue-router';

const _sfc_main$a = /* @__PURE__ */ defineComponent({
  __name: "Dialog",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    defaultOpen: { type: Boolean },
    modal: { type: Boolean }
  },
  emits: ["update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const forwarded = useForwardPropsEmits(props, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DialogRoot), mergeProps({ "data-slot": "dialog" }, unref(forwarded), _attrs), {
        default: withCtx((slotProps, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", slotProps, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default", slotProps)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/dialog/Dialog.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "DialogClose",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DialogClose), mergeProps({ "data-slot": "dialog-close" }, props, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/dialog/DialogClose.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "DialogOverlay",
  __ssrInlineRender: true,
  props: {
    forceMount: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = reactiveOmit(props, "class");
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DialogOverlay), mergeProps({ "data-slot": "dialog-overlay" }, unref(delegatedProps), {
        class: unref(cn)("data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80", props.class)
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/dialog/DialogOverlay.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  ...{
    inheritAttrs: false
  },
  __name: "DialogContent",
  __ssrInlineRender: true,
  props: {
    forceMount: { type: Boolean },
    disableOutsidePointerEvents: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {},
    showCloseButton: { type: Boolean, default: true }
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "openAutoFocus", "closeAutoFocus"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const delegatedProps = reactiveOmit(props, "class");
    const forwarded = useForwardPropsEmits(delegatedProps, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DialogPortal), _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$8, null, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(DialogContent), mergeProps({ "data-slot": "dialog-content" }, { ..._ctx.$attrs, ...unref(forwarded) }, {
              class: unref(cn)(
                "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
                props.class
              )
            }), {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push3, _parent3, _scopeId2);
                  if (__props.showCloseButton) {
                    _push3(ssrRenderComponent(unref(DialogClose), {
                      "data-slot": "dialog-close",
                      class: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(X), null, null, _parent4, _scopeId3));
                          _push4(`<span class="sr-only"${_scopeId3}>Close</span>`);
                        } else {
                          return [
                            createVNode(unref(X)),
                            createVNode("span", { class: "sr-only" }, "Close")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    renderSlot(_ctx.$slots, "default"),
                    __props.showCloseButton ? (openBlock(), createBlock(unref(DialogClose), {
                      key: 0,
                      "data-slot": "dialog-close",
                      class: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(X)),
                        createVNode("span", { class: "sr-only" }, "Close")
                      ]),
                      _: 1
                    })) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$8),
              createVNode(unref(DialogContent), mergeProps({ "data-slot": "dialog-content" }, { ..._ctx.$attrs, ...unref(forwarded) }, {
                class: unref(cn)(
                  "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
                  props.class
                )
              }), {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default"),
                  __props.showCloseButton ? (openBlock(), createBlock(unref(DialogClose), {
                    key: 0,
                    "data-slot": "dialog-close",
                    class: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(X)),
                      createVNode("span", { class: "sr-only" }, "Close")
                    ]),
                    _: 1
                  })) : createCommentVNode("", true)
                ]),
                _: 3
              }, 16, ["class"])
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/dialog/DialogContent.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "DialogDescription",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = reactiveOmit(props, "class");
    const forwardedProps = useForwardProps(delegatedProps);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DialogDescription), mergeProps({ "data-slot": "dialog-description" }, unref(forwardedProps), {
        class: unref(cn)("text-muted-foreground text-sm", props.class)
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/dialog/DialogDescription.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "DialogFooter",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        "data-slot": "dialog-footer",
        class: unref(cn)("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/dialog/DialogFooter.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "DialogHeader",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        "data-slot": "dialog-header",
        class: unref(cn)("flex flex-col gap-2 text-center sm:text-left", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/dialog/DialogHeader.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  ...{
    inheritAttrs: false
  },
  __name: "DialogScrollContent",
  __ssrInlineRender: true,
  props: {
    forceMount: { type: Boolean },
    disableOutsidePointerEvents: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "openAutoFocus", "closeAutoFocus"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const delegatedProps = reactiveOmit(props, "class");
    const forwarded = useForwardPropsEmits(delegatedProps, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DialogPortal), _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(DialogOverlay), { class: "fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(DialogContent), mergeProps({
                    class: unref(cn)(
                      "relative z-50 grid w-full max-w-lg my-8 gap-4 border border-border bg-background p-6 shadow-lg duration-200 sm:rounded-lg md:w-full",
                      props.class
                    )
                  }, { ..._ctx.$attrs, ...unref(forwarded) }, {
                    onPointerDownOutside: (event) => {
                      const originalEvent = event.detail.originalEvent;
                      const target = originalEvent.target;
                      if (originalEvent.offsetX > target.clientWidth || originalEvent.offsetY > target.clientHeight) {
                        event.preventDefault();
                      }
                    }
                  }), {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push4, _parent4, _scopeId3);
                        _push4(ssrRenderComponent(unref(DialogClose), { class: "absolute top-4 right-4 p-0.5 transition-colors rounded-md hover:bg-secondary" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(X), { class: "w-4 h-4" }, null, _parent5, _scopeId4));
                              _push5(`<span class="sr-only"${_scopeId4}>Close</span>`);
                            } else {
                              return [
                                createVNode(unref(X), { class: "w-4 h-4" }),
                                createVNode("span", { class: "sr-only" }, "Close")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          renderSlot(_ctx.$slots, "default"),
                          createVNode(unref(DialogClose), { class: "absolute top-4 right-4 p-0.5 transition-colors rounded-md hover:bg-secondary" }, {
                            default: withCtx(() => [
                              createVNode(unref(X), { class: "w-4 h-4" }),
                              createVNode("span", { class: "sr-only" }, "Close")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 3
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(DialogContent), mergeProps({
                      class: unref(cn)(
                        "relative z-50 grid w-full max-w-lg my-8 gap-4 border border-border bg-background p-6 shadow-lg duration-200 sm:rounded-lg md:w-full",
                        props.class
                      )
                    }, { ..._ctx.$attrs, ...unref(forwarded) }, {
                      onPointerDownOutside: (event) => {
                        const originalEvent = event.detail.originalEvent;
                        const target = originalEvent.target;
                        if (originalEvent.offsetX > target.clientWidth || originalEvent.offsetY > target.clientHeight) {
                          event.preventDefault();
                        }
                      }
                    }), {
                      default: withCtx(() => [
                        renderSlot(_ctx.$slots, "default"),
                        createVNode(unref(DialogClose), { class: "absolute top-4 right-4 p-0.5 transition-colors rounded-md hover:bg-secondary" }, {
                          default: withCtx(() => [
                            createVNode(unref(X), { class: "w-4 h-4" }),
                            createVNode("span", { class: "sr-only" }, "Close")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 3
                    }, 16, ["class", "onPointerDownOutside"])
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(DialogOverlay), { class: "fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" }, {
                default: withCtx(() => [
                  createVNode(unref(DialogContent), mergeProps({
                    class: unref(cn)(
                      "relative z-50 grid w-full max-w-lg my-8 gap-4 border border-border bg-background p-6 shadow-lg duration-200 sm:rounded-lg md:w-full",
                      props.class
                    )
                  }, { ..._ctx.$attrs, ...unref(forwarded) }, {
                    onPointerDownOutside: (event) => {
                      const originalEvent = event.detail.originalEvent;
                      const target = originalEvent.target;
                      if (originalEvent.offsetX > target.clientWidth || originalEvent.offsetY > target.clientHeight) {
                        event.preventDefault();
                      }
                    }
                  }), {
                    default: withCtx(() => [
                      renderSlot(_ctx.$slots, "default"),
                      createVNode(unref(DialogClose), { class: "absolute top-4 right-4 p-0.5 transition-colors rounded-md hover:bg-secondary" }, {
                        default: withCtx(() => [
                          createVNode(unref(X), { class: "w-4 h-4" }),
                          createVNode("span", { class: "sr-only" }, "Close")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 3
                  }, 16, ["class", "onPointerDownOutside"])
                ]),
                _: 3
              })
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/dialog/DialogScrollContent.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "DialogTitle",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = reactiveOmit(props, "class");
    const forwardedProps = useForwardProps(delegatedProps);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DialogTitle), mergeProps({ "data-slot": "dialog-title" }, unref(forwardedProps), {
        class: unref(cn)("text-lg leading-none font-semibold", props.class)
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/dialog/DialogTitle.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "DialogTrigger",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DialogTrigger), mergeProps({ "data-slot": "dialog-trigger" }, props, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/dialog/DialogTrigger.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const items = ref([]);
    const title = ref("");
    const date = ref("");
    const loading = ref(true);
    const editing = ref(false);
    const editId = ref("");
    const editTitle = ref("");
    const editDate = ref("");
    const formatStates = ref({});
    function formatCountdown(days, format, anniversaryDate) {
      const absDays = Math.abs(days);
      switch (format) {
        case "years":
          if (absDays >= 365) {
            if (anniversaryDate) {
              const today = dayjs();
              const target = dayjs(anniversaryDate);
              const years = Math.abs(today.diff(target, "year"));
              const earlier = today.isBefore(target) ? today : target;
              const later = today.isAfter(target) ? today : target;
              const afterYears = earlier.add(years, "year");
              const remainingDays = Math.abs(later.diff(afterYears, "day"));
              if (remainingDays === 0) {
                return `${years}\u5E74`;
              }
              return `${years}\u5E74${remainingDays}\u5929`;
            } else {
              const years = Math.floor(absDays / 365);
              const remainingDays = absDays % 365;
              if (remainingDays === 0) {
                return `${years}\u5E74`;
              }
              return `${years}\u5E74${remainingDays}\u5929`;
            }
          }
          return formatCountdown(days, "months", anniversaryDate);
        case "months":
          if (absDays >= 30) {
            if (anniversaryDate) {
              const today = dayjs();
              const target = dayjs(anniversaryDate);
              const months = Math.abs(today.diff(target, "month"));
              const earlier = today.isBefore(target) ? today : target;
              const later = today.isAfter(target) ? today : target;
              const afterMonths = earlier.add(months, "month");
              const remainingDays = Math.abs(later.diff(afterMonths, "day"));
              if (remainingDays === 0) {
                return `${months}\u4E2A\u6708`;
              }
              return `${months}\u4E2A\u6708${remainingDays}\u5929`;
            } else {
              const months = Math.floor(absDays / 30);
              const remainingDays = absDays % 30;
              if (remainingDays === 0) {
                return `${months}\u4E2A\u6708`;
              }
              return `${months}\u4E2A\u6708${remainingDays}\u5929`;
            }
          }
          return formatCountdown(days, "weeks", anniversaryDate);
        case "weeks":
          if (absDays >= 7) {
            const weeks = Math.floor(absDays / 7);
            const remainingDays = absDays % 7;
            if (remainingDays === 0) {
              return `${weeks}\u5468`;
            }
            return `${weeks}\u5468${remainingDays}\u5929`;
          }
          return formatCountdown(days, "days", anniversaryDate);
        case "days":
        default:
          return `${absDays}\u5929`;
      }
    }
    function toggleFormat(id, days) {
      const absDays = Math.abs(days);
      const currentFormat = formatStates.value[id] || "days";
      if (absDays >= 365) {
        if (currentFormat === "days") {
          formatStates.value[id] = "weeks";
        } else if (currentFormat === "weeks") {
          formatStates.value[id] = "months";
        } else if (currentFormat === "months") {
          formatStates.value[id] = "years";
        } else {
          formatStates.value[id] = "days";
        }
      } else if (absDays >= 30) {
        if (currentFormat === "days") {
          formatStates.value[id] = "weeks";
        } else if (currentFormat === "weeks") {
          formatStates.value[id] = "months";
        } else {
          formatStates.value[id] = "days";
        }
      } else if (absDays >= 7) {
        if (currentFormat === "days") {
          formatStates.value[id] = "weeks";
        } else {
          formatStates.value[id] = "days";
        }
      }
    }
    function meta(a) {
      const today = /* @__PURE__ */ new Date();
      const d = new Date(a.date);
      const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
      const t1 = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      const diffDays = Math.round((t1 - t0) / (24 * 60 * 60 * 1e3));
      const overdue = diffDays < 0;
      const currentFormat = formatStates.value[a.id] || "days";
      const formattedText = diffDays === 0 ? "\u5C31\u662F\u4ECA\u5929" : overdue ? `\u5DF2\u7ECF ${formatCountdown(diffDays, currentFormat, a.date)}` : `\u8FD8\u6709 ${formatCountdown(diffDays, currentFormat, a.date)}`;
      return { days: diffDays, overdue, label: formattedText, canToggle: Math.abs(diffDays) >= 7 };
    }
    async function load() {
      loading.value = true;
      try {
        const res = await apiFetch("/api/anniversaries");
        items.value = res.items;
        formatStates.value = {};
      } catch (e) {
        console.error("\u52A0\u8F7D\u7EAA\u5FF5\u65E5\u5217\u8868\u5931\u8D25:", e);
      } finally {
        loading.value = false;
      }
    }
    async function create() {
      if (!title.value || !date.value) return;
      try {
        await createAnniversary({ title: title.value, date: date.value });
        title.value = "";
        date.value = "";
        await load();
      } catch (e) {
        console.error("\u521B\u5EFA\u7EAA\u5FF5\u65E5\u5931\u8D25:", e);
      }
    }
    async function remove(id) {
      try {
        await deleteAnniversary(id);
        await load();
      } catch (e) {
        console.error("\u5220\u9664\u7EAA\u5FF5\u65E5\u5931\u8D25:", e);
      }
    }
    function openEdit(a) {
      editId.value = a.id;
      editTitle.value = a.title;
      editDate.value = a.date.slice(0, 10);
      editing.value = true;
    }
    function closeEdit() {
      editing.value = false;
    }
    async function saveEdit() {
      if (!editId.value) return;
      try {
        await updateAnniversary(editId.value, { title: editTitle.value, date: editDate.value });
        editing.value = false;
        await load();
      } catch (e) {
        console.error("\u66F4\u65B0\u7EAA\u5FF5\u65E5\u5931\u8D25:", e);
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-50 dark:bg-slate-900" }, _attrs))}>`);
      _push(ssrRenderComponent(DogHeader, null, null, _parent));
      _push(`<div class="max-w-3xl mx-auto px-4 py-6 space-y-4">`);
      _push(ssrRenderComponent(unref(_sfc_main$7$1), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$5$1), { class: "px-4" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<form class="flex flex-col md:flex-row gap-3"${_scopeId2}><div class="flex-1 md:flex-[2]"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$b), {
                    modelValue: title.value,
                    "onUpdate:modelValue": ($event) => title.value = $event,
                    placeholder: "\u7EAA\u5FF5\u65E5\u6807\u9898"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div><div class="flex-1"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$b), {
                    modelValue: date.value,
                    "onUpdate:modelValue": ($event) => date.value = $event,
                    type: "date"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$v), {
                    type: "submit",
                    class: "md:w-auto"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`\u521B\u5EFA`);
                      } else {
                        return [
                          createTextVNode("\u521B\u5EFA")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</form>`);
                } else {
                  return [
                    createVNode("form", {
                      class: "flex flex-col md:flex-row gap-3",
                      onSubmit: withModifiers(create, ["prevent"])
                    }, [
                      createVNode("div", { class: "flex-1 md:flex-[2]" }, [
                        createVNode(unref(_sfc_main$b), {
                          modelValue: title.value,
                          "onUpdate:modelValue": ($event) => title.value = $event,
                          placeholder: "\u7EAA\u5FF5\u65E5\u6807\u9898"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      createVNode("div", { class: "flex-1" }, [
                        createVNode(unref(_sfc_main$b), {
                          modelValue: date.value,
                          "onUpdate:modelValue": ($event) => date.value = $event,
                          type: "date"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      createVNode(unref(_sfc_main$v), {
                        type: "submit",
                        class: "md:w-auto"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("\u521B\u5EFA")
                        ]),
                        _: 1
                      })
                    ], 32)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$5$1), { class: "px-4" }, {
                default: withCtx(() => [
                  createVNode("form", {
                    class: "flex flex-col md:flex-row gap-3",
                    onSubmit: withModifiers(create, ["prevent"])
                  }, [
                    createVNode("div", { class: "flex-1 md:flex-[2]" }, [
                      createVNode(unref(_sfc_main$b), {
                        modelValue: title.value,
                        "onUpdate:modelValue": ($event) => title.value = $event,
                        placeholder: "\u7EAA\u5FF5\u65E5\u6807\u9898"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    createVNode("div", { class: "flex-1" }, [
                      createVNode(unref(_sfc_main$b), {
                        modelValue: date.value,
                        "onUpdate:modelValue": ($event) => date.value = $event,
                        type: "date"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    createVNode(unref(_sfc_main$v), {
                      type: "submit",
                      class: "md:w-auto"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("\u521B\u5EFA")
                      ]),
                      _: 1
                    })
                  ], 32)
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      if (loading.value) {
        _push(`<div>`);
        _push(ssrRenderComponent(SkeletonList, { count: 2 }, null, _parent));
        _push(`</div>`);
      } else if (items.value.length === 0) {
        _push(`<div>`);
        _push(ssrRenderComponent(EmptyState, {
          text: "\u6DFB\u52A0\u4E00\u4E2A\u7279\u522B\u7684\u65E5\u5B50\u5427",
          img: "/assets/images/couple/couple-1.png",
          "cta-text": "\u521B\u5EFA\u7EAA\u5FF5\u65E5",
          "cta-to": "/anniversaries"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="grid md:grid-cols-2 gap-4"><!--[-->`);
        ssrRenderList(items.value, (a) => {
          _push(ssrRenderComponent(unref(_sfc_main$7$1), {
            key: a.id,
            class: meta(a).overdue ? "border-destructive/30" : "border-primary/30"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(_sfc_main$5$1), null, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<div class="flex items-start justify-between gap-3 mb-4"${_scopeId2}><div class="flex-1"${_scopeId2}><h3 class="font-semibold text-lg mb-1"${_scopeId2}>${ssrInterpolate(a.title)}</h3><p class="text-sm text-muted-foreground"${_scopeId2}>${ssrInterpolate(new Date(a.date).toLocaleDateString())}</p></div>`);
                      _push3(ssrRenderComponent(unref(_sfc_main$2$1), {
                        variant: meta(a).overdue ? "destructive" : meta(a).days === 0 ? "default" : "secondary",
                        class: meta(a).canToggle && meta(a).days !== 0 ? "cursor-pointer hover:opacity-80" : "",
                        title: meta(a).canToggle && meta(a).days !== 0 ? "\u70B9\u51FB\u5207\u6362\u663E\u793A\u683C\u5F0F" : "",
                        onClick: ($event) => meta(a).canToggle && meta(a).days !== 0 ? toggleFormat(a.id, meta(a).days) : null
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`${ssrInterpolate(meta(a).label)}`);
                          } else {
                            return [
                              createTextVNode(toDisplayString(meta(a).label), 1)
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                      _push3(`</div><div class="flex items-center gap-2"${_scopeId2}>`);
                      _push3(ssrRenderComponent(unref(_sfc_main$v), {
                        variant: "outline",
                        size: "sm",
                        onClick: ($event) => openEdit(a)
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`\u7F16\u8F91`);
                          } else {
                            return [
                              createTextVNode("\u7F16\u8F91")
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                      _push3(ssrRenderComponent(unref(_sfc_main$v), {
                        variant: "outline",
                        size: "sm",
                        onClick: ($event) => remove(a.id)
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`\u5220\u9664`);
                          } else {
                            return [
                              createTextVNode("\u5220\u9664")
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                      _push3(`</div>`);
                    } else {
                      return [
                        createVNode("div", { class: "flex items-start justify-between gap-3 mb-4" }, [
                          createVNode("div", { class: "flex-1" }, [
                            createVNode("h3", { class: "font-semibold text-lg mb-1" }, toDisplayString(a.title), 1),
                            createVNode("p", { class: "text-sm text-muted-foreground" }, toDisplayString(new Date(a.date).toLocaleDateString()), 1)
                          ]),
                          createVNode(unref(_sfc_main$2$1), {
                            variant: meta(a).overdue ? "destructive" : meta(a).days === 0 ? "default" : "secondary",
                            class: meta(a).canToggle && meta(a).days !== 0 ? "cursor-pointer hover:opacity-80" : "",
                            title: meta(a).canToggle && meta(a).days !== 0 ? "\u70B9\u51FB\u5207\u6362\u663E\u793A\u683C\u5F0F" : "",
                            onClick: ($event) => meta(a).canToggle && meta(a).days !== 0 ? toggleFormat(a.id, meta(a).days) : null
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(meta(a).label), 1)
                            ]),
                            _: 2
                          }, 1032, ["variant", "class", "title", "onClick"])
                        ]),
                        createVNode("div", { class: "flex items-center gap-2" }, [
                          createVNode(unref(_sfc_main$v), {
                            variant: "outline",
                            size: "sm",
                            onClick: ($event) => openEdit(a)
                          }, {
                            default: withCtx(() => [
                              createTextVNode("\u7F16\u8F91")
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(unref(_sfc_main$v), {
                            variant: "outline",
                            size: "sm",
                            onClick: ($event) => remove(a.id)
                          }, {
                            default: withCtx(() => [
                              createTextVNode("\u5220\u9664")
                            ]),
                            _: 1
                          }, 8, ["onClick"])
                        ])
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              } else {
                return [
                  createVNode(unref(_sfc_main$5$1), null, {
                    default: withCtx(() => [
                      createVNode("div", { class: "flex items-start justify-between gap-3 mb-4" }, [
                        createVNode("div", { class: "flex-1" }, [
                          createVNode("h3", { class: "font-semibold text-lg mb-1" }, toDisplayString(a.title), 1),
                          createVNode("p", { class: "text-sm text-muted-foreground" }, toDisplayString(new Date(a.date).toLocaleDateString()), 1)
                        ]),
                        createVNode(unref(_sfc_main$2$1), {
                          variant: meta(a).overdue ? "destructive" : meta(a).days === 0 ? "default" : "secondary",
                          class: meta(a).canToggle && meta(a).days !== 0 ? "cursor-pointer hover:opacity-80" : "",
                          title: meta(a).canToggle && meta(a).days !== 0 ? "\u70B9\u51FB\u5207\u6362\u663E\u793A\u683C\u5F0F" : "",
                          onClick: ($event) => meta(a).canToggle && meta(a).days !== 0 ? toggleFormat(a.id, meta(a).days) : null
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(meta(a).label), 1)
                          ]),
                          _: 2
                        }, 1032, ["variant", "class", "title", "onClick"])
                      ]),
                      createVNode("div", { class: "flex items-center gap-2" }, [
                        createVNode(unref(_sfc_main$v), {
                          variant: "outline",
                          size: "sm",
                          onClick: ($event) => openEdit(a)
                        }, {
                          default: withCtx(() => [
                            createTextVNode("\u7F16\u8F91")
                          ]),
                          _: 1
                        }, 8, ["onClick"]),
                        createVNode(unref(_sfc_main$v), {
                          variant: "outline",
                          size: "sm",
                          onClick: ($event) => remove(a.id)
                        }, {
                          default: withCtx(() => [
                            createTextVNode("\u5220\u9664")
                          ]),
                          _: 1
                        }, 8, ["onClick"])
                      ])
                    ]),
                    _: 2
                  }, 1024)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      }
      _push(ssrRenderComponent(unref(_sfc_main$a), {
        open: editing.value,
        "onUpdate:open": (val) => editing.value = val
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$7), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$4), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$2), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`\u7F16\u8F91\u7EAA\u5FF5\u65E5`);
                            } else {
                              return [
                                createTextVNode("\u7F16\u8F91\u7EAA\u5FF5\u65E5")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$2), null, {
                            default: withCtx(() => [
                              createTextVNode("\u7F16\u8F91\u7EAA\u5FF5\u65E5")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<form class="space-y-4"${_scopeId2}><div class="space-y-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$c), { for: "edit-title" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`\u6807\u9898`);
                      } else {
                        return [
                          createTextVNode("\u6807\u9898")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$b), {
                    id: "edit-title",
                    modelValue: editTitle.value,
                    "onUpdate:modelValue": ($event) => editTitle.value = $event,
                    placeholder: "\u7EAA\u5FF5\u65E5\u6807\u9898"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div><div class="space-y-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$c), { for: "edit-date" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`\u65E5\u671F`);
                      } else {
                        return [
                          createTextVNode("\u65E5\u671F")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$b), {
                    id: "edit-date",
                    modelValue: editDate.value,
                    "onUpdate:modelValue": ($event) => editDate.value = $event,
                    type: "date"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$5), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$v), {
                          type: "button",
                          variant: "outline",
                          onClick: closeEdit
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`\u53D6\u6D88`);
                            } else {
                              return [
                                createTextVNode("\u53D6\u6D88")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$v), { type: "submit" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`\u4FDD\u5B58`);
                            } else {
                              return [
                                createTextVNode("\u4FDD\u5B58")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$v), {
                            type: "button",
                            variant: "outline",
                            onClick: closeEdit
                          }, {
                            default: withCtx(() => [
                              createTextVNode("\u53D6\u6D88")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$v), { type: "submit" }, {
                            default: withCtx(() => [
                              createTextVNode("\u4FDD\u5B58")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</form>`);
                } else {
                  return [
                    createVNode(unref(_sfc_main$4), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$2), null, {
                          default: withCtx(() => [
                            createTextVNode("\u7F16\u8F91\u7EAA\u5FF5\u65E5")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode("form", {
                      class: "space-y-4",
                      onSubmit: withModifiers(saveEdit, ["prevent"])
                    }, [
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode(unref(_sfc_main$c), { for: "edit-title" }, {
                          default: withCtx(() => [
                            createTextVNode("\u6807\u9898")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$b), {
                          id: "edit-title",
                          modelValue: editTitle.value,
                          "onUpdate:modelValue": ($event) => editTitle.value = $event,
                          placeholder: "\u7EAA\u5FF5\u65E5\u6807\u9898"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode(unref(_sfc_main$c), { for: "edit-date" }, {
                          default: withCtx(() => [
                            createTextVNode("\u65E5\u671F")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$b), {
                          id: "edit-date",
                          modelValue: editDate.value,
                          "onUpdate:modelValue": ($event) => editDate.value = $event,
                          type: "date"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      createVNode(unref(_sfc_main$5), null, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$v), {
                            type: "button",
                            variant: "outline",
                            onClick: closeEdit
                          }, {
                            default: withCtx(() => [
                              createTextVNode("\u53D6\u6D88")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$v), { type: "submit" }, {
                            default: withCtx(() => [
                              createTextVNode("\u4FDD\u5B58")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ], 32)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$7), null, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$4), null, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$2), null, {
                        default: withCtx(() => [
                          createTextVNode("\u7F16\u8F91\u7EAA\u5FF5\u65E5")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode("form", {
                    class: "space-y-4",
                    onSubmit: withModifiers(saveEdit, ["prevent"])
                  }, [
                    createVNode("div", { class: "space-y-2" }, [
                      createVNode(unref(_sfc_main$c), { for: "edit-title" }, {
                        default: withCtx(() => [
                          createTextVNode("\u6807\u9898")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$b), {
                        id: "edit-title",
                        modelValue: editTitle.value,
                        "onUpdate:modelValue": ($event) => editTitle.value = $event,
                        placeholder: "\u7EAA\u5FF5\u65E5\u6807\u9898"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    createVNode("div", { class: "space-y-2" }, [
                      createVNode(unref(_sfc_main$c), { for: "edit-date" }, {
                        default: withCtx(() => [
                          createTextVNode("\u65E5\u671F")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$b), {
                        id: "edit-date",
                        modelValue: editDate.value,
                        "onUpdate:modelValue": ($event) => editDate.value = $event,
                        type: "date"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    createVNode(unref(_sfc_main$5), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$v), {
                          type: "button",
                          variant: "outline",
                          onClick: closeEdit
                        }, {
                          default: withCtx(() => [
                            createTextVNode("\u53D6\u6D88")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$v), { type: "submit" }, {
                          default: withCtx(() => [
                            createTextVNode("\u4FDD\u5B58")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ], 32)
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/anniversaries/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
