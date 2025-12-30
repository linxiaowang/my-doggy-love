import { _ as __nuxt_component_0 } from './nuxt-link-qMRI1Itf.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createBlock, createCommentVNode, createVNode, openBlock, withModifiers, withKeys, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { D as DogHeader, _ as _sfc_main$v, e as _sfc_main$5$1, f as _sfc_main$3, g as _sfc_main$4, h as handleApiError, a as apiFetch } from './DogHeader-WAUZOG8S.mjs';
import { E as EmptyState } from './EmptyState-DZkE9L5G.mjs';
import { S as SkeletonList } from './SkeletonList-C44MGr6N.mjs';
import { _ as _sfc_main$7, d as _sfc_main$5, e as _sfc_main$2 } from './Input-KB5-SBeR.mjs';
import { _ as _sfc_main$1 } from './Textarea-DIw-33_A.mjs';
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

async function createMessage(data) {
  return apiFetch("/api/messages", {
    method: "POST",
    body: data
  });
}
async function createMessageComment(messageId, content) {
  return apiFetch(`/api/messages/${messageId}/comment`, {
    method: "POST",
    body: { content }
  });
}
async function replyToComment(commentId, content) {
  return apiFetch(`/api/messages/comments/${commentId}/reply`, {
    method: "POST",
    body: { content }
  });
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const items = ref([]);
    const content = ref("");
    const loading = ref(true);
    const comment = ref("");
    const openId = ref(null);
    const inputOpenId = ref(null);
    const comments = ref([]);
    const loadingComments = ref(false);
    const replyOpenId = ref(null);
    const replyContent = ref("");
    function formatCount(n) {
      return n && n > 0 ? `(${n})` : "";
    }
    async function load() {
      loading.value = true;
      try {
        const res = await apiFetch("/api/messages");
        items.value = res.items;
      } catch (e) {
        console.error("加载留言失败:", e);
      } finally {
        loading.value = false;
      }
    }
    const errorMessage = ref("");
    const submitting = ref(false);
    async function submit() {
      if (!content.value) return;
      errorMessage.value = "";
      submitting.value = true;
      try {
        await createMessage({ content: content.value });
        content.value = "";
        await load();
      } catch (e) {
        errorMessage.value = e?.friendlyMessage || handleApiError(e);
        console.error("发布留言失败:", e);
      } finally {
        submitting.value = false;
      }
    }
    function toggleComments(id) {
      openId.value = openId.value === id ? null : id;
      if (openId.value === id) loadComments(id);
    }
    async function loadComments(id) {
      loadingComments.value = true;
      try {
        const res = await apiFetch(`/api/messages/${id}/comments`);
        comments.value = res.items;
      } catch (e) {
        console.error("加载评论失败:", e);
      } finally {
        loadingComments.value = false;
      }
    }
    function toggleInput(id) {
      inputOpenId.value = inputOpenId.value === id ? null : id;
    }
    async function submitComment(id) {
      if (!comment.value) return;
      try {
        await createMessageComment(id, comment.value);
        comment.value = "";
        openId.value = id;
        inputOpenId.value = null;
        await loadComments(id);
      } catch (e) {
        console.error("发布评论失败:", e);
      }
    }
    function toggleReply(id) {
      replyOpenId.value = replyOpenId.value === id ? null : id;
    }
    async function submitReply(commentId) {
      if (!replyContent.value) return;
      try {
        await replyToComment(commentId, replyContent.value);
        replyContent.value = "";
        if (openId.value) await loadComments(openId.value);
      } catch (e) {
        console.error("回复评论失败:", e);
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br from-#f7f6f3 via-#faf9f7 to-#f7f6f3" }, _attrs))}>`);
      _push(ssrRenderComponent(DogHeader, null, null, _parent));
      _push(`<div class="max-w-2xl mx-auto px-4 py-6 space-y-4">`);
      _push(ssrRenderComponent(unref(_sfc_main$7), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$5), { class: "px-4" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (errorMessage.value) {
                    _push3(`<div class="mb-4 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg"${_scopeId2}>${ssrInterpolate(errorMessage.value)} `);
                    if (errorMessage.value.includes("情侣")) {
                      _push3(ssrRenderComponent(_component_NuxtLink, {
                        to: "/user/couple",
                        class: "underline ml-1 font-medium hover:opacity-80"
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`去绑定`);
                          } else {
                            return [
                              createTextVNode("去绑定")
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`<form class="flex gap-2 items-center"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$1), {
                    modelValue: content.value,
                    "onUpdate:modelValue": ($event) => content.value = $event,
                    placeholder: "留下想说的话…",
                    class: "flex-1 min-h-[80px]"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$v), {
                    type: "submit",
                    disabled: submitting.value
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(submitting.value ? "发布中..." : "发布")}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(submitting.value ? "发布中..." : "发布"), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</form>`);
                } else {
                  return [
                    errorMessage.value ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "mb-4 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg"
                    }, [
                      createTextVNode(toDisplayString(errorMessage.value) + " ", 1),
                      errorMessage.value.includes("情侣") ? (openBlock(), createBlock(_component_NuxtLink, {
                        key: 0,
                        to: "/user/couple",
                        class: "underline ml-1 font-medium hover:opacity-80"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("去绑定")
                        ]),
                        _: 1
                      })) : createCommentVNode("", true)
                    ])) : createCommentVNode("", true),
                    createVNode("form", {
                      class: "flex gap-2 items-center",
                      onSubmit: withModifiers(submit, ["prevent"])
                    }, [
                      createVNode(unref(_sfc_main$1), {
                        modelValue: content.value,
                        "onUpdate:modelValue": ($event) => content.value = $event,
                        placeholder: "留下想说的话…",
                        class: "flex-1 min-h-[80px]"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode(unref(_sfc_main$v), {
                        type: "submit",
                        disabled: submitting.value
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(submitting.value ? "发布中..." : "发布"), 1)
                        ]),
                        _: 1
                      }, 8, ["disabled"])
                    ], 32)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$5), { class: "px-4" }, {
                default: withCtx(() => [
                  errorMessage.value ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "mb-4 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg"
                  }, [
                    createTextVNode(toDisplayString(errorMessage.value) + " ", 1),
                    errorMessage.value.includes("情侣") ? (openBlock(), createBlock(_component_NuxtLink, {
                      key: 0,
                      to: "/user/couple",
                      class: "underline ml-1 font-medium hover:opacity-80"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("去绑定")
                      ]),
                      _: 1
                    })) : createCommentVNode("", true)
                  ])) : createCommentVNode("", true),
                  createVNode("form", {
                    class: "flex gap-2 items-center",
                    onSubmit: withModifiers(submit, ["prevent"])
                  }, [
                    createVNode(unref(_sfc_main$1), {
                      modelValue: content.value,
                      "onUpdate:modelValue": ($event) => content.value = $event,
                      placeholder: "留下想说的话…",
                      class: "flex-1 min-h-[80px]"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(unref(_sfc_main$v), {
                      type: "submit",
                      disabled: submitting.value
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(submitting.value ? "发布中..." : "发布"), 1)
                      ]),
                      _: 1
                    }, 8, ["disabled"])
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
        _push(ssrRenderComponent(SkeletonList, { count: 3 }, null, _parent));
        _push(`</div>`);
      } else if (items.value.length === 0) {
        _push(`<div>`);
        _push(ssrRenderComponent(EmptyState, {
          text: "还没有留言",
          img: "/assets/images/xiaobai/xiaobai-3.png",
          "cta-text": "去发表第一条",
          "cta-to": "/messages"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="space-y-3"><!--[-->`);
        ssrRenderList(items.value, (m) => {
          _push(ssrRenderComponent(unref(_sfc_main$7), {
            key: m.id
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(_sfc_main$5), { class: "px-4" }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<div class="flex items-start gap-3"${_scopeId2}>`);
                      _push3(ssrRenderComponent(unref(_sfc_main$5$1), null, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(unref(_sfc_main$3), {
                              src: m.author?.avatarUrl || "/assets/images/xiaobai/xiaobai-2.png",
                              alt: m.author?.nickName || "用户头像"
                            }, null, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(_sfc_main$4), null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`${ssrInterpolate((m.author?.nickName || "匿名").charAt(0))}`);
                                } else {
                                  return [
                                    createTextVNode(toDisplayString((m.author?.nickName || "匿名").charAt(0)), 1)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          } else {
                            return [
                              createVNode(unref(_sfc_main$3), {
                                src: m.author?.avatarUrl || "/assets/images/xiaobai/xiaobai-2.png",
                                alt: m.author?.nickName || "用户头像"
                              }, null, 8, ["src", "alt"]),
                              createVNode(unref(_sfc_main$4), null, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString((m.author?.nickName || "匿名").charAt(0)), 1)
                                ]),
                                _: 2
                              }, 1024)
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                      _push3(`<div class="flex-1 min-w-0"${_scopeId2}><div class="text-sm text-muted-foreground mb-1.5 font-medium"${_scopeId2}>${ssrInterpolate(m.author?.nickName || "匿名")} · ${ssrInterpolate(new Date(m.createdAt).toLocaleString())}</div><div class="text-foreground whitespace-pre-wrap break-words leading-relaxed"${_scopeId2}>${ssrInterpolate(m.content)}</div><div class="mt-3 flex items-center gap-3 text-sm border-t border-border pt-3"${_scopeId2}>`);
                      _push3(ssrRenderComponent(unref(_sfc_main$v), {
                        variant: "ghost",
                        size: "sm",
                        onClick: ($event) => toggleComments(m.id)
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`${ssrInterpolate(openId.value === m.id ? "收起评论" : `查看评论${formatCount(m.commentCount)}`)}`);
                          } else {
                            return [
                              createTextVNode(toDisplayString(openId.value === m.id ? "收起评论" : `查看评论${formatCount(m.commentCount)}`), 1)
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                      _push3(`<span class="text-muted-foreground/30"${_scopeId2}>|</span>`);
                      _push3(ssrRenderComponent(unref(_sfc_main$v), {
                        variant: "ghost",
                        size: "sm",
                        onClick: ($event) => toggleInput(m.id)
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`${ssrInterpolate(inputOpenId.value === m.id ? "收起输入" : "写评论")}`);
                          } else {
                            return [
                              createTextVNode(toDisplayString(inputOpenId.value === m.id ? "收起输入" : "写评论"), 1)
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                      _push3(`</div>`);
                      if (inputOpenId.value === m.id) {
                        _push3(`<div class="mt-3 flex items-center gap-2 animate-fade-in"${_scopeId2}>`);
                        _push3(ssrRenderComponent(unref(_sfc_main$2), {
                          modelValue: comment.value,
                          "onUpdate:modelValue": ($event) => comment.value = $event,
                          placeholder: "写点评论…",
                          class: "flex-1",
                          onKeydown: ($event) => submitComment(m.id)
                        }, null, _parent3, _scopeId2));
                        _push3(ssrRenderComponent(unref(_sfc_main$v), {
                          size: "sm",
                          onClick: ($event) => submitComment(m.id)
                        }, {
                          default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                            if (_push4) {
                              _push4(`发布`);
                            } else {
                              return [
                                createTextVNode("发布")
                              ];
                            }
                          }),
                          _: 2
                        }, _parent3, _scopeId2));
                        _push3(`</div>`);
                      } else {
                        _push3(`<!---->`);
                      }
                      if (openId.value === m.id) {
                        _push3(`<div class="mt-2"${_scopeId2}>`);
                        if (loadingComments.value) {
                          _push3(`<div class="text-sm text-muted-foreground"${_scopeId2}>加载中…</div>`);
                        } else if (comments.value.length === 0) {
                          _push3(`<div class="text-sm text-muted-foreground"${_scopeId2}>暂无评论</div>`);
                        } else {
                          _push3(`<div class="space-y-2"${_scopeId2}><!--[-->`);
                          ssrRenderList(comments.value, (c) => {
                            _push3(`<div class="space-y-1"${_scopeId2}><div class="flex items-start gap-2"${_scopeId2}>`);
                            _push3(ssrRenderComponent(unref(_sfc_main$5$1), { class: "w-7 h-7" }, {
                              default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                                if (_push4) {
                                  _push4(ssrRenderComponent(unref(_sfc_main$3), {
                                    src: c.author?.avatarUrl || "/assets/images/xiaobai/xiaobai-2.png",
                                    alt: c.author?.nickName || "用户头像"
                                  }, null, _parent4, _scopeId3));
                                  _push4(ssrRenderComponent(unref(_sfc_main$4), { class: "text-xs" }, {
                                    default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                      if (_push5) {
                                        _push5(`${ssrInterpolate((c.author?.nickName || "匿名").charAt(0))}`);
                                      } else {
                                        return [
                                          createTextVNode(toDisplayString((c.author?.nickName || "匿名").charAt(0)), 1)
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent4, _scopeId3));
                                } else {
                                  return [
                                    createVNode(unref(_sfc_main$3), {
                                      src: c.author?.avatarUrl || "/assets/images/xiaobai/xiaobai-2.png",
                                      alt: c.author?.nickName || "用户头像"
                                    }, null, 8, ["src", "alt"]),
                                    createVNode(unref(_sfc_main$4), { class: "text-xs" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString((c.author?.nickName || "匿名").charAt(0)), 1)
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent3, _scopeId2));
                            _push3(`<div class="flex-1 min-w-0"${_scopeId2}><div class="text-xs text-muted-foreground"${_scopeId2}>${ssrInterpolate(c.author?.nickName || "匿名")} · ${ssrInterpolate(new Date(c.createdAt).toLocaleString())}</div><div class="text-sm text-foreground whitespace-pre-wrap break-words"${_scopeId2}>${ssrInterpolate(c.content)}</div>`);
                            _push3(ssrRenderComponent(unref(_sfc_main$v), {
                              variant: "link",
                              size: "sm",
                              class: "h-auto p-0 text-xs",
                              onClick: ($event) => toggleReply(c.id)
                            }, {
                              default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                                if (_push4) {
                                  _push4(`${ssrInterpolate(replyOpenId.value === c.id ? "收起回复" : "回复")}`);
                                } else {
                                  return [
                                    createTextVNode(toDisplayString(replyOpenId.value === c.id ? "收起回复" : "回复"), 1)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent3, _scopeId2));
                            if (replyOpenId.value === c.id) {
                              _push3(`<div class="mt-1 flex items-center gap-2"${_scopeId2}>`);
                              _push3(ssrRenderComponent(unref(_sfc_main$2), {
                                modelValue: replyContent.value,
                                "onUpdate:modelValue": ($event) => replyContent.value = $event,
                                placeholder: "回复…",
                                class: "flex-1 h-8 text-sm",
                                onKeydown: ($event) => submitReply(c.id)
                              }, null, _parent3, _scopeId2));
                              _push3(ssrRenderComponent(unref(_sfc_main$v), {
                                size: "sm",
                                class: "h-8",
                                onClick: ($event) => submitReply(c.id)
                              }, {
                                default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                                  if (_push4) {
                                    _push4(`发送`);
                                  } else {
                                    return [
                                      createTextVNode("发送")
                                    ];
                                  }
                                }),
                                _: 2
                              }, _parent3, _scopeId2));
                              _push3(`</div>`);
                            } else {
                              _push3(`<!---->`);
                            }
                            _push3(`</div></div>`);
                            if (c.replies?.length) {
                              _push3(`<div class="pl-8 space-y-1"${_scopeId2}><!--[-->`);
                              ssrRenderList(c.replies, (r) => {
                                _push3(`<div class="flex items-start gap-2"${_scopeId2}>`);
                                _push3(ssrRenderComponent(unref(_sfc_main$5$1), { class: "w-6 h-6" }, {
                                  default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                                    if (_push4) {
                                      _push4(ssrRenderComponent(unref(_sfc_main$3), {
                                        src: r.author?.avatarUrl,
                                        alt: r.author?.nickName || "用户头像"
                                      }, null, _parent4, _scopeId3));
                                      _push4(ssrRenderComponent(unref(_sfc_main$4), { class: "text-[10px]" }, {
                                        default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                          if (_push5) {
                                            _push5(`${ssrInterpolate((r.author?.nickName || "匿名").charAt(0))}`);
                                          } else {
                                            return [
                                              createTextVNode(toDisplayString((r.author?.nickName || "匿名").charAt(0)), 1)
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent4, _scopeId3));
                                    } else {
                                      return [
                                        createVNode(unref(_sfc_main$3), {
                                          src: r.author?.avatarUrl,
                                          alt: r.author?.nickName || "用户头像"
                                        }, null, 8, ["src", "alt"]),
                                        createVNode(unref(_sfc_main$4), { class: "text-[10px]" }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString((r.author?.nickName || "匿名").charAt(0)), 1)
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent3, _scopeId2));
                                _push3(`<div class="flex-1 min-w-0"${_scopeId2}><div class="text-xs text-muted-foreground"${_scopeId2}>${ssrInterpolate(r.author?.nickName || "匿名")} · ${ssrInterpolate(new Date(r.createdAt).toLocaleString())}</div><div class="text-sm text-foreground whitespace-pre-wrap break-words"${_scopeId2}>${ssrInterpolate(r.content)}</div></div></div>`);
                              });
                              _push3(`<!--]--></div>`);
                            } else {
                              _push3(`<!---->`);
                            }
                            _push3(`</div>`);
                          });
                          _push3(`<!--]--></div>`);
                        }
                        _push3(`</div>`);
                      } else {
                        _push3(`<!---->`);
                      }
                      _push3(`</div></div>`);
                    } else {
                      return [
                        createVNode("div", { class: "flex items-start gap-3" }, [
                          createVNode(unref(_sfc_main$5$1), null, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$3), {
                                src: m.author?.avatarUrl || "/assets/images/xiaobai/xiaobai-2.png",
                                alt: m.author?.nickName || "用户头像"
                              }, null, 8, ["src", "alt"]),
                              createVNode(unref(_sfc_main$4), null, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString((m.author?.nickName || "匿名").charAt(0)), 1)
                                ]),
                                _: 2
                              }, 1024)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode("div", { class: "flex-1 min-w-0" }, [
                            createVNode("div", { class: "text-sm text-muted-foreground mb-1.5 font-medium" }, toDisplayString(m.author?.nickName || "匿名") + " · " + toDisplayString(new Date(m.createdAt).toLocaleString()), 1),
                            createVNode("div", { class: "text-foreground whitespace-pre-wrap break-words leading-relaxed" }, toDisplayString(m.content), 1),
                            createVNode("div", { class: "mt-3 flex items-center gap-3 text-sm border-t border-border pt-3" }, [
                              createVNode(unref(_sfc_main$v), {
                                variant: "ghost",
                                size: "sm",
                                onClick: ($event) => toggleComments(m.id)
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(openId.value === m.id ? "收起评论" : `查看评论${formatCount(m.commentCount)}`), 1)
                                ]),
                                _: 2
                              }, 1032, ["onClick"]),
                              createVNode("span", { class: "text-muted-foreground/30" }, "|"),
                              createVNode(unref(_sfc_main$v), {
                                variant: "ghost",
                                size: "sm",
                                onClick: ($event) => toggleInput(m.id)
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(inputOpenId.value === m.id ? "收起输入" : "写评论"), 1)
                                ]),
                                _: 2
                              }, 1032, ["onClick"])
                            ]),
                            inputOpenId.value === m.id ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "mt-3 flex items-center gap-2 animate-fade-in"
                            }, [
                              createVNode(unref(_sfc_main$2), {
                                modelValue: comment.value,
                                "onUpdate:modelValue": ($event) => comment.value = $event,
                                placeholder: "写点评论…",
                                class: "flex-1",
                                onKeydown: withKeys(withModifiers(($event) => submitComment(m.id), ["prevent"]), ["enter"])
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "onKeydown"]),
                              createVNode(unref(_sfc_main$v), {
                                size: "sm",
                                onClick: ($event) => submitComment(m.id)
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("发布")
                                ]),
                                _: 1
                              }, 8, ["onClick"])
                            ])) : createCommentVNode("", true),
                            openId.value === m.id ? (openBlock(), createBlock("div", {
                              key: 1,
                              class: "mt-2"
                            }, [
                              loadingComments.value ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "text-sm text-muted-foreground"
                              }, "加载中…")) : comments.value.length === 0 ? (openBlock(), createBlock("div", {
                                key: 1,
                                class: "text-sm text-muted-foreground"
                              }, "暂无评论")) : (openBlock(), createBlock("div", {
                                key: 2,
                                class: "space-y-2"
                              }, [
                                (openBlock(true), createBlock(Fragment, null, renderList(comments.value, (c) => {
                                  return openBlock(), createBlock("div", {
                                    key: c.id,
                                    class: "space-y-1"
                                  }, [
                                    createVNode("div", { class: "flex items-start gap-2" }, [
                                      createVNode(unref(_sfc_main$5$1), { class: "w-7 h-7" }, {
                                        default: withCtx(() => [
                                          createVNode(unref(_sfc_main$3), {
                                            src: c.author?.avatarUrl || "/assets/images/xiaobai/xiaobai-2.png",
                                            alt: c.author?.nickName || "用户头像"
                                          }, null, 8, ["src", "alt"]),
                                          createVNode(unref(_sfc_main$4), { class: "text-xs" }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString((c.author?.nickName || "匿名").charAt(0)), 1)
                                            ]),
                                            _: 2
                                          }, 1024)
                                        ]),
                                        _: 2
                                      }, 1024),
                                      createVNode("div", { class: "flex-1 min-w-0" }, [
                                        createVNode("div", { class: "text-xs text-muted-foreground" }, toDisplayString(c.author?.nickName || "匿名") + " · " + toDisplayString(new Date(c.createdAt).toLocaleString()), 1),
                                        createVNode("div", { class: "text-sm text-foreground whitespace-pre-wrap break-words" }, toDisplayString(c.content), 1),
                                        createVNode(unref(_sfc_main$v), {
                                          variant: "link",
                                          size: "sm",
                                          class: "h-auto p-0 text-xs",
                                          onClick: ($event) => toggleReply(c.id)
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(replyOpenId.value === c.id ? "收起回复" : "回复"), 1)
                                          ]),
                                          _: 2
                                        }, 1032, ["onClick"]),
                                        replyOpenId.value === c.id ? (openBlock(), createBlock("div", {
                                          key: 0,
                                          class: "mt-1 flex items-center gap-2"
                                        }, [
                                          createVNode(unref(_sfc_main$2), {
                                            modelValue: replyContent.value,
                                            "onUpdate:modelValue": ($event) => replyContent.value = $event,
                                            placeholder: "回复…",
                                            class: "flex-1 h-8 text-sm",
                                            onKeydown: withKeys(withModifiers(($event) => submitReply(c.id), ["prevent"]), ["enter"])
                                          }, null, 8, ["modelValue", "onUpdate:modelValue", "onKeydown"]),
                                          createVNode(unref(_sfc_main$v), {
                                            size: "sm",
                                            class: "h-8",
                                            onClick: ($event) => submitReply(c.id)
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("发送")
                                            ]),
                                            _: 1
                                          }, 8, ["onClick"])
                                        ])) : createCommentVNode("", true)
                                      ])
                                    ]),
                                    c.replies?.length ? (openBlock(), createBlock("div", {
                                      key: 0,
                                      class: "pl-8 space-y-1"
                                    }, [
                                      (openBlock(true), createBlock(Fragment, null, renderList(c.replies, (r) => {
                                        return openBlock(), createBlock("div", {
                                          key: r.id,
                                          class: "flex items-start gap-2"
                                        }, [
                                          createVNode(unref(_sfc_main$5$1), { class: "w-6 h-6" }, {
                                            default: withCtx(() => [
                                              createVNode(unref(_sfc_main$3), {
                                                src: r.author?.avatarUrl,
                                                alt: r.author?.nickName || "用户头像"
                                              }, null, 8, ["src", "alt"]),
                                              createVNode(unref(_sfc_main$4), { class: "text-[10px]" }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString((r.author?.nickName || "匿名").charAt(0)), 1)
                                                ]),
                                                _: 2
                                              }, 1024)
                                            ]),
                                            _: 2
                                          }, 1024),
                                          createVNode("div", { class: "flex-1 min-w-0" }, [
                                            createVNode("div", { class: "text-xs text-muted-foreground" }, toDisplayString(r.author?.nickName || "匿名") + " · " + toDisplayString(new Date(r.createdAt).toLocaleString()), 1),
                                            createVNode("div", { class: "text-sm text-foreground whitespace-pre-wrap break-words" }, toDisplayString(r.content), 1)
                                          ])
                                        ]);
                                      }), 128))
                                    ])) : createCommentVNode("", true)
                                  ]);
                                }), 128))
                              ]))
                            ])) : createCommentVNode("", true)
                          ])
                        ])
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              } else {
                return [
                  createVNode(unref(_sfc_main$5), { class: "px-4" }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "flex items-start gap-3" }, [
                        createVNode(unref(_sfc_main$5$1), null, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$3), {
                              src: m.author?.avatarUrl || "/assets/images/xiaobai/xiaobai-2.png",
                              alt: m.author?.nickName || "用户头像"
                            }, null, 8, ["src", "alt"]),
                            createVNode(unref(_sfc_main$4), null, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString((m.author?.nickName || "匿名").charAt(0)), 1)
                              ]),
                              _: 2
                            }, 1024)
                          ]),
                          _: 2
                        }, 1024),
                        createVNode("div", { class: "flex-1 min-w-0" }, [
                          createVNode("div", { class: "text-sm text-muted-foreground mb-1.5 font-medium" }, toDisplayString(m.author?.nickName || "匿名") + " · " + toDisplayString(new Date(m.createdAt).toLocaleString()), 1),
                          createVNode("div", { class: "text-foreground whitespace-pre-wrap break-words leading-relaxed" }, toDisplayString(m.content), 1),
                          createVNode("div", { class: "mt-3 flex items-center gap-3 text-sm border-t border-border pt-3" }, [
                            createVNode(unref(_sfc_main$v), {
                              variant: "ghost",
                              size: "sm",
                              onClick: ($event) => toggleComments(m.id)
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(openId.value === m.id ? "收起评论" : `查看评论${formatCount(m.commentCount)}`), 1)
                              ]),
                              _: 2
                            }, 1032, ["onClick"]),
                            createVNode("span", { class: "text-muted-foreground/30" }, "|"),
                            createVNode(unref(_sfc_main$v), {
                              variant: "ghost",
                              size: "sm",
                              onClick: ($event) => toggleInput(m.id)
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(inputOpenId.value === m.id ? "收起输入" : "写评论"), 1)
                              ]),
                              _: 2
                            }, 1032, ["onClick"])
                          ]),
                          inputOpenId.value === m.id ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "mt-3 flex items-center gap-2 animate-fade-in"
                          }, [
                            createVNode(unref(_sfc_main$2), {
                              modelValue: comment.value,
                              "onUpdate:modelValue": ($event) => comment.value = $event,
                              placeholder: "写点评论…",
                              class: "flex-1",
                              onKeydown: withKeys(withModifiers(($event) => submitComment(m.id), ["prevent"]), ["enter"])
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "onKeydown"]),
                            createVNode(unref(_sfc_main$v), {
                              size: "sm",
                              onClick: ($event) => submitComment(m.id)
                            }, {
                              default: withCtx(() => [
                                createTextVNode("发布")
                              ]),
                              _: 1
                            }, 8, ["onClick"])
                          ])) : createCommentVNode("", true),
                          openId.value === m.id ? (openBlock(), createBlock("div", {
                            key: 1,
                            class: "mt-2"
                          }, [
                            loadingComments.value ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "text-sm text-muted-foreground"
                            }, "加载中…")) : comments.value.length === 0 ? (openBlock(), createBlock("div", {
                              key: 1,
                              class: "text-sm text-muted-foreground"
                            }, "暂无评论")) : (openBlock(), createBlock("div", {
                              key: 2,
                              class: "space-y-2"
                            }, [
                              (openBlock(true), createBlock(Fragment, null, renderList(comments.value, (c) => {
                                return openBlock(), createBlock("div", {
                                  key: c.id,
                                  class: "space-y-1"
                                }, [
                                  createVNode("div", { class: "flex items-start gap-2" }, [
                                    createVNode(unref(_sfc_main$5$1), { class: "w-7 h-7" }, {
                                      default: withCtx(() => [
                                        createVNode(unref(_sfc_main$3), {
                                          src: c.author?.avatarUrl || "/assets/images/xiaobai/xiaobai-2.png",
                                          alt: c.author?.nickName || "用户头像"
                                        }, null, 8, ["src", "alt"]),
                                        createVNode(unref(_sfc_main$4), { class: "text-xs" }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString((c.author?.nickName || "匿名").charAt(0)), 1)
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ]),
                                      _: 2
                                    }, 1024),
                                    createVNode("div", { class: "flex-1 min-w-0" }, [
                                      createVNode("div", { class: "text-xs text-muted-foreground" }, toDisplayString(c.author?.nickName || "匿名") + " · " + toDisplayString(new Date(c.createdAt).toLocaleString()), 1),
                                      createVNode("div", { class: "text-sm text-foreground whitespace-pre-wrap break-words" }, toDisplayString(c.content), 1),
                                      createVNode(unref(_sfc_main$v), {
                                        variant: "link",
                                        size: "sm",
                                        class: "h-auto p-0 text-xs",
                                        onClick: ($event) => toggleReply(c.id)
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(replyOpenId.value === c.id ? "收起回复" : "回复"), 1)
                                        ]),
                                        _: 2
                                      }, 1032, ["onClick"]),
                                      replyOpenId.value === c.id ? (openBlock(), createBlock("div", {
                                        key: 0,
                                        class: "mt-1 flex items-center gap-2"
                                      }, [
                                        createVNode(unref(_sfc_main$2), {
                                          modelValue: replyContent.value,
                                          "onUpdate:modelValue": ($event) => replyContent.value = $event,
                                          placeholder: "回复…",
                                          class: "flex-1 h-8 text-sm",
                                          onKeydown: withKeys(withModifiers(($event) => submitReply(c.id), ["prevent"]), ["enter"])
                                        }, null, 8, ["modelValue", "onUpdate:modelValue", "onKeydown"]),
                                        createVNode(unref(_sfc_main$v), {
                                          size: "sm",
                                          class: "h-8",
                                          onClick: ($event) => submitReply(c.id)
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("发送")
                                          ]),
                                          _: 1
                                        }, 8, ["onClick"])
                                      ])) : createCommentVNode("", true)
                                    ])
                                  ]),
                                  c.replies?.length ? (openBlock(), createBlock("div", {
                                    key: 0,
                                    class: "pl-8 space-y-1"
                                  }, [
                                    (openBlock(true), createBlock(Fragment, null, renderList(c.replies, (r) => {
                                      return openBlock(), createBlock("div", {
                                        key: r.id,
                                        class: "flex items-start gap-2"
                                      }, [
                                        createVNode(unref(_sfc_main$5$1), { class: "w-6 h-6" }, {
                                          default: withCtx(() => [
                                            createVNode(unref(_sfc_main$3), {
                                              src: r.author?.avatarUrl,
                                              alt: r.author?.nickName || "用户头像"
                                            }, null, 8, ["src", "alt"]),
                                            createVNode(unref(_sfc_main$4), { class: "text-[10px]" }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString((r.author?.nickName || "匿名").charAt(0)), 1)
                                              ]),
                                              _: 2
                                            }, 1024)
                                          ]),
                                          _: 2
                                        }, 1024),
                                        createVNode("div", { class: "flex-1 min-w-0" }, [
                                          createVNode("div", { class: "text-xs text-muted-foreground" }, toDisplayString(r.author?.nickName || "匿名") + " · " + toDisplayString(new Date(r.createdAt).toLocaleString()), 1),
                                          createVNode("div", { class: "text-sm text-foreground whitespace-pre-wrap break-words" }, toDisplayString(r.content), 1)
                                        ])
                                      ]);
                                    }), 128))
                                  ])) : createCommentVNode("", true)
                                ]);
                              }), 128))
                            ]))
                          ])) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/messages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
