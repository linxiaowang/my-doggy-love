import { defineComponent, ref, computed, mergeProps, unref, withCtx, createTextVNode, createVNode, withModifiers, toDisplayString, createBlock, createCommentVNode, openBlock, renderSlot, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderSlot } from 'vue/server-renderer';
import { D as DogHeader, _ as _sfc_main$v, d as _sfc_main$2$1, c as cn, a as apiFetch } from './DogHeader-WAUZOG8S.mjs';
import { S as SkeletonList } from './SkeletonList-C44MGr6N.mjs';
import { E as EmptyState } from './EmptyState-DZkE9L5G.mjs';
import { _ as _sfc_main$7, d as _sfc_main$5$1, e as _sfc_main$6 } from './Input-KB5-SBeR.mjs';
import { Check } from 'lucide-vue-next';
import { useForwardPropsEmits, TabsRoot, TabsList, useForwardProps, TabsTrigger, CheckboxRoot, CheckboxIndicator, TabsContent } from 'reka-ui';
import { r as reactiveOmit } from './server.mjs';
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

const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "Checkbox",
  __ssrInlineRender: true,
  props: {
    defaultValue: { type: [Boolean, String] },
    modelValue: { type: [Boolean, String, null] },
    disabled: { type: Boolean },
    value: {},
    id: {},
    asChild: { type: Boolean },
    as: {},
    name: {},
    required: { type: Boolean },
    class: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const delegatedProps = reactiveOmit(props, "class");
    const forwarded = useForwardPropsEmits(delegatedProps, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(CheckboxRoot), mergeProps({ "data-slot": "checkbox" }, unref(forwarded), {
        class: unref(cn)(
          "peer border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
          props.class
        )
      }, _attrs), {
        default: withCtx((slotProps, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(CheckboxIndicator), {
              "data-slot": "checkbox-indicator",
              class: "grid place-content-center text-current transition-none"
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  ssrRenderSlot(_ctx.$slots, "default", slotProps, () => {
                    _push3(ssrRenderComponent(unref(Check), { class: "size-3.5" }, null, _parent3, _scopeId2));
                  }, _push3, _parent3, _scopeId2);
                } else {
                  return [
                    renderSlot(_ctx.$slots, "default", slotProps, () => [
                      createVNode(unref(Check), { class: "size-3.5" })
                    ])
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(CheckboxIndicator), {
                "data-slot": "checkbox-indicator",
                class: "grid place-content-center text-current transition-none"
              }, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default", slotProps, () => [
                    createVNode(unref(Check), { class: "size-3.5" })
                  ])
                ]),
                _: 2
              }, 1024)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/checkbox/Checkbox.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "Tabs",
  __ssrInlineRender: true,
  props: {
    defaultValue: {},
    orientation: {},
    dir: {},
    activationMode: {},
    modelValue: {},
    unmountOnHide: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const delegatedProps = reactiveOmit(props, "class");
    const forwarded = useForwardPropsEmits(delegatedProps, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(TabsRoot), mergeProps({ "data-slot": "tabs" }, unref(forwarded), {
        class: unref(cn)("flex flex-col gap-2", props.class)
      }, _attrs), {
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
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/tabs/Tabs.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "TabsContent",
  __ssrInlineRender: true,
  props: {
    value: {},
    forceMount: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = reactiveOmit(props, "class");
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(TabsContent), mergeProps({
        "data-slot": "tabs-content",
        class: unref(cn)("flex-1 outline-none", props.class)
      }, unref(delegatedProps), _attrs), {
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
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/tabs/TabsContent.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "TabsList",
  __ssrInlineRender: true,
  props: {
    loop: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = reactiveOmit(props, "class");
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(TabsList), mergeProps({ "data-slot": "tabs-list" }, unref(delegatedProps), {
        class: unref(cn)(
          "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
          props.class
        )
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/tabs/TabsList.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "TabsTrigger",
  __ssrInlineRender: true,
  props: {
    value: {},
    disabled: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = reactiveOmit(props, "class");
    const forwardedProps = useForwardProps(delegatedProps);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(TabsTrigger), mergeProps({
        "data-slot": "tabs-trigger",
        class: unref(cn)(
          "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          props.class
        )
      }, unref(forwardedProps), _attrs), {
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/tabs/TabsTrigger.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
async function createWish(data) {
  return apiFetch("/api/wishes", {
    method: "POST",
    body: data
  });
}
async function updateWish(id, data) {
  return apiFetch(`/api/wishes/${id}`, {
    method: "PATCH",
    body: data
  });
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const items = ref([]);
    const title = ref("");
    const loading = ref(true);
    const filter = ref("all");
    const todoList = computed(() => items.value.filter((i) => i.status === "todo"));
    const doneList = computed(() => items.value.filter((i) => i.status === "done"));
    const filteredList = computed(() => {
      if (filter.value === "todo") return todoList.value;
      if (filter.value === "done") return doneList.value;
      return items.value;
    });
    async function load() {
      loading.value = true;
      try {
        const res = await apiFetch("/api/wishes");
        items.value = res.items;
      } catch (e) {
        console.error("\u52A0\u8F7D\u613F\u671B\u5217\u8868\u5931\u8D25:", e);
      } finally {
        loading.value = false;
      }
    }
    async function addWish() {
      if (!title.value) return;
      try {
        await createWish({ title: title.value });
        title.value = "";
        await load();
      } catch (e) {
        console.error("\u6DFB\u52A0\u613F\u671B\u5931\u8D25:", e);
      }
    }
    async function markDone(id) {
      try {
        await updateWish(id, { status: "done" });
        await load();
      } catch (e) {
        console.error("\u6807\u8BB0\u5B8C\u6210\u5931\u8D25:", e);
      }
    }
    async function markTodo(id) {
      try {
        await updateWish(id, { status: "todo" });
        await load();
      } catch (e) {
        console.error("\u91CD\u7F6E\u613F\u671B\u5931\u8D25:", e);
      }
    }
    async function toggle(w) {
      if (w.status === "todo") await markDone(w.id);
      else await markTodo(w.id);
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br from-slate-50 via-slate-50/50 to-slate-50 dark:from-slate-900 dark:via-slate-900/50 dark:to-slate-900" }, _attrs))}>`);
      _push(ssrRenderComponent(DogHeader, null, null, _parent));
      _push(`<div class="max-w-3xl mx-auto px-4 py-6 space-y-4">`);
      _push(ssrRenderComponent(unref(_sfc_main$7), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$5$1), { class: "px-4" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<form class="flex flex-col sm:flex-row gap-3 mb-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$6), {
                    modelValue: title.value,
                    "onUpdate:modelValue": ($event) => title.value = $event,
                    placeholder: "\u6DFB\u52A0\u4E00\u4E2A\u613F\u671B\u2026",
                    class: "flex-1"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$v), {
                    type: "submit",
                    class: "sm:w-auto"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`\u6DFB\u52A0`);
                      } else {
                        return [
                          createTextVNode("\u6DFB\u52A0")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</form><div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"${_scopeId2}><div class="text-sm text-muted-foreground text-center sm:text-left"${_scopeId2}> \u5171 ${ssrInterpolate(items.value.length)} \u4E2A\u613F\u671B \xB7 \u5DF2\u5B8C\u6210 ${ssrInterpolate(doneList.value.length)} \u4E2A </div>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$4), {
                    "model-value": filter.value,
                    "onUpdate:modelValue": (val) => filter.value = val,
                    class: "w-full sm:w-auto"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$2), { class: "grid w-full grid-cols-3" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(_sfc_main$1), { value: "all" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`\u5168\u90E8`);
                                  } else {
                                    return [
                                      createTextVNode("\u5168\u90E8")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(_sfc_main$1), { value: "todo" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`\u672A\u5B8C\u6210`);
                                  } else {
                                    return [
                                      createTextVNode("\u672A\u5B8C\u6210")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(_sfc_main$1), { value: "done" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`\u5DF2\u5B8C\u6210`);
                                  } else {
                                    return [
                                      createTextVNode("\u5DF2\u5B8C\u6210")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(_sfc_main$1), { value: "all" }, {
                                  default: withCtx(() => [
                                    createTextVNode("\u5168\u90E8")
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$1), { value: "todo" }, {
                                  default: withCtx(() => [
                                    createTextVNode("\u672A\u5B8C\u6210")
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$1), { value: "done" }, {
                                  default: withCtx(() => [
                                    createTextVNode("\u5DF2\u5B8C\u6210")
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$2), { class: "grid w-full grid-cols-3" }, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$1), { value: "all" }, {
                                default: withCtx(() => [
                                  createTextVNode("\u5168\u90E8")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$1), { value: "todo" }, {
                                default: withCtx(() => [
                                  createTextVNode("\u672A\u5B8C\u6210")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$1), { value: "done" }, {
                                default: withCtx(() => [
                                  createTextVNode("\u5DF2\u5B8C\u6210")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("form", {
                      class: "flex flex-col sm:flex-row gap-3 mb-4",
                      onSubmit: withModifiers(addWish, ["prevent"])
                    }, [
                      createVNode(unref(_sfc_main$6), {
                        modelValue: title.value,
                        "onUpdate:modelValue": ($event) => title.value = $event,
                        placeholder: "\u6DFB\u52A0\u4E00\u4E2A\u613F\u671B\u2026",
                        class: "flex-1"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode(unref(_sfc_main$v), {
                        type: "submit",
                        class: "sm:w-auto"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("\u6DFB\u52A0")
                        ]),
                        _: 1
                      })
                    ], 32),
                    createVNode("div", { class: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" }, [
                      createVNode("div", { class: "text-sm text-muted-foreground text-center sm:text-left" }, " \u5171 " + toDisplayString(items.value.length) + " \u4E2A\u613F\u671B \xB7 \u5DF2\u5B8C\u6210 " + toDisplayString(doneList.value.length) + " \u4E2A ", 1),
                      createVNode(unref(_sfc_main$4), {
                        "model-value": filter.value,
                        "onUpdate:modelValue": (val) => filter.value = val,
                        class: "w-full sm:w-auto"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$2), { class: "grid w-full grid-cols-3" }, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$1), { value: "all" }, {
                                default: withCtx(() => [
                                  createTextVNode("\u5168\u90E8")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$1), { value: "todo" }, {
                                default: withCtx(() => [
                                  createTextVNode("\u672A\u5B8C\u6210")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$1), { value: "done" }, {
                                default: withCtx(() => [
                                  createTextVNode("\u5DF2\u5B8C\u6210")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }, 8, ["model-value", "onUpdate:modelValue"])
                    ])
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
                    class: "flex flex-col sm:flex-row gap-3 mb-4",
                    onSubmit: withModifiers(addWish, ["prevent"])
                  }, [
                    createVNode(unref(_sfc_main$6), {
                      modelValue: title.value,
                      "onUpdate:modelValue": ($event) => title.value = $event,
                      placeholder: "\u6DFB\u52A0\u4E00\u4E2A\u613F\u671B\u2026",
                      class: "flex-1"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(unref(_sfc_main$v), {
                      type: "submit",
                      class: "sm:w-auto"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("\u6DFB\u52A0")
                      ]),
                      _: 1
                    })
                  ], 32),
                  createVNode("div", { class: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" }, [
                    createVNode("div", { class: "text-sm text-muted-foreground text-center sm:text-left" }, " \u5171 " + toDisplayString(items.value.length) + " \u4E2A\u613F\u671B \xB7 \u5DF2\u5B8C\u6210 " + toDisplayString(doneList.value.length) + " \u4E2A ", 1),
                    createVNode(unref(_sfc_main$4), {
                      "model-value": filter.value,
                      "onUpdate:modelValue": (val) => filter.value = val,
                      class: "w-full sm:w-auto"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$2), { class: "grid w-full grid-cols-3" }, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$1), { value: "all" }, {
                              default: withCtx(() => [
                                createTextVNode("\u5168\u90E8")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$1), { value: "todo" }, {
                              default: withCtx(() => [
                                createTextVNode("\u672A\u5B8C\u6210")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$1), { value: "done" }, {
                              default: withCtx(() => [
                                createTextVNode("\u5DF2\u5B8C\u6210")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }, 8, ["model-value", "onUpdate:modelValue"])
                  ])
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
        _push(ssrRenderComponent(SkeletonList, { count: 3 }, null, _parent));
        _push(`</div>`);
      } else if (filteredList.value.length === 0) {
        _push(`<div>`);
        _push(ssrRenderComponent(EmptyState, {
          text: "\u8FD8\u6CA1\u6709\u613F\u671B\uFF0C\u6DFB\u52A0\u4E00\u4E2A\u5427",
          img: "/assets/images/xiaobai/xiaobai-1.png",
          "cta-text": "\u6DFB\u52A0\u613F\u671B",
          "cta-to": "/wishes"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="space-y-3"><!--[-->`);
        ssrRenderList(filteredList.value, (w) => {
          _push(ssrRenderComponent(unref(_sfc_main$7), {
            key: w.id
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(_sfc_main$5$1), null, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<div class="flex items-start gap-3 flex-1 min-w-0"${_scopeId2}>`);
                      _push3(ssrRenderComponent(unref(_sfc_main$5), {
                        checked: w.status === "done",
                        "onUpdate:checked": ($event) => toggle(w),
                        class: "mt-1"
                      }, null, _parent3, _scopeId2));
                      _push3(`<div class="flex-1 min-w-0"${_scopeId2}><div class="${ssrRenderClass([w.status === "done" ? "line-through text-muted-foreground" : "", "text-base font-medium break-words"])}"${_scopeId2}>${ssrInterpolate(w.title)}</div>`);
                      if (w.status === "done" && w.finishedAt) {
                        _push3(`<div class="flex items-center gap-2 mt-2"${_scopeId2}>`);
                        _push3(ssrRenderComponent(unref(_sfc_main$2$1), {
                          variant: "default",
                          class: "text-xs"
                        }, {
                          default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                            if (_push4) {
                              _push4(`\u5DF2\u5B8C\u6210`);
                            } else {
                              return [
                                createTextVNode("\u5DF2\u5B8C\u6210")
                              ];
                            }
                          }),
                          _: 2
                        }, _parent3, _scopeId2));
                        _push3(`<span class="text-xs text-muted-foreground"${_scopeId2}>${ssrInterpolate(new Date(w.finishedAt).toLocaleString())}</span></div>`);
                      } else {
                        _push3(`<!---->`);
                      }
                      _push3(`</div><div class="flex-shrink-0"${_scopeId2}>`);
                      if (w.status === "todo") {
                        _push3(ssrRenderComponent(unref(_sfc_main$v), {
                          variant: "outline",
                          size: "sm",
                          onClick: ($event) => markDone(w.id)
                        }, {
                          default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                            if (_push4) {
                              _push4(`\u6807\u8BB0\u5B8C\u6210`);
                            } else {
                              return [
                                createTextVNode("\u6807\u8BB0\u5B8C\u6210")
                              ];
                            }
                          }),
                          _: 2
                        }, _parent3, _scopeId2));
                      } else {
                        _push3(ssrRenderComponent(unref(_sfc_main$v), {
                          variant: "outline",
                          size: "sm",
                          onClick: ($event) => markTodo(w.id)
                        }, {
                          default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                            if (_push4) {
                              _push4(`\u91CD\u7F6E`);
                            } else {
                              return [
                                createTextVNode("\u91CD\u7F6E")
                              ];
                            }
                          }),
                          _: 2
                        }, _parent3, _scopeId2));
                      }
                      _push3(`</div></div>`);
                    } else {
                      return [
                        createVNode("div", { class: "flex items-start gap-3 flex-1 min-w-0" }, [
                          createVNode(unref(_sfc_main$5), {
                            checked: w.status === "done",
                            "onUpdate:checked": ($event) => toggle(w),
                            class: "mt-1"
                          }, null, 8, ["checked", "onUpdate:checked"]),
                          createVNode("div", { class: "flex-1 min-w-0" }, [
                            createVNode("div", {
                              class: ["text-base font-medium break-words", w.status === "done" ? "line-through text-muted-foreground" : ""]
                            }, toDisplayString(w.title), 3),
                            w.status === "done" && w.finishedAt ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "flex items-center gap-2 mt-2"
                            }, [
                              createVNode(unref(_sfc_main$2$1), {
                                variant: "default",
                                class: "text-xs"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("\u5DF2\u5B8C\u6210")
                                ]),
                                _: 1
                              }),
                              createVNode("span", { class: "text-xs text-muted-foreground" }, toDisplayString(new Date(w.finishedAt).toLocaleString()), 1)
                            ])) : createCommentVNode("", true)
                          ]),
                          createVNode("div", { class: "flex-shrink-0" }, [
                            w.status === "todo" ? (openBlock(), createBlock(unref(_sfc_main$v), {
                              key: 0,
                              variant: "outline",
                              size: "sm",
                              onClick: ($event) => markDone(w.id)
                            }, {
                              default: withCtx(() => [
                                createTextVNode("\u6807\u8BB0\u5B8C\u6210")
                              ]),
                              _: 1
                            }, 8, ["onClick"])) : (openBlock(), createBlock(unref(_sfc_main$v), {
                              key: 1,
                              variant: "outline",
                              size: "sm",
                              onClick: ($event) => markTodo(w.id)
                            }, {
                              default: withCtx(() => [
                                createTextVNode("\u91CD\u7F6E")
                              ]),
                              _: 1
                            }, 8, ["onClick"]))
                          ])
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
                      createVNode("div", { class: "flex items-start gap-3 flex-1 min-w-0" }, [
                        createVNode(unref(_sfc_main$5), {
                          checked: w.status === "done",
                          "onUpdate:checked": ($event) => toggle(w),
                          class: "mt-1"
                        }, null, 8, ["checked", "onUpdate:checked"]),
                        createVNode("div", { class: "flex-1 min-w-0" }, [
                          createVNode("div", {
                            class: ["text-base font-medium break-words", w.status === "done" ? "line-through text-muted-foreground" : ""]
                          }, toDisplayString(w.title), 3),
                          w.status === "done" && w.finishedAt ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "flex items-center gap-2 mt-2"
                          }, [
                            createVNode(unref(_sfc_main$2$1), {
                              variant: "default",
                              class: "text-xs"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("\u5DF2\u5B8C\u6210")
                              ]),
                              _: 1
                            }),
                            createVNode("span", { class: "text-xs text-muted-foreground" }, toDisplayString(new Date(w.finishedAt).toLocaleString()), 1)
                          ])) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "flex-shrink-0" }, [
                          w.status === "todo" ? (openBlock(), createBlock(unref(_sfc_main$v), {
                            key: 0,
                            variant: "outline",
                            size: "sm",
                            onClick: ($event) => markDone(w.id)
                          }, {
                            default: withCtx(() => [
                              createTextVNode("\u6807\u8BB0\u5B8C\u6210")
                            ]),
                            _: 1
                          }, 8, ["onClick"])) : (openBlock(), createBlock(unref(_sfc_main$v), {
                            key: 1,
                            variant: "outline",
                            size: "sm",
                            onClick: ($event) => markTodo(w.id)
                          }, {
                            default: withCtx(() => [
                              createTextVNode("\u91CD\u7F6E")
                            ]),
                            _: 1
                          }, 8, ["onClick"]))
                        ])
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
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/wishes/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
