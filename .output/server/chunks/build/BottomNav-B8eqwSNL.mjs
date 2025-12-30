import { defineComponent, mergeProps, unref, withCtx, createVNode, createBlock, Transition, createCommentVNode, openBlock, toDisplayString, computed, readonly, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent, ssrRenderClass, ssrRenderAttr } from 'vue/server-renderer';
import { _ as _export_sfc, b as useRoute, i as useState, n as navigateTo } from './server.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-qMRI1Itf.mjs';

const _sfc_main$1 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<footer${ssrRenderAttrs(mergeProps({ class: "border-t border-border py-6" }, _attrs))}><div class="max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-3 items-center justify-between"><div class="text-sm text-muted-foreground flex flex-wrap gap-2 items-center justify-center md:justify-start"><span>\xA9 ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} My Doggy Love</span><span class="text-muted-foreground/50">\xB7</span><span>\u4EE5\u7231\u4E3A\u540D\uFF0C\u8BB0\u5F55\u6BCF\u4E00\u5E27\u5FC3\u52A8</span><span class="text-muted-foreground/50">\xB7</span><a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener" class="hover:underline hover:text-foreground transition-colors">\u95FDICP\u59072025120753\u53F7</a></div><div class="flex items-center gap-3"><a href="https://github.com/linxiaowang/my-doggy-love" target="_blank" rel="noopener" title="GitHub" class="text-muted-foreground hover:text-foreground transition-colors"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path></svg></a><a href="https://github.com/linxiaowang/my-doggy-love/issues" target="_blank" rel="noopener" class="text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors" title="\u53CD\u9988">\u53CD\u9988</a><a href="https://github.com/linxiaowang/my-doggy-love/blob/main/LICENSE" target="_blank" rel="noopener" class="text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors" title="\u8BB8\u53EF\u8BC1">\u8BB8\u53EF\u8BC1</a></div></div></footer>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Footer.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender]]), { __name: "Footer" });
const useAuth = () => {
  const user = useState("auth-user", () => null);
  const loading = useState("auth-loading", () => true);
  const isAuthenticated = computed(() => !!user.value);
  async function checkAuth() {
    loading.value = true;
    try {
      const res = await $fetch("/api/auth/me", {
        credentials: "include"
      });
      user.value = res.user;
      return res.user;
    } catch (error) {
      user.value = null;
      return null;
    } finally {
      loading.value = false;
    }
  }
  async function requireAuth(redirectTo) {
    const currentUser = await checkAuth();
    if (!currentUser) {
      const redirectPath = redirectTo || useRoute().fullPath;
      await navigateTo({
        path: "/user/login",
        query: { redirect: redirectPath }
      });
      return null;
    }
    return currentUser;
  }
  async function logout() {
    try {
      await $fetch("/api/auth/logout", { method: "POST" });
      user.value = null;
      await navigateTo("/user/login");
    } catch (error) {
      console.error("\u9000\u51FA\u767B\u5F55\u5931\u8D25:", error);
    }
  }
  return {
    user: readonly(user),
    loading: readonly(loading),
    isAuthenticated,
    checkAuth,
    requireAuth,
    logout
  };
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BottomNav",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const { isAuthenticated } = useAuth();
    const navItems = [
      { name: "\u9996\u9875", path: "/", icon: "home", ariaLabel: "\u9996\u9875" },
      { name: "\u65E5\u5E38", path: "/daily", icon: "image", ariaLabel: "\u65E5\u5E38\u52A8\u6001" },
      { name: "\u613F\u671B", path: "/wishes", icon: "star", ariaLabel: "\u613F\u671B\u6E05\u5355" },
      { name: "\u7559\u8A00", path: "/messages", icon: "message-circle", ariaLabel: "\u7559\u8A00\u677F" },
      { name: "\u6211\u7684", path: "/user/profile", icon: "user", ariaLabel: "\u4E2A\u4EBA\u4E2D\u5FC3" }
    ];
    function isActive(path) {
      if (path === "/") return route.path === "/";
      return route.path.startsWith(path);
    }
    const icons = {
      "home": "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
      "image": "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5-5 5 5M12 15V3",
      "star": "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
      "message-circle": "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z",
      "user": "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      if (unref(isAuthenticated)) {
        _push(`<nav${ssrRenderAttrs(mergeProps({
          class: "fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border pb-[env(safe-area-inset-bottom)] z-50 md:hidden",
          role: "navigation",
          "aria-label": "\u4E3B\u5BFC\u822A"
        }, _attrs))}><div class="flex justify-around items-center h-16 px-2"><!--[-->`);
        ssrRenderList(navItems, (item) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: item.path,
            to: item.path,
            class: ["relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 group", isActive(item.path) ? "text-primary" : "text-muted-foreground hover:text-foreground"],
            "aria-label": item.ariaLabel,
            "aria-current": isActive(item.path) ? "page" : void 0
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(``);
                if (isActive(item.path)) {
                  _push2(`<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-primary/10 rounded-2xl -z-10"${_scopeId}></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<svg class="${ssrRenderClass([isActive(item.path) ? "scale-110" : "", "w-6 h-6 transition-transform duration-300"])}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true"${_scopeId}><path${ssrRenderAttr("d", icons[item.icon])}${_scopeId}></path></svg><span class="text-[10px] font-medium transition-colors duration-300"${_scopeId}>${ssrInterpolate(item.name)}</span>`);
              } else {
                return [
                  createVNode(Transition, {
                    "enter-active-class": "transition-all duration-300 ease-out",
                    "enter-from-class": "scale-0 opacity-0",
                    "enter-to-class": "scale-100 opacity-100",
                    "leave-active-class": "transition-all duration-200 ease-in",
                    "leave-from-class": "scale-100 opacity-100",
                    "leave-to-class": "scale-0 opacity-0"
                  }, {
                    default: withCtx(() => [
                      isActive(item.path) ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-primary/10 rounded-2xl -z-10"
                      })) : createCommentVNode("", true)
                    ]),
                    _: 2
                  }, 1024),
                  (openBlock(), createBlock("svg", {
                    class: ["w-6 h-6 transition-transform duration-300", isActive(item.path) ? "scale-110" : ""],
                    fill: "none",
                    stroke: "currentColor",
                    "stroke-width": "2",
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    viewBox: "0 0 24 24",
                    "aria-hidden": "true"
                  }, [
                    createVNode("path", {
                      d: icons[item.icon]
                    }, null, 8, ["d"])
                  ], 2)),
                  createVNode("span", { class: "text-[10px] font-medium transition-colors duration-300" }, toDisplayString(item.name), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div></nav>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/BottomNav.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const BottomNav = Object.assign(_sfc_main, { __name: "BottomNav" });

export { BottomNav as B, __nuxt_component_0 as _ };
