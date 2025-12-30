import { _ as __nuxt_component_0 } from './nuxt-link-qMRI1Itf.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, createBlock, openBlock, createCommentVNode, Fragment, withModifiers, renderList, withKeys, nextTick, renderSlot, toRaw, isRef, watch, Teleport, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrRenderSlot, ssrRenderTeleport } from 'vue/server-renderer';
import { D as DogHeader, d as _sfc_main$2$1, _ as _sfc_main$v, h as handleApiError, c as cn, a as apiFetch, u as useAuthStore, e as _sfc_main$5$2, f as _sfc_main$3$1, g as _sfc_main$4$1, i as buttonVariants, b as useApiFetch } from './DogHeader-WAUZOG8S.mjs';
import { E as EmptyState } from './EmptyState-DZkE9L5G.mjs';
import { S as SkeletonList } from './SkeletonList-C44MGr6N.mjs';
import { _ as _sfc_main$7$1, d as _sfc_main$5$1, e as _sfc_main$q } from './Input-KB5-SBeR.mjs';
import { _ as _export_sfc, r as reactiveOmit, c as useVModel, d as createReusableTemplate } from './server.mjs';
import { getLocalTimeZone, today, DateFormatter } from '@internationalized/date';
import { CalendarIcon, ChevronDownIcon, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { useForwardPropsEmits, PopoverRoot, PopoverTrigger, PopoverPortal, PopoverContent, useDateFormatter, CalendarRoot, useForwardProps, CalendarHeader, CalendarPrev, CalendarNext, CalendarHeading, CalendarGrid, CalendarGridHead, CalendarGridRow, CalendarHeadCell, CalendarGridBody, CalendarCell, CalendarCellTrigger, PopoverAnchor } from 'reka-ui';
import { createYearRange, toDate, createYear } from 'reka-ui/date';
import { _ as _sfc_main$p } from './Textarea-DIw-33_A.mjs';
import { _ as _sfc_main$o } from './Label-2yaGIUAD.mjs';
import draggable from 'vuedraggable';
import Compressor from 'compressorjs';
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

async function createDailyPost(data) {
  return apiFetch("/api/daily", {
    method: "POST",
    body: data
  });
}
function useDailyPostComments(postId) {
  const url = typeof postId === "function" ? () => `/api/daily/${postId()}/comments` : `/api/daily/${postId}/comments`;
  return useApiFetch(url);
}
async function createDailyComment(postId, content) {
  return apiFetch(`/api/daily/${postId}/comment`, {
    method: "POST",
    body: { content }
  });
}
async function deleteDailyPost(id) {
  return apiFetch(`/api/daily/${id}`, {
    method: "DELETE"
  });
}
function getThumbnailUrl(originalUrl) {
  if (!originalUrl) return originalUrl;
  if (originalUrl.includes("/thumb_")) {
    return originalUrl;
  }
  const urlParts = originalUrl.split("/");
  const fileName = urlParts[urlParts.length - 1];
  if (fileName.startsWith("thumb_")) {
    return originalUrl;
  }
  const thumbnailFileName = `thumb_${fileName}`;
  urlParts[urlParts.length - 1] = thumbnailFileName;
  const thumbnailUrl = urlParts.join("/");
  return thumbnailUrl;
}
const _sfc_main$n = /* @__PURE__ */ defineComponent({
  __name: "PostCard",
  __ssrInlineRender: true,
  props: {
    id: {},
    content: {},
    createdAt: {},
    mediaUrls: {},
    commentCount: {},
    tags: {},
    authorId: {}
  },
  emits: ["commented", "deleted"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const dateLabel = computed(() => new Date(props.createdAt).toLocaleString());
    const comment = ref("");
    const showComments = ref(false);
    const comments = ref([]);
    const totalCount = computed(() => {
      const sumReplies = (list) => list.reduce((sum, c) => sum + 1 + (Array.isArray(c.replies) ? sumReplies(c.replies) : 0), 0);
      return comments.value.length ? sumReplies(comments.value) : props.commentCount || 0;
    });
    const displayCount = computed(() => totalCount.value > 0 ? `(${totalCount.value})` : "");
    const showInput = ref(false);
    const replyOpenId = ref(null);
    const replyContent = ref("");
    const previewIndex = ref(null);
    const currentMedia = computed(() => {
      if (previewIndex.value === null || !props.mediaUrls) return null;
      return props.mediaUrls[previewIndex.value];
    });
    function isImage(url) {
      if (!url) return false;
      const lowerUrl = url.toLowerCase();
      return lowerUrl.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?|#|$)/i) !== null || lowerUrl.includes("image/") || lowerUrl.startsWith("data:image/");
    }
    function isVideo(url) {
      if (!url) return false;
      const lowerUrl = url.toLowerCase();
      return lowerUrl.match(/\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv)(\?|#|$)/i) !== null || lowerUrl.includes("video/") || lowerUrl.startsWith("data:video/");
    }
    function handleVideoMetadata(event) {
      event.target;
    }
    function handleThumbnailError(event) {
      const img = event.target;
      const originalUrl = img.getAttribute("data-original");
      if (originalUrl && img.src !== originalUrl) {
        img.src = originalUrl;
      }
    }
    function openPreview(index) {
      previewIndex.value = index;
      (void 0).body.style.overflow = "hidden";
    }
    function closePreview() {
      previewIndex.value = null;
      (void 0).body.style.overflow = "";
    }
    function prevMedia() {
      if (previewIndex.value !== null && previewIndex.value > 0) {
        previewIndex.value--;
      }
    }
    function nextMedia() {
      if (previewIndex.value !== null && props.mediaUrls && previewIndex.value < props.mediaUrls.length - 1) {
        previewIndex.value++;
      }
    }
    const { data: commentsData, pending: loadingComments, refresh: refreshComments } = useDailyPostComments(() => props.id);
    watch(commentsData, (newData) => {
      if (newData?.items) {
        comments.value = newData.items;
      }
    }, { immediate: true });
    const loading = computed(() => loadingComments.value);
    async function submit() {
      if (!comment.value) return;
      try {
        await createDailyComment(props.id, comment.value);
        comment.value = "";
        showInput.value = false;
        showComments.value = true;
        await refreshComments();
        emit("commented");
      } catch (e) {
        console.error("\u53D1\u5E03\u8BC4\u8BBA\u5931\u8D25:", e);
      }
    }
    async function toggleComments() {
      showComments.value = !showComments.value;
      if (showComments.value && comments.value.length === 0) {
        await refreshComments();
      }
    }
    function toggleInput() {
      showInput.value = !showInput.value;
    }
    async function submitReply(parentId) {
      if (!replyContent.value) return;
      try {
        await apiFetch(`/api/daily/comments/${parentId}/reply`, {
          method: "POST",
          body: { content: replyContent.value }
        });
        replyContent.value = "";
        replyOpenId.value = null;
        showComments.value = true;
        if (showComments.value) {
          await refreshComments();
        }
      } catch (e) {
        console.error("\u56DE\u590D\u8BC4\u8BBA\u5931\u8D25:", e);
      }
    }
    function toggleReply(id) {
      replyOpenId.value = replyOpenId.value === id ? null : id;
    }
    const authStore = useAuthStore();
    const canDelete = computed(() => {
      const currentUserId = authStore.user?.id;
      return props.authorId && currentUserId && props.authorId === currentUserId;
    });
    async function handleDelete() {
      if (!confirm("\u786E\u5B9A\u8981\u5220\u9664\u8FD9\u6761\u65E5\u5E38\u8BB0\u5F55\u5417\uFF1F")) {
        return;
      }
      try {
        await deleteDailyPost(props.id);
        emit("deleted");
      } catch (e) {
        console.error("\u5220\u9664\u5931\u8D25:", e);
        alert(e?.friendlyMessage || "\u5220\u9664\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5");
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(_sfc_main$7$1), mergeProps({ class: "mb-4" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$5$1), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex items-center gap-2 text-sm text-muted-foreground mb-4"${_scopeId2}><span${_scopeId2}>${ssrInterpolate(dateLabel.value)}</span>`);
                  if (__props.tags?.length) {
                    _push3(`<span class="ml-auto inline-flex flex-wrap gap-1.5"${_scopeId2}><!--[-->`);
                    ssrRenderList(__props.tags, (t) => {
                      _push3(ssrRenderComponent(unref(_sfc_main$2$1), {
                        key: t,
                        variant: "secondary",
                        class: "hover:bg-secondary/80"
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`${ssrInterpolate(t)}`);
                          } else {
                            return [
                              createTextVNode(toDisplayString(t), 1)
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    });
                    _push3(`<!--]--></span>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div><div class="mt-2 text-foreground leading-relaxed whitespace-pre-wrap break-words"${_scopeId2}>${ssrInterpolate(__props.content)}</div>`);
                  if (__props.mediaUrls?.length) {
                    _push3(`<div class="mt-4 grid grid-cols-3 gap-2"${_scopeId2}><!--[-->`);
                    ssrRenderList(__props.mediaUrls, (u, i) => {
                      _push3(`<div class="relative cursor-pointer overflow-hidden rounded-lg group shadow-sm hover:shadow-md transition-all duration-300 aspect-square"${_scopeId2}>`);
                      if (isImage(u)) {
                        _push3(`<div class="relative w-full h-full bg-muted"${_scopeId2}><img${ssrRenderAttr("src", unref(getThumbnailUrl)(u))}${ssrRenderAttr("data-original", u)} loading="lazy" decoding="async" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-0 transition-opacity duration-300"${_scopeId2}></div>`);
                      } else if (isVideo(u)) {
                        _push3(`<div class="w-full h-full bg-muted flex items-center justify-center relative group-hover:bg-muted/80 transition-colors duration-300"${_scopeId2}><video${ssrRenderAttr("src", u)} class="w-full h-full object-cover" preload="metadata" muted${_scopeId2}></video><div class="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors duration-300"${_scopeId2}><svg class="w-10 h-10 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24"${_scopeId2}><path d="M8 5v14l11-7z"${_scopeId2}></path></svg></div></div>`);
                      } else {
                        _push3(`<div class="w-full h-full bg-muted flex items-center justify-center"${_scopeId2}><span class="text-xs text-muted-foreground"${_scopeId2}>\u672A\u77E5\u7C7B\u578B</span></div>`);
                      }
                      _push3(`</div>`);
                    });
                    _push3(`<!--]--></div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  ssrRenderTeleport(_push3, (_push4) => {
                    if (previewIndex.value !== null) {
                      _push4(`<div class="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-sm"${_scopeId2}><button class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-50 transition-all duration-200 hover:scale-110 active:scale-95 border-none cursor-pointer"${_scopeId2}><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"${_scopeId2}></path></svg></button>`);
                      if (__props.mediaUrls && __props.mediaUrls.length > 1 && previewIndex.value !== null && previewIndex.value > 0) {
                        _push4(`<button class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-50 cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 border-none" type="button"${_scopeId2}><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"${_scopeId2}></path></svg></button>`);
                      } else {
                        _push4(`<!---->`);
                      }
                      if (__props.mediaUrls && __props.mediaUrls.length > 1 && previewIndex.value !== null && previewIndex.value < __props.mediaUrls.length - 1) {
                        _push4(`<button class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-50 cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 border-none" type="button"${_scopeId2}><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"${_scopeId2}></path></svg></button>`);
                      } else {
                        _push4(`<!---->`);
                      }
                      _push4(`<div class="max-w-[90vw] max-h-[90vh] flex items-center justify-center w-full h-full p-4"${_scopeId2}>`);
                      if (currentMedia.value && isImage(currentMedia.value)) {
                        _push4(`<img${ssrRenderAttr("src", currentMedia.value)} class="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-sm select-none" alt="\u9884\u89C8"${_scopeId2}>`);
                      } else if (currentMedia.value && isVideo(currentMedia.value)) {
                        _push4(`<video${ssrRenderAttr("src", currentMedia.value)} class="max-w-full max-h-[85vh] shadow-2xl rounded-sm" controls autoplay${_scopeId2}></video>`);
                      } else {
                        _push4(`<!---->`);
                      }
                      _push4(`</div>`);
                      if (__props.mediaUrls && __props.mediaUrls.length > 1) {
                        _push4(`<div class="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-sm font-medium border border-white/5"${_scopeId2}>${ssrInterpolate(previewIndex.value + 1)} / ${ssrInterpolate(__props.mediaUrls.length)}</div>`);
                      } else {
                        _push4(`<!---->`);
                      }
                      _push4(`</div>`);
                    } else {
                      _push4(`<!---->`);
                    }
                  }, "body", false, _parent3);
                  _push3(`<div class="mt-4 flex items-center gap-2 text-sm border-t pt-1"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$v), {
                    variant: "ghost",
                    size: "sm",
                    class: "h-8 px-2 text-muted-foreground hover:text-foreground",
                    onClick: toggleComments
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(showComments.value ? "\u6536\u8D77\u8BC4\u8BBA" : `\u67E5\u770B\u8BC4\u8BBA${displayCount.value}`)}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(showComments.value ? "\u6536\u8D77\u8BC4\u8BBA" : `\u67E5\u770B\u8BC4\u8BBA${displayCount.value}`), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<span class="text-border h-4 w-px bg-border"${_scopeId2}></span>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$v), {
                    variant: "ghost",
                    size: "sm",
                    class: "h-8 px-2 text-muted-foreground hover:text-foreground",
                    onClick: toggleInput
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(showInput.value ? "\u6536\u8D77\u8F93\u5165" : "\u5199\u8BC4\u8BBA")}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(showInput.value ? "\u6536\u8D77\u8F93\u5165" : "\u5199\u8BC4\u8BBA"), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  if (canDelete.value) {
                    _push3(`<!--[--><span class="text-border h-4 w-px bg-border"${_scopeId2}></span>`);
                    _push3(ssrRenderComponent(unref(_sfc_main$v), {
                      variant: "ghost",
                      size: "sm",
                      class: "h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10",
                      onClick: handleDelete
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(` \u5220\u9664 `);
                        } else {
                          return [
                            createTextVNode(" \u5220\u9664 ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`<!--]-->`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div>`);
                  if (showInput.value) {
                    _push3(`<div class="mt-4 flex gap-2 animate-fade-in items-end"${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(_sfc_main$q), {
                      modelValue: comment.value,
                      "onUpdate:modelValue": ($event) => comment.value = $event,
                      placeholder: "\u5199\u70B9\u8BC4\u8BBA\u2026",
                      class: "flex-1",
                      onKeydown: submit
                    }, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(_sfc_main$v), {
                      onClick: submit,
                      disabled: !comment.value.trim()
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`\u53D1\u5E03`);
                        } else {
                          return [
                            createTextVNode("\u53D1\u5E03")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`<div class="mt-2"${_scopeId2}>`);
                  if (showComments.value) {
                    _push3(`<div class="mt-4 space-y-4"${_scopeId2}>`);
                    if (loading.value) {
                      _push3(`<div class="text-sm text-muted-foreground py-2 text-center"${_scopeId2}>\u52A0\u8F7D\u4E2D\u2026</div>`);
                    } else if (comments.value.length === 0) {
                      _push3(`<div class="text-sm text-muted-foreground py-2 text-center"${_scopeId2}>\u6682\u65E0\u8BC4\u8BBA</div>`);
                    } else {
                      _push3(`<div class="space-y-4 pl-1"${_scopeId2}><!--[-->`);
                      ssrRenderList(comments.value, (c) => {
                        _push3(`<div class="space-y-2"${_scopeId2}><div class="flex items-start gap-3"${_scopeId2}>`);
                        _push3(ssrRenderComponent(unref(_sfc_main$5$2), { class: "w-8 h-8" }, {
                          default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                            if (_push4) {
                              _push4(ssrRenderComponent(unref(_sfc_main$3$1), {
                                src: c.author.avatarUrl || "/assets/images/xiaobai/xiaobai-2.png"
                              }, null, _parent4, _scopeId3));
                              _push4(ssrRenderComponent(unref(_sfc_main$4$1), null, {
                                default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                  if (_push5) {
                                    _push5(`${ssrInterpolate(c.author.nickName?.slice(0, 2) || "\u7528\u6237")}`);
                                  } else {
                                    return [
                                      createTextVNode(toDisplayString(c.author.nickName?.slice(0, 2) || "\u7528\u6237"), 1)
                                    ];
                                  }
                                }),
                                _: 2
                              }, _parent4, _scopeId3));
                            } else {
                              return [
                                createVNode(unref(_sfc_main$3$1), {
                                  src: c.author.avatarUrl || "/assets/images/xiaobai/xiaobai-2.png"
                                }, null, 8, ["src"]),
                                createVNode(unref(_sfc_main$4$1), null, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(c.author.nickName?.slice(0, 2) || "\u7528\u6237"), 1)
                                  ]),
                                  _: 2
                                }, 1024)
                              ];
                            }
                          }),
                          _: 2
                        }, _parent3, _scopeId2));
                        _push3(`<div class="flex-1 space-y-1"${_scopeId2}><div class="flex items-center justify-between"${_scopeId2}><span class="text-sm font-medium text-foreground"${_scopeId2}>${ssrInterpolate(c.author.nickName)}</span><span class="text-xs text-muted-foreground"${_scopeId2}>${ssrInterpolate(new Date(c.createdAt).toLocaleString())}</span></div><div class="text-sm text-foreground/90"${_scopeId2}>${ssrInterpolate(c.content)}</div><div class="flex items-center gap-2 pt-1"${_scopeId2}>`);
                        _push3(ssrRenderComponent(unref(_sfc_main$v), {
                          variant: "link",
                          size: "sm",
                          class: "h-auto p-0 text-muted-foreground text-xs",
                          onClick: ($event) => toggleReply(c.id)
                        }, {
                          default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                            if (_push4) {
                              _push4(`${ssrInterpolate(replyOpenId.value === c.id ? "\u6536\u8D77\u56DE\u590D" : "\u56DE\u590D")}`);
                            } else {
                              return [
                                createTextVNode(toDisplayString(replyOpenId.value === c.id ? "\u6536\u8D77\u56DE\u590D" : "\u56DE\u590D"), 1)
                              ];
                            }
                          }),
                          _: 2
                        }, _parent3, _scopeId2));
                        _push3(`</div>`);
                        if (replyOpenId.value === c.id) {
                          _push3(`<div class="mt-2 flex items-center gap-2"${_scopeId2}>`);
                          _push3(ssrRenderComponent(unref(_sfc_main$q), {
                            modelValue: replyContent.value,
                            "onUpdate:modelValue": ($event) => replyContent.value = $event,
                            placeholder: "\u56DE\u590D\u2026",
                            class: "h-8 text-sm",
                            onKeydown: ($event) => submitReply(c.id)
                          }, null, _parent3, _scopeId2));
                          _push3(ssrRenderComponent(unref(_sfc_main$v), {
                            size: "sm",
                            class: "h-8",
                            onClick: ($event) => submitReply(c.id),
                            disabled: !replyContent.value.trim()
                          }, {
                            default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                              if (_push4) {
                                _push4(`\u53D1\u9001`);
                              } else {
                                return [
                                  createTextVNode("\u53D1\u9001")
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
                          _push3(`<div class="pl-11 space-y-3"${_scopeId2}><!--[-->`);
                          ssrRenderList(c.replies, (r) => {
                            _push3(`<div class="space-y-2"${_scopeId2}><div class="flex items-start gap-3"${_scopeId2}>`);
                            _push3(ssrRenderComponent(unref(_sfc_main$5$2), { class: "w-6 h-6" }, {
                              default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                                if (_push4) {
                                  _push4(ssrRenderComponent(unref(_sfc_main$3$1), {
                                    src: r.author.avatarUrl || "/assets/images/xiaobai/xiaobai-2.png"
                                  }, null, _parent4, _scopeId3));
                                  _push4(ssrRenderComponent(unref(_sfc_main$4$1), null, {
                                    default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                      if (_push5) {
                                        _push5(`${ssrInterpolate(r.author.nickName?.slice(0, 2))}`);
                                      } else {
                                        return [
                                          createTextVNode(toDisplayString(r.author.nickName?.slice(0, 2)), 1)
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent4, _scopeId3));
                                } else {
                                  return [
                                    createVNode(unref(_sfc_main$3$1), {
                                      src: r.author.avatarUrl || "/assets/images/xiaobai/xiaobai-2.png"
                                    }, null, 8, ["src"]),
                                    createVNode(unref(_sfc_main$4$1), null, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(r.author.nickName?.slice(0, 2)), 1)
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent3, _scopeId2));
                            _push3(`<div class="flex-1 space-y-1"${_scopeId2}><div class="flex items-center justify-between"${_scopeId2}><span class="text-sm font-medium text-foreground"${_scopeId2}>${ssrInterpolate(r.author.nickName)}</span><span class="text-xs text-muted-foreground"${_scopeId2}>${ssrInterpolate(new Date(r.createdAt).toLocaleString())}</span></div><div class="text-sm text-foreground/90"${_scopeId2}>${ssrInterpolate(r.content)}</div><div class="flex items-center gap-2 pt-1"${_scopeId2}>`);
                            _push3(ssrRenderComponent(unref(_sfc_main$v), {
                              variant: "link",
                              size: "sm",
                              class: "h-auto p-0 text-muted-foreground text-xs",
                              onClick: ($event) => toggleReply(r.id)
                            }, {
                              default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                                if (_push4) {
                                  _push4(`${ssrInterpolate(replyOpenId.value === r.id ? "\u6536\u8D77\u56DE\u590D" : "\u56DE\u590D")}`);
                                } else {
                                  return [
                                    createTextVNode(toDisplayString(replyOpenId.value === r.id ? "\u6536\u8D77\u56DE\u590D" : "\u56DE\u590D"), 1)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent3, _scopeId2));
                            _push3(`</div>`);
                            if (replyOpenId.value === r.id) {
                              _push3(`<div class="mt-2 flex items-center gap-2"${_scopeId2}>`);
                              _push3(ssrRenderComponent(unref(_sfc_main$q), {
                                modelValue: replyContent.value,
                                "onUpdate:modelValue": ($event) => replyContent.value = $event,
                                placeholder: "\u56DE\u590D\u2026",
                                class: "h-8 text-sm",
                                onKeydown: ($event) => submitReply(r.id)
                              }, null, _parent3, _scopeId2));
                              _push3(ssrRenderComponent(unref(_sfc_main$v), {
                                size: "sm",
                                class: "h-8",
                                onClick: ($event) => submitReply(r.id),
                                disabled: !replyContent.value.trim()
                              }, {
                                default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                                  if (_push4) {
                                    _push4(`\u53D1\u9001`);
                                  } else {
                                    return [
                                      createTextVNode("\u53D1\u9001")
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
                            if (r.replies?.length) {
                              _push3(`<div class="pl-9 space-y-2"${_scopeId2}><!--[-->`);
                              ssrRenderList(r.replies, (z) => {
                                _push3(`<div class="flex items-start gap-3"${_scopeId2}>`);
                                _push3(ssrRenderComponent(unref(_sfc_main$5$2), { class: "w-6 h-6" }, {
                                  default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                                    if (_push4) {
                                      _push4(ssrRenderComponent(unref(_sfc_main$3$1), {
                                        src: z.author.avatarUrl || "/assets/images/xiaobai/xiaobai-2.png"
                                      }, null, _parent4, _scopeId3));
                                      _push4(ssrRenderComponent(unref(_sfc_main$4$1), null, {
                                        default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                          if (_push5) {
                                            _push5(`${ssrInterpolate(z.author.nickName?.slice(0, 2))}`);
                                          } else {
                                            return [
                                              createTextVNode(toDisplayString(z.author.nickName?.slice(0, 2)), 1)
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent4, _scopeId3));
                                    } else {
                                      return [
                                        createVNode(unref(_sfc_main$3$1), {
                                          src: z.author.avatarUrl || "/assets/images/xiaobai/xiaobai-2.png"
                                        }, null, 8, ["src"]),
                                        createVNode(unref(_sfc_main$4$1), null, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(z.author.nickName?.slice(0, 2)), 1)
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent3, _scopeId2));
                                _push3(`<div class="flex-1 space-y-1"${_scopeId2}><div class="flex items-center justify-between"${_scopeId2}><span class="text-sm font-medium text-foreground"${_scopeId2}>${ssrInterpolate(z.author.nickName)}</span><span class="text-xs text-muted-foreground"${_scopeId2}>${ssrInterpolate(new Date(z.createdAt).toLocaleString())}</span></div><div class="text-sm text-foreground/90"${_scopeId2}>${ssrInterpolate(z.content)}</div></div></div>`);
                              });
                              _push3(`<!--]--></div>`);
                            } else {
                              _push3(`<!---->`);
                            }
                            _push3(`</div>`);
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
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex items-center gap-2 text-sm text-muted-foreground mb-4" }, [
                      createVNode("span", null, toDisplayString(dateLabel.value), 1),
                      __props.tags?.length ? (openBlock(), createBlock("span", {
                        key: 0,
                        class: "ml-auto inline-flex flex-wrap gap-1.5"
                      }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.tags, (t) => {
                          return openBlock(), createBlock(unref(_sfc_main$2$1), {
                            key: t,
                            variant: "secondary",
                            class: "hover:bg-secondary/80"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(t), 1)
                            ]),
                            _: 2
                          }, 1024);
                        }), 128))
                      ])) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "mt-2 text-foreground leading-relaxed whitespace-pre-wrap break-words" }, toDisplayString(__props.content), 1),
                    __props.mediaUrls?.length ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "mt-4 grid grid-cols-3 gap-2"
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.mediaUrls, (u, i) => {
                        return openBlock(), createBlock("div", {
                          key: i,
                          class: "relative cursor-pointer overflow-hidden rounded-lg group shadow-sm hover:shadow-md transition-all duration-300 aspect-square",
                          onClick: ($event) => openPreview(i)
                        }, [
                          isImage(u) ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "relative w-full h-full bg-muted"
                          }, [
                            createVNode("img", {
                              src: unref(getThumbnailUrl)(u),
                              "data-original": u,
                              loading: "lazy",
                              decoding: "async",
                              class: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-0 transition-opacity duration-300",
                              onError: handleThumbnailError,
                              onLoad: (e) => e.target.classList.remove("opacity-0")
                            }, null, 40, ["src", "data-original", "onLoad"])
                          ])) : isVideo(u) ? (openBlock(), createBlock("div", {
                            key: 1,
                            class: "w-full h-full bg-muted flex items-center justify-center relative group-hover:bg-muted/80 transition-colors duration-300"
                          }, [
                            createVNode("video", {
                              src: u,
                              class: "w-full h-full object-cover",
                              preload: "metadata",
                              muted: "",
                              onLoadedmetadata: handleVideoMetadata
                            }, null, 40, ["src"]),
                            createVNode("div", { class: "absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors duration-300" }, [
                              (openBlock(), createBlock("svg", {
                                class: "w-10 h-10 text-white drop-shadow-lg",
                                fill: "currentColor",
                                viewBox: "0 0 24 24"
                              }, [
                                createVNode("path", { d: "M8 5v14l11-7z" })
                              ]))
                            ])
                          ])) : (openBlock(), createBlock("div", {
                            key: 2,
                            class: "w-full h-full bg-muted flex items-center justify-center"
                          }, [
                            createVNode("span", { class: "text-xs text-muted-foreground" }, "\u672A\u77E5\u7C7B\u578B")
                          ]))
                        ], 8, ["onClick"]);
                      }), 128))
                    ])) : createCommentVNode("", true),
                    (openBlock(), createBlock(Teleport, { to: "body" }, [
                      previewIndex.value !== null ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-sm",
                        onClick: withModifiers(closePreview, ["self"]),
                        onKeydown: withKeys(closePreview, ["esc"])
                      }, [
                        createVNode("button", {
                          class: "absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-50 transition-all duration-200 hover:scale-110 active:scale-95 border-none cursor-pointer",
                          onClick: closePreview
                        }, [
                          (openBlock(), createBlock("svg", {
                            class: "w-6 h-6",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24"
                          }, [
                            createVNode("path", {
                              "stroke-linecap": "round",
                              "stroke-linejoin": "round",
                              "stroke-width": "2",
                              d: "M6 18L18 6M6 6l12 12"
                            })
                          ]))
                        ]),
                        __props.mediaUrls && __props.mediaUrls.length > 1 && previewIndex.value !== null && previewIndex.value > 0 ? (openBlock(), createBlock("button", {
                          key: 0,
                          class: "absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-50 cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 border-none",
                          onClick: withModifiers(prevMedia, ["stop", "prevent"]),
                          type: "button"
                        }, [
                          (openBlock(), createBlock("svg", {
                            class: "w-6 h-6",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24"
                          }, [
                            createVNode("path", {
                              "stroke-linecap": "round",
                              "stroke-linejoin": "round",
                              "stroke-width": "2",
                              d: "M15 19l-7-7 7-7"
                            })
                          ]))
                        ])) : createCommentVNode("", true),
                        __props.mediaUrls && __props.mediaUrls.length > 1 && previewIndex.value !== null && previewIndex.value < __props.mediaUrls.length - 1 ? (openBlock(), createBlock("button", {
                          key: 1,
                          class: "absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-50 cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 border-none",
                          onClick: withModifiers(nextMedia, ["stop", "prevent"]),
                          type: "button"
                        }, [
                          (openBlock(), createBlock("svg", {
                            class: "w-6 h-6",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24"
                          }, [
                            createVNode("path", {
                              "stroke-linecap": "round",
                              "stroke-linejoin": "round",
                              "stroke-width": "2",
                              d: "M9 5l7 7-7 7"
                            })
                          ]))
                        ])) : createCommentVNode("", true),
                        createVNode("div", {
                          class: "max-w-[90vw] max-h-[90vh] flex items-center justify-center w-full h-full p-4",
                          onClick: withModifiers(() => {
                          }, ["stop"])
                        }, [
                          currentMedia.value && isImage(currentMedia.value) ? (openBlock(), createBlock("img", {
                            key: 0,
                            src: currentMedia.value,
                            class: "max-w-full max-h-[85vh] object-contain shadow-2xl rounded-sm select-none",
                            alt: "\u9884\u89C8"
                          }, null, 8, ["src"])) : currentMedia.value && isVideo(currentMedia.value) ? (openBlock(), createBlock("video", {
                            key: 1,
                            src: currentMedia.value,
                            class: "max-w-full max-h-[85vh] shadow-2xl rounded-sm",
                            controls: "",
                            autoplay: ""
                          }, null, 8, ["src"])) : createCommentVNode("", true)
                        ], 8, ["onClick"]),
                        __props.mediaUrls && __props.mediaUrls.length > 1 ? (openBlock(), createBlock("div", {
                          key: 2,
                          class: "absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-sm font-medium border border-white/5"
                        }, toDisplayString(previewIndex.value + 1) + " / " + toDisplayString(__props.mediaUrls.length), 1)) : createCommentVNode("", true)
                      ], 32)) : createCommentVNode("", true)
                    ])),
                    createVNode("div", { class: "mt-4 flex items-center gap-2 text-sm border-t pt-1" }, [
                      createVNode(unref(_sfc_main$v), {
                        variant: "ghost",
                        size: "sm",
                        class: "h-8 px-2 text-muted-foreground hover:text-foreground",
                        onClick: toggleComments
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(showComments.value ? "\u6536\u8D77\u8BC4\u8BBA" : `\u67E5\u770B\u8BC4\u8BBA${displayCount.value}`), 1)
                        ]),
                        _: 1
                      }),
                      createVNode("span", { class: "text-border h-4 w-px bg-border" }),
                      createVNode(unref(_sfc_main$v), {
                        variant: "ghost",
                        size: "sm",
                        class: "h-8 px-2 text-muted-foreground hover:text-foreground",
                        onClick: toggleInput
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(showInput.value ? "\u6536\u8D77\u8F93\u5165" : "\u5199\u8BC4\u8BBA"), 1)
                        ]),
                        _: 1
                      }),
                      canDelete.value ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                        createVNode("span", { class: "text-border h-4 w-px bg-border" }),
                        createVNode(unref(_sfc_main$v), {
                          variant: "ghost",
                          size: "sm",
                          class: "h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10",
                          onClick: handleDelete
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" \u5220\u9664 ")
                          ]),
                          _: 1
                        })
                      ], 64)) : createCommentVNode("", true)
                    ]),
                    showInput.value ? (openBlock(), createBlock("div", {
                      key: 1,
                      class: "mt-4 flex gap-2 animate-fade-in items-end"
                    }, [
                      createVNode(unref(_sfc_main$q), {
                        modelValue: comment.value,
                        "onUpdate:modelValue": ($event) => comment.value = $event,
                        placeholder: "\u5199\u70B9\u8BC4\u8BBA\u2026",
                        class: "flex-1",
                        onKeydown: withKeys(withModifiers(submit, ["prevent"]), ["enter"])
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "onKeydown"]),
                      createVNode(unref(_sfc_main$v), {
                        onClick: submit,
                        disabled: !comment.value.trim()
                      }, {
                        default: withCtx(() => [
                          createTextVNode("\u53D1\u5E03")
                        ]),
                        _: 1
                      }, 8, ["disabled"])
                    ])) : createCommentVNode("", true),
                    createVNode("div", { class: "mt-2" }, [
                      showComments.value ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "mt-4 space-y-4"
                      }, [
                        loading.value ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "text-sm text-muted-foreground py-2 text-center"
                        }, "\u52A0\u8F7D\u4E2D\u2026")) : comments.value.length === 0 ? (openBlock(), createBlock("div", {
                          key: 1,
                          class: "text-sm text-muted-foreground py-2 text-center"
                        }, "\u6682\u65E0\u8BC4\u8BBA")) : (openBlock(), createBlock("div", {
                          key: 2,
                          class: "space-y-4 pl-1"
                        }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(comments.value, (c) => {
                            return openBlock(), createBlock("div", {
                              key: c.id,
                              class: "space-y-2"
                            }, [
                              createVNode("div", { class: "flex items-start gap-3" }, [
                                createVNode(unref(_sfc_main$5$2), { class: "w-8 h-8" }, {
                                  default: withCtx(() => [
                                    createVNode(unref(_sfc_main$3$1), {
                                      src: c.author.avatarUrl || "/assets/images/xiaobai/xiaobai-2.png"
                                    }, null, 8, ["src"]),
                                    createVNode(unref(_sfc_main$4$1), null, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(c.author.nickName?.slice(0, 2) || "\u7528\u6237"), 1)
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1024),
                                createVNode("div", { class: "flex-1 space-y-1" }, [
                                  createVNode("div", { class: "flex items-center justify-between" }, [
                                    createVNode("span", { class: "text-sm font-medium text-foreground" }, toDisplayString(c.author.nickName), 1),
                                    createVNode("span", { class: "text-xs text-muted-foreground" }, toDisplayString(new Date(c.createdAt).toLocaleString()), 1)
                                  ]),
                                  createVNode("div", { class: "text-sm text-foreground/90" }, toDisplayString(c.content), 1),
                                  createVNode("div", { class: "flex items-center gap-2 pt-1" }, [
                                    createVNode(unref(_sfc_main$v), {
                                      variant: "link",
                                      size: "sm",
                                      class: "h-auto p-0 text-muted-foreground text-xs",
                                      onClick: ($event) => toggleReply(c.id)
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(replyOpenId.value === c.id ? "\u6536\u8D77\u56DE\u590D" : "\u56DE\u590D"), 1)
                                      ]),
                                      _: 2
                                    }, 1032, ["onClick"])
                                  ]),
                                  replyOpenId.value === c.id ? (openBlock(), createBlock("div", {
                                    key: 0,
                                    class: "mt-2 flex items-center gap-2"
                                  }, [
                                    createVNode(unref(_sfc_main$q), {
                                      modelValue: replyContent.value,
                                      "onUpdate:modelValue": ($event) => replyContent.value = $event,
                                      placeholder: "\u56DE\u590D\u2026",
                                      class: "h-8 text-sm",
                                      onKeydown: withKeys(withModifiers(($event) => submitReply(c.id), ["prevent"]), ["enter"])
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "onKeydown"]),
                                    createVNode(unref(_sfc_main$v), {
                                      size: "sm",
                                      class: "h-8",
                                      onClick: ($event) => submitReply(c.id),
                                      disabled: !replyContent.value.trim()
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("\u53D1\u9001")
                                      ]),
                                      _: 1
                                    }, 8, ["onClick", "disabled"])
                                  ])) : createCommentVNode("", true)
                                ])
                              ]),
                              c.replies?.length ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "pl-11 space-y-3"
                              }, [
                                (openBlock(true), createBlock(Fragment, null, renderList(c.replies, (r) => {
                                  return openBlock(), createBlock("div", {
                                    key: r.id,
                                    class: "space-y-2"
                                  }, [
                                    createVNode("div", { class: "flex items-start gap-3" }, [
                                      createVNode(unref(_sfc_main$5$2), { class: "w-6 h-6" }, {
                                        default: withCtx(() => [
                                          createVNode(unref(_sfc_main$3$1), {
                                            src: r.author.avatarUrl || "/assets/images/xiaobai/xiaobai-2.png"
                                          }, null, 8, ["src"]),
                                          createVNode(unref(_sfc_main$4$1), null, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(r.author.nickName?.slice(0, 2)), 1)
                                            ]),
                                            _: 2
                                          }, 1024)
                                        ]),
                                        _: 2
                                      }, 1024),
                                      createVNode("div", { class: "flex-1 space-y-1" }, [
                                        createVNode("div", { class: "flex items-center justify-between" }, [
                                          createVNode("span", { class: "text-sm font-medium text-foreground" }, toDisplayString(r.author.nickName), 1),
                                          createVNode("span", { class: "text-xs text-muted-foreground" }, toDisplayString(new Date(r.createdAt).toLocaleString()), 1)
                                        ]),
                                        createVNode("div", { class: "text-sm text-foreground/90" }, toDisplayString(r.content), 1),
                                        createVNode("div", { class: "flex items-center gap-2 pt-1" }, [
                                          createVNode(unref(_sfc_main$v), {
                                            variant: "link",
                                            size: "sm",
                                            class: "h-auto p-0 text-muted-foreground text-xs",
                                            onClick: ($event) => toggleReply(r.id)
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(replyOpenId.value === r.id ? "\u6536\u8D77\u56DE\u590D" : "\u56DE\u590D"), 1)
                                            ]),
                                            _: 2
                                          }, 1032, ["onClick"])
                                        ]),
                                        replyOpenId.value === r.id ? (openBlock(), createBlock("div", {
                                          key: 0,
                                          class: "mt-2 flex items-center gap-2"
                                        }, [
                                          createVNode(unref(_sfc_main$q), {
                                            modelValue: replyContent.value,
                                            "onUpdate:modelValue": ($event) => replyContent.value = $event,
                                            placeholder: "\u56DE\u590D\u2026",
                                            class: "h-8 text-sm",
                                            onKeydown: withKeys(withModifiers(($event) => submitReply(r.id), ["prevent"]), ["enter"])
                                          }, null, 8, ["modelValue", "onUpdate:modelValue", "onKeydown"]),
                                          createVNode(unref(_sfc_main$v), {
                                            size: "sm",
                                            class: "h-8",
                                            onClick: ($event) => submitReply(r.id),
                                            disabled: !replyContent.value.trim()
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("\u53D1\u9001")
                                            ]),
                                            _: 1
                                          }, 8, ["onClick", "disabled"])
                                        ])) : createCommentVNode("", true)
                                      ])
                                    ]),
                                    r.replies?.length ? (openBlock(), createBlock("div", {
                                      key: 0,
                                      class: "pl-9 space-y-2"
                                    }, [
                                      (openBlock(true), createBlock(Fragment, null, renderList(r.replies, (z) => {
                                        return openBlock(), createBlock("div", {
                                          key: z.id,
                                          class: "flex items-start gap-3"
                                        }, [
                                          createVNode(unref(_sfc_main$5$2), { class: "w-6 h-6" }, {
                                            default: withCtx(() => [
                                              createVNode(unref(_sfc_main$3$1), {
                                                src: z.author.avatarUrl || "/assets/images/xiaobai/xiaobai-2.png"
                                              }, null, 8, ["src"]),
                                              createVNode(unref(_sfc_main$4$1), null, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(z.author.nickName?.slice(0, 2)), 1)
                                                ]),
                                                _: 2
                                              }, 1024)
                                            ]),
                                            _: 2
                                          }, 1024),
                                          createVNode("div", { class: "flex-1 space-y-1" }, [
                                            createVNode("div", { class: "flex items-center justify-between" }, [
                                              createVNode("span", { class: "text-sm font-medium text-foreground" }, toDisplayString(z.author.nickName), 1),
                                              createVNode("span", { class: "text-xs text-muted-foreground" }, toDisplayString(new Date(z.createdAt).toLocaleString()), 1)
                                            ]),
                                            createVNode("div", { class: "text-sm text-foreground/90" }, toDisplayString(z.content), 1)
                                          ])
                                        ]);
                                      }), 128))
                                    ])) : createCommentVNode("", true)
                                  ]);
                                }), 128))
                              ])) : createCommentVNode("", true)
                            ]);
                          }), 128))
                        ]))
                      ])) : createCommentVNode("", true)
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$5$1), null, {
                default: withCtx(() => [
                  createVNode("div", { class: "flex items-center gap-2 text-sm text-muted-foreground mb-4" }, [
                    createVNode("span", null, toDisplayString(dateLabel.value), 1),
                    __props.tags?.length ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "ml-auto inline-flex flex-wrap gap-1.5"
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.tags, (t) => {
                        return openBlock(), createBlock(unref(_sfc_main$2$1), {
                          key: t,
                          variant: "secondary",
                          class: "hover:bg-secondary/80"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(t), 1)
                          ]),
                          _: 2
                        }, 1024);
                      }), 128))
                    ])) : createCommentVNode("", true)
                  ]),
                  createVNode("div", { class: "mt-2 text-foreground leading-relaxed whitespace-pre-wrap break-words" }, toDisplayString(__props.content), 1),
                  __props.mediaUrls?.length ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "mt-4 grid grid-cols-3 gap-2"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.mediaUrls, (u, i) => {
                      return openBlock(), createBlock("div", {
                        key: i,
                        class: "relative cursor-pointer overflow-hidden rounded-lg group shadow-sm hover:shadow-md transition-all duration-300 aspect-square",
                        onClick: ($event) => openPreview(i)
                      }, [
                        isImage(u) ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "relative w-full h-full bg-muted"
                        }, [
                          createVNode("img", {
                            src: unref(getThumbnailUrl)(u),
                            "data-original": u,
                            loading: "lazy",
                            decoding: "async",
                            class: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-0 transition-opacity duration-300",
                            onError: handleThumbnailError,
                            onLoad: (e) => e.target.classList.remove("opacity-0")
                          }, null, 40, ["src", "data-original", "onLoad"])
                        ])) : isVideo(u) ? (openBlock(), createBlock("div", {
                          key: 1,
                          class: "w-full h-full bg-muted flex items-center justify-center relative group-hover:bg-muted/80 transition-colors duration-300"
                        }, [
                          createVNode("video", {
                            src: u,
                            class: "w-full h-full object-cover",
                            preload: "metadata",
                            muted: "",
                            onLoadedmetadata: handleVideoMetadata
                          }, null, 40, ["src"]),
                          createVNode("div", { class: "absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors duration-300" }, [
                            (openBlock(), createBlock("svg", {
                              class: "w-10 h-10 text-white drop-shadow-lg",
                              fill: "currentColor",
                              viewBox: "0 0 24 24"
                            }, [
                              createVNode("path", { d: "M8 5v14l11-7z" })
                            ]))
                          ])
                        ])) : (openBlock(), createBlock("div", {
                          key: 2,
                          class: "w-full h-full bg-muted flex items-center justify-center"
                        }, [
                          createVNode("span", { class: "text-xs text-muted-foreground" }, "\u672A\u77E5\u7C7B\u578B")
                        ]))
                      ], 8, ["onClick"]);
                    }), 128))
                  ])) : createCommentVNode("", true),
                  (openBlock(), createBlock(Teleport, { to: "body" }, [
                    previewIndex.value !== null ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-sm",
                      onClick: withModifiers(closePreview, ["self"]),
                      onKeydown: withKeys(closePreview, ["esc"])
                    }, [
                      createVNode("button", {
                        class: "absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-50 transition-all duration-200 hover:scale-110 active:scale-95 border-none cursor-pointer",
                        onClick: closePreview
                      }, [
                        (openBlock(), createBlock("svg", {
                          class: "w-6 h-6",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M6 18L18 6M6 6l12 12"
                          })
                        ]))
                      ]),
                      __props.mediaUrls && __props.mediaUrls.length > 1 && previewIndex.value !== null && previewIndex.value > 0 ? (openBlock(), createBlock("button", {
                        key: 0,
                        class: "absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-50 cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 border-none",
                        onClick: withModifiers(prevMedia, ["stop", "prevent"]),
                        type: "button"
                      }, [
                        (openBlock(), createBlock("svg", {
                          class: "w-6 h-6",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M15 19l-7-7 7-7"
                          })
                        ]))
                      ])) : createCommentVNode("", true),
                      __props.mediaUrls && __props.mediaUrls.length > 1 && previewIndex.value !== null && previewIndex.value < __props.mediaUrls.length - 1 ? (openBlock(), createBlock("button", {
                        key: 1,
                        class: "absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-50 cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 border-none",
                        onClick: withModifiers(nextMedia, ["stop", "prevent"]),
                        type: "button"
                      }, [
                        (openBlock(), createBlock("svg", {
                          class: "w-6 h-6",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M9 5l7 7-7 7"
                          })
                        ]))
                      ])) : createCommentVNode("", true),
                      createVNode("div", {
                        class: "max-w-[90vw] max-h-[90vh] flex items-center justify-center w-full h-full p-4",
                        onClick: withModifiers(() => {
                        }, ["stop"])
                      }, [
                        currentMedia.value && isImage(currentMedia.value) ? (openBlock(), createBlock("img", {
                          key: 0,
                          src: currentMedia.value,
                          class: "max-w-full max-h-[85vh] object-contain shadow-2xl rounded-sm select-none",
                          alt: "\u9884\u89C8"
                        }, null, 8, ["src"])) : currentMedia.value && isVideo(currentMedia.value) ? (openBlock(), createBlock("video", {
                          key: 1,
                          src: currentMedia.value,
                          class: "max-w-full max-h-[85vh] shadow-2xl rounded-sm",
                          controls: "",
                          autoplay: ""
                        }, null, 8, ["src"])) : createCommentVNode("", true)
                      ], 8, ["onClick"]),
                      __props.mediaUrls && __props.mediaUrls.length > 1 ? (openBlock(), createBlock("div", {
                        key: 2,
                        class: "absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-sm font-medium border border-white/5"
                      }, toDisplayString(previewIndex.value + 1) + " / " + toDisplayString(__props.mediaUrls.length), 1)) : createCommentVNode("", true)
                    ], 32)) : createCommentVNode("", true)
                  ])),
                  createVNode("div", { class: "mt-4 flex items-center gap-2 text-sm border-t pt-1" }, [
                    createVNode(unref(_sfc_main$v), {
                      variant: "ghost",
                      size: "sm",
                      class: "h-8 px-2 text-muted-foreground hover:text-foreground",
                      onClick: toggleComments
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(showComments.value ? "\u6536\u8D77\u8BC4\u8BBA" : `\u67E5\u770B\u8BC4\u8BBA${displayCount.value}`), 1)
                      ]),
                      _: 1
                    }),
                    createVNode("span", { class: "text-border h-4 w-px bg-border" }),
                    createVNode(unref(_sfc_main$v), {
                      variant: "ghost",
                      size: "sm",
                      class: "h-8 px-2 text-muted-foreground hover:text-foreground",
                      onClick: toggleInput
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(showInput.value ? "\u6536\u8D77\u8F93\u5165" : "\u5199\u8BC4\u8BBA"), 1)
                      ]),
                      _: 1
                    }),
                    canDelete.value ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                      createVNode("span", { class: "text-border h-4 w-px bg-border" }),
                      createVNode(unref(_sfc_main$v), {
                        variant: "ghost",
                        size: "sm",
                        class: "h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10",
                        onClick: handleDelete
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" \u5220\u9664 ")
                        ]),
                        _: 1
                      })
                    ], 64)) : createCommentVNode("", true)
                  ]),
                  showInput.value ? (openBlock(), createBlock("div", {
                    key: 1,
                    class: "mt-4 flex gap-2 animate-fade-in items-end"
                  }, [
                    createVNode(unref(_sfc_main$q), {
                      modelValue: comment.value,
                      "onUpdate:modelValue": ($event) => comment.value = $event,
                      placeholder: "\u5199\u70B9\u8BC4\u8BBA\u2026",
                      class: "flex-1",
                      onKeydown: withKeys(withModifiers(submit, ["prevent"]), ["enter"])
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "onKeydown"]),
                    createVNode(unref(_sfc_main$v), {
                      onClick: submit,
                      disabled: !comment.value.trim()
                    }, {
                      default: withCtx(() => [
                        createTextVNode("\u53D1\u5E03")
                      ]),
                      _: 1
                    }, 8, ["disabled"])
                  ])) : createCommentVNode("", true),
                  createVNode("div", { class: "mt-2" }, [
                    showComments.value ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "mt-4 space-y-4"
                    }, [
                      loading.value ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "text-sm text-muted-foreground py-2 text-center"
                      }, "\u52A0\u8F7D\u4E2D\u2026")) : comments.value.length === 0 ? (openBlock(), createBlock("div", {
                        key: 1,
                        class: "text-sm text-muted-foreground py-2 text-center"
                      }, "\u6682\u65E0\u8BC4\u8BBA")) : (openBlock(), createBlock("div", {
                        key: 2,
                        class: "space-y-4 pl-1"
                      }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(comments.value, (c) => {
                          return openBlock(), createBlock("div", {
                            key: c.id,
                            class: "space-y-2"
                          }, [
                            createVNode("div", { class: "flex items-start gap-3" }, [
                              createVNode(unref(_sfc_main$5$2), { class: "w-8 h-8" }, {
                                default: withCtx(() => [
                                  createVNode(unref(_sfc_main$3$1), {
                                    src: c.author.avatarUrl || "/assets/images/xiaobai/xiaobai-2.png"
                                  }, null, 8, ["src"]),
                                  createVNode(unref(_sfc_main$4$1), null, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(c.author.nickName?.slice(0, 2) || "\u7528\u6237"), 1)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 2
                              }, 1024),
                              createVNode("div", { class: "flex-1 space-y-1" }, [
                                createVNode("div", { class: "flex items-center justify-between" }, [
                                  createVNode("span", { class: "text-sm font-medium text-foreground" }, toDisplayString(c.author.nickName), 1),
                                  createVNode("span", { class: "text-xs text-muted-foreground" }, toDisplayString(new Date(c.createdAt).toLocaleString()), 1)
                                ]),
                                createVNode("div", { class: "text-sm text-foreground/90" }, toDisplayString(c.content), 1),
                                createVNode("div", { class: "flex items-center gap-2 pt-1" }, [
                                  createVNode(unref(_sfc_main$v), {
                                    variant: "link",
                                    size: "sm",
                                    class: "h-auto p-0 text-muted-foreground text-xs",
                                    onClick: ($event) => toggleReply(c.id)
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(replyOpenId.value === c.id ? "\u6536\u8D77\u56DE\u590D" : "\u56DE\u590D"), 1)
                                    ]),
                                    _: 2
                                  }, 1032, ["onClick"])
                                ]),
                                replyOpenId.value === c.id ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  class: "mt-2 flex items-center gap-2"
                                }, [
                                  createVNode(unref(_sfc_main$q), {
                                    modelValue: replyContent.value,
                                    "onUpdate:modelValue": ($event) => replyContent.value = $event,
                                    placeholder: "\u56DE\u590D\u2026",
                                    class: "h-8 text-sm",
                                    onKeydown: withKeys(withModifiers(($event) => submitReply(c.id), ["prevent"]), ["enter"])
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "onKeydown"]),
                                  createVNode(unref(_sfc_main$v), {
                                    size: "sm",
                                    class: "h-8",
                                    onClick: ($event) => submitReply(c.id),
                                    disabled: !replyContent.value.trim()
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("\u53D1\u9001")
                                    ]),
                                    _: 1
                                  }, 8, ["onClick", "disabled"])
                                ])) : createCommentVNode("", true)
                              ])
                            ]),
                            c.replies?.length ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "pl-11 space-y-3"
                            }, [
                              (openBlock(true), createBlock(Fragment, null, renderList(c.replies, (r) => {
                                return openBlock(), createBlock("div", {
                                  key: r.id,
                                  class: "space-y-2"
                                }, [
                                  createVNode("div", { class: "flex items-start gap-3" }, [
                                    createVNode(unref(_sfc_main$5$2), { class: "w-6 h-6" }, {
                                      default: withCtx(() => [
                                        createVNode(unref(_sfc_main$3$1), {
                                          src: r.author.avatarUrl || "/assets/images/xiaobai/xiaobai-2.png"
                                        }, null, 8, ["src"]),
                                        createVNode(unref(_sfc_main$4$1), null, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(r.author.nickName?.slice(0, 2)), 1)
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ]),
                                      _: 2
                                    }, 1024),
                                    createVNode("div", { class: "flex-1 space-y-1" }, [
                                      createVNode("div", { class: "flex items-center justify-between" }, [
                                        createVNode("span", { class: "text-sm font-medium text-foreground" }, toDisplayString(r.author.nickName), 1),
                                        createVNode("span", { class: "text-xs text-muted-foreground" }, toDisplayString(new Date(r.createdAt).toLocaleString()), 1)
                                      ]),
                                      createVNode("div", { class: "text-sm text-foreground/90" }, toDisplayString(r.content), 1),
                                      createVNode("div", { class: "flex items-center gap-2 pt-1" }, [
                                        createVNode(unref(_sfc_main$v), {
                                          variant: "link",
                                          size: "sm",
                                          class: "h-auto p-0 text-muted-foreground text-xs",
                                          onClick: ($event) => toggleReply(r.id)
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(replyOpenId.value === r.id ? "\u6536\u8D77\u56DE\u590D" : "\u56DE\u590D"), 1)
                                          ]),
                                          _: 2
                                        }, 1032, ["onClick"])
                                      ]),
                                      replyOpenId.value === r.id ? (openBlock(), createBlock("div", {
                                        key: 0,
                                        class: "mt-2 flex items-center gap-2"
                                      }, [
                                        createVNode(unref(_sfc_main$q), {
                                          modelValue: replyContent.value,
                                          "onUpdate:modelValue": ($event) => replyContent.value = $event,
                                          placeholder: "\u56DE\u590D\u2026",
                                          class: "h-8 text-sm",
                                          onKeydown: withKeys(withModifiers(($event) => submitReply(r.id), ["prevent"]), ["enter"])
                                        }, null, 8, ["modelValue", "onUpdate:modelValue", "onKeydown"]),
                                        createVNode(unref(_sfc_main$v), {
                                          size: "sm",
                                          class: "h-8",
                                          onClick: ($event) => submitReply(r.id),
                                          disabled: !replyContent.value.trim()
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("\u53D1\u9001")
                                          ]),
                                          _: 1
                                        }, 8, ["onClick", "disabled"])
                                      ])) : createCommentVNode("", true)
                                    ])
                                  ]),
                                  r.replies?.length ? (openBlock(), createBlock("div", {
                                    key: 0,
                                    class: "pl-9 space-y-2"
                                  }, [
                                    (openBlock(true), createBlock(Fragment, null, renderList(r.replies, (z) => {
                                      return openBlock(), createBlock("div", {
                                        key: z.id,
                                        class: "flex items-start gap-3"
                                      }, [
                                        createVNode(unref(_sfc_main$5$2), { class: "w-6 h-6" }, {
                                          default: withCtx(() => [
                                            createVNode(unref(_sfc_main$3$1), {
                                              src: z.author.avatarUrl || "/assets/images/xiaobai/xiaobai-2.png"
                                            }, null, 8, ["src"]),
                                            createVNode(unref(_sfc_main$4$1), null, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(z.author.nickName?.slice(0, 2)), 1)
                                              ]),
                                              _: 2
                                            }, 1024)
                                          ]),
                                          _: 2
                                        }, 1024),
                                        createVNode("div", { class: "flex-1 space-y-1" }, [
                                          createVNode("div", { class: "flex items-center justify-between" }, [
                                            createVNode("span", { class: "text-sm font-medium text-foreground" }, toDisplayString(z.author.nickName), 1),
                                            createVNode("span", { class: "text-xs text-muted-foreground" }, toDisplayString(new Date(z.createdAt).toLocaleString()), 1)
                                          ]),
                                          createVNode("div", { class: "text-sm text-foreground/90" }, toDisplayString(z.content), 1)
                                        ])
                                      ]);
                                    }), 128))
                                  ])) : createCommentVNode("", true)
                                ]);
                              }), 128))
                            ])) : createCommentVNode("", true)
                          ]);
                        }), 128))
                      ]))
                    ])) : createCommentVNode("", true)
                  ])
                ]),
                _: 2
              }, 1024)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$n = _sfc_main$n.setup;
_sfc_main$n.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/PostCard.vue");
  return _sfc_setup$n ? _sfc_setup$n(props, ctx) : void 0;
};
const PostCard = Object.assign(_sfc_main$n, { __name: "PostCard" });
const _sfc_main$m = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "timeline relative" }, _attrs))} data-v-dfa7c259><div class="rail" data-v-dfa7c259></div><div class="space-y-6" data-v-dfa7c259>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</div></div>`);
}
const _sfc_setup$m = _sfc_main$m.setup;
_sfc_main$m.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Timeline.vue");
  return _sfc_setup$m ? _sfc_setup$m(props, ctx) : void 0;
};
const Timeline = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$m, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-dfa7c259"]]), { __name: "Timeline" });
const _sfc_main$l = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative pl-14" }, _attrs))} data-v-fda2d56c><div class="node" data-v-fda2d56c><svg viewBox="0 0 24 24" class="paw" data-v-fda2d56c><circle cx="7.5" cy="7.5" r="2.2" data-v-fda2d56c></circle><circle cx="12" cy="6.5" r="2.2" data-v-fda2d56c></circle><circle cx="16.5" cy="7.5" r="2.2" data-v-fda2d56c></circle><ellipse cx="12" cy="13.5" rx="4.2" ry="3.2" data-v-fda2d56c></ellipse></svg></div><div data-v-fda2d56c>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</div></div>`);
}
const _sfc_setup$l = _sfc_main$l.setup;
_sfc_main$l.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TimelineItem.vue");
  return _sfc_setup$l ? _sfc_setup$l(props, ctx) : void 0;
};
const TimelineItem = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$l, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-fda2d56c"]]), { __name: "TimelineItem" });
const _sfc_main$k = /* @__PURE__ */ defineComponent({
  ...{
    inheritAttrs: false
  },
  __name: "NativeSelect",
  __ssrInlineRender: true,
  props: {
    modelValue: {},
    class: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const delegatedProps = reactiveOmit(props, "class");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "group/native-select relative w-fit has-[select:disabled]:opacity-50",
        "data-slot": "native-select-wrapper"
      }, _attrs))}><select${ssrRenderAttrs(mergeProps({ ..._ctx.$attrs, ...unref(delegatedProps) }, {
        "data-slot": "native-select",
        class: unref(cn)(
          "border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 dark:hover:bg-input/50 h-9 w-full min-w-0 appearance-none rounded-md border bg-transparent px-3 py-2 pr-9 text-sm shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          props.class
        )
      }))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</select>`);
      _push(ssrRenderComponent(unref(ChevronDownIcon), {
        class: "text-muted-foreground pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 opacity-50 select-none",
        "aria-hidden": "true",
        "data-slot": "native-select-icon"
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$k = _sfc_main$k.setup;
_sfc_main$k.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/native-select/NativeSelect.vue");
  return _sfc_setup$k ? _sfc_setup$k(props, ctx) : void 0;
};
const _sfc_main$j = /* @__PURE__ */ defineComponent({
  __name: "NativeSelectOptGroup",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<optgroup${ssrRenderAttrs(mergeProps({
        "data-slot": "native-select-optgroup",
        class: unref(cn)("bg-popover text-popover-foreground", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</optgroup>`);
    };
  }
});
const _sfc_setup$j = _sfc_main$j.setup;
_sfc_main$j.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/native-select/NativeSelectOptGroup.vue");
  return _sfc_setup$j ? _sfc_setup$j(props, ctx) : void 0;
};
const _sfc_main$i = /* @__PURE__ */ defineComponent({
  __name: "NativeSelectOption",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<option${ssrRenderAttrs(mergeProps({
        "data-slot": "native-select-option",
        class: unref(cn)("bg-popover text-popover-foreground", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</option>`);
    };
  }
});
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/native-select/NativeSelectOption.vue");
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};
const _sfc_main$h = /* @__PURE__ */ defineComponent({
  __name: "Calendar",
  __ssrInlineRender: true,
  props: {
    defaultValue: {},
    defaultPlaceholder: {},
    placeholder: {},
    pagedNavigation: { type: Boolean },
    preventDeselect: { type: Boolean },
    weekStartsOn: {},
    weekdayFormat: {},
    calendarLabel: {},
    fixedWeeks: { type: Boolean },
    maxValue: {},
    minValue: {},
    locale: {},
    numberOfMonths: {},
    disabled: { type: Boolean },
    readonly: { type: Boolean },
    initialFocus: { type: Boolean },
    isDateDisabled: {},
    isDateUnavailable: {},
    dir: {},
    nextPage: {},
    prevPage: {},
    modelValue: { default: void 0 },
    multiple: { type: Boolean },
    disableDaysOutsideCurrentView: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {},
    layout: { default: void 0 },
    yearRange: {}
  },
  emits: ["update:modelValue", "update:placeholder"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const delegatedProps = reactiveOmit(props, "class", "layout", "placeholder");
    const placeholder = useVModel(props, "placeholder", emits, {
      passive: true,
      defaultValue: props.defaultPlaceholder ?? today(getLocalTimeZone())
    });
    const formatter = useDateFormatter(props.locale ?? "en");
    const yearRange = computed(() => {
      return props.yearRange ?? createYearRange({
        start: props?.minValue ?? (toRaw(props.placeholder) ?? props.defaultPlaceholder ?? today(getLocalTimeZone())).cycle("year", -100),
        end: props?.maxValue ?? (toRaw(props.placeholder) ?? props.defaultPlaceholder ?? today(getLocalTimeZone())).cycle("year", 10)
      });
    });
    const [DefineMonthTemplate, ReuseMonthTemplate] = createReusableTemplate();
    const [DefineYearTemplate, ReuseYearTemplate] = createReusableTemplate();
    const forwarded = useForwardPropsEmits(delegatedProps, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(DefineMonthTemplate), null, {
        default: withCtx(({ date }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="**:data-[slot=native-select-icon]:right-1"${_scopeId}><div class="relative"${_scopeId}><div class="absolute inset-0 flex h-full items-center text-sm pl-2 pointer-events-none"${_scopeId}>${ssrInterpolate(unref(formatter).custom(unref(toDate)(date), { month: "short" }))}</div>`);
            _push2(ssrRenderComponent(unref(_sfc_main$k), {
              class: "text-xs h-8 pr-6 pl-2 text-transparent relative",
              onChange: (e) => {
                placeholder.value = unref(placeholder).set({
                  month: Number(e?.target?.value)
                });
              }
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<!--[-->`);
                  ssrRenderList(unref(createYear)({ dateObj: date }), (month) => {
                    _push3(ssrRenderComponent(unref(_sfc_main$i), {
                      key: month.toString(),
                      value: month.month,
                      selected: date.month === month.month
                    }, {
                      default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(unref(formatter).custom(unref(toDate)(month), { month: "short" }))}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(unref(formatter).custom(unref(toDate)(month), { month: "short" })), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  });
                  _push3(`<!--]-->`);
                } else {
                  return [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(createYear)({ dateObj: date }), (month) => {
                      return openBlock(), createBlock(unref(_sfc_main$i), {
                        key: month.toString(),
                        value: month.month,
                        selected: date.month === month.month
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(unref(formatter).custom(unref(toDate)(month), { month: "short" })), 1)
                        ]),
                        _: 2
                      }, 1032, ["value", "selected"]);
                    }), 128))
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "**:data-[slot=native-select-icon]:right-1" }, [
                createVNode("div", { class: "relative" }, [
                  createVNode("div", { class: "absolute inset-0 flex h-full items-center text-sm pl-2 pointer-events-none" }, toDisplayString(unref(formatter).custom(unref(toDate)(date), { month: "short" })), 1),
                  createVNode(unref(_sfc_main$k), {
                    class: "text-xs h-8 pr-6 pl-2 text-transparent relative",
                    onChange: (e) => {
                      placeholder.value = unref(placeholder).set({
                        month: Number(e?.target?.value)
                      });
                    }
                  }, {
                    default: withCtx(() => [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(createYear)({ dateObj: date }), (month) => {
                        return openBlock(), createBlock(unref(_sfc_main$i), {
                          key: month.toString(),
                          value: month.month,
                          selected: date.month === month.month
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(unref(formatter).custom(unref(toDate)(month), { month: "short" })), 1)
                          ]),
                          _: 2
                        }, 1032, ["value", "selected"]);
                      }), 128))
                    ]),
                    _: 2
                  }, 1032, ["onChange"])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(DefineYearTemplate), null, {
        default: withCtx(({ date }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="**:data-[slot=native-select-icon]:right-1"${_scopeId}><div class="relative"${_scopeId}><div class="absolute inset-0 flex h-full items-center text-sm pl-2 pointer-events-none"${_scopeId}>${ssrInterpolate(unref(formatter).custom(unref(toDate)(date), { year: "numeric" }))}</div>`);
            _push2(ssrRenderComponent(unref(_sfc_main$k), {
              class: "text-xs h-8 pr-6 pl-2 text-transparent relative",
              onChange: (e) => {
                placeholder.value = unref(placeholder).set({
                  year: Number(e?.target?.value)
                });
              }
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<!--[-->`);
                  ssrRenderList(yearRange.value, (year) => {
                    _push3(ssrRenderComponent(unref(_sfc_main$i), {
                      key: year.toString(),
                      value: year.year,
                      selected: date.year === year.year
                    }, {
                      default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(unref(formatter).custom(unref(toDate)(year), { year: "numeric" }))}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(unref(formatter).custom(unref(toDate)(year), { year: "numeric" })), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  });
                  _push3(`<!--]-->`);
                } else {
                  return [
                    (openBlock(true), createBlock(Fragment, null, renderList(yearRange.value, (year) => {
                      return openBlock(), createBlock(unref(_sfc_main$i), {
                        key: year.toString(),
                        value: year.year,
                        selected: date.year === year.year
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(unref(formatter).custom(unref(toDate)(year), { year: "numeric" })), 1)
                        ]),
                        _: 2
                      }, 1032, ["value", "selected"]);
                    }), 128))
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "**:data-[slot=native-select-icon]:right-1" }, [
                createVNode("div", { class: "relative" }, [
                  createVNode("div", { class: "absolute inset-0 flex h-full items-center text-sm pl-2 pointer-events-none" }, toDisplayString(unref(formatter).custom(unref(toDate)(date), { year: "numeric" })), 1),
                  createVNode(unref(_sfc_main$k), {
                    class: "text-xs h-8 pr-6 pl-2 text-transparent relative",
                    onChange: (e) => {
                      placeholder.value = unref(placeholder).set({
                        year: Number(e?.target?.value)
                      });
                    }
                  }, {
                    default: withCtx(() => [
                      (openBlock(true), createBlock(Fragment, null, renderList(yearRange.value, (year) => {
                        return openBlock(), createBlock(unref(_sfc_main$i), {
                          key: year.toString(),
                          value: year.year,
                          selected: date.year === year.year
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(unref(formatter).custom(unref(toDate)(year), { year: "numeric" })), 1)
                          ]),
                          _: 2
                        }, 1032, ["value", "selected"]);
                      }), 128))
                    ]),
                    _: 2
                  }, 1032, ["onChange"])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(CalendarRoot), mergeProps(unref(forwarded), {
        placeholder: unref(placeholder),
        "onUpdate:placeholder": ($event) => isRef(placeholder) ? placeholder.value = $event : null,
        "data-slot": "calendar",
        class: unref(cn)("p-3", props.class)
      }), {
        default: withCtx(({ grid, weekDays, date }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$9), { class: "pt-0" }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<nav class="flex items-center gap-1 absolute top-0 inset-x-0 justify-between"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$6), null, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        ssrRenderSlot(_ctx.$slots, "calendar-prev-icon", {}, null, _push4, _parent4, _scopeId3);
                      } else {
                        return [
                          renderSlot(_ctx.$slots, "calendar-prev-icon")
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$7), null, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        ssrRenderSlot(_ctx.$slots, "calendar-next-icon", {}, null, _push4, _parent4, _scopeId3);
                      } else {
                        return [
                          renderSlot(_ctx.$slots, "calendar-next-icon")
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                  _push3(`</nav>`);
                  ssrRenderSlot(_ctx.$slots, "calendar-heading", {
                    date,
                    month: unref(ReuseMonthTemplate),
                    year: unref(ReuseYearTemplate)
                  }, () => {
                    if (__props.layout === "month-and-year") {
                      _push3(`<div class="flex items-center justify-center gap-1"${_scopeId2}>`);
                      _push3(ssrRenderComponent(unref(ReuseMonthTemplate), { date }, null, _parent3, _scopeId2));
                      _push3(ssrRenderComponent(unref(ReuseYearTemplate), { date }, null, _parent3, _scopeId2));
                      _push3(`</div>`);
                    } else if (__props.layout === "month-only") {
                      _push3(`<div class="flex items-center justify-center gap-1"${_scopeId2}>`);
                      _push3(ssrRenderComponent(unref(ReuseMonthTemplate), { date }, null, _parent3, _scopeId2));
                      _push3(` ${ssrInterpolate(unref(formatter).custom(unref(toDate)(date), { year: "numeric" }))}</div>`);
                    } else if (__props.layout === "year-only") {
                      _push3(`<div class="flex items-center justify-center gap-1"${_scopeId2}>${ssrInterpolate(unref(formatter).custom(unref(toDate)(date), { month: "short" }))} `);
                      _push3(ssrRenderComponent(unref(ReuseYearTemplate), { date }, null, _parent3, _scopeId2));
                      _push3(`</div>`);
                    } else {
                      _push3(ssrRenderComponent(unref(_sfc_main$8), null, null, _parent3, _scopeId2));
                    }
                  }, _push3, _parent3, _scopeId2);
                } else {
                  return [
                    createVNode("nav", { class: "flex items-center gap-1 absolute top-0 inset-x-0 justify-between" }, [
                      createVNode(unref(_sfc_main$6), null, {
                        default: withCtx(() => [
                          renderSlot(_ctx.$slots, "calendar-prev-icon")
                        ]),
                        _: 3
                      }),
                      createVNode(unref(_sfc_main$7), null, {
                        default: withCtx(() => [
                          renderSlot(_ctx.$slots, "calendar-next-icon")
                        ]),
                        _: 3
                      })
                    ]),
                    renderSlot(_ctx.$slots, "calendar-heading", {
                      date,
                      month: unref(ReuseMonthTemplate),
                      year: unref(ReuseYearTemplate)
                    }, () => [
                      __props.layout === "month-and-year" ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "flex items-center justify-center gap-1"
                      }, [
                        createVNode(unref(ReuseMonthTemplate), { date }, null, 8, ["date"]),
                        createVNode(unref(ReuseYearTemplate), { date }, null, 8, ["date"])
                      ])) : __props.layout === "month-only" ? (openBlock(), createBlock("div", {
                        key: 1,
                        class: "flex items-center justify-center gap-1"
                      }, [
                        createVNode(unref(ReuseMonthTemplate), { date }, null, 8, ["date"]),
                        createTextVNode(" " + toDisplayString(unref(formatter).custom(unref(toDate)(date), { year: "numeric" })), 1)
                      ])) : __props.layout === "year-only" ? (openBlock(), createBlock("div", {
                        key: 2,
                        class: "flex items-center justify-center gap-1"
                      }, [
                        createTextVNode(toDisplayString(unref(formatter).custom(unref(toDate)(date), { month: "short" })) + " ", 1),
                        createVNode(unref(ReuseYearTemplate), { date }, null, 8, ["date"])
                      ])) : (openBlock(), createBlock(unref(_sfc_main$8), { key: 3 }))
                    ])
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(`<div class="flex flex-col gap-y-4 mt-4 sm:flex-row sm:gap-x-4 sm:gap-y-0"${_scopeId}><!--[-->`);
            ssrRenderList(grid, (month) => {
              _push2(ssrRenderComponent(unref(_sfc_main$e), {
                key: month.value.toString()
              }, {
                default: withCtx((_, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(_sfc_main$c), null, {
                      default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(_sfc_main$b), null, {
                            default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<!--[-->`);
                                ssrRenderList(weekDays, (day) => {
                                  _push5(ssrRenderComponent(unref(_sfc_main$a), { key: day }, {
                                    default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(`${ssrInterpolate(day)}`);
                                      } else {
                                        return [
                                          createTextVNode(toDisplayString(day), 1)
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                });
                                _push5(`<!--]-->`);
                              } else {
                                return [
                                  (openBlock(true), createBlock(Fragment, null, renderList(weekDays, (day) => {
                                    return openBlock(), createBlock(unref(_sfc_main$a), { key: day }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(day), 1)
                                      ]),
                                      _: 2
                                    }, 1024);
                                  }), 128))
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(_sfc_main$b), null, {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(weekDays, (day) => {
                                  return openBlock(), createBlock(unref(_sfc_main$a), { key: day }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(day), 1)
                                    ]),
                                    _: 2
                                  }, 1024);
                                }), 128))
                              ]),
                              _: 2
                            }, 1024)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(_sfc_main$d), null, {
                      default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<!--[-->`);
                          ssrRenderList(month.rows, (weekDates, index) => {
                            _push4(ssrRenderComponent(unref(_sfc_main$b), {
                              key: `weekDate-${index}`,
                              class: "mt-2 w-full"
                            }, {
                              default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`<!--[-->`);
                                  ssrRenderList(weekDates, (weekDate) => {
                                    _push5(ssrRenderComponent(unref(_sfc_main$g), {
                                      key: weekDate.toString(),
                                      date: weekDate
                                    }, {
                                      default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                        if (_push6) {
                                          _push6(ssrRenderComponent(unref(_sfc_main$f), {
                                            day: weekDate,
                                            month: month.value
                                          }, null, _parent6, _scopeId5));
                                        } else {
                                          return [
                                            createVNode(unref(_sfc_main$f), {
                                              day: weekDate,
                                              month: month.value
                                            }, null, 8, ["day", "month"])
                                          ];
                                        }
                                      }),
                                      _: 2
                                    }, _parent5, _scopeId4));
                                  });
                                  _push5(`<!--]-->`);
                                } else {
                                  return [
                                    (openBlock(true), createBlock(Fragment, null, renderList(weekDates, (weekDate) => {
                                      return openBlock(), createBlock(unref(_sfc_main$g), {
                                        key: weekDate.toString(),
                                        date: weekDate
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(_sfc_main$f), {
                                            day: weekDate,
                                            month: month.value
                                          }, null, 8, ["day", "month"])
                                        ]),
                                        _: 2
                                      }, 1032, ["date"]);
                                    }), 128))
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          });
                          _push4(`<!--]-->`);
                        } else {
                          return [
                            (openBlock(true), createBlock(Fragment, null, renderList(month.rows, (weekDates, index) => {
                              return openBlock(), createBlock(unref(_sfc_main$b), {
                                key: `weekDate-${index}`,
                                class: "mt-2 w-full"
                              }, {
                                default: withCtx(() => [
                                  (openBlock(true), createBlock(Fragment, null, renderList(weekDates, (weekDate) => {
                                    return openBlock(), createBlock(unref(_sfc_main$g), {
                                      key: weekDate.toString(),
                                      date: weekDate
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(_sfc_main$f), {
                                          day: weekDate,
                                          month: month.value
                                        }, null, 8, ["day", "month"])
                                      ]),
                                      _: 2
                                    }, 1032, ["date"]);
                                  }), 128))
                                ]),
                                _: 2
                              }, 1024);
                            }), 128))
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(_sfc_main$c), null, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$b), null, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(weekDays, (day) => {
                                return openBlock(), createBlock(unref(_sfc_main$a), { key: day }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(day), 1)
                                  ]),
                                  _: 2
                                }, 1024);
                              }), 128))
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1024),
                      createVNode(unref(_sfc_main$d), null, {
                        default: withCtx(() => [
                          (openBlock(true), createBlock(Fragment, null, renderList(month.rows, (weekDates, index) => {
                            return openBlock(), createBlock(unref(_sfc_main$b), {
                              key: `weekDate-${index}`,
                              class: "mt-2 w-full"
                            }, {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(weekDates, (weekDate) => {
                                  return openBlock(), createBlock(unref(_sfc_main$g), {
                                    key: weekDate.toString(),
                                    date: weekDate
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(_sfc_main$f), {
                                        day: weekDate,
                                        month: month.value
                                      }, null, 8, ["day", "month"])
                                    ]),
                                    _: 2
                                  }, 1032, ["date"]);
                                }), 128))
                              ]),
                              _: 2
                            }, 1024);
                          }), 128))
                        ]),
                        _: 2
                      }, 1024)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode(unref(_sfc_main$9), { class: "pt-0" }, {
                default: withCtx(() => [
                  createVNode("nav", { class: "flex items-center gap-1 absolute top-0 inset-x-0 justify-between" }, [
                    createVNode(unref(_sfc_main$6), null, {
                      default: withCtx(() => [
                        renderSlot(_ctx.$slots, "calendar-prev-icon")
                      ]),
                      _: 3
                    }),
                    createVNode(unref(_sfc_main$7), null, {
                      default: withCtx(() => [
                        renderSlot(_ctx.$slots, "calendar-next-icon")
                      ]),
                      _: 3
                    })
                  ]),
                  renderSlot(_ctx.$slots, "calendar-heading", {
                    date,
                    month: unref(ReuseMonthTemplate),
                    year: unref(ReuseYearTemplate)
                  }, () => [
                    __props.layout === "month-and-year" ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "flex items-center justify-center gap-1"
                    }, [
                      createVNode(unref(ReuseMonthTemplate), { date }, null, 8, ["date"]),
                      createVNode(unref(ReuseYearTemplate), { date }, null, 8, ["date"])
                    ])) : __props.layout === "month-only" ? (openBlock(), createBlock("div", {
                      key: 1,
                      class: "flex items-center justify-center gap-1"
                    }, [
                      createVNode(unref(ReuseMonthTemplate), { date }, null, 8, ["date"]),
                      createTextVNode(" " + toDisplayString(unref(formatter).custom(unref(toDate)(date), { year: "numeric" })), 1)
                    ])) : __props.layout === "year-only" ? (openBlock(), createBlock("div", {
                      key: 2,
                      class: "flex items-center justify-center gap-1"
                    }, [
                      createTextVNode(toDisplayString(unref(formatter).custom(unref(toDate)(date), { month: "short" })) + " ", 1),
                      createVNode(unref(ReuseYearTemplate), { date }, null, 8, ["date"])
                    ])) : (openBlock(), createBlock(unref(_sfc_main$8), { key: 3 }))
                  ])
                ]),
                _: 2
              }, 1024),
              createVNode("div", { class: "flex flex-col gap-y-4 mt-4 sm:flex-row sm:gap-x-4 sm:gap-y-0" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(grid, (month) => {
                  return openBlock(), createBlock(unref(_sfc_main$e), {
                    key: month.value.toString()
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$c), null, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$b), null, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(weekDays, (day) => {
                                return openBlock(), createBlock(unref(_sfc_main$a), { key: day }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(day), 1)
                                  ]),
                                  _: 2
                                }, 1024);
                              }), 128))
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1024),
                      createVNode(unref(_sfc_main$d), null, {
                        default: withCtx(() => [
                          (openBlock(true), createBlock(Fragment, null, renderList(month.rows, (weekDates, index) => {
                            return openBlock(), createBlock(unref(_sfc_main$b), {
                              key: `weekDate-${index}`,
                              class: "mt-2 w-full"
                            }, {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(weekDates, (weekDate) => {
                                  return openBlock(), createBlock(unref(_sfc_main$g), {
                                    key: weekDate.toString(),
                                    date: weekDate
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(_sfc_main$f), {
                                        day: weekDate,
                                        month: month.value
                                      }, null, 8, ["day", "month"])
                                    ]),
                                    _: 2
                                  }, 1032, ["date"]);
                                }), 128))
                              ]),
                              _: 2
                            }, 1024);
                          }), 128))
                        ]),
                        _: 2
                      }, 1024)
                    ]),
                    _: 2
                  }, 1024);
                }), 128))
              ])
            ];
          }
        }),
        _: 3
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/calendar/Calendar.vue");
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};
const _sfc_main$g = /* @__PURE__ */ defineComponent({
  __name: "CalendarCell",
  __ssrInlineRender: true,
  props: {
    date: {},
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = reactiveOmit(props, "class");
    const forwardedProps = useForwardProps(delegatedProps);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(CalendarCell), mergeProps({
        "data-slot": "calendar-cell",
        class: unref(cn)("relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([data-selected])]:rounded-md [&:has([data-selected])]:bg-accent", props.class)
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
const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/calendar/CalendarCell.vue");
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};
const _sfc_main$f = /* @__PURE__ */ defineComponent({
  __name: "CalendarCellTrigger",
  __ssrInlineRender: true,
  props: {
    day: {},
    month: {},
    asChild: { type: Boolean },
    as: { default: "button" },
    class: {}
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = reactiveOmit(props, "class");
    const forwardedProps = useForwardProps(delegatedProps);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(CalendarCellTrigger), mergeProps({
        "data-slot": "calendar-cell-trigger",
        class: unref(cn)(
          unref(buttonVariants)({ variant: "ghost" }),
          "size-8 p-0 font-normal aria-selected:opacity-100 cursor-default",
          "[&[data-today]:not([data-selected])]:bg-accent [&[data-today]:not([data-selected])]:text-accent-foreground",
          // Selected
          "data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[selected]:opacity-100 data-[selected]:hover:bg-primary data-[selected]:hover:text-primary-foreground data-[selected]:focus:bg-primary data-[selected]:focus:text-primary-foreground",
          // Disabled
          "data-[disabled]:text-muted-foreground data-[disabled]:opacity-50",
          // Unavailable
          "data-[unavailable]:text-destructive-foreground data-[unavailable]:line-through",
          // Outside months
          "data-[outside-view]:text-muted-foreground",
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
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/calendar/CalendarCellTrigger.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
const _sfc_main$e = /* @__PURE__ */ defineComponent({
  __name: "CalendarGrid",
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
      _push(ssrRenderComponent(unref(CalendarGrid), mergeProps({
        "data-slot": "calendar-grid",
        class: unref(cn)("w-full border-collapse space-x-1", props.class)
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
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/calendar/CalendarGrid.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const _sfc_main$d = /* @__PURE__ */ defineComponent({
  __name: "CalendarGridBody",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(CalendarGridBody), mergeProps({ "data-slot": "calendar-grid-body" }, props, _attrs), {
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
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/calendar/CalendarGridBody.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const _sfc_main$c = /* @__PURE__ */ defineComponent({
  __name: "CalendarGridHead",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(CalendarGridHead), mergeProps({ "data-slot": "calendar-grid-head" }, props, _attrs), {
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
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/calendar/CalendarGridHead.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const _sfc_main$b = /* @__PURE__ */ defineComponent({
  __name: "CalendarGridRow",
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
      _push(ssrRenderComponent(unref(CalendarGridRow), mergeProps({
        "data-slot": "calendar-grid-row",
        class: unref(cn)("flex", props.class)
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
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/calendar/CalendarGridRow.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const _sfc_main$a = /* @__PURE__ */ defineComponent({
  __name: "CalendarHeadCell",
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
      _push(ssrRenderComponent(unref(CalendarHeadCell), mergeProps({
        "data-slot": "calendar-head-cell",
        class: unref(cn)("text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem]", props.class)
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
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/calendar/CalendarHeadCell.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "CalendarHeader",
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
      _push(ssrRenderComponent(unref(CalendarHeader), mergeProps({
        "data-slot": "calendar-header",
        class: unref(cn)("flex justify-center pt-1 relative items-center w-full px-8", props.class)
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
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/calendar/CalendarHeader.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "CalendarHeading",
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
      _push(ssrRenderComponent(unref(CalendarHeading), mergeProps({
        "data-slot": "calendar-heading",
        class: unref(cn)("text-sm font-medium", props.class)
      }, unref(forwardedProps), _attrs), {
        default: withCtx(({ headingValue }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", { headingValue }, () => {
              _push2(`${ssrInterpolate(headingValue)}`);
            }, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default", { headingValue }, () => [
                createTextVNode(toDisplayString(headingValue), 1)
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/calendar/CalendarHeading.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "CalendarNextButton",
  __ssrInlineRender: true,
  props: {
    nextPage: { type: Function },
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = reactiveOmit(props, "class");
    const forwardedProps = useForwardProps(delegatedProps);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(CalendarNext), mergeProps({
        "data-slot": "calendar-next-button",
        class: unref(cn)(
          unref(buttonVariants)({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          props.class
        )
      }, unref(forwardedProps), _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, () => {
              _push2(ssrRenderComponent(unref(ChevronRight), { class: "size-4" }, null, _parent2, _scopeId));
            }, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default", {}, () => [
                createVNode(unref(ChevronRight), { class: "size-4" })
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/calendar/CalendarNextButton.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "CalendarPrevButton",
  __ssrInlineRender: true,
  props: {
    prevPage: { type: Function },
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = reactiveOmit(props, "class");
    const forwardedProps = useForwardProps(delegatedProps);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(CalendarPrev), mergeProps({
        "data-slot": "calendar-prev-button",
        class: unref(cn)(
          unref(buttonVariants)({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          props.class
        )
      }, unref(forwardedProps), _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, () => {
              _push2(ssrRenderComponent(unref(ChevronLeft), { class: "size-4" }, null, _parent2, _scopeId));
            }, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default", {}, () => [
                createVNode(unref(ChevronLeft), { class: "size-4" })
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/calendar/CalendarPrevButton.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "Popover",
  __ssrInlineRender: true,
  props: {
    defaultOpen: { type: Boolean },
    open: { type: Boolean },
    modal: { type: Boolean }
  },
  emits: ["update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const forwarded = useForwardPropsEmits(props, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(PopoverRoot), mergeProps({ "data-slot": "popover" }, unref(forwarded), _attrs), {
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
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/popover/Popover.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "PopoverAnchor",
  __ssrInlineRender: true,
  props: {
    reference: {},
    asChild: { type: Boolean },
    as: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(PopoverAnchor), mergeProps({ "data-slot": "popover-anchor" }, props, _attrs), {
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
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/popover/PopoverAnchor.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  ...{
    inheritAttrs: false
  },
  __name: "PopoverContent",
  __ssrInlineRender: true,
  props: {
    forceMount: { type: Boolean },
    side: {},
    sideOffset: { default: 4 },
    sideFlip: { type: Boolean },
    align: { default: "center" },
    alignOffset: {},
    alignFlip: { type: Boolean },
    avoidCollisions: { type: Boolean },
    collisionBoundary: {},
    collisionPadding: {},
    arrowPadding: {},
    sticky: {},
    hideWhenDetached: { type: Boolean },
    positionStrategy: {},
    updatePositionStrategy: {},
    disableUpdateOnLayoutShift: { type: Boolean },
    prioritizePosition: { type: Boolean },
    reference: {},
    asChild: { type: Boolean },
    as: {},
    disableOutsidePointerEvents: { type: Boolean },
    class: {}
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "openAutoFocus", "closeAutoFocus"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const delegatedProps = reactiveOmit(props, "class");
    const forwarded = useForwardPropsEmits(delegatedProps, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(PopoverPortal), _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(PopoverContent), mergeProps({ "data-slot": "popover-content" }, { ..._ctx.$attrs, ...unref(forwarded) }, {
              class: unref(cn)(
                "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 rounded-md border p-4 shadow-md origin-(--reka-popover-content-transform-origin) outline-hidden",
                props.class
              )
            }), {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push3, _parent3, _scopeId2);
                } else {
                  return [
                    renderSlot(_ctx.$slots, "default")
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(PopoverContent), mergeProps({ "data-slot": "popover-content" }, { ..._ctx.$attrs, ...unref(forwarded) }, {
                class: unref(cn)(
                  "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 rounded-md border p-4 shadow-md origin-(--reka-popover-content-transform-origin) outline-hidden",
                  props.class
                )
              }), {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default")
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
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/popover/PopoverContent.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "PopoverTrigger",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(PopoverTrigger), mergeProps({ "data-slot": "popover-trigger" }, props, _attrs), {
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/popover/PopoverTrigger.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "DatePicker",
  __ssrInlineRender: true,
  props: {
    modelValue: {},
    placeholder: { default: "\u9009\u62E9\u65E5\u671F" },
    defaultPlaceholder: { default: () => today(getLocalTimeZone()) }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const date = computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value)
    });
    const df = new DateFormatter("zh-CN", {
      dateStyle: "long"
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(_sfc_main$5), _attrs, {
        default: withCtx(({ close }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$2), { "as-child": "" }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$v), {
                    variant: "outline",
                    class: unref(cn)(
                      "w-full justify-start text-left font-normal transition-all duration-200",
                      "hover:border-primary/50 hover:shadow-sm",
                      !date.value && "text-muted-foreground",
                      date.value && "text-foreground"
                    )
                  }, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(CalendarIcon), { class: "mr-2 h-4 w-4 shrink-0" }, null, _parent4, _scopeId3));
                        _push4(`<span class="truncate"${_scopeId3}>${ssrInterpolate(date.value ? unref(df).format(date.value.toDate(unref(getLocalTimeZone)())) : __props.placeholder)}</span>`);
                        if (date.value) {
                          _push4(`<svg class="ml-auto h-3 w-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId3}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"${_scopeId3}></path></svg>`);
                        } else {
                          _push4(`<!---->`);
                        }
                      } else {
                        return [
                          createVNode(unref(CalendarIcon), { class: "mr-2 h-4 w-4 shrink-0" }),
                          createVNode("span", { class: "truncate" }, toDisplayString(date.value ? unref(df).format(date.value.toDate(unref(getLocalTimeZone)())) : __props.placeholder), 1),
                          date.value ? (openBlock(), createBlock("svg", {
                            key: 0,
                            class: "ml-auto h-3 w-3 text-muted-foreground",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24"
                          }, [
                            createVNode("path", {
                              "stroke-linecap": "round",
                              "stroke-linejoin": "round",
                              "stroke-width": "2",
                              d: "M6 18L18 6M6 6l12 12"
                            })
                          ])) : createCommentVNode("", true)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$v), {
                      variant: "outline",
                      class: unref(cn)(
                        "w-full justify-start text-left font-normal transition-all duration-200",
                        "hover:border-primary/50 hover:shadow-sm",
                        !date.value && "text-muted-foreground",
                        date.value && "text-foreground"
                      )
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(CalendarIcon), { class: "mr-2 h-4 w-4 shrink-0" }),
                        createVNode("span", { class: "truncate" }, toDisplayString(date.value ? unref(df).format(date.value.toDate(unref(getLocalTimeZone)())) : __props.placeholder), 1),
                        date.value ? (openBlock(), createBlock("svg", {
                          key: 0,
                          class: "ml-auto h-3 w-3 text-muted-foreground",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M6 18L18 6M6 6l12 12"
                          })
                        ])) : createCommentVNode("", true)
                      ]),
                      _: 1
                    }, 8, ["class"])
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$3), {
              class: "w-auto p-0 shadow-lg border-border/50",
              align: "start"
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$h), {
                    modelValue: date.value,
                    "onUpdate:modelValue": [($event) => date.value = $event, close],
                    "default-placeholder": __props.defaultPlaceholder,
                    layout: "month-and-year",
                    "initial-focus": ""
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$h), {
                      modelValue: date.value,
                      "onUpdate:modelValue": [($event) => date.value = $event, close],
                      "default-placeholder": __props.defaultPlaceholder,
                      layout: "month-and-year",
                      "initial-focus": ""
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "default-placeholder"])
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$2), { "as-child": "" }, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$v), {
                    variant: "outline",
                    class: unref(cn)(
                      "w-full justify-start text-left font-normal transition-all duration-200",
                      "hover:border-primary/50 hover:shadow-sm",
                      !date.value && "text-muted-foreground",
                      date.value && "text-foreground"
                    )
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(CalendarIcon), { class: "mr-2 h-4 w-4 shrink-0" }),
                      createVNode("span", { class: "truncate" }, toDisplayString(date.value ? unref(df).format(date.value.toDate(unref(getLocalTimeZone)())) : __props.placeholder), 1),
                      date.value ? (openBlock(), createBlock("svg", {
                        key: 0,
                        class: "ml-auto h-3 w-3 text-muted-foreground",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24"
                      }, [
                        createVNode("path", {
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          "stroke-width": "2",
                          d: "M6 18L18 6M6 6l12 12"
                        })
                      ])) : createCommentVNode("", true)
                    ]),
                    _: 1
                  }, 8, ["class"])
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$3), {
                class: "w-auto p-0 shadow-lg border-border/50",
                align: "start"
              }, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$h), {
                    modelValue: date.value,
                    "onUpdate:modelValue": [($event) => date.value = $event, close],
                    "default-placeholder": __props.defaultPlaceholder,
                    layout: "month-and-year",
                    "initial-focus": ""
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "default-placeholder"])
                ]),
                _: 2
              }, 1024)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/DatePicker.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
async function uploadFiles(files) {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("file", file);
  });
  return apiFetch("/api/upload", {
    method: "POST",
    body: formData
  });
}
async function compressImage(file, options = {}) {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.8,
    checkOrientation = true,
    retainExif = false,
    mimeType,
    convertTypes = ["image/png"],
    convertSize = 5 * 1024 * 1024,
    // 5MB
    keepOriginalFormat = false
  } = options;
  let outputMimeType = mimeType || "auto";
  if (keepOriginalFormat && !mimeType) {
    if (file.type === "image/png") {
      outputMimeType = "image/png";
    } else if (file.type === "image/webp") {
      outputMimeType = "image/webp";
    } else {
      outputMimeType = "image/jpeg";
    }
  }
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality,
      maxWidth,
      maxHeight,
      checkOrientation,
      retainExif,
      mimeType: outputMimeType,
      convertTypes,
      convertSize,
      success(result) {
        const compressedFile = new File(
          [result],
          file.name,
          {
            type: result.type || file.type,
            lastModified: Date.now()
          }
        );
        resolve(compressedFile);
      },
      error(err) {
        console.error("\u56FE\u7247\u538B\u7F29\u5931\u8D25:", err);
        reject(err);
      }
    });
  });
}
function shouldCompress(file, maxSize = 1024 * 1024) {
  if (!file.type.startsWith("image/")) {
    return false;
  }
  if (file.size <= maxSize) {
    return false;
  }
  return true;
}
async function compressImages(files, options = {}) {
  const results = [];
  for (const file of files) {
    if (shouldCompress(file)) {
      try {
        const compressedBlob = await compressImage(file, options);
        const compressedFile = new File(
          [compressedBlob],
          file.name,
          { type: compressedBlob.type }
        );
        results.push(compressedFile);
      } catch (error) {
        console.warn(`\u538B\u7F29\u56FE\u7247 ${file.name} \u5931\u8D25:`, error);
        results.push(file);
      }
    } else {
      results.push(file);
    }
  }
  return results;
}
const pageSize = 10;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const items = ref([]);
    const loading = ref(true);
    const content = ref("");
    const fileRef = ref(null);
    const start = ref();
    const end = ref();
    const tag = ref("");
    const filePreviews = ref([]);
    const loadingMore = ref(false);
    const selectedTags = ref([]);
    const selectedTagsForPost = ref([]);
    const presetTags = ref([
      "\u65C5\u6E38",
      "\u7F8E\u98DF",
      "\u7EA6\u4F1A",
      "\u8D2D\u7269",
      "\u7535\u5F71",
      "\u8FD0\u52A8",
      "\u5B66\u4E60",
      "\u5DE5\u4F5C",
      "\u4F11\u606F",
      "\u60CA\u559C",
      "\u7EAA\u5FF5\u65E5",
      "\u65E5\u5E38",
      "\u5F00\u5FC3",
      "\u611F\u52A8"
    ]);
    const showCustomTagInput = ref(false);
    const customTagInput = ref("");
    const customTagInputRef = ref(null);
    const errorMessage = ref("");
    const creating = ref(false);
    async function load() {
      loading.value = true;
      try {
        const res = await apiFetch(`/api/daily?take=${pageSize}`);
        items.value = res.items;
      } catch (e) {
        console.error("\u52A0\u8F7D\u65E5\u5E38\u8BB0\u5F55\u5931\u8D25:", e);
      } finally {
        loading.value = false;
      }
    }
    async function create() {
      if (!content.value) return;
      errorMessage.value = "";
      creating.value = true;
      try {
        let mediaUrls = [];
        if (fileRef.value?.files && fileRef.value.files.length) {
          const files = Array.from(fileRef.value.files);
          const filesToUpload = await compressImages(files, {
            maxWidth: 1920,
            maxHeight: 1920,
            quality: 0.8,
            // compressorjs 推荐值
            checkOrientation: true,
            // 自动纠正图片方向
            retainExif: false,
            // 不保留 EXIF 以减小体积
            convertTypes: ["image/png"],
            // 大 PNG 自动转 JPEG
            convertSize: 5 * 1024 * 1024,
            // 5MB 阈值
            keepOriginalFormat: false
            // 统一转换为 JPEG 以减小体积
          });
          const up = await uploadFiles(filesToUpload);
          mediaUrls = up.urls.map((item) => {
            if (typeof item === "string") {
              return item;
            }
            return item.url;
          });
        }
        await createDailyPost({
          content: content.value,
          mediaUrls,
          tags: selectedTagsForPost.value
        });
        content.value = "";
        selectedTagsForPost.value = [];
        showCustomTagInput.value = false;
        customTagInput.value = "";
        filePreviews.value.forEach((preview) => {
          if (preview.url) {
            URL.revokeObjectURL(preview.url);
          }
        });
        filePreviews.value = [];
        if (fileRef.value) fileRef.value.value = "";
        await load();
      } catch (e) {
        errorMessage.value = e?.friendlyMessage || handleApiError(e);
        if (errorMessage.value.includes("\u60C5\u4FA3")) ;
        console.error("\u53D1\u5E03\u65E5\u5E38\u8BB0\u5F55\u5931\u8D25:", e);
      } finally {
        creating.value = false;
      }
    }
    function asArray(v) {
      if (Array.isArray(v)) return v;
      return [];
    }
    const filtered = computed(() => {
      const s = start.value ? start.value.toDate(getLocalTimeZone()) : null;
      const e = end.value ? end.value.toDate(getLocalTimeZone()) : null;
      const t = tag.value.trim();
      return items.value.filter((it) => {
        const d = new Date(it.createdAt);
        if (s && d < s) return false;
        if (e && d > new Date(e.getTime() + 24 * 60 * 60 * 1e3 - 1)) return false;
        if (t) {
          const tagsArr = Array.isArray(it.tags) ? it.tags : [];
          if (!tagsArr.some((x) => String(x).includes(t))) return false;
        }
        if (selectedTags.value.length) {
          const tagsArr = Array.isArray(it.tags) ? it.tags : [];
          const hasAny = selectedTags.value.some((st) => tagsArr.includes(st));
          if (!hasAny) return false;
        }
        return true;
      });
    });
    const grouped = computed(() => {
      const now = /* @__PURE__ */ new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const startOfWeek = new Date(startOfToday - (now.getDay() || 7 - 1) * 24 * 60 * 60 * 1e3).getTime();
      const today2 = [];
      const thisWeek = [];
      const earlier = [];
      for (const it of filtered.value) {
        const t = new Date(it.createdAt).getTime();
        if (t >= startOfToday) today2.push(it);
        else if (t >= startOfWeek) thisWeek.push(it);
        else earlier.push(it);
      }
      const groups = [];
      if (today2.length) groups.push({ label: "\u4ECA\u5929", items: today2 });
      if (thisWeek.length) groups.push({ label: "\u672C\u5468", items: thisWeek });
      if (earlier.length) groups.push({ label: "\u66F4\u65E9", items: earlier });
      return groups;
    });
    const hasMore = computed(() => items.value.length > 0 && items.value.length % pageSize === 0);
    async function loadMore() {
      if (!items.value.length) return;
      loadingMore.value = true;
      try {
        const last = items.value[items.value.length - 1];
        const res = await apiFetch(`/api/daily?take=${pageSize}&cursor=${encodeURIComponent(last.id)}`);
        const toAppend = res.items.filter((p) => !items.value.find((i) => i.id === p.id));
        items.value = items.value.concat(toAppend);
      } catch (e) {
        console.error("\u52A0\u8F7D\u66F4\u591A\u5931\u8D25:", e);
      } finally {
        loadingMore.value = false;
      }
    }
    async function onFilesChange() {
      if (!fileRef.value?.files || !fileRef.value.files.length) {
        return;
      }
      const newFiles = Array.from(fileRef.value.files);
      const existingFileNames = new Set(filePreviews.value.map((p) => `${p.name}-${p.size}`));
      const filesToAdd = newFiles.filter((file) => {
        const fileKey = `${file.name}-${file.size}`;
        return !existingFileNames.has(fileKey);
      });
      if (filesToAdd.length === 0) {
        return;
      }
      const imageFiles = filesToAdd.filter((f) => f.type.startsWith("image/"));
      const needsCompression = imageFiles.filter((f) => shouldCompress(f));
      if (needsCompression.length > 0) {
        console.log(`\u5C06\u538B\u7F29 ${needsCompression.length} \u5F20\u56FE\u7247\u4EE5\u4F18\u5316\u4E0A\u4F20\u901F\u5EA6`);
      }
      filesToAdd.forEach((file) => {
        const preview = {
          file,
          name: file.name,
          type: file.type,
          size: file.size,
          url: ""
          // 将在下面设置
        };
        if (file.type.startsWith("image/")) {
          preview.url = URL.createObjectURL(file);
          filePreviews.value.push(preview);
        } else if (file.type.startsWith("video/")) {
          const video = (void 0).createElement("video");
          video.preload = "metadata";
          const videoUrl = URL.createObjectURL(file);
          video.src = videoUrl;
          preview.url = videoUrl;
          const previewIndex = filePreviews.value.length;
          filePreviews.value.push(preview);
          video.onloadedmetadata = () => {
            video.currentTime = 0.1;
          };
          video.onseeked = () => {
            const canvas = (void 0).createElement("canvas");
            canvas.width = video.videoWidth || 400;
            canvas.height = video.videoHeight || 300;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              if (filePreviews.value[previewIndex]) {
                filePreviews.value[previewIndex].url = canvas.toDataURL();
              }
              URL.revokeObjectURL(videoUrl);
            }
          };
          video.onerror = () => {
            URL.revokeObjectURL(videoUrl);
          };
        } else {
          filePreviews.value.push(preview);
        }
      });
      updateFileInput();
    }
    function updateFileInput() {
      if (!fileRef.value) return;
      const dt = new DataTransfer();
      filePreviews.value.forEach((preview) => {
        dt.items.add(preview.file);
      });
      fileRef.value.files = dt.files;
    }
    function removeFile(index) {
      if (filePreviews.value[index]?.url) {
        URL.revokeObjectURL(filePreviews.value[index].url);
      }
      filePreviews.value.splice(index, 1);
      updateFileInput();
    }
    function onDragEnd() {
      updateFileInput();
    }
    async function reloadOne(id) {
      await load();
    }
    async function handleDelete(id) {
      const index = items.value.findIndex((item) => item.id === id);
      if (index >= 0) {
        items.value.splice(index, 1);
      }
    }
    const allTags = computed(() => {
      const set = /* @__PURE__ */ new Set();
      for (const it of items.value) {
        const arr = Array.isArray(it.tags) ? it.tags : [];
        for (const t of arr) set.add(t);
      }
      return Array.from(set);
    });
    function toggleTag(t) {
      const i = selectedTags.value.indexOf(t);
      if (i >= 0) selectedTags.value.splice(i, 1);
      else selectedTags.value.push(t);
    }
    function togglePostTag(tagName) {
      const index = selectedTagsForPost.value.indexOf(tagName);
      if (index >= 0) {
        selectedTagsForPost.value.splice(index, 1);
      } else {
        selectedTagsForPost.value.push(tagName);
      }
    }
    function removePostTag(tagName) {
      const index = selectedTagsForPost.value.indexOf(tagName);
      if (index >= 0) {
        selectedTagsForPost.value.splice(index, 1);
      }
    }
    function addCustomTag() {
      const trimmed = customTagInput.value.trim();
      if (!trimmed) {
        cancelCustomTag();
        return;
      }
      if (!selectedTagsForPost.value.includes(trimmed)) {
        selectedTagsForPost.value.push(trimmed);
      }
      if (!presetTags.value.includes(trimmed)) {
        presetTags.value.push(trimmed);
      }
      customTagInput.value = "";
      showCustomTagInput.value = false;
    }
    function startCustomTag() {
      showCustomTagInput.value = true;
      nextTick(() => {
        customTagInputRef.value?.focus();
      });
    }
    function cancelCustomTag() {
      showCustomTagInput.value = false;
      customTagInput.value = "";
    }
    function handleCustomTagBlur() {
      setTimeout(() => {
        if (customTagInput.value.trim()) {
          addCustomTag();
        } else {
          cancelCustomTag();
        }
      }, 200);
    }
    function presetDays(days) {
      const todayDate = today(getLocalTimeZone());
      if (days === 0) {
        start.value = todayDate;
        end.value = todayDate;
      } else {
        const from = todayDate.subtract({ days: days - 1 });
        start.value = from;
        end.value = todayDate;
      }
    }
    function clearFilters() {
      start.value = void 0;
      end.value = void 0;
      tag.value = "";
      selectedTags.value = [];
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br from-slate-50 via-slate-50/50 to-slate-50 dark:from-slate-900 dark:via-slate-900/50 dark:to-slate-900" }, _attrs))}>`);
      _push(ssrRenderComponent(DogHeader, null, null, _parent));
      _push(`<div class="max-w-3xl mx-auto px-4 py-6 space-y-4">`);
      _push(ssrRenderComponent(unref(_sfc_main$7$1), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$5$1), { class: "px-4" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (errorMessage.value) {
                    _push3(`<div class="mb-4 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg animate-fade-in"${_scopeId2}>${ssrInterpolate(errorMessage.value)} `);
                    if (errorMessage.value.includes("\u60C5\u4FA3")) {
                      _push3(ssrRenderComponent(_component_NuxtLink, {
                        to: "/user/couple",
                        class: "underline ml-1 font-medium hover:opacity-80"
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`\u53BB\u7ED1\u5B9A`);
                          } else {
                            return [
                              createTextVNode("\u53BB\u7ED1\u5B9A")
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
                  _push3(`<form class="flex flex-col gap-4"${_scopeId2}><div class="space-y-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$o), { for: "content" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`\u8BB0\u5F55\u5185\u5BB9`);
                      } else {
                        return [
                          createTextVNode("\u8BB0\u5F55\u5185\u5BB9")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$p), {
                    id: "content",
                    modelValue: content.value,
                    "onUpdate:modelValue": ($event) => content.value = $event,
                    placeholder: "\u4ECA\u5929\u60F3\u8BB0\u5F55\u70B9\u4EC0\u4E48\u2026",
                    class: "min-h-[100px]"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div><div class="space-y-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$o), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`\u9009\u62E9\u6807\u7B7E`);
                      } else {
                        return [
                          createTextVNode("\u9009\u62E9\u6807\u7B7E")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<div class="flex flex-wrap gap-2"${_scopeId2}><!--[-->`);
                  ssrRenderList(presetTags.value, (tag2) => {
                    _push3(ssrRenderComponent(unref(_sfc_main$2$1), {
                      key: tag2,
                      variant: "outline",
                      class: ["cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors", selectedTagsForPost.value.includes(tag2) ? "bg-primary text-primary-foreground" : ""],
                      onClick: ($event) => togglePostTag(tag2)
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(tag2)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(tag2), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  });
                  _push3(`<!--]-->`);
                  if (!showCustomTagInput.value) {
                    _push3(ssrRenderComponent(unref(_sfc_main$2$1), {
                      variant: "outline",
                      class: "cursor-pointer hover:bg-muted",
                      onClick: startCustomTag
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<span class="mr-1"${_scopeId3}>+</span><span${_scopeId3}>\u81EA\u5B9A\u4E49</span>`);
                        } else {
                          return [
                            createVNode("span", { class: "mr-1" }, "+"),
                            createVNode("span", null, "\u81EA\u5B9A\u4E49")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<div class="flex items-center gap-2"${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(_sfc_main$q), {
                      ref_key: "customTagInputRef",
                      ref: customTagInputRef,
                      modelValue: customTagInput.value,
                      "onUpdate:modelValue": ($event) => customTagInput.value = $event,
                      type: "text",
                      placeholder: "\u8F93\u5165\u6807\u7B7E\u540D\u79F0",
                      maxlength: "10",
                      class: "h-8 w-32",
                      onKeyup: [addCustomTag, cancelCustomTag],
                      onBlur: handleCustomTagBlur
                    }, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(_sfc_main$v), {
                      type: "button",
                      size: "sm",
                      variant: "default",
                      class: "h-8 px-3",
                      onClick: addCustomTag
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(` \u6DFB\u52A0 `);
                        } else {
                          return [
                            createTextVNode(" \u6DFB\u52A0 ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(_sfc_main$v), {
                      type: "button",
                      size: "sm",
                      variant: "outline",
                      class: "h-8 px-3",
                      onClick: cancelCustomTag
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(` \u53D6\u6D88 `);
                        } else {
                          return [
                            createTextVNode(" \u53D6\u6D88 ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div>`);
                  }
                  _push3(`</div>`);
                  if (selectedTagsForPost.value.length > 0) {
                    _push3(`<div class="flex flex-wrap gap-2 items-center"${_scopeId2}><span class="text-xs text-muted-foreground"${_scopeId2}>\u5DF2\u9009\uFF1A</span><!--[-->`);
                    ssrRenderList(selectedTagsForPost.value, (tag2) => {
                      _push3(ssrRenderComponent(unref(_sfc_main$2$1), {
                        key: tag2,
                        class: "gap-1 pr-1"
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`${ssrInterpolate(tag2)} <button type="button" class="ml-1 p-0.5 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-gray-800 transition-colors" title="\u5220\u9664\u6807\u7B7E"${_scopeId3}><svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId3}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"${_scopeId3}></path></svg></button>`);
                          } else {
                            return [
                              createTextVNode(toDisplayString(tag2) + " ", 1),
                              createVNode("button", {
                                type: "button",
                                class: "ml-1 p-0.5 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-gray-800 transition-colors",
                                onClick: ($event) => removePostTag(tag2),
                                title: "\u5220\u9664\u6807\u7B7E"
                              }, [
                                (openBlock(), createBlock("svg", {
                                  class: "w-2.5 h-2.5",
                                  fill: "none",
                                  stroke: "currentColor",
                                  viewBox: "0 0 24 24"
                                }, [
                                  createVNode("path", {
                                    "stroke-linecap": "round",
                                    "stroke-linejoin": "round",
                                    "stroke-width": "2",
                                    d: "M6 18L18 6M6 6l12 12"
                                  })
                                ]))
                              ], 8, ["onClick"])
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    });
                    _push3(`<!--]--></div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div><div class="space-y-3"${_scopeId2}><div class="flex items-center gap-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$v), {
                    variant: "outline",
                    "as-child": "",
                    class: "flex-1"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<label class="cursor-pointer"${_scopeId3}><input type="file" accept="image/*,video/*" multiple class="hidden"${_scopeId3}><div class="flex items-center gap-2"${_scopeId3}><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId3}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"${_scopeId3}></path></svg><span${_scopeId3}>\u6DFB\u52A0\u56FE\u7247/\u89C6\u9891</span>`);
                        if (filePreviews.value.length > 0) {
                          _push4(ssrRenderComponent(unref(_sfc_main$2$1), {
                            variant: "secondary",
                            class: "ml-auto"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(filePreviews.value.length)}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(filePreviews.value.length), 1)
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`</div></label>`);
                      } else {
                        return [
                          createVNode("label", { class: "cursor-pointer" }, [
                            createVNode("input", {
                              ref_key: "fileRef",
                              ref: fileRef,
                              type: "file",
                              accept: "image/*,video/*",
                              multiple: "",
                              class: "hidden",
                              onChange: onFilesChange
                            }, null, 544),
                            createVNode("div", { class: "flex items-center gap-2" }, [
                              (openBlock(), createBlock("svg", {
                                class: "w-4 h-4",
                                fill: "none",
                                stroke: "currentColor",
                                viewBox: "0 0 24 24"
                              }, [
                                createVNode("path", {
                                  "stroke-linecap": "round",
                                  "stroke-linejoin": "round",
                                  "stroke-width": "2",
                                  d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                })
                              ])),
                              createVNode("span", null, "\u6DFB\u52A0\u56FE\u7247/\u89C6\u9891"),
                              filePreviews.value.length > 0 ? (openBlock(), createBlock(unref(_sfc_main$2$1), {
                                key: 0,
                                variant: "secondary",
                                class: "ml-auto"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(filePreviews.value.length), 1)
                                ]),
                                _: 1
                              })) : createCommentVNode("", true)
                            ])
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$v), {
                    type: "submit",
                    class: "flex-1",
                    disabled: creating.value
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(creating.value ? "\u53D1\u5E03\u4E2D..." : "\u53D1\u5E03")}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(creating.value ? "\u53D1\u5E03\u4E2D..." : "\u53D1\u5E03"), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                  if (filePreviews.value.length > 0) {
                    _push3(ssrRenderComponent(unref(draggable), {
                      modelValue: filePreviews.value,
                      "onUpdate:modelValue": ($event) => filePreviews.value = $event,
                      animation: 200,
                      "item-key": (item) => `${item.name}-${item.size}`,
                      class: "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3",
                      onEnd: onDragEnd
                    }, {
                      item: withCtx(({ element: preview, index }, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<div class="relative group aspect-square rounded-lg overflow-hidden bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 cursor-move"${_scopeId3}>`);
                          if (preview.type.startsWith("image/")) {
                            _push4(`<img${ssrRenderAttr("src", preview.url)}${ssrRenderAttr("alt", preview.name)} class="w-full h-full object-cover"${_scopeId3}>`);
                          } else if (preview.type.startsWith("video/")) {
                            _push4(`<div class="w-full h-full flex flex-col items-center justify-center bg-slate-200 dark:bg-slate-700 relative"${_scopeId3}>`);
                            if (preview.url && preview.url.startsWith("data:image")) {
                              _push4(`<img${ssrRenderAttr("src", preview.url)} class="w-full h-full object-cover" alt="\u89C6\u9891\u9884\u89C8"${_scopeId3}>`);
                            } else {
                              _push4(`<!--[--><svg class="w-12 h-12 text-slate-400 dark:text-slate-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId3}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"${_scopeId3}></path></svg><span class="text-xs text-slate-500 dark:text-slate-400 px-2 text-center truncate w-full"${_scopeId3}>${ssrInterpolate(preview.name)}</span><!--]-->`);
                            }
                            _push4(`<div class="absolute inset-0 flex items-center justify-center bg-black/20"${_scopeId3}><svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24"${_scopeId3}><path d="M8 5v14l11-7z"${_scopeId3}></path></svg></div></div>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`<button type="button" class="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-10" title="\u5220\u9664"${_scopeId3}><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId3}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"${_scopeId3}></path></svg></button><div class="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-xs"${_scopeId3}>${ssrInterpolate(preview.type.startsWith("image/") ? "\u56FE\u7247" : "\u89C6\u9891")}</div></div>`);
                        } else {
                          return [
                            createVNode("div", { class: "relative group aspect-square rounded-lg overflow-hidden bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 cursor-move" }, [
                              preview.type.startsWith("image/") ? (openBlock(), createBlock("img", {
                                key: 0,
                                src: preview.url,
                                alt: preview.name,
                                class: "w-full h-full object-cover"
                              }, null, 8, ["src", "alt"])) : preview.type.startsWith("video/") ? (openBlock(), createBlock("div", {
                                key: 1,
                                class: "w-full h-full flex flex-col items-center justify-center bg-slate-200 dark:bg-slate-700 relative"
                              }, [
                                preview.url && preview.url.startsWith("data:image") ? (openBlock(), createBlock("img", {
                                  key: 0,
                                  src: preview.url,
                                  class: "w-full h-full object-cover",
                                  alt: "\u89C6\u9891\u9884\u89C8"
                                }, null, 8, ["src"])) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                  (openBlock(), createBlock("svg", {
                                    class: "w-12 h-12 text-slate-400 dark:text-slate-500 mb-2",
                                    fill: "none",
                                    stroke: "currentColor",
                                    viewBox: "0 0 24 24"
                                  }, [
                                    createVNode("path", {
                                      "stroke-linecap": "round",
                                      "stroke-linejoin": "round",
                                      "stroke-width": "2",
                                      d: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                    })
                                  ])),
                                  createVNode("span", { class: "text-xs text-slate-500 dark:text-slate-400 px-2 text-center truncate w-full" }, toDisplayString(preview.name), 1)
                                ], 64)),
                                createVNode("div", { class: "absolute inset-0 flex items-center justify-center bg-black/20" }, [
                                  (openBlock(), createBlock("svg", {
                                    class: "w-10 h-10 text-white",
                                    fill: "currentColor",
                                    viewBox: "0 0 24 24"
                                  }, [
                                    createVNode("path", { d: "M8 5v14l11-7z" })
                                  ]))
                                ])
                              ])) : createCommentVNode("", true),
                              createVNode("button", {
                                type: "button",
                                class: "absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-10",
                                onClick: withModifiers(($event) => removeFile(index), ["stop"]),
                                title: "\u5220\u9664"
                              }, [
                                (openBlock(), createBlock("svg", {
                                  class: "w-4 h-4",
                                  fill: "none",
                                  stroke: "currentColor",
                                  viewBox: "0 0 24 24"
                                }, [
                                  createVNode("path", {
                                    "stroke-linecap": "round",
                                    "stroke-linejoin": "round",
                                    "stroke-width": "2",
                                    d: "M6 18L18 6M6 6l12 12"
                                  })
                                ]))
                              ], 8, ["onClick"]),
                              createVNode("div", { class: "absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-xs" }, toDisplayString(preview.type.startsWith("image/") ? "\u56FE\u7247" : "\u89C6\u9891"), 1)
                            ])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div></form>`);
                } else {
                  return [
                    errorMessage.value ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "mb-4 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg animate-fade-in"
                    }, [
                      createTextVNode(toDisplayString(errorMessage.value) + " ", 1),
                      errorMessage.value.includes("\u60C5\u4FA3") ? (openBlock(), createBlock(_component_NuxtLink, {
                        key: 0,
                        to: "/user/couple",
                        class: "underline ml-1 font-medium hover:opacity-80"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("\u53BB\u7ED1\u5B9A")
                        ]),
                        _: 1
                      })) : createCommentVNode("", true)
                    ])) : createCommentVNode("", true),
                    createVNode("form", {
                      class: "flex flex-col gap-4",
                      onSubmit: withModifiers(create, ["prevent"])
                    }, [
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode(unref(_sfc_main$o), { for: "content" }, {
                          default: withCtx(() => [
                            createTextVNode("\u8BB0\u5F55\u5185\u5BB9")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$p), {
                          id: "content",
                          modelValue: content.value,
                          "onUpdate:modelValue": ($event) => content.value = $event,
                          placeholder: "\u4ECA\u5929\u60F3\u8BB0\u5F55\u70B9\u4EC0\u4E48\u2026",
                          class: "min-h-[100px]"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode(unref(_sfc_main$o), null, {
                          default: withCtx(() => [
                            createTextVNode("\u9009\u62E9\u6807\u7B7E")
                          ]),
                          _: 1
                        }),
                        createVNode("div", { class: "flex flex-wrap gap-2" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(presetTags.value, (tag2) => {
                            return openBlock(), createBlock(unref(_sfc_main$2$1), {
                              key: tag2,
                              variant: "outline",
                              class: ["cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors", selectedTagsForPost.value.includes(tag2) ? "bg-primary text-primary-foreground" : ""],
                              onClick: ($event) => togglePostTag(tag2)
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(tag2), 1)
                              ]),
                              _: 2
                            }, 1032, ["class", "onClick"]);
                          }), 128)),
                          !showCustomTagInput.value ? (openBlock(), createBlock(unref(_sfc_main$2$1), {
                            key: 0,
                            variant: "outline",
                            class: "cursor-pointer hover:bg-muted",
                            onClick: startCustomTag
                          }, {
                            default: withCtx(() => [
                              createVNode("span", { class: "mr-1" }, "+"),
                              createVNode("span", null, "\u81EA\u5B9A\u4E49")
                            ]),
                            _: 1
                          })) : (openBlock(), createBlock("div", {
                            key: 1,
                            class: "flex items-center gap-2"
                          }, [
                            createVNode(unref(_sfc_main$q), {
                              ref_key: "customTagInputRef",
                              ref: customTagInputRef,
                              modelValue: customTagInput.value,
                              "onUpdate:modelValue": ($event) => customTagInput.value = $event,
                              type: "text",
                              placeholder: "\u8F93\u5165\u6807\u7B7E\u540D\u79F0",
                              maxlength: "10",
                              class: "h-8 w-32",
                              onKeyup: [
                                withKeys(addCustomTag, ["enter"]),
                                withKeys(cancelCustomTag, ["esc"])
                              ],
                              onBlur: handleCustomTagBlur
                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                            createVNode(unref(_sfc_main$v), {
                              type: "button",
                              size: "sm",
                              variant: "default",
                              class: "h-8 px-3",
                              onClick: addCustomTag
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" \u6DFB\u52A0 ")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$v), {
                              type: "button",
                              size: "sm",
                              variant: "outline",
                              class: "h-8 px-3",
                              onClick: cancelCustomTag
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" \u53D6\u6D88 ")
                              ]),
                              _: 1
                            })
                          ]))
                        ]),
                        selectedTagsForPost.value.length > 0 ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "flex flex-wrap gap-2 items-center"
                        }, [
                          createVNode("span", { class: "text-xs text-muted-foreground" }, "\u5DF2\u9009\uFF1A"),
                          (openBlock(true), createBlock(Fragment, null, renderList(selectedTagsForPost.value, (tag2) => {
                            return openBlock(), createBlock(unref(_sfc_main$2$1), {
                              key: tag2,
                              class: "gap-1 pr-1"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(tag2) + " ", 1),
                                createVNode("button", {
                                  type: "button",
                                  class: "ml-1 p-0.5 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-gray-800 transition-colors",
                                  onClick: ($event) => removePostTag(tag2),
                                  title: "\u5220\u9664\u6807\u7B7E"
                                }, [
                                  (openBlock(), createBlock("svg", {
                                    class: "w-2.5 h-2.5",
                                    fill: "none",
                                    stroke: "currentColor",
                                    viewBox: "0 0 24 24"
                                  }, [
                                    createVNode("path", {
                                      "stroke-linecap": "round",
                                      "stroke-linejoin": "round",
                                      "stroke-width": "2",
                                      d: "M6 18L18 6M6 6l12 12"
                                    })
                                  ]))
                                ], 8, ["onClick"])
                              ]),
                              _: 2
                            }, 1024);
                          }), 128))
                        ])) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "space-y-3" }, [
                        createVNode("div", { class: "flex items-center gap-2" }, [
                          createVNode(unref(_sfc_main$v), {
                            variant: "outline",
                            "as-child": "",
                            class: "flex-1"
                          }, {
                            default: withCtx(() => [
                              createVNode("label", { class: "cursor-pointer" }, [
                                createVNode("input", {
                                  ref_key: "fileRef",
                                  ref: fileRef,
                                  type: "file",
                                  accept: "image/*,video/*",
                                  multiple: "",
                                  class: "hidden",
                                  onChange: onFilesChange
                                }, null, 544),
                                createVNode("div", { class: "flex items-center gap-2" }, [
                                  (openBlock(), createBlock("svg", {
                                    class: "w-4 h-4",
                                    fill: "none",
                                    stroke: "currentColor",
                                    viewBox: "0 0 24 24"
                                  }, [
                                    createVNode("path", {
                                      "stroke-linecap": "round",
                                      "stroke-linejoin": "round",
                                      "stroke-width": "2",
                                      d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    })
                                  ])),
                                  createVNode("span", null, "\u6DFB\u52A0\u56FE\u7247/\u89C6\u9891"),
                                  filePreviews.value.length > 0 ? (openBlock(), createBlock(unref(_sfc_main$2$1), {
                                    key: 0,
                                    variant: "secondary",
                                    class: "ml-auto"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(filePreviews.value.length), 1)
                                    ]),
                                    _: 1
                                  })) : createCommentVNode("", true)
                                ])
                              ])
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$v), {
                            type: "submit",
                            class: "flex-1",
                            disabled: creating.value
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(creating.value ? "\u53D1\u5E03\u4E2D..." : "\u53D1\u5E03"), 1)
                            ]),
                            _: 1
                          }, 8, ["disabled"])
                        ]),
                        filePreviews.value.length > 0 ? (openBlock(), createBlock(unref(draggable), {
                          key: 0,
                          modelValue: filePreviews.value,
                          "onUpdate:modelValue": ($event) => filePreviews.value = $event,
                          animation: 200,
                          "item-key": (item) => `${item.name}-${item.size}`,
                          class: "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3",
                          onEnd: onDragEnd
                        }, {
                          item: withCtx(({ element: preview, index }) => [
                            createVNode("div", { class: "relative group aspect-square rounded-lg overflow-hidden bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 cursor-move" }, [
                              preview.type.startsWith("image/") ? (openBlock(), createBlock("img", {
                                key: 0,
                                src: preview.url,
                                alt: preview.name,
                                class: "w-full h-full object-cover"
                              }, null, 8, ["src", "alt"])) : preview.type.startsWith("video/") ? (openBlock(), createBlock("div", {
                                key: 1,
                                class: "w-full h-full flex flex-col items-center justify-center bg-slate-200 dark:bg-slate-700 relative"
                              }, [
                                preview.url && preview.url.startsWith("data:image") ? (openBlock(), createBlock("img", {
                                  key: 0,
                                  src: preview.url,
                                  class: "w-full h-full object-cover",
                                  alt: "\u89C6\u9891\u9884\u89C8"
                                }, null, 8, ["src"])) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                  (openBlock(), createBlock("svg", {
                                    class: "w-12 h-12 text-slate-400 dark:text-slate-500 mb-2",
                                    fill: "none",
                                    stroke: "currentColor",
                                    viewBox: "0 0 24 24"
                                  }, [
                                    createVNode("path", {
                                      "stroke-linecap": "round",
                                      "stroke-linejoin": "round",
                                      "stroke-width": "2",
                                      d: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                    })
                                  ])),
                                  createVNode("span", { class: "text-xs text-slate-500 dark:text-slate-400 px-2 text-center truncate w-full" }, toDisplayString(preview.name), 1)
                                ], 64)),
                                createVNode("div", { class: "absolute inset-0 flex items-center justify-center bg-black/20" }, [
                                  (openBlock(), createBlock("svg", {
                                    class: "w-10 h-10 text-white",
                                    fill: "currentColor",
                                    viewBox: "0 0 24 24"
                                  }, [
                                    createVNode("path", { d: "M8 5v14l11-7z" })
                                  ]))
                                ])
                              ])) : createCommentVNode("", true),
                              createVNode("button", {
                                type: "button",
                                class: "absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-10",
                                onClick: withModifiers(($event) => removeFile(index), ["stop"]),
                                title: "\u5220\u9664"
                              }, [
                                (openBlock(), createBlock("svg", {
                                  class: "w-4 h-4",
                                  fill: "none",
                                  stroke: "currentColor",
                                  viewBox: "0 0 24 24"
                                }, [
                                  createVNode("path", {
                                    "stroke-linecap": "round",
                                    "stroke-linejoin": "round",
                                    "stroke-width": "2",
                                    d: "M6 18L18 6M6 6l12 12"
                                  })
                                ]))
                              ], 8, ["onClick"]),
                              createVNode("div", { class: "absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-xs" }, toDisplayString(preview.type.startsWith("image/") ? "\u56FE\u7247" : "\u89C6\u9891"), 1)
                            ])
                          ]),
                          _: 1
                        }, 8, ["modelValue", "onUpdate:modelValue", "item-key"])) : createCommentVNode("", true)
                      ])
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
                  errorMessage.value ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "mb-4 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg animate-fade-in"
                  }, [
                    createTextVNode(toDisplayString(errorMessage.value) + " ", 1),
                    errorMessage.value.includes("\u60C5\u4FA3") ? (openBlock(), createBlock(_component_NuxtLink, {
                      key: 0,
                      to: "/user/couple",
                      class: "underline ml-1 font-medium hover:opacity-80"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("\u53BB\u7ED1\u5B9A")
                      ]),
                      _: 1
                    })) : createCommentVNode("", true)
                  ])) : createCommentVNode("", true),
                  createVNode("form", {
                    class: "flex flex-col gap-4",
                    onSubmit: withModifiers(create, ["prevent"])
                  }, [
                    createVNode("div", { class: "space-y-2" }, [
                      createVNode(unref(_sfc_main$o), { for: "content" }, {
                        default: withCtx(() => [
                          createTextVNode("\u8BB0\u5F55\u5185\u5BB9")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$p), {
                        id: "content",
                        modelValue: content.value,
                        "onUpdate:modelValue": ($event) => content.value = $event,
                        placeholder: "\u4ECA\u5929\u60F3\u8BB0\u5F55\u70B9\u4EC0\u4E48\u2026",
                        class: "min-h-[100px]"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    createVNode("div", { class: "space-y-2" }, [
                      createVNode(unref(_sfc_main$o), null, {
                        default: withCtx(() => [
                          createTextVNode("\u9009\u62E9\u6807\u7B7E")
                        ]),
                        _: 1
                      }),
                      createVNode("div", { class: "flex flex-wrap gap-2" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(presetTags.value, (tag2) => {
                          return openBlock(), createBlock(unref(_sfc_main$2$1), {
                            key: tag2,
                            variant: "outline",
                            class: ["cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors", selectedTagsForPost.value.includes(tag2) ? "bg-primary text-primary-foreground" : ""],
                            onClick: ($event) => togglePostTag(tag2)
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(tag2), 1)
                            ]),
                            _: 2
                          }, 1032, ["class", "onClick"]);
                        }), 128)),
                        !showCustomTagInput.value ? (openBlock(), createBlock(unref(_sfc_main$2$1), {
                          key: 0,
                          variant: "outline",
                          class: "cursor-pointer hover:bg-muted",
                          onClick: startCustomTag
                        }, {
                          default: withCtx(() => [
                            createVNode("span", { class: "mr-1" }, "+"),
                            createVNode("span", null, "\u81EA\u5B9A\u4E49")
                          ]),
                          _: 1
                        })) : (openBlock(), createBlock("div", {
                          key: 1,
                          class: "flex items-center gap-2"
                        }, [
                          createVNode(unref(_sfc_main$q), {
                            ref_key: "customTagInputRef",
                            ref: customTagInputRef,
                            modelValue: customTagInput.value,
                            "onUpdate:modelValue": ($event) => customTagInput.value = $event,
                            type: "text",
                            placeholder: "\u8F93\u5165\u6807\u7B7E\u540D\u79F0",
                            maxlength: "10",
                            class: "h-8 w-32",
                            onKeyup: [
                              withKeys(addCustomTag, ["enter"]),
                              withKeys(cancelCustomTag, ["esc"])
                            ],
                            onBlur: handleCustomTagBlur
                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                          createVNode(unref(_sfc_main$v), {
                            type: "button",
                            size: "sm",
                            variant: "default",
                            class: "h-8 px-3",
                            onClick: addCustomTag
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" \u6DFB\u52A0 ")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$v), {
                            type: "button",
                            size: "sm",
                            variant: "outline",
                            class: "h-8 px-3",
                            onClick: cancelCustomTag
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" \u53D6\u6D88 ")
                            ]),
                            _: 1
                          })
                        ]))
                      ]),
                      selectedTagsForPost.value.length > 0 ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "flex flex-wrap gap-2 items-center"
                      }, [
                        createVNode("span", { class: "text-xs text-muted-foreground" }, "\u5DF2\u9009\uFF1A"),
                        (openBlock(true), createBlock(Fragment, null, renderList(selectedTagsForPost.value, (tag2) => {
                          return openBlock(), createBlock(unref(_sfc_main$2$1), {
                            key: tag2,
                            class: "gap-1 pr-1"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(tag2) + " ", 1),
                              createVNode("button", {
                                type: "button",
                                class: "ml-1 p-0.5 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-gray-800 transition-colors",
                                onClick: ($event) => removePostTag(tag2),
                                title: "\u5220\u9664\u6807\u7B7E"
                              }, [
                                (openBlock(), createBlock("svg", {
                                  class: "w-2.5 h-2.5",
                                  fill: "none",
                                  stroke: "currentColor",
                                  viewBox: "0 0 24 24"
                                }, [
                                  createVNode("path", {
                                    "stroke-linecap": "round",
                                    "stroke-linejoin": "round",
                                    "stroke-width": "2",
                                    d: "M6 18L18 6M6 6l12 12"
                                  })
                                ]))
                              ], 8, ["onClick"])
                            ]),
                            _: 2
                          }, 1024);
                        }), 128))
                      ])) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "space-y-3" }, [
                      createVNode("div", { class: "flex items-center gap-2" }, [
                        createVNode(unref(_sfc_main$v), {
                          variant: "outline",
                          "as-child": "",
                          class: "flex-1"
                        }, {
                          default: withCtx(() => [
                            createVNode("label", { class: "cursor-pointer" }, [
                              createVNode("input", {
                                ref_key: "fileRef",
                                ref: fileRef,
                                type: "file",
                                accept: "image/*,video/*",
                                multiple: "",
                                class: "hidden",
                                onChange: onFilesChange
                              }, null, 544),
                              createVNode("div", { class: "flex items-center gap-2" }, [
                                (openBlock(), createBlock("svg", {
                                  class: "w-4 h-4",
                                  fill: "none",
                                  stroke: "currentColor",
                                  viewBox: "0 0 24 24"
                                }, [
                                  createVNode("path", {
                                    "stroke-linecap": "round",
                                    "stroke-linejoin": "round",
                                    "stroke-width": "2",
                                    d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  })
                                ])),
                                createVNode("span", null, "\u6DFB\u52A0\u56FE\u7247/\u89C6\u9891"),
                                filePreviews.value.length > 0 ? (openBlock(), createBlock(unref(_sfc_main$2$1), {
                                  key: 0,
                                  variant: "secondary",
                                  class: "ml-auto"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(filePreviews.value.length), 1)
                                  ]),
                                  _: 1
                                })) : createCommentVNode("", true)
                              ])
                            ])
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$v), {
                          type: "submit",
                          class: "flex-1",
                          disabled: creating.value
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(creating.value ? "\u53D1\u5E03\u4E2D..." : "\u53D1\u5E03"), 1)
                          ]),
                          _: 1
                        }, 8, ["disabled"])
                      ]),
                      filePreviews.value.length > 0 ? (openBlock(), createBlock(unref(draggable), {
                        key: 0,
                        modelValue: filePreviews.value,
                        "onUpdate:modelValue": ($event) => filePreviews.value = $event,
                        animation: 200,
                        "item-key": (item) => `${item.name}-${item.size}`,
                        class: "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3",
                        onEnd: onDragEnd
                      }, {
                        item: withCtx(({ element: preview, index }) => [
                          createVNode("div", { class: "relative group aspect-square rounded-lg overflow-hidden bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 cursor-move" }, [
                            preview.type.startsWith("image/") ? (openBlock(), createBlock("img", {
                              key: 0,
                              src: preview.url,
                              alt: preview.name,
                              class: "w-full h-full object-cover"
                            }, null, 8, ["src", "alt"])) : preview.type.startsWith("video/") ? (openBlock(), createBlock("div", {
                              key: 1,
                              class: "w-full h-full flex flex-col items-center justify-center bg-slate-200 dark:bg-slate-700 relative"
                            }, [
                              preview.url && preview.url.startsWith("data:image") ? (openBlock(), createBlock("img", {
                                key: 0,
                                src: preview.url,
                                class: "w-full h-full object-cover",
                                alt: "\u89C6\u9891\u9884\u89C8"
                              }, null, 8, ["src"])) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                (openBlock(), createBlock("svg", {
                                  class: "w-12 h-12 text-slate-400 dark:text-slate-500 mb-2",
                                  fill: "none",
                                  stroke: "currentColor",
                                  viewBox: "0 0 24 24"
                                }, [
                                  createVNode("path", {
                                    "stroke-linecap": "round",
                                    "stroke-linejoin": "round",
                                    "stroke-width": "2",
                                    d: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                  })
                                ])),
                                createVNode("span", { class: "text-xs text-slate-500 dark:text-slate-400 px-2 text-center truncate w-full" }, toDisplayString(preview.name), 1)
                              ], 64)),
                              createVNode("div", { class: "absolute inset-0 flex items-center justify-center bg-black/20" }, [
                                (openBlock(), createBlock("svg", {
                                  class: "w-10 h-10 text-white",
                                  fill: "currentColor",
                                  viewBox: "0 0 24 24"
                                }, [
                                  createVNode("path", { d: "M8 5v14l11-7z" })
                                ]))
                              ])
                            ])) : createCommentVNode("", true),
                            createVNode("button", {
                              type: "button",
                              class: "absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-10",
                              onClick: withModifiers(($event) => removeFile(index), ["stop"]),
                              title: "\u5220\u9664"
                            }, [
                              (openBlock(), createBlock("svg", {
                                class: "w-4 h-4",
                                fill: "none",
                                stroke: "currentColor",
                                viewBox: "0 0 24 24"
                              }, [
                                createVNode("path", {
                                  "stroke-linecap": "round",
                                  "stroke-linejoin": "round",
                                  "stroke-width": "2",
                                  d: "M6 18L18 6M6 6l12 12"
                                })
                              ]))
                            ], 8, ["onClick"]),
                            createVNode("div", { class: "absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-xs" }, toDisplayString(preview.type.startsWith("image/") ? "\u56FE\u7247" : "\u89C6\u9891"), 1)
                          ])
                        ]),
                        _: 1
                      }, 8, ["modelValue", "onUpdate:modelValue", "item-key"])) : createCommentVNode("", true)
                    ])
                  ], 32)
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$7$1), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$5$1), { class: "px-4 space-y-4" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_sfc_main$1, {
                    modelValue: start.value,
                    "onUpdate:modelValue": ($event) => start.value = $event,
                    placeholder: "\u8D77\u59CB\u65F6\u95F4",
                    class: "h-9"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_sfc_main$1, {
                    modelValue: end.value,
                    "onUpdate:modelValue": ($event) => end.value = $event,
                    placeholder: "\u7ED3\u675F\u65F6\u95F4",
                    class: "h-9"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div><div class="flex flex-wrap gap-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$v), {
                    variant: "outline",
                    size: "sm",
                    onClick: ($event) => presetDays(0),
                    class: "h-9 px-3"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId3}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"${_scopeId3}></path></svg> \u4ECA\u5929 `);
                      } else {
                        return [
                          (openBlock(), createBlock("svg", {
                            class: "w-4 h-4 mr-1",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24"
                          }, [
                            createVNode("path", {
                              "stroke-linecap": "round",
                              "stroke-linejoin": "round",
                              "stroke-width": "2",
                              d: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                            })
                          ])),
                          createTextVNode(" \u4ECA\u5929 ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$v), {
                    variant: "outline",
                    size: "sm",
                    onClick: ($event) => presetDays(7),
                    class: "h-9 px-3"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId3}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"${_scopeId3}></path></svg> \u8FD17\u5929 `);
                      } else {
                        return [
                          (openBlock(), createBlock("svg", {
                            class: "w-4 h-4 mr-1",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24"
                          }, [
                            createVNode("path", {
                              "stroke-linecap": "round",
                              "stroke-linejoin": "round",
                              "stroke-width": "2",
                              d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            })
                          ])),
                          createTextVNode(" \u8FD17\u5929 ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$v), {
                    variant: "outline",
                    size: "sm",
                    onClick: ($event) => presetDays(30),
                    class: "h-9 px-3"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId3}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"${_scopeId3}></path></svg> \u8FD130\u5929 `);
                      } else {
                        return [
                          (openBlock(), createBlock("svg", {
                            class: "w-4 h-4 mr-1",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24"
                          }, [
                            createVNode("path", {
                              "stroke-linecap": "round",
                              "stroke-linejoin": "round",
                              "stroke-width": "2",
                              d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            })
                          ])),
                          createTextVNode(" \u8FD130\u5929 ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<div class="ml-auto"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$v), {
                    variant: "ghost",
                    size: "sm",
                    onClick: clearFilters,
                    class: "h-9 px-3 text-muted-foreground hover:text-foreground"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId3}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"${_scopeId3}></path></svg>`);
                      } else {
                        return [
                          (openBlock(), createBlock("svg", {
                            class: "w-4 h-4",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24"
                          }, [
                            createVNode("path", {
                              "stroke-linecap": "round",
                              "stroke-linejoin": "round",
                              "stroke-width": "2",
                              d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            })
                          ]))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div></div>`);
                  if (allTags.value.length > 0) {
                    _push3(`<div class="pt-2 border-t border-border/50"${_scopeId2}><div class="flex flex-wrap gap-2"${_scopeId2}><!--[-->`);
                    ssrRenderList(allTags.value, (t) => {
                      _push3(ssrRenderComponent(unref(_sfc_main$2$1), {
                        key: t,
                        variant: "outline",
                        class: ["cursor-pointer transition-all duration-200 hover:shadow-sm", selectedTags.value.includes(t) ? "bg-primary text-primary-foreground shadow-sm border-primary/50" : "hover:bg-muted/50 hover:border-muted-foreground/30"],
                        onClick: ($event) => toggleTag(t)
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            if (selectedTags.value.includes(t)) {
                              _push4(`<span class="mr-1"${_scopeId3}>\u2713</span>`);
                            } else {
                              _push4(`<!---->`);
                            }
                            _push4(` ${ssrInterpolate(t)}`);
                          } else {
                            return [
                              selectedTags.value.includes(t) ? (openBlock(), createBlock("span", {
                                key: 0,
                                class: "mr-1"
                              }, "\u2713")) : createCommentVNode("", true),
                              createTextVNode(" " + toDisplayString(t), 1)
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    });
                    _push3(`<!--]--></div></div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-2" }, [
                      createVNode(_sfc_main$1, {
                        modelValue: start.value,
                        "onUpdate:modelValue": ($event) => start.value = $event,
                        placeholder: "\u8D77\u59CB\u65F6\u95F4",
                        class: "h-9"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode(_sfc_main$1, {
                        modelValue: end.value,
                        "onUpdate:modelValue": ($event) => end.value = $event,
                        placeholder: "\u7ED3\u675F\u65F6\u95F4",
                        class: "h-9"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    createVNode("div", { class: "flex flex-wrap gap-2" }, [
                      createVNode(unref(_sfc_main$v), {
                        variant: "outline",
                        size: "sm",
                        onClick: ($event) => presetDays(0),
                        class: "h-9 px-3"
                      }, {
                        default: withCtx(() => [
                          (openBlock(), createBlock("svg", {
                            class: "w-4 h-4 mr-1",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24"
                          }, [
                            createVNode("path", {
                              "stroke-linecap": "round",
                              "stroke-linejoin": "round",
                              "stroke-width": "2",
                              d: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                            })
                          ])),
                          createTextVNode(" \u4ECA\u5929 ")
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode(unref(_sfc_main$v), {
                        variant: "outline",
                        size: "sm",
                        onClick: ($event) => presetDays(7),
                        class: "h-9 px-3"
                      }, {
                        default: withCtx(() => [
                          (openBlock(), createBlock("svg", {
                            class: "w-4 h-4 mr-1",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24"
                          }, [
                            createVNode("path", {
                              "stroke-linecap": "round",
                              "stroke-linejoin": "round",
                              "stroke-width": "2",
                              d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            })
                          ])),
                          createTextVNode(" \u8FD17\u5929 ")
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode(unref(_sfc_main$v), {
                        variant: "outline",
                        size: "sm",
                        onClick: ($event) => presetDays(30),
                        class: "h-9 px-3"
                      }, {
                        default: withCtx(() => [
                          (openBlock(), createBlock("svg", {
                            class: "w-4 h-4 mr-1",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24"
                          }, [
                            createVNode("path", {
                              "stroke-linecap": "round",
                              "stroke-linejoin": "round",
                              "stroke-width": "2",
                              d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            })
                          ])),
                          createTextVNode(" \u8FD130\u5929 ")
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode("div", { class: "ml-auto" }, [
                        createVNode(unref(_sfc_main$v), {
                          variant: "ghost",
                          size: "sm",
                          onClick: clearFilters,
                          class: "h-9 px-3 text-muted-foreground hover:text-foreground"
                        }, {
                          default: withCtx(() => [
                            (openBlock(), createBlock("svg", {
                              class: "w-4 h-4",
                              fill: "none",
                              stroke: "currentColor",
                              viewBox: "0 0 24 24"
                            }, [
                              createVNode("path", {
                                "stroke-linecap": "round",
                                "stroke-linejoin": "round",
                                "stroke-width": "2",
                                d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              })
                            ]))
                          ]),
                          _: 1
                        })
                      ])
                    ]),
                    allTags.value.length > 0 ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "pt-2 border-t border-border/50"
                    }, [
                      createVNode("div", { class: "flex flex-wrap gap-2" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(allTags.value, (t) => {
                          return openBlock(), createBlock(unref(_sfc_main$2$1), {
                            key: t,
                            variant: "outline",
                            class: ["cursor-pointer transition-all duration-200 hover:shadow-sm", selectedTags.value.includes(t) ? "bg-primary text-primary-foreground shadow-sm border-primary/50" : "hover:bg-muted/50 hover:border-muted-foreground/30"],
                            onClick: ($event) => toggleTag(t)
                          }, {
                            default: withCtx(() => [
                              selectedTags.value.includes(t) ? (openBlock(), createBlock("span", {
                                key: 0,
                                class: "mr-1"
                              }, "\u2713")) : createCommentVNode("", true),
                              createTextVNode(" " + toDisplayString(t), 1)
                            ]),
                            _: 2
                          }, 1032, ["class", "onClick"]);
                        }), 128))
                      ])
                    ])) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$5$1), { class: "px-4 space-y-4" }, {
                default: withCtx(() => [
                  createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-2 gap-2" }, [
                    createVNode(_sfc_main$1, {
                      modelValue: start.value,
                      "onUpdate:modelValue": ($event) => start.value = $event,
                      placeholder: "\u8D77\u59CB\u65F6\u95F4",
                      class: "h-9"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    createVNode(_sfc_main$1, {
                      modelValue: end.value,
                      "onUpdate:modelValue": ($event) => end.value = $event,
                      placeholder: "\u7ED3\u675F\u65F6\u95F4",
                      class: "h-9"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  createVNode("div", { class: "flex flex-wrap gap-2" }, [
                    createVNode(unref(_sfc_main$v), {
                      variant: "outline",
                      size: "sm",
                      onClick: ($event) => presetDays(0),
                      class: "h-9 px-3"
                    }, {
                      default: withCtx(() => [
                        (openBlock(), createBlock("svg", {
                          class: "w-4 h-4 mr-1",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                          })
                        ])),
                        createTextVNode(" \u4ECA\u5929 ")
                      ]),
                      _: 1
                    }, 8, ["onClick"]),
                    createVNode(unref(_sfc_main$v), {
                      variant: "outline",
                      size: "sm",
                      onClick: ($event) => presetDays(7),
                      class: "h-9 px-3"
                    }, {
                      default: withCtx(() => [
                        (openBlock(), createBlock("svg", {
                          class: "w-4 h-4 mr-1",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          })
                        ])),
                        createTextVNode(" \u8FD17\u5929 ")
                      ]),
                      _: 1
                    }, 8, ["onClick"]),
                    createVNode(unref(_sfc_main$v), {
                      variant: "outline",
                      size: "sm",
                      onClick: ($event) => presetDays(30),
                      class: "h-9 px-3"
                    }, {
                      default: withCtx(() => [
                        (openBlock(), createBlock("svg", {
                          class: "w-4 h-4 mr-1",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          })
                        ])),
                        createTextVNode(" \u8FD130\u5929 ")
                      ]),
                      _: 1
                    }, 8, ["onClick"]),
                    createVNode("div", { class: "ml-auto" }, [
                      createVNode(unref(_sfc_main$v), {
                        variant: "ghost",
                        size: "sm",
                        onClick: clearFilters,
                        class: "h-9 px-3 text-muted-foreground hover:text-foreground"
                      }, {
                        default: withCtx(() => [
                          (openBlock(), createBlock("svg", {
                            class: "w-4 h-4",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24"
                          }, [
                            createVNode("path", {
                              "stroke-linecap": "round",
                              "stroke-linejoin": "round",
                              "stroke-width": "2",
                              d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            })
                          ]))
                        ]),
                        _: 1
                      })
                    ])
                  ]),
                  allTags.value.length > 0 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "pt-2 border-t border-border/50"
                  }, [
                    createVNode("div", { class: "flex flex-wrap gap-2" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(allTags.value, (t) => {
                        return openBlock(), createBlock(unref(_sfc_main$2$1), {
                          key: t,
                          variant: "outline",
                          class: ["cursor-pointer transition-all duration-200 hover:shadow-sm", selectedTags.value.includes(t) ? "bg-primary text-primary-foreground shadow-sm border-primary/50" : "hover:bg-muted/50 hover:border-muted-foreground/30"],
                          onClick: ($event) => toggleTag(t)
                        }, {
                          default: withCtx(() => [
                            selectedTags.value.includes(t) ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "mr-1"
                            }, "\u2713")) : createCommentVNode("", true),
                            createTextVNode(" " + toDisplayString(t), 1)
                          ]),
                          _: 2
                        }, 1032, ["class", "onClick"]);
                      }), 128))
                    ])
                  ])) : createCommentVNode("", true)
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
          text: "\u6682\u65E0\u65E5\u5E38\u8BB0\u5F55",
          img: "/assets/images/xiaojimao/xiaojimao-4.png",
          "cta-text": "\u53BB\u53D1\u5E03\u4E00\u6761",
          "cta-to": "/daily"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(ssrRenderComponent(Timeline, null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<!--[-->`);
              ssrRenderList(grouped.value, (group) => {
                _push2(`<!--[--><div class="pl-14 text-sm muted mb-2"${_scopeId}>${ssrInterpolate(group.label)}</div><!--[-->`);
                ssrRenderList(group.items, (it) => {
                  _push2(ssrRenderComponent(TimelineItem, {
                    key: it.id
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(ssrRenderComponent(PostCard, {
                          id: it.id,
                          content: it.content,
                          createdAt: it.createdAt,
                          "media-urls": asArray(it.mediaUrls),
                          "comment-count": it.commentCount || 0,
                          tags: it.tags || [],
                          authorId: it.authorId || it.author?.id,
                          onCommented: ($event) => reloadOne(it.id),
                          onDeleted: ($event) => handleDelete(it.id)
                        }, null, _parent3, _scopeId2));
                      } else {
                        return [
                          createVNode(PostCard, {
                            id: it.id,
                            content: it.content,
                            createdAt: it.createdAt,
                            "media-urls": asArray(it.mediaUrls),
                            "comment-count": it.commentCount || 0,
                            tags: it.tags || [],
                            authorId: it.authorId || it.author?.id,
                            onCommented: ($event) => reloadOne(it.id),
                            onDeleted: ($event) => handleDelete(it.id)
                          }, null, 8, ["id", "content", "createdAt", "media-urls", "comment-count", "tags", "authorId", "onCommented", "onDeleted"])
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                });
                _push2(`<!--]--><!--]-->`);
              });
              _push2(`<!--]-->`);
            } else {
              return [
                (openBlock(true), createBlock(Fragment, null, renderList(grouped.value, (group) => {
                  return openBlock(), createBlock(Fragment, {
                    key: group.label
                  }, [
                    createVNode("div", { class: "pl-14 text-sm muted mb-2" }, toDisplayString(group.label), 1),
                    (openBlock(true), createBlock(Fragment, null, renderList(group.items, (it) => {
                      return openBlock(), createBlock(TimelineItem, {
                        key: it.id
                      }, {
                        default: withCtx(() => [
                          createVNode(PostCard, {
                            id: it.id,
                            content: it.content,
                            createdAt: it.createdAt,
                            "media-urls": asArray(it.mediaUrls),
                            "comment-count": it.commentCount || 0,
                            tags: it.tags || [],
                            authorId: it.authorId || it.author?.id,
                            onCommented: ($event) => reloadOne(it.id),
                            onDeleted: ($event) => handleDelete(it.id)
                          }, null, 8, ["id", "content", "createdAt", "media-urls", "comment-count", "tags", "authorId", "onCommented", "onDeleted"])
                        ]),
                        _: 2
                      }, 1024);
                    }), 128))
                  ], 64);
                }), 128))
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      if (hasMore.value && !loading.value) {
        _push(`<div class="mt-4 flex justify-center">`);
        _push(ssrRenderComponent(unref(_sfc_main$v), {
          variant: "outline",
          onClick: loadMore,
          disabled: loadingMore.value
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(loadingMore.value ? "\u52A0\u8F7D\u4E2D\u2026" : "\u52A0\u8F7D\u66F4\u591A")}`);
            } else {
              return [
                createTextVNode(toDisplayString(loadingMore.value ? "\u52A0\u8F7D\u4E2D\u2026" : "\u52A0\u8F7D\u66F4\u591A"), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/daily/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
