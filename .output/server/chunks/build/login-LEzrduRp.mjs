import { _ as __nuxt_component_0 } from './nuxt-link-qMRI1Itf.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createTextVNode, createVNode, toDisplayString, createBlock, createCommentVNode, openBlock, withModifiers, nextTick, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { D as DogHeader, _ as _sfc_main$v, l as login, h as handleApiError } from './DogHeader-WAUZOG8S.mjs';
import { D as DogLoginAnimation } from './DogLoginAnimation-Clw9zWe1.mjs';
import { _ as _sfc_main$7, a as _sfc_main$2, b as _sfc_main$1, c as _sfc_main$4, d as _sfc_main$5, e as _sfc_main$6 } from './Input-KB5-SBeR.mjs';
import { _ as _sfc_main$3 } from './Label-2yaGIUAD.mjs';
import { useRouter } from 'vue-router';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    const router = useRouter();
    const email = ref("");
    const password = ref("");
    const loading = ref(false);
    const error = ref("");
    async function onSubmit() {
      error.value = "";
      if (!email.value.trim()) {
        error.value = "请输入邮箱";
        return;
      }
      if (!password.value) {
        error.value = "请输入密码";
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value.trim())) {
        error.value = "邮箱格式不正确";
        return;
      }
      loading.value = true;
      try {
        await login({
          email: email.value.trim(),
          password: password.value
        });
        if (false) ;
        const route = useRoute();
        const redirectTo = route.query.redirect || "/";
        await nextTick();
        setTimeout(async () => {
          await router.push(redirectTo);
        }, 100);
      } catch (e) {
        error.value = e?.friendlyMessage || handleApiError(e);
      } finally {
        loading.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-muted/30" }, _attrs))}>`);
      _push(ssrRenderComponent(DogHeader, null, null, _parent));
      _push(`<div class="max-w-md mx-auto px-4 py-10">`);
      _push(ssrRenderComponent(DogLoginAnimation, { class: "mb-4" }, null, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$7), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$2), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$1), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`登录`);
                      } else {
                        return [
                          createTextVNode("登录")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$4), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`使用邮箱和密码登录`);
                      } else {
                        return [
                          createTextVNode("使用邮箱和密码登录")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$1), null, {
                      default: withCtx(() => [
                        createTextVNode("登录")
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$4), null, {
                      default: withCtx(() => [
                        createTextVNode("使用邮箱和密码登录")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$5), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (error.value) {
                    _push3(`<div class="mb-4 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md"${_scopeId2}>${ssrInterpolate(error.value)}</div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`<form class="space-y-4"${_scopeId2}><div class="space-y-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$3), {
                    htmlFor: "email",
                    class: "sr-only"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`邮箱`);
                      } else {
                        return [
                          createTextVNode("邮箱")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$6), {
                    id: "email",
                    modelValue: email.value,
                    "onUpdate:modelValue": ($event) => email.value = $event,
                    modelModifiers: { trim: true },
                    type: "email",
                    placeholder: "邮箱",
                    required: "",
                    autocomplete: "email"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div><div class="space-y-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$3), {
                    htmlFor: "password",
                    class: "sr-only"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`密码`);
                      } else {
                        return [
                          createTextVNode("密码")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$6), {
                    id: "password",
                    modelValue: password.value,
                    "onUpdate:modelValue": ($event) => password.value = $event,
                    modelModifiers: { trim: true },
                    type: "password",
                    placeholder: "密码",
                    required: "",
                    autocomplete: "current-password"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$v), {
                    type: "submit",
                    class: "w-full",
                    disabled: loading.value || !email.value || !password.value
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(loading.value ? "登录中…" : "登录")}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(loading.value ? "登录中…" : "登录"), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</form><div class="mt-6 flex items-center justify-between"${_scopeId2}><span class="text-sm text-muted-foreground"${_scopeId2}>还没有账号？</span>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$v), {
                    variant: "link",
                    class: "p-0 h-auto",
                    "as-child": ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_NuxtLink, { to: "/user/register" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`去注册`);
                            } else {
                              return [
                                createTextVNode("去注册")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_NuxtLink, { to: "/user/register" }, {
                            default: withCtx(() => [
                              createTextVNode("去注册")
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
                    error.value ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "mb-4 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md"
                    }, toDisplayString(error.value), 1)) : createCommentVNode("", true),
                    createVNode("form", {
                      class: "space-y-4",
                      onSubmit: withModifiers(onSubmit, ["prevent"])
                    }, [
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode(unref(_sfc_main$3), {
                          htmlFor: "email",
                          class: "sr-only"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("邮箱")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$6), {
                          id: "email",
                          modelValue: email.value,
                          "onUpdate:modelValue": ($event) => email.value = $event,
                          modelModifiers: { trim: true },
                          type: "email",
                          placeholder: "邮箱",
                          required: "",
                          autocomplete: "email"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode(unref(_sfc_main$3), {
                          htmlFor: "password",
                          class: "sr-only"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("密码")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$6), {
                          id: "password",
                          modelValue: password.value,
                          "onUpdate:modelValue": ($event) => password.value = $event,
                          modelModifiers: { trim: true },
                          type: "password",
                          placeholder: "密码",
                          required: "",
                          autocomplete: "current-password"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      createVNode(unref(_sfc_main$v), {
                        type: "submit",
                        class: "w-full",
                        disabled: loading.value || !email.value || !password.value
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(loading.value ? "登录中…" : "登录"), 1)
                        ]),
                        _: 1
                      }, 8, ["disabled"])
                    ], 32),
                    createVNode("div", { class: "mt-6 flex items-center justify-between" }, [
                      createVNode("span", { class: "text-sm text-muted-foreground" }, "还没有账号？"),
                      createVNode(unref(_sfc_main$v), {
                        variant: "link",
                        class: "p-0 h-auto",
                        "as-child": ""
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_NuxtLink, { to: "/user/register" }, {
                            default: withCtx(() => [
                              createTextVNode("去注册")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$2), null, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$1), null, {
                    default: withCtx(() => [
                      createTextVNode("登录")
                    ]),
                    _: 1
                  }),
                  createVNode(unref(_sfc_main$4), null, {
                    default: withCtx(() => [
                      createTextVNode("使用邮箱和密码登录")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$5), null, {
                default: withCtx(() => [
                  error.value ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "mb-4 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md"
                  }, toDisplayString(error.value), 1)) : createCommentVNode("", true),
                  createVNode("form", {
                    class: "space-y-4",
                    onSubmit: withModifiers(onSubmit, ["prevent"])
                  }, [
                    createVNode("div", { class: "space-y-2" }, [
                      createVNode(unref(_sfc_main$3), {
                        htmlFor: "email",
                        class: "sr-only"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("邮箱")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$6), {
                        id: "email",
                        modelValue: email.value,
                        "onUpdate:modelValue": ($event) => email.value = $event,
                        modelModifiers: { trim: true },
                        type: "email",
                        placeholder: "邮箱",
                        required: "",
                        autocomplete: "email"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    createVNode("div", { class: "space-y-2" }, [
                      createVNode(unref(_sfc_main$3), {
                        htmlFor: "password",
                        class: "sr-only"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("密码")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$6), {
                        id: "password",
                        modelValue: password.value,
                        "onUpdate:modelValue": ($event) => password.value = $event,
                        modelModifiers: { trim: true },
                        type: "password",
                        placeholder: "密码",
                        required: "",
                        autocomplete: "current-password"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    createVNode(unref(_sfc_main$v), {
                      type: "submit",
                      class: "w-full",
                      disabled: loading.value || !email.value || !password.value
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(loading.value ? "登录中…" : "登录"), 1)
                      ]),
                      _: 1
                    }, 8, ["disabled"])
                  ], 32),
                  createVNode("div", { class: "mt-6 flex items-center justify-between" }, [
                    createVNode("span", { class: "text-sm text-muted-foreground" }, "还没有账号？"),
                    createVNode(unref(_sfc_main$v), {
                      variant: "link",
                      class: "p-0 h-auto",
                      "as-child": ""
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_NuxtLink, { to: "/user/register" }, {
                          default: withCtx(() => [
                            createTextVNode("去注册")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/user/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
