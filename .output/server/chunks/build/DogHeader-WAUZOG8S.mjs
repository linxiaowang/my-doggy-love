import { _ as __nuxt_component_0 } from './nuxt-link-qMRI1Itf.mjs';
import { clsx } from 'clsx';
import { ref, computed, readonly, defineComponent, unref, mergeProps, withCtx, renderSlot, watch, createVNode, createTextVNode, toDisplayString, createBlock, createCommentVNode, openBlock, toValue, reactive, Transition, inject, nextTick, getCurrentInstance, onServerPrefetch, shallowRef, toRef, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderSlot, ssrRenderAttr, ssrInterpolate, ssrRenderAttrs, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { Primitive, AvatarRoot, AvatarImage, AvatarFallback, useForwardPropsEmits, DropdownMenuRoot, useForwardProps, DropdownMenuTrigger, DropdownMenuPortal, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DialogRoot, DialogTrigger, DialogPortal, DialogContent, DialogClose, DialogTitle, DialogDescription, Separator, DialogOverlay, DropdownMenuCheckboxItem, DropdownMenuItemIndicator, DropdownMenuGroup, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from 'reka-ui';
import { twMerge } from 'tailwind-merge';
import { r as reactiveOmit, j as useThemeDecorations, b as useRoute, _ as _export_sfc, n as navigateTo, h as fetchDefaults, u as useHead, o as onClickOutside, e as useNuxtApp, f as asyncDataDefaults, i as useState, g as createError } from './server.mjs';
import { p as publicAssetsURL } from '../routes/renderer.mjs';
import { Bell, X, ChevronDown, Check, Circle, ChevronRight } from 'lucide-vue-next';
import { F as hash } from '../nitro/nitro.mjs';
import { isPlainObject } from '@vue/shared';
import { debounce } from 'perfect-debounce';
import { defineStore } from 'pinia';

const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const loading = ref(false);
  const initialized = ref(false);
  const isAuthenticated = computed(() => !!user.value);
  async function fetchUser() {
    {
      return null;
    }
  }
  function setUser(newUser) {
    user.value = newUser;
    initialized.value = true;
  }
  function clearUser() {
    user.value = null;
    initialized.value = true;
  }
  async function refreshUser() {
    return fetchUser();
  }
  function updateUser(updates) {
    if (user.value) {
      user.value = { ...user.value, ...updates };
    }
  }
  return {
    user: readonly(user),
    loading: readonly(loading),
    initialized: readonly(initialized),
    isAuthenticated,
    fetchUser,
    setUser,
    clearUser,
    refreshUser,
    updateUser
  };
});

function useAsyncData(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (_isAutoKeyNeeded(args[0], args[1])) {
    args.unshift(autoKey);
  }
  let [_key, _handler, options = {}] = args;
  const key = computed(() => toValue(_key));
  if (typeof key.value !== "string") {
    throw new TypeError("[nuxt] [useAsyncData] key must be a string.");
  }
  if (typeof _handler !== "function") {
    throw new TypeError("[nuxt] [useAsyncData] handler must be a function.");
  }
  const nuxtApp = useNuxtApp();
  options.server ??= true;
  options.default ??= getDefault;
  options.getCachedData ??= getDefaultCachedData;
  options.lazy ??= false;
  options.immediate ??= true;
  options.deep ??= asyncDataDefaults.deep;
  options.dedupe ??= "cancel";
  options._functionName || "useAsyncData";
  nuxtApp._asyncData[key.value];
  function createInitialFetch() {
    const initialFetchOptions = { cause: "initial", dedupe: options.dedupe };
    if (!nuxtApp._asyncData[key.value]?._init) {
      initialFetchOptions.cachedData = options.getCachedData(key.value, nuxtApp, { cause: "initial" });
      nuxtApp._asyncData[key.value] = createAsyncData(nuxtApp, key.value, _handler, options, initialFetchOptions.cachedData);
    }
    return () => nuxtApp._asyncData[key.value].execute(initialFetchOptions);
  }
  const initialFetch = createInitialFetch();
  const asyncData = nuxtApp._asyncData[key.value];
  asyncData._deps++;
  const fetchOnServer = options.server !== false && nuxtApp.payload.serverRendered;
  if (fetchOnServer && options.immediate) {
    const promise = initialFetch();
    if (getCurrentInstance()) {
      onServerPrefetch(() => promise);
    } else {
      nuxtApp.hook("app:created", async () => {
        await promise;
      });
    }
  }
  const asyncReturn = {
    data: writableComputedRef(() => nuxtApp._asyncData[key.value]?.data),
    pending: writableComputedRef(() => nuxtApp._asyncData[key.value]?.pending),
    status: writableComputedRef(() => nuxtApp._asyncData[key.value]?.status),
    error: writableComputedRef(() => nuxtApp._asyncData[key.value]?.error),
    refresh: (...args2) => {
      if (!nuxtApp._asyncData[key.value]?._init) {
        const initialFetch2 = createInitialFetch();
        return initialFetch2();
      }
      return nuxtApp._asyncData[key.value].execute(...args2);
    },
    execute: (...args2) => asyncReturn.refresh(...args2),
    clear: () => {
      const entry = nuxtApp._asyncData[key.value];
      if (entry?._abortController) {
        try {
          entry._abortController.abort(new DOMException("AsyncData aborted by user.", "AbortError"));
        } finally {
          entry._abortController = void 0;
        }
      }
      clearNuxtDataByKey(nuxtApp, key.value);
    }
  };
  const asyncDataPromise = Promise.resolve(nuxtApp._asyncDataPromises[key.value]).then(() => asyncReturn);
  Object.assign(asyncDataPromise, asyncReturn);
  return asyncDataPromise;
}
function writableComputedRef(getter) {
  return computed({
    get() {
      return getter()?.value;
    },
    set(value) {
      const ref2 = getter();
      if (ref2) {
        ref2.value = value;
      }
    }
  });
}
function _isAutoKeyNeeded(keyOrFetcher, fetcher) {
  if (typeof keyOrFetcher === "string") {
    return false;
  }
  if (typeof keyOrFetcher === "object" && keyOrFetcher !== null) {
    return false;
  }
  if (typeof keyOrFetcher === "function" && typeof fetcher === "function") {
    return false;
  }
  return true;
}
function clearNuxtDataByKey(nuxtApp, key) {
  if (key in nuxtApp.payload.data) {
    nuxtApp.payload.data[key] = void 0;
  }
  if (key in nuxtApp.payload._errors) {
    nuxtApp.payload._errors[key] = void 0;
  }
  if (nuxtApp._asyncData[key]) {
    nuxtApp._asyncData[key].data.value = unref(nuxtApp._asyncData[key]._default());
    nuxtApp._asyncData[key].error.value = void 0;
    nuxtApp._asyncData[key].status.value = "idle";
  }
  if (key in nuxtApp._asyncDataPromises) {
    nuxtApp._asyncDataPromises[key] = void 0;
  }
}
function pick(obj, keys) {
  const newObj = {};
  for (const key of keys) {
    newObj[key] = obj[key];
  }
  return newObj;
}
function createAsyncData(nuxtApp, key, _handler, options, initialCachedData) {
  nuxtApp.payload._errors[key] ??= void 0;
  const hasCustomGetCachedData = options.getCachedData !== getDefaultCachedData;
  const handler = _handler ;
  const _ref = options.deep ? ref : shallowRef;
  const hasCachedData = initialCachedData !== void 0;
  const unsubRefreshAsyncData = nuxtApp.hook("app:data:refresh", async (keys) => {
    if (!keys || keys.includes(key)) {
      await asyncData.execute({ cause: "refresh:hook" });
    }
  });
  const asyncData = {
    data: _ref(hasCachedData ? initialCachedData : options.default()),
    pending: computed(() => asyncData.status.value === "pending"),
    error: toRef(nuxtApp.payload._errors, key),
    status: shallowRef("idle"),
    execute: (...args) => {
      const [_opts, newValue = void 0] = args;
      const opts = _opts && newValue === void 0 && typeof _opts === "object" ? _opts : {};
      if (nuxtApp._asyncDataPromises[key]) {
        if ((opts.dedupe ?? options.dedupe) === "defer") {
          return nuxtApp._asyncDataPromises[key];
        }
      }
      {
        const cachedData = "cachedData" in opts ? opts.cachedData : options.getCachedData(key, nuxtApp, { cause: opts.cause ?? "refresh:manual" });
        if (cachedData !== void 0) {
          nuxtApp.payload.data[key] = asyncData.data.value = cachedData;
          asyncData.error.value = void 0;
          asyncData.status.value = "success";
          return Promise.resolve(cachedData);
        }
      }
      if (asyncData._abortController) {
        asyncData._abortController.abort(new DOMException("AsyncData request cancelled by deduplication", "AbortError"));
      }
      asyncData._abortController = new AbortController();
      asyncData.status.value = "pending";
      const promise = new Promise(
        (resolve, reject) => {
          try {
            const timeout = opts.timeout ?? options.timeout;
            const mergedSignal = mergeAbortSignals([asyncData._abortController?.signal, opts?.signal], timeout);
            if (mergedSignal.aborted) {
              const reason = mergedSignal.reason;
              reject(reason instanceof Error ? reason : new DOMException(String(reason ?? "Aborted"), "AbortError"));
              return;
            }
            mergedSignal.addEventListener("abort", () => {
              const reason = mergedSignal.reason;
              reject(reason instanceof Error ? reason : new DOMException(String(reason ?? "Aborted"), "AbortError"));
            }, { once: true });
            return Promise.resolve(handler(nuxtApp, { signal: mergedSignal })).then(resolve, reject);
          } catch (err) {
            reject(err);
          }
        }
      ).then(async (_result) => {
        let result = _result;
        if (options.transform) {
          result = await options.transform(_result);
        }
        if (options.pick) {
          result = pick(result, options.pick);
        }
        nuxtApp.payload.data[key] = result;
        asyncData.data.value = result;
        asyncData.error.value = void 0;
        asyncData.status.value = "success";
      }).catch((error) => {
        if (nuxtApp._asyncDataPromises[key] && nuxtApp._asyncDataPromises[key] !== promise) {
          return;
        }
        if (asyncData._abortController?.signal.aborted) {
          return;
        }
        if (typeof DOMException !== "undefined" && error instanceof DOMException && error.name === "AbortError") {
          asyncData.status.value = "idle";
          return;
        }
        asyncData.error.value = createError(error);
        asyncData.data.value = unref(options.default());
        asyncData.status.value = "error";
      }).finally(() => {
        delete nuxtApp._asyncDataPromises[key];
      });
      nuxtApp._asyncDataPromises[key] = promise;
      return nuxtApp._asyncDataPromises[key];
    },
    _execute: debounce((...args) => asyncData.execute(...args), 0, { leading: true }),
    _default: options.default,
    _deps: 0,
    _init: true,
    _hash: void 0,
    _off: () => {
      unsubRefreshAsyncData();
      if (nuxtApp._asyncData[key]?._init) {
        nuxtApp._asyncData[key]._init = false;
      }
      if (!hasCustomGetCachedData) {
        nextTick(() => {
          if (!nuxtApp._asyncData[key]?._init) {
            clearNuxtDataByKey(nuxtApp, key);
            asyncData.execute = () => Promise.resolve();
          }
        });
      }
    }
  };
  return asyncData;
}
const getDefault = () => void 0;
const getDefaultCachedData = (key, nuxtApp, ctx) => {
  if (nuxtApp.isHydrating) {
    return nuxtApp.payload.data[key];
  }
  if (ctx.cause !== "refresh:manual" && ctx.cause !== "refresh:hook") {
    return nuxtApp.static.data[key];
  }
};
function mergeAbortSignals(signals, timeout) {
  const list = signals.filter((s) => !!s);
  if (typeof timeout === "number" && timeout >= 0) {
    const timeoutSignal = AbortSignal.timeout?.(timeout);
    if (timeoutSignal) {
      list.push(timeoutSignal);
    }
  }
  if (AbortSignal.any) {
    return AbortSignal.any(list);
  }
  const controller = new AbortController();
  for (const sig of list) {
    if (sig.aborted) {
      const reason = sig.reason ?? new DOMException("Aborted", "AbortError");
      try {
        controller.abort(reason);
      } catch {
        controller.abort();
      }
      return controller.signal;
    }
  }
  const onAbort = () => {
    const abortedSignal = list.find((s) => s.aborted);
    const reason = abortedSignal?.reason ?? new DOMException("Aborted", "AbortError");
    try {
      controller.abort(reason);
    } catch {
      controller.abort();
    }
  };
  for (const sig of list) {
    sig.addEventListener?.("abort", onAbort, { once: true });
  }
  return controller.signal;
}
function useRequestEvent(nuxtApp) {
  nuxtApp ||= useNuxtApp();
  return nuxtApp.ssrContext?.event;
}
function useRequestFetch() {
  return useRequestEvent()?.$fetch || globalThis.$fetch;
}
function useFetch(request, arg1, arg2) {
  const [opts = {}, autoKey] = typeof arg1 === "string" ? [{}, arg1] : [arg1, arg2];
  const _request = computed(() => toValue(request));
  const key = computed(() => toValue(opts.key) || "$f" + hash([autoKey, typeof _request.value === "string" ? _request.value : "", ...generateOptionSegments(opts)]));
  if (!opts.baseURL && typeof _request.value === "string" && (_request.value[0] === "/" && _request.value[1] === "/")) {
    throw new Error('[nuxt] [useFetch] the request URL must not start with "//".');
  }
  const {
    server,
    lazy,
    default: defaultFn,
    transform,
    pick: pick2,
    watch: watchSources,
    immediate,
    getCachedData,
    deep,
    dedupe,
    timeout,
    ...fetchOptions
  } = opts;
  const _fetchOptions = reactive({
    ...fetchDefaults,
    ...fetchOptions,
    cache: typeof opts.cache === "boolean" ? void 0 : opts.cache
  });
  const _asyncDataOptions = {
    server,
    lazy,
    default: defaultFn,
    transform,
    pick: pick2,
    immediate,
    getCachedData,
    deep,
    dedupe,
    timeout,
    watch: watchSources === false ? [] : [...watchSources || [], _fetchOptions]
  };
  const asyncData = useAsyncData(watchSources === false ? key.value : key, (_, { signal }) => {
    let _$fetch = opts.$fetch || globalThis.$fetch;
    if (!opts.$fetch) {
      const isLocalFetch = typeof _request.value === "string" && _request.value[0] === "/" && (!toValue(opts.baseURL) || toValue(opts.baseURL)[0] === "/");
      if (isLocalFetch) {
        _$fetch = useRequestFetch();
      }
    }
    return _$fetch(_request.value, { signal, ..._fetchOptions });
  }, _asyncDataOptions);
  return asyncData;
}
function generateOptionSegments(opts) {
  const segments = [
    toValue(opts.method)?.toUpperCase() || "GET",
    toValue(opts.baseURL)
  ];
  for (const _obj of [opts.params || opts.query]) {
    const obj = toValue(_obj);
    if (!obj) {
      continue;
    }
    const unwrapped = {};
    for (const [key, value] of Object.entries(obj)) {
      unwrapped[toValue(key)] = toValue(value);
    }
    segments.push(unwrapped);
  }
  if (opts.body) {
    const value = toValue(opts.body);
    if (!value) {
      segments.push(hash(value));
    } else if (value instanceof ArrayBuffer) {
      segments.push(hash(Object.fromEntries([...new Uint8Array(value).entries()].map(([k, v]) => [k, v.toString()]))));
    } else if (value instanceof FormData) {
      const obj = {};
      for (const entry of value.entries()) {
        const [key, val] = entry;
        obj[key] = val instanceof File ? val.name : val;
      }
      segments.push(hash(obj));
    } else if (isPlainObject(value)) {
      segments.push(hash(reactive(value)));
    } else {
      try {
        segments.push(hash(value));
      } catch {
        console.warn("[useFetch] Failed to hash body", value);
      }
    }
  }
  return segments;
}
function handleApiError(error) {
  const apiError = error;
  const statusMessage = apiError?.statusMessage || apiError?.data?.statusMessage;
  const message = apiError?.message || apiError?.data?.message || "\u8BF7\u6C42\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5";
  if (statusMessage === "not in couple" || message.includes("not in couple")) {
    return "\u60A8\u8FD8\u6CA1\u6709\u7ED1\u5B9A\u60C5\u4FA3\uFF0C\u65E0\u6CD5\u6267\u884C\u6B64\u64CD\u4F5C\u3002";
  }
  if (apiError?.statusCode === 400) {
    return message || "\u8BF7\u6C42\u53C2\u6570\u9519\u8BEF";
  }
  if (apiError?.statusCode === 401) {
    return "\u767B\u5F55\u5DF2\u8FC7\u671F\uFF0C\u8BF7\u91CD\u65B0\u767B\u5F55";
  }
  if (apiError?.statusCode === 403) {
    return "\u6CA1\u6709\u6743\u9650\u6267\u884C\u6B64\u64CD\u4F5C";
  }
  if (apiError?.statusCode === 404) {
    return "\u8BF7\u6C42\u7684\u8D44\u6E90\u4E0D\u5B58\u5728";
  }
  if (apiError?.statusCode === 500) {
    return "\u670D\u52A1\u5668\u9519\u8BEF\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5";
  }
  return message;
}
function useApiFetch(url, options = {}) {
  const errorMessage = ref("");
  const isError = computed(() => !!errorMessage.value);
  const result = useFetch(url, {
    credentials: "include",
    // 自动包含 cookie
    immediate: true,
    // 立即执行请求
    ...options,
    onResponseError({ response }) {
      const message = handleApiError(response._data || response);
      errorMessage.value = message;
      if (options.onResponseError) {
        options.onResponseError({ response });
      }
    },
    onRequestError({ error }) {
      errorMessage.value = "\u7F51\u7EDC\u9519\u8BEF\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC\u8FDE\u63A5";
      if (options.onRequestError) {
        options.onRequestError({ error });
      }
    }
  }, "$kyqkoAOuMd");
  const clearError = () => {
    errorMessage.value = "";
  };
  return {
    ...result,
    errorMessage: readonly(errorMessage),
    isError,
    clearError
  };
}
async function apiFetch(url, options = {}) {
  try {
    const result = await $fetch(url, {
      credentials: "include",
      ...options
    });
    return result;
  } catch (error) {
    const message = handleApiError(error);
    const enhancedError = error;
    enhancedError.friendlyMessage = message;
    throw enhancedError;
  }
}
const falsyToString = (value) => typeof value === "boolean" ? `${value}` : value === 0 ? "0" : value;
const cx = clsx;
const cva = (base, config) => (props) => {
  var _config_compoundVariants;
  if ((config === null || config === void 0 ? void 0 : config.variants) == null) return cx(base, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
  const { variants, defaultVariants } = config;
  const getVariantClassNames = Object.keys(variants).map((variant) => {
    const variantProp = props === null || props === void 0 ? void 0 : props[variant];
    const defaultVariantProp = defaultVariants === null || defaultVariants === void 0 ? void 0 : defaultVariants[variant];
    if (variantProp === null) return null;
    const variantKey = falsyToString(variantProp) || falsyToString(defaultVariantProp);
    return variants[variant][variantKey];
  });
  const propsWithoutUndefined = props && Object.entries(props).reduce((acc, param) => {
    let [key, value] = param;
    if (value === void 0) {
      return acc;
    }
    acc[key] = value;
    return acc;
  }, {});
  const getCompoundVariantClassNames = config === null || config === void 0 ? void 0 : (_config_compoundVariants = config.compoundVariants) === null || _config_compoundVariants === void 0 ? void 0 : _config_compoundVariants.reduce((acc, param) => {
    let { class: cvClass, className: cvClassName, ...compoundVariantOptions } = param;
    return Object.entries(compoundVariantOptions).every((param2) => {
      let [key, value] = param2;
      return Array.isArray(value) ? value.includes({
        ...defaultVariants,
        ...propsWithoutUndefined
      }[key]) : {
        ...defaultVariants,
        ...propsWithoutUndefined
      }[key] === value;
    }) ? [
      ...acc,
      cvClass,
      cvClassName
    ] : acc;
  }, []);
  return cx(base, getVariantClassNames, getCompoundVariantClassNames, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
};
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const _sfc_main$v = /* @__PURE__ */ defineComponent({
  __name: "Button",
  __ssrInlineRender: true,
  props: {
    variant: {},
    size: {},
    class: {},
    asChild: { type: Boolean },
    as: { default: "button" }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Primitive), mergeProps({
        "data-slot": "button",
        as: __props.as,
        "as-child": __props.asChild,
        class: unref(cn)(unref(buttonVariants)({ variant: __props.variant, size: __props.size }), props.class)
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
const _sfc_setup$v = _sfc_main$v.setup;
_sfc_main$v.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/button/Button.vue");
  return _sfc_setup$v ? _sfc_setup$v(props, ctx) : void 0;
};
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        "default": "h-9 px-4 py-2 has-[>svg]:px-3",
        "sm": "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        "lg": "h-10 rounded-md px-6 has-[>svg]:px-4",
        "icon": "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const useColorMode = () => {
  return useState("color-mode").value;
};
const _sfc_main$u = /* @__PURE__ */ defineComponent({
  __name: "DarkToggle",
  __ssrInlineRender: true,
  setup(__props) {
    const color = useColorMode();
    useHead({
      meta: [{
        id: "theme-color",
        name: "theme-color",
        content: () => color.value === "dark" ? "#0f172a" : "#ffffff"
      }]
    });
    function toggleDark() {
      color.preference = color.value === "dark" ? "light" : "dark";
    }
    const isDark = computed(() => color.value === "dark");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Button = _sfc_main$v;
      _push(ssrRenderComponent(_component_Button, mergeProps({
        variant: "ghost",
        size: "icon",
        class: "relative w-8 h-8 hover:bg-muted/50",
        onClick: toggleDark,
        "aria-label": unref(isDark) ? "\u5207\u6362\u5230\u4EAE\u8272\u6A21\u5F0F" : "\u5207\u6362\u5230\u6697\u9ED1\u6A21\u5F0F"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(``);
            if (unref(isDark)) {
              _push2(`<svg class="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"${_scopeId}></path></svg>`);
            } else {
              _push2(`<svg class="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"${_scopeId}></path></svg>`);
            }
          } else {
            return [
              createVNode(Transition, {
                "enter-active-class": "transition-all duration-300 ease-out",
                "enter-from-class": "rotate-90 scale-0 opacity-0",
                "enter-to-class": "rotate-0 scale-100 opacity-100",
                "leave-active-class": "transition-all duration-200 ease-in",
                "leave-from-class": "rotate-0 scale-100 opacity-100",
                "leave-to-class": "-rotate-90 scale-0 opacity-0",
                mode: "out-in"
              }, {
                default: withCtx(() => [
                  unref(isDark) ? (openBlock(), createBlock("svg", {
                    key: "moon",
                    class: "w-5 h-5 text-foreground",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24",
                    "aria-hidden": "true"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    })
                  ])) : (openBlock(), createBlock("svg", {
                    key: "sun",
                    class: "w-5 h-5 text-foreground",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24",
                    "aria-hidden": "true"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    })
                  ]))
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$u = _sfc_main$u.setup;
_sfc_main$u.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/DarkToggle.vue");
  return _sfc_setup$u ? _sfc_setup$u(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main$u, { __name: "DarkToggle" });
const _imports_0 = publicAssetsURL("/assets/images/couple/couple-1.png");
const _sfc_main$t = /* @__PURE__ */ defineComponent({
  __name: "UserStatusSelector",
  __ssrInlineRender: true,
  props: {
    currentStatus: {}
  },
  emits: ["update"],
  setup(__props, { emit: __emit }) {
    const showPicker = ref(false);
    const showCustomInput = ref(false);
    const customStatusText = ref("");
    const customInputRef = ref(null);
    const containerRef = ref(null);
    onClickOutside(containerRef, () => {
      showPicker.value = false;
    });
    const closeOtherPopups = inject("closeOtherPopups", () => {
    });
    watch(showPicker, (newVal) => {
      if (newVal) {
        closeOtherPopups();
      }
    });
    watch(showCustomInput, async (newVal) => {
      if (newVal) {
        await nextTick();
        customInputRef.value?.focus();
      }
    });
    const statusOptions = [
      { key: "happy", label: "\u5F00\u5FC3", emoji: "\u{1F60A}" },
      { key: "busy", label: "\u5FD9\u788C", emoji: "\u{1F4BC}" },
      { key: "thinking", label: "\u5728\u601D\u8003", emoji: "\u{1F914}" },
      { key: "working", label: "\u5DE5\u4F5C\u4E2D", emoji: "\u{1F4BB}" },
      { key: "relaxing", label: "\u4F11\u606F\u4E2D", emoji: "\u{1F60C}" },
      { key: "eating", label: "\u5403\u996D\u4E2D", emoji: "\u{1F37D}\uFE0F" },
      { key: "sporting", label: "\u5728\u8FD0\u52A8", emoji: "\u{1F3C3}" },
      { key: "traveling", label: "\u65C5\u884C\u4E2D", emoji: "\u2708\uFE0F" },
      { key: "sleeping", label: "\u7761\u89C9\u4E2D", emoji: "\u{1F634}" },
      { key: "studying", label: "\u5B66\u4E60\u4E2D", emoji: "\u{1F4DA}" },
      { key: "shopping", label: "\u8D2D\u7269\u4E2D", emoji: "\u{1F6CD}\uFE0F" },
      { key: "loving", label: "\u604B\u7231\u4E2D", emoji: "\u{1F495}" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "relative",
        ref_key: "containerRef",
        ref: containerRef
      }, _attrs))} data-v-31530a85>`);
      if (__props.currentStatus) {
        _push(`<button class="flex items-center gap-1 py-1 px-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors text-sm" data-v-31530a85><span class="text-secondary-foreground" data-v-31530a85>${ssrInterpolate(__props.currentStatus)}</span>`);
        _push(ssrRenderComponent(unref(ChevronDown), { class: "w-4 h-4 text-secondary-foreground/70" }, null, _parent));
        _push(`</button>`);
      } else {
        _push(`<button class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary hover:bg-secondary/80 transition-colors text-sm text-secondary-foreground" data-v-31530a85><span data-v-31530a85>\u8BBE\u7F6E\u72B6\u6001</span></button>`);
      }
      if (showPicker.value) {
        _push(`<div class="absolute right-0 top-full mt-2 w-64 rounded-lg border bg-popover shadow-lg z-50 overflow-hidden" data-v-31530a85>`);
        if (!showCustomInput.value) {
          _push(`<div class="p-2" data-v-31530a85><div class="text-xs text-muted-foreground px-2 py-1 mb-1" data-v-31530a85>\u9009\u62E9\u4E00\u4E2A\u72B6\u6001</div><div class="grid grid-cols-2 gap-1" data-v-31530a85><!--[-->`);
          ssrRenderList(statusOptions, (status) => {
            _push(`<button class="${ssrRenderClass([{ "bg-accent": __props.currentStatus === status.label }, "flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-accent transition-colors"])}" data-v-31530a85><span class="text-2xl" data-v-31530a85>${ssrInterpolate(status.emoji)}</span><span class="text-sm text-foreground" data-v-31530a85>${ssrInterpolate(status.label)}</span></button>`);
          });
          _push(`<!--]--></div><button class="w-full mt-2 px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors border" data-v-31530a85><span class="flex items-center justify-center gap-1" data-v-31530a85><span data-v-31530a85>\u270F\uFE0F</span><span data-v-31530a85>\u81EA\u5B9A\u4E49\u72B6\u6001</span></span></button>`);
          if (__props.currentStatus) {
            _push(`<button class="w-full mt-2 px-3 py-2 text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors" data-v-31530a85> \u6E05\u9664\u72B6\u6001 </button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<div class="p-3" data-v-31530a85><div class="text-xs text-muted-foreground mb-2" data-v-31530a85>\u8F93\u5165\u81EA\u5B9A\u4E49\u72B6\u6001</div><input${ssrRenderAttr("value", customStatusText.value)} type="text" placeholder="\u8F93\u5165\u4F60\u7684\u72B6\u6001..." maxlength="20" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors" data-v-31530a85><div class="flex gap-2 mt-3" data-v-31530a85><button class="flex-1 px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors" data-v-31530a85> \u53D6\u6D88 </button><button class="flex-1 px-3 py-2 text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors" data-v-31530a85> \u786E\u5B9A </button></div></div>`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$t = _sfc_main$t.setup;
_sfc_main$t.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserStatusSelector.vue");
  return _sfc_setup$t ? _sfc_setup$t(props, ctx) : void 0;
};
const UserStatusSelector = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$t, [["__scopeId", "data-v-31530a85"]]), { __name: "UserStatusSelector" });
async function login(data) {
  const result = await apiFetch("/api/auth/login", {
    method: "POST",
    body: data
  });
  return result;
}
async function register(data) {
  const result = await apiFetch("/api/auth/register", {
    method: "POST",
    body: data
  });
  return result;
}
async function logout() {
  await apiFetch("/api/auth/logout", {
    method: "POST"
  });
}
async function updateStatus(status) {
  const result = await apiFetch("/api/auth/status", {
    method: "PATCH",
    body: { status }
  });
  return result;
}
function useNotifications(options) {
  const take = options?.take;
  const unreadOnly = options?.unreadOnly || false;
  const url = `/api/notifications?take=${take}&unreadOnly=${unreadOnly}`;
  return useApiFetch(url);
}
function useUnreadNotificationCount() {
  return useApiFetch("/api/notifications/unread-count", {
    // 仅在客户端执行，避免 SSR 时 401 错误
    server: false,
    // 静默处理 401 错误（未登录时正常）
    onResponseError({ response }) {
      if (response.status === 401) {
        return;
      }
    }
  });
}
async function markAllNotificationsAsRead() {
  return apiFetch("/api/notifications/read-all", {
    method: "PATCH"
  });
}
const _sfc_main$s = /* @__PURE__ */ defineComponent({
  __name: "DropdownMenu",
  __ssrInlineRender: true,
  props: {
    defaultOpen: { type: Boolean },
    open: { type: Boolean },
    dir: {},
    modal: { type: Boolean }
  },
  emits: ["update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const forwarded = useForwardPropsEmits(props, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DropdownMenuRoot), mergeProps({ "data-slot": "dropdown-menu" }, unref(forwarded), _attrs), {
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
const _sfc_setup$s = _sfc_main$s.setup;
_sfc_main$s.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/dropdown-menu/DropdownMenu.vue");
  return _sfc_setup$s ? _sfc_setup$s(props, ctx) : void 0;
};
const _sfc_main$r = /* @__PURE__ */ defineComponent({
  __name: "DropdownMenuCheckboxItem",
  __ssrInlineRender: true,
  props: {
    modelValue: { type: [Boolean, String] },
    disabled: { type: Boolean },
    textValue: {},
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  emits: ["select", "update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const delegatedProps = reactiveOmit(props, "class");
    const forwarded = useForwardPropsEmits(delegatedProps, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DropdownMenuCheckboxItem), mergeProps({ "data-slot": "dropdown-menu-checkbox-item" }, unref(forwarded), {
        class: unref(cn)(
          "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          props.class
        )
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(DropdownMenuItemIndicator), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  ssrRenderSlot(_ctx.$slots, "indicator-icon", {}, () => {
                    _push3(ssrRenderComponent(unref(Check), { class: "size-4" }, null, _parent3, _scopeId2));
                  }, _push3, _parent3, _scopeId2);
                } else {
                  return [
                    renderSlot(_ctx.$slots, "indicator-icon", {}, () => [
                      createVNode(unref(Check), { class: "size-4" })
                    ])
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
            _push2(`</span>`);
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              createVNode("span", { class: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center" }, [
                createVNode(unref(DropdownMenuItemIndicator), null, {
                  default: withCtx(() => [
                    renderSlot(_ctx.$slots, "indicator-icon", {}, () => [
                      createVNode(unref(Check), { class: "size-4" })
                    ])
                  ]),
                  _: 3
                })
              ]),
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$r = _sfc_main$r.setup;
_sfc_main$r.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/dropdown-menu/DropdownMenuCheckboxItem.vue");
  return _sfc_setup$r ? _sfc_setup$r(props, ctx) : void 0;
};
const _sfc_main$q = /* @__PURE__ */ defineComponent({
  ...{
    inheritAttrs: false
  },
  __name: "DropdownMenuContent",
  __ssrInlineRender: true,
  props: {
    forceMount: { type: Boolean },
    loop: { type: Boolean },
    side: {},
    sideOffset: { default: 4 },
    sideFlip: { type: Boolean },
    align: {},
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
    class: {}
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "closeAutoFocus"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const delegatedProps = reactiveOmit(props, "class");
    const forwarded = useForwardPropsEmits(delegatedProps, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DropdownMenuPortal), _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(DropdownMenuContent), mergeProps({ "data-slot": "dropdown-menu-content" }, { ..._ctx.$attrs, ...unref(forwarded) }, {
              class: unref(cn)("bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--reka-dropdown-menu-content-available-height) min-w-[8rem] origin-(--reka-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md", props.class)
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
              createVNode(unref(DropdownMenuContent), mergeProps({ "data-slot": "dropdown-menu-content" }, { ..._ctx.$attrs, ...unref(forwarded) }, {
                class: unref(cn)("bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--reka-dropdown-menu-content-available-height) min-w-[8rem] origin-(--reka-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md", props.class)
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
const _sfc_setup$q = _sfc_main$q.setup;
_sfc_main$q.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/dropdown-menu/DropdownMenuContent.vue");
  return _sfc_setup$q ? _sfc_setup$q(props, ctx) : void 0;
};
const _sfc_main$p = /* @__PURE__ */ defineComponent({
  __name: "DropdownMenuGroup",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DropdownMenuGroup), mergeProps({ "data-slot": "dropdown-menu-group" }, props, _attrs), {
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
const _sfc_setup$p = _sfc_main$p.setup;
_sfc_main$p.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/dropdown-menu/DropdownMenuGroup.vue");
  return _sfc_setup$p ? _sfc_setup$p(props, ctx) : void 0;
};
const _sfc_main$o = /* @__PURE__ */ defineComponent({
  __name: "DropdownMenuItem",
  __ssrInlineRender: true,
  props: {
    disabled: { type: Boolean },
    textValue: {},
    asChild: { type: Boolean },
    as: {},
    class: {},
    inset: { type: Boolean },
    variant: { default: "default" }
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = reactiveOmit(props, "inset", "variant", "class");
    const forwardedProps = useForwardProps(delegatedProps);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DropdownMenuItem), mergeProps({
        "data-slot": "dropdown-menu-item",
        "data-inset": __props.inset ? "" : void 0,
        "data-variant": __props.variant
      }, unref(forwardedProps), {
        class: unref(cn)("focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", props.class)
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
const _sfc_setup$o = _sfc_main$o.setup;
_sfc_main$o.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/dropdown-menu/DropdownMenuItem.vue");
  return _sfc_setup$o ? _sfc_setup$o(props, ctx) : void 0;
};
const _sfc_main$n = /* @__PURE__ */ defineComponent({
  __name: "DropdownMenuLabel",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: {},
    class: {},
    inset: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = reactiveOmit(props, "class", "inset");
    const forwardedProps = useForwardProps(delegatedProps);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DropdownMenuLabel), mergeProps({
        "data-slot": "dropdown-menu-label",
        "data-inset": __props.inset ? "" : void 0
      }, unref(forwardedProps), {
        class: unref(cn)("px-2 py-1.5 text-sm font-medium data-[inset]:pl-8", props.class)
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
const _sfc_setup$n = _sfc_main$n.setup;
_sfc_main$n.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/dropdown-menu/DropdownMenuLabel.vue");
  return _sfc_setup$n ? _sfc_setup$n(props, ctx) : void 0;
};
const _sfc_main$m = /* @__PURE__ */ defineComponent({
  __name: "DropdownMenuRadioGroup",
  __ssrInlineRender: true,
  props: {
    modelValue: {},
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const forwarded = useForwardPropsEmits(props, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DropdownMenuRadioGroup), mergeProps({ "data-slot": "dropdown-menu-radio-group" }, unref(forwarded), _attrs), {
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
const _sfc_setup$m = _sfc_main$m.setup;
_sfc_main$m.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/dropdown-menu/DropdownMenuRadioGroup.vue");
  return _sfc_setup$m ? _sfc_setup$m(props, ctx) : void 0;
};
const _sfc_main$l = /* @__PURE__ */ defineComponent({
  __name: "DropdownMenuRadioItem",
  __ssrInlineRender: true,
  props: {
    value: {},
    disabled: { type: Boolean },
    textValue: {},
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  emits: ["select"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const delegatedProps = reactiveOmit(props, "class");
    const forwarded = useForwardPropsEmits(delegatedProps, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DropdownMenuRadioItem), mergeProps({ "data-slot": "dropdown-menu-radio-item" }, unref(forwarded), {
        class: unref(cn)(
          "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          props.class
        )
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(DropdownMenuItemIndicator), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  ssrRenderSlot(_ctx.$slots, "indicator-icon", {}, () => {
                    _push3(ssrRenderComponent(unref(Circle), { class: "size-2 fill-current" }, null, _parent3, _scopeId2));
                  }, _push3, _parent3, _scopeId2);
                } else {
                  return [
                    renderSlot(_ctx.$slots, "indicator-icon", {}, () => [
                      createVNode(unref(Circle), { class: "size-2 fill-current" })
                    ])
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
            _push2(`</span>`);
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              createVNode("span", { class: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center" }, [
                createVNode(unref(DropdownMenuItemIndicator), null, {
                  default: withCtx(() => [
                    renderSlot(_ctx.$slots, "indicator-icon", {}, () => [
                      createVNode(unref(Circle), { class: "size-2 fill-current" })
                    ])
                  ]),
                  _: 3
                })
              ]),
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$l = _sfc_main$l.setup;
_sfc_main$l.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/dropdown-menu/DropdownMenuRadioItem.vue");
  return _sfc_setup$l ? _sfc_setup$l(props, ctx) : void 0;
};
const _sfc_main$k = /* @__PURE__ */ defineComponent({
  __name: "DropdownMenuSeparator",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = reactiveOmit(props, "class");
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DropdownMenuSeparator), mergeProps({ "data-slot": "dropdown-menu-separator" }, unref(delegatedProps), {
        class: unref(cn)("bg-border -mx-1 my-1 h-px", props.class)
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$k = _sfc_main$k.setup;
_sfc_main$k.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/dropdown-menu/DropdownMenuSeparator.vue");
  return _sfc_setup$k ? _sfc_setup$k(props, ctx) : void 0;
};
const _sfc_main$j = /* @__PURE__ */ defineComponent({
  __name: "DropdownMenuShortcut",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<span${ssrRenderAttrs(mergeProps({
        "data-slot": "dropdown-menu-shortcut",
        class: unref(cn)("text-muted-foreground ml-auto text-xs tracking-widest", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</span>`);
    };
  }
});
const _sfc_setup$j = _sfc_main$j.setup;
_sfc_main$j.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/dropdown-menu/DropdownMenuShortcut.vue");
  return _sfc_setup$j ? _sfc_setup$j(props, ctx) : void 0;
};
const _sfc_main$i = /* @__PURE__ */ defineComponent({
  __name: "DropdownMenuSub",
  __ssrInlineRender: true,
  props: {
    defaultOpen: { type: Boolean },
    open: { type: Boolean }
  },
  emits: ["update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const forwarded = useForwardPropsEmits(props, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DropdownMenuSub), mergeProps({ "data-slot": "dropdown-menu-sub" }, unref(forwarded), _attrs), {
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
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/dropdown-menu/DropdownMenuSub.vue");
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};
const _sfc_main$h = /* @__PURE__ */ defineComponent({
  __name: "DropdownMenuSubContent",
  __ssrInlineRender: true,
  props: {
    forceMount: { type: Boolean },
    loop: { type: Boolean },
    sideOffset: {},
    sideFlip: { type: Boolean },
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
    class: {}
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "entryFocus", "openAutoFocus", "closeAutoFocus"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const delegatedProps = reactiveOmit(props, "class");
    const forwarded = useForwardPropsEmits(delegatedProps, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DropdownMenuSubContent), mergeProps({ "data-slot": "dropdown-menu-sub-content" }, unref(forwarded), {
        class: unref(cn)("bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--reka-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg", props.class)
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
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/dropdown-menu/DropdownMenuSubContent.vue");
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};
const _sfc_main$g = /* @__PURE__ */ defineComponent({
  __name: "DropdownMenuSubTrigger",
  __ssrInlineRender: true,
  props: {
    disabled: { type: Boolean },
    textValue: {},
    asChild: { type: Boolean },
    as: {},
    class: {},
    inset: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = reactiveOmit(props, "class", "inset");
    const forwardedProps = useForwardProps(delegatedProps);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DropdownMenuSubTrigger), mergeProps({ "data-slot": "dropdown-menu-sub-trigger" }, unref(forwardedProps), {
        class: unref(cn)(
          "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8",
          props.class
        )
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
            _push2(ssrRenderComponent(unref(ChevronRight), { class: "ml-auto size-4" }, null, _parent2, _scopeId));
          } else {
            return [
              renderSlot(_ctx.$slots, "default"),
              createVNode(unref(ChevronRight), { class: "ml-auto size-4" })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/dropdown-menu/DropdownMenuSubTrigger.vue");
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};
const _sfc_main$f = /* @__PURE__ */ defineComponent({
  __name: "DropdownMenuTrigger",
  __ssrInlineRender: true,
  props: {
    disabled: { type: Boolean },
    asChild: { type: Boolean },
    as: {}
  },
  setup(__props) {
    const props = __props;
    const forwardedProps = useForwardProps(props);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DropdownMenuTrigger), mergeProps({ "data-slot": "dropdown-menu-trigger" }, unref(forwardedProps), _attrs), {
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/dropdown-menu/DropdownMenuTrigger.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
const _sfc_main$e = /* @__PURE__ */ defineComponent({
  __name: "Sheet",
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
      _push(ssrRenderComponent(unref(DialogRoot), mergeProps({ "data-slot": "sheet" }, unref(forwarded), _attrs), {
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
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/sheet/Sheet.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const _sfc_main$d = /* @__PURE__ */ defineComponent({
  __name: "SheetClose",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DialogClose), mergeProps({ "data-slot": "sheet-close" }, props, _attrs), {
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/sheet/SheetClose.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const _sfc_main$c = /* @__PURE__ */ defineComponent({
  __name: "SheetOverlay",
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
      _push(ssrRenderComponent(unref(DialogOverlay), mergeProps({
        "data-slot": "sheet-overlay",
        class: unref(cn)("data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80", props.class)
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
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/sheet/SheetOverlay.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const _sfc_main$b = /* @__PURE__ */ defineComponent({
  ...{
    inheritAttrs: false
  },
  __name: "SheetContent",
  __ssrInlineRender: true,
  props: {
    class: {},
    side: { default: "right" },
    forceMount: { type: Boolean },
    disableOutsidePointerEvents: { type: Boolean },
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "openAutoFocus", "closeAutoFocus"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const delegatedProps = reactiveOmit(props, "class", "side");
    const forwarded = useForwardPropsEmits(delegatedProps, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DialogPortal), _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$c, null, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(DialogContent), mergeProps({
              "data-slot": "sheet-content",
              class: unref(cn)(
                "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
                __props.side === "right" && "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
                __props.side === "left" && "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
                __props.side === "top" && "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
                __props.side === "bottom" && "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
                props.class
              )
            }, { ..._ctx.$attrs, ...unref(forwarded) }), {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push3, _parent3, _scopeId2);
                  _push3(ssrRenderComponent(unref(DialogClose), { class: "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(X), { class: "size-4" }, null, _parent4, _scopeId3));
                        _push4(`<span class="sr-only"${_scopeId3}>Close</span>`);
                      } else {
                        return [
                          createVNode(unref(X), { class: "size-4" }),
                          createVNode("span", { class: "sr-only" }, "Close")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    renderSlot(_ctx.$slots, "default"),
                    createVNode(unref(DialogClose), { class: "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none" }, {
                      default: withCtx(() => [
                        createVNode(unref(X), { class: "size-4" }),
                        createVNode("span", { class: "sr-only" }, "Close")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$c),
              createVNode(unref(DialogContent), mergeProps({
                "data-slot": "sheet-content",
                class: unref(cn)(
                  "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
                  __props.side === "right" && "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
                  __props.side === "left" && "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
                  __props.side === "top" && "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
                  __props.side === "bottom" && "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
                  props.class
                )
              }, { ..._ctx.$attrs, ...unref(forwarded) }), {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default"),
                  createVNode(unref(DialogClose), { class: "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none" }, {
                    default: withCtx(() => [
                      createVNode(unref(X), { class: "size-4" }),
                      createVNode("span", { class: "sr-only" }, "Close")
                    ]),
                    _: 1
                  })
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
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/sheet/SheetContent.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const _sfc_main$a = /* @__PURE__ */ defineComponent({
  __name: "SheetDescription",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = reactiveOmit(props, "class");
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DialogDescription), mergeProps({
        "data-slot": "sheet-description",
        class: unref(cn)("text-muted-foreground text-sm", props.class)
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
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/sheet/SheetDescription.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "SheetFooter",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        "data-slot": "sheet-footer",
        class: unref(cn)("mt-auto flex flex-col gap-2 p-4", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/sheet/SheetFooter.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "SheetHeader",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        "data-slot": "sheet-header",
        class: unref(cn)("flex flex-col gap-1.5 p-4", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/sheet/SheetHeader.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "SheetTitle",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = reactiveOmit(props, "class");
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DialogTitle), mergeProps({
        "data-slot": "sheet-title",
        class: unref(cn)("text-foreground font-semibold", props.class)
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
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/sheet/SheetTitle.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "SheetTrigger",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DialogTrigger), mergeProps({ "data-slot": "sheet-trigger" }, props, _attrs), {
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/sheet/SheetTrigger.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "Avatar",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(AvatarRoot), mergeProps({
        "data-slot": "avatar",
        class: unref(cn)("relative flex size-8 shrink-0 overflow-hidden rounded-full", props.class)
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
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/avatar/Avatar.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "AvatarFallback",
  __ssrInlineRender: true,
  props: {
    delayMs: {},
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = reactiveOmit(props, "class");
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(AvatarFallback), mergeProps({ "data-slot": "avatar-fallback" }, unref(delegatedProps), {
        class: unref(cn)("bg-muted flex size-full items-center justify-center rounded-full", props.class)
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
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/avatar/AvatarFallback.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "AvatarImage",
  __ssrInlineRender: true,
  props: {
    src: {},
    referrerPolicy: {},
    crossOrigin: {},
    asChild: { type: Boolean },
    as: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(AvatarImage), mergeProps({ "data-slot": "avatar-image" }, props, { class: "aspect-square size-full" }, _attrs), {
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/avatar/AvatarImage.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "Badge",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: {},
    variant: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = reactiveOmit(props, "class");
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Primitive), mergeProps({
        "data-slot": "badge",
        class: unref(cn)(unref(badgeVariants)({ variant: __props.variant }), props.class)
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
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/badge/Badge.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive: "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Separator",
  __ssrInlineRender: true,
  props: {
    orientation: { default: "horizontal" },
    decorative: { type: Boolean, default: true },
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = reactiveOmit(props, "class");
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Separator), mergeProps({ "data-slot": "separator" }, unref(delegatedProps), {
        class: unref(cn)(
          "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
          props.class
        )
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/separator/Separator.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DogHeader",
  __ssrInlineRender: true,
  setup(__props) {
    const isPushEnabled = ref(false);
    const pushLoading = ref(false);
    const authStore = useAuthStore();
    const me = computed(() => authStore.user);
    const { data: unreadCountData } = useUnreadNotificationCount();
    const unreadCount = computed(() => unreadCountData.value?.count || 0);
    const {
      isNewYear,
      toggleDecoration
    } = useThemeDecorations();
    const decorationIcon = computed(() => {
      if (isNewYear.value) return "\u{1F434}";
      return "\u2728";
    });
    const decorationLabel = computed(() => {
      if (isNewYear.value) return "\u9A6C\u5E74\u88C5\u9970\u5DF2\u5F00\u542F,\u70B9\u51FB\u5207\u6362";
      return "\u5F00\u542F\u8282\u65E5\u88C5\u9970";
    });
    watch(unreadCount, (count) => {
    }, { immediate: true });
    const route = useRoute();
    watch(() => route.fullPath, async (newPath, oldPath) => {
    }, { immediate: false });
    async function doLogout() {
      try {
        await logout();
        navigateTo("/user/login");
      } catch (error) {
        console.error("\u9000\u51FA\u767B\u5F55\u5931\u8D25:", error);
      }
    }
    async function updateStatusHandler(status) {
      try {
        await updateStatus(status);
      } catch (error) {
        console.error("\u66F4\u65B0\u72B6\u6001\u5931\u8D25:", error);
      }
    }
    function urlBase64ToUint8Array(base64String) {
      const padding = "=".repeat((4 - base64String.length % 4) % 4);
      const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
      const rawData = (void 0).atob(base64);
      const outputArray = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    }
    async function enableNotification() {
      if (!("Notification" in void 0)) {
        alert("\u60A8\u7684\u6D4F\u89C8\u5668\u4E0D\u652F\u6301\u901A\u77E5\u529F\u80FD");
        return;
      }
      pushLoading.value = true;
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          const { key } = await apiFetch("/api/notifications/vapid-public-key");
          if (!key) {
            throw new Error("\u65E0\u6CD5\u83B7\u53D6 VAPID \u516C\u94A5");
          }
          const registration = await (void 0).serviceWorker.ready;
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(key)
          });
          await apiFetch("/api/notifications/subscribe", {
            method: "POST",
            body: { subscription }
          });
          isPushEnabled.value = true;
          alert("\u901A\u77E5\u5DF2\u5F00\u542F\uFF01");
        } else {
          alert("\u60A8\u62D2\u7EDD\u4E86\u901A\u77E5\u6743\u9650\uFF0C\u65E0\u6CD5\u63A5\u6536\u6D88\u606F\u63D0\u9192");
        }
      } catch (e) {
        console.error("\u8BF7\u6C42\u901A\u77E5\u6743\u9650\u5931\u8D25:", e);
        alert("\u5F00\u542F\u901A\u77E5\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5");
      } finally {
        pushLoading.value = false;
      }
    }
    async function disableNotification() {
      pushLoading.value = true;
      try {
        const registration = await (void 0).serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          try {
            await apiFetch("/api/notifications/unsubscribe", {
              method: "POST",
              body: { endpoint: subscription.endpoint }
            });
          } catch (e) {
            console.warn("\u540E\u7AEF\u5220\u9664\u8BA2\u9605\u5931\u8D25\uFF0C\u7EE7\u7EED\u53D6\u6D88\u6D4F\u89C8\u5668\u8BA2\u9605", e);
          }
          await subscription.unsubscribe();
        }
        isPushEnabled.value = false;
        alert("\u901A\u77E5\u5DF2\u5173\u95ED");
      } catch (e) {
        console.error("\u5173\u95ED\u901A\u77E5\u5931\u8D25:", e);
        alert("\u5173\u95ED\u901A\u77E5\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5");
      } finally {
        pushLoading.value = false;
      }
    }
    async function testNotification() {
      if (!("Notification" in void 0)) return;
      if (Notification.permission === "granted") {
        try {
          await apiFetch("/api/test-push", { method: "POST" });
          alert("\u6D4B\u8BD5\u901A\u77E5\u5DF2\u53D1\u9001\uFF0C\u8BF7\u68C0\u67E5\u901A\u77E5\u680F");
        } catch (e) {
          console.error("\u53D1\u9001\u6D4B\u8BD5\u901A\u77E5\u5931\u8D25:", e);
          alert("\u53D1\u9001\u5931\u8D25");
        }
      } else {
        alert('\u8BF7\u5148\u70B9\u51FB"\u5F00\u542F\u901A\u77E5"');
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_DarkToggle = __nuxt_component_1;
      _push(`<!--[--><header class="fixed top-0 left-0 right-0 z-30 w-screen flex items-center justify-between px-4 md:px-8 lg:px-12 py-3 bg-background/95 backdrop-blur-md border-b border-border pt-[calc(0.75rem+env(safe-area-inset-top))]">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex items-center gap-2 md:gap-3 cursor-pointer hover:opacity-80 transition flex-shrink-0 min-w-0",
        "aria-label": "\u56DE\u5230\u9996\u9875"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", _imports_0)} alt="My Doggy Love Logo" class="w-6 h-6 flex-shrink-0"${_scopeId}><span class="font-semibold text-sm md:text-base truncate"${_scopeId}>My Doggy Love</span>`);
          } else {
            return [
              createVNode("img", {
                src: _imports_0,
                alt: "My Doggy Love Logo",
                class: "w-6 h-6 flex-shrink-0"
              }),
              createVNode("span", { class: "font-semibold text-sm md:text-base truncate" }, "My Doggy Love")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<nav class="hidden md:flex items-center gap-6 lg:gap-8 text-sm" role="navigation" aria-label="\u4E3B\u5BFC\u822A">`);
      _push(ssrRenderComponent(unref(_sfc_main$v), {
        variant: "link",
        "as-child": "",
        class: "text-foreground hover:no-underline px-0"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_NuxtLink, { to: "/" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`\u9996\u9875`);
                } else {
                  return [
                    createTextVNode("\u9996\u9875")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_NuxtLink, { to: "/" }, {
                default: withCtx(() => [
                  createTextVNode("\u9996\u9875")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$v), {
        variant: "link",
        "as-child": "",
        class: "text-foreground hover:no-underline px-0"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_NuxtLink, { to: "/daily" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`\u65E5\u5E38`);
                } else {
                  return [
                    createTextVNode("\u65E5\u5E38")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_NuxtLink, { to: "/daily" }, {
                default: withCtx(() => [
                  createTextVNode("\u65E5\u5E38")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$v), {
        variant: "link",
        "as-child": "",
        class: "text-foreground hover:no-underline px-0"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_NuxtLink, { to: "/anniversaries" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`\u7EAA\u5FF5\u65E5`);
                } else {
                  return [
                    createTextVNode("\u7EAA\u5FF5\u65E5")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_NuxtLink, { to: "/anniversaries" }, {
                default: withCtx(() => [
                  createTextVNode("\u7EAA\u5FF5\u65E5")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$v), {
        variant: "link",
        "as-child": "",
        class: "text-foreground hover:no-underline px-0"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_NuxtLink, { to: "/wishes" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`\u613F\u671B\u6E05\u5355`);
                } else {
                  return [
                    createTextVNode("\u613F\u671B\u6E05\u5355")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_NuxtLink, { to: "/wishes" }, {
                default: withCtx(() => [
                  createTextVNode("\u613F\u671B\u6E05\u5355")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$v), {
        variant: "link",
        "as-child": "",
        class: "text-foreground hover:no-underline px-0"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_NuxtLink, { to: "/messages" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`\u7559\u8A00\u677F`);
                } else {
                  return [
                    createTextVNode("\u7559\u8A00\u677F")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_NuxtLink, { to: "/messages" }, {
                default: withCtx(() => [
                  createTextVNode("\u7559\u8A00\u677F")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</nav><div class="flex items-center gap-1.5 md:gap-2 relative flex-shrink-0">`);
      _push(ssrRenderComponent(_component_DarkToggle, null, null, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$v), {
        variant: "ghost",
        size: "icon",
        class: "relative w-8 h-8 hover:bg-muted/50",
        onClick: unref(toggleDecoration),
        "aria-label": decorationLabel.value,
        title: "\u5207\u6362\u8282\u65E5\u88C5\u9970"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="text-xl"${_scopeId}>${ssrInterpolate(decorationIcon.value)}</span>`);
          } else {
            return [
              createVNode("span", { class: "text-xl" }, toDisplayString(decorationIcon.value), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      if (me.value) {
        _push(`<!--[--><div class="md:block hidden">`);
        _push(ssrRenderComponent(UserStatusSelector, {
          "current-status": me.value?.status,
          onUpdate: updateStatusHandler
        }, null, _parent));
        _push(`</div>`);
        _push(ssrRenderComponent(unref(_sfc_main$v), {
          variant: "ghost",
          size: "icon",
          "as-child": "",
          class: "relative w-8 h-8 hover:bg-muted/50 group",
          "aria-label": unreadCount.value > 0 ? `\u6709 ${unreadCount.value} \u6761\u672A\u8BFB\u901A\u77E5` : "\u67E5\u770B\u901A\u77E5"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_NuxtLink, { to: "/notifications" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(Bell), {
                      class: "w-6 h-6 text-muted-foreground hover:text-foreground transition-colors",
                      "aria-hidden": "true"
                    }, null, _parent3, _scopeId2));
                    if (unreadCount.value > 0) {
                      _push3(ssrRenderComponent(unref(_sfc_main$2), {
                        variant: "destructive",
                        "aria-label": `${unreadCount.value} \u6761\u672A\u8BFB\u901A\u77E5`,
                        class: "absolute -top-1 -right-1 px-1.5 py-0.5 h-5 min-w-[18px] flex items-center justify-center text-[10px] font-semibold shadow-md border-2 border-white dark:border-slate-900 bg-red-600 dark:bg-red-600 text-white animate-in zoom-in-50 duration-200 group-hover:scale-110 transition-transform"
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`${ssrInterpolate(unreadCount.value > 99 ? "99+" : unreadCount.value)}`);
                          } else {
                            return [
                              createTextVNode(toDisplayString(unreadCount.value > 99 ? "99+" : unreadCount.value), 1)
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
                      createVNode(unref(Bell), {
                        class: "w-6 h-6 text-muted-foreground hover:text-foreground transition-colors",
                        "aria-hidden": "true"
                      }),
                      unreadCount.value > 0 ? (openBlock(), createBlock(unref(_sfc_main$2), {
                        key: 0,
                        variant: "destructive",
                        "aria-label": `${unreadCount.value} \u6761\u672A\u8BFB\u901A\u77E5`,
                        class: "absolute -top-1 -right-1 px-1.5 py-0.5 h-5 min-w-[18px] flex items-center justify-center text-[10px] font-semibold shadow-md border-2 border-white dark:border-slate-900 bg-red-600 dark:bg-red-600 text-white animate-in zoom-in-50 duration-200 group-hover:scale-110 transition-transform"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(unreadCount.value > 99 ? "99+" : unreadCount.value), 1)
                        ]),
                        _: 1
                      }, 8, ["aria-label"])) : createCommentVNode("", true)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_NuxtLink, { to: "/notifications" }, {
                  default: withCtx(() => [
                    createVNode(unref(Bell), {
                      class: "w-6 h-6 text-muted-foreground hover:text-foreground transition-colors",
                      "aria-hidden": "true"
                    }),
                    unreadCount.value > 0 ? (openBlock(), createBlock(unref(_sfc_main$2), {
                      key: 0,
                      variant: "destructive",
                      "aria-label": `${unreadCount.value} \u6761\u672A\u8BFB\u901A\u77E5`,
                      class: "absolute -top-1 -right-1 px-1.5 py-0.5 h-5 min-w-[18px] flex items-center justify-center text-[10px] font-semibold shadow-md border-2 border-white dark:border-slate-900 bg-red-600 dark:bg-red-600 text-white animate-in zoom-in-50 duration-200 group-hover:scale-110 transition-transform"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(unreadCount.value > 99 ? "99+" : unreadCount.value), 1)
                      ]),
                      _: 1
                    }, 8, ["aria-label"])) : createCommentVNode("", true)
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(_sfc_main$s), null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(_sfc_main$f), { "as-child": "" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(_sfc_main$v), {
                      variant: "ghost",
                      class: "flex items-center gap-2 px-1 hover:bg-transparent",
                      "aria-label": "\u7528\u6237\u83DC\u5355"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(_sfc_main$5), { class: "w-8 h-8" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(unref(_sfc_main$3), {
                                  src: me.value.avatarUrl || "/assets/images/xiaobai/xiaobai-2.png"
                                }, null, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(unref(_sfc_main$4), null, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`${ssrInterpolate(me.value.nickName?.slice(0, 2) || "\u7528\u6237")}`);
                                    } else {
                                      return [
                                        createTextVNode(toDisplayString(me.value.nickName?.slice(0, 2) || "\u7528\u6237"), 1)
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(unref(_sfc_main$3), {
                                    src: me.value.avatarUrl || "/assets/images/xiaobai/xiaobai-2.png"
                                  }, null, 8, ["src"]),
                                  createVNode(unref(_sfc_main$4), null, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(me.value.nickName?.slice(0, 2) || "\u7528\u6237"), 1)
                                    ]),
                                    _: 1
                                  })
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(`<span class="hidden md:inline text-sm font-normal"${_scopeId3}>${ssrInterpolate(me.value.nickName)}</span>`);
                        } else {
                          return [
                            createVNode(unref(_sfc_main$5), { class: "w-8 h-8" }, {
                              default: withCtx(() => [
                                createVNode(unref(_sfc_main$3), {
                                  src: me.value.avatarUrl || "/assets/images/xiaobai/xiaobai-2.png"
                                }, null, 8, ["src"]),
                                createVNode(unref(_sfc_main$4), null, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(me.value.nickName?.slice(0, 2) || "\u7528\u6237"), 1)
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode("span", { class: "hidden md:inline text-sm font-normal" }, toDisplayString(me.value.nickName), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(_sfc_main$v), {
                        variant: "ghost",
                        class: "flex items-center gap-2 px-1 hover:bg-transparent",
                        "aria-label": "\u7528\u6237\u83DC\u5355"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$5), { class: "w-8 h-8" }, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$3), {
                                src: me.value.avatarUrl || "/assets/images/xiaobai/xiaobai-2.png"
                              }, null, 8, ["src"]),
                              createVNode(unref(_sfc_main$4), null, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(me.value.nickName?.slice(0, 2) || "\u7528\u6237"), 1)
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode("span", { class: "hidden md:inline text-sm font-normal" }, toDisplayString(me.value.nickName), 1)
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(_sfc_main$q), {
                align: "end",
                class: "w-48"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(_sfc_main$n), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`\u6211\u7684\u8D26\u6237`);
                        } else {
                          return [
                            createTextVNode("\u6211\u7684\u8D26\u6237")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(_sfc_main$k), null, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(_sfc_main$o), { "as-child": "" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_NuxtLink, {
                            to: "/user/profile",
                            class: "w-full cursor-pointer"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`\u7528\u6237\u8D44\u6599`);
                              } else {
                                return [
                                  createTextVNode("\u7528\u6237\u8D44\u6599")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_NuxtLink, {
                              to: "/user/profile",
                              class: "w-full cursor-pointer"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("\u7528\u6237\u8D44\u6599")
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(_sfc_main$o), { "as-child": "" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_NuxtLink, {
                            to: "/user/couple",
                            class: "w-full cursor-pointer"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`\u60C5\u4FA3\u7ED1\u5B9A`);
                              } else {
                                return [
                                  createTextVNode("\u60C5\u4FA3\u7ED1\u5B9A")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_NuxtLink, {
                              to: "/user/couple",
                              class: "w-full cursor-pointer"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("\u60C5\u4FA3\u7ED1\u5B9A")
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(_sfc_main$o), {
                      onClick: ($event) => isPushEnabled.value ? disableNotification() : enableNotification(),
                      disabled: pushLoading.value,
                      "aria-label": isPushEnabled.value ? "\u5173\u95ED\u63A8\u9001\u901A\u77E5" : "\u5F00\u542F\u63A8\u9001\u901A\u77E5"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<div class="flex items-center justify-between w-full"${_scopeId3}><span${_scopeId3}>${ssrInterpolate(isPushEnabled.value ? "\u5173\u95ED\u901A\u77E5" : "\u5F00\u542F\u901A\u77E5")}</span>`);
                          if (pushLoading.value) {
                            _push4(`<span class="text-xs text-muted-foreground" aria-hidden="true"${_scopeId3}>...</span>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`</div>`);
                        } else {
                          return [
                            createVNode("div", { class: "flex items-center justify-between w-full" }, [
                              createVNode("span", null, toDisplayString(isPushEnabled.value ? "\u5173\u95ED\u901A\u77E5" : "\u5F00\u542F\u901A\u77E5"), 1),
                              pushLoading.value ? (openBlock(), createBlock("span", {
                                key: 0,
                                class: "text-xs text-muted-foreground",
                                "aria-hidden": "true"
                              }, "...")) : createCommentVNode("", true)
                            ])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    if (isPushEnabled.value) {
                      _push3(ssrRenderComponent(unref(_sfc_main$o), { onClick: testNotification }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(` \u6D4B\u8BD5\u901A\u77E5 `);
                          } else {
                            return [
                              createTextVNode(" \u6D4B\u8BD5\u901A\u77E5 ")
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(ssrRenderComponent(unref(_sfc_main$k), null, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(_sfc_main$o), {
                      onClick: doLogout,
                      class: "text-destructive focus:text-destructive"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(` \u9000\u51FA\u767B\u5F55 `);
                        } else {
                          return [
                            createTextVNode(" \u9000\u51FA\u767B\u5F55 ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(_sfc_main$n), null, {
                        default: withCtx(() => [
                          createTextVNode("\u6211\u7684\u8D26\u6237")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$k)),
                      createVNode(unref(_sfc_main$o), { "as-child": "" }, {
                        default: withCtx(() => [
                          createVNode(_component_NuxtLink, {
                            to: "/user/profile",
                            class: "w-full cursor-pointer"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("\u7528\u6237\u8D44\u6599")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$o), { "as-child": "" }, {
                        default: withCtx(() => [
                          createVNode(_component_NuxtLink, {
                            to: "/user/couple",
                            class: "w-full cursor-pointer"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("\u60C5\u4FA3\u7ED1\u5B9A")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$o), {
                        onClick: ($event) => isPushEnabled.value ? disableNotification() : enableNotification(),
                        disabled: pushLoading.value,
                        "aria-label": isPushEnabled.value ? "\u5173\u95ED\u63A8\u9001\u901A\u77E5" : "\u5F00\u542F\u63A8\u9001\u901A\u77E5"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "flex items-center justify-between w-full" }, [
                            createVNode("span", null, toDisplayString(isPushEnabled.value ? "\u5173\u95ED\u901A\u77E5" : "\u5F00\u542F\u901A\u77E5"), 1),
                            pushLoading.value ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "text-xs text-muted-foreground",
                              "aria-hidden": "true"
                            }, "...")) : createCommentVNode("", true)
                          ])
                        ]),
                        _: 1
                      }, 8, ["onClick", "disabled", "aria-label"]),
                      isPushEnabled.value ? (openBlock(), createBlock(unref(_sfc_main$o), {
                        key: 0,
                        onClick: testNotification
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" \u6D4B\u8BD5\u901A\u77E5 ")
                        ]),
                        _: 1
                      })) : createCommentVNode("", true),
                      createVNode(unref(_sfc_main$k)),
                      createVNode(unref(_sfc_main$o), {
                        onClick: doLogout,
                        class: "text-destructive focus:text-destructive"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" \u9000\u51FA\u767B\u5F55 ")
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(_sfc_main$f), { "as-child": "" }, {
                  default: withCtx(() => [
                    createVNode(unref(_sfc_main$v), {
                      variant: "ghost",
                      class: "flex items-center gap-2 px-1 hover:bg-transparent",
                      "aria-label": "\u7528\u6237\u83DC\u5355"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$5), { class: "w-8 h-8" }, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$3), {
                              src: me.value.avatarUrl || "/assets/images/xiaobai/xiaobai-2.png"
                            }, null, 8, ["src"]),
                            createVNode(unref(_sfc_main$4), null, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(me.value.nickName?.slice(0, 2) || "\u7528\u6237"), 1)
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode("span", { class: "hidden md:inline text-sm font-normal" }, toDisplayString(me.value.nickName), 1)
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                createVNode(unref(_sfc_main$q), {
                  align: "end",
                  class: "w-48"
                }, {
                  default: withCtx(() => [
                    createVNode(unref(_sfc_main$n), null, {
                      default: withCtx(() => [
                        createTextVNode("\u6211\u7684\u8D26\u6237")
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$k)),
                    createVNode(unref(_sfc_main$o), { "as-child": "" }, {
                      default: withCtx(() => [
                        createVNode(_component_NuxtLink, {
                          to: "/user/profile",
                          class: "w-full cursor-pointer"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("\u7528\u6237\u8D44\u6599")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$o), { "as-child": "" }, {
                      default: withCtx(() => [
                        createVNode(_component_NuxtLink, {
                          to: "/user/couple",
                          class: "w-full cursor-pointer"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("\u60C5\u4FA3\u7ED1\u5B9A")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$o), {
                      onClick: ($event) => isPushEnabled.value ? disableNotification() : enableNotification(),
                      disabled: pushLoading.value,
                      "aria-label": isPushEnabled.value ? "\u5173\u95ED\u63A8\u9001\u901A\u77E5" : "\u5F00\u542F\u63A8\u9001\u901A\u77E5"
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "flex items-center justify-between w-full" }, [
                          createVNode("span", null, toDisplayString(isPushEnabled.value ? "\u5173\u95ED\u901A\u77E5" : "\u5F00\u542F\u901A\u77E5"), 1),
                          pushLoading.value ? (openBlock(), createBlock("span", {
                            key: 0,
                            class: "text-xs text-muted-foreground",
                            "aria-hidden": "true"
                          }, "...")) : createCommentVNode("", true)
                        ])
                      ]),
                      _: 1
                    }, 8, ["onClick", "disabled", "aria-label"]),
                    isPushEnabled.value ? (openBlock(), createBlock(unref(_sfc_main$o), {
                      key: 0,
                      onClick: testNotification
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" \u6D4B\u8BD5\u901A\u77E5 ")
                      ]),
                      _: 1
                    })) : createCommentVNode("", true),
                    createVNode(unref(_sfc_main$k)),
                    createVNode(unref(_sfc_main$o), {
                      onClick: doLogout,
                      class: "text-destructive focus:text-destructive"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" \u9000\u51FA\u767B\u5F55 ")
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
        }, _parent));
        _push(`<!--]-->`);
      } else {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(unref(_sfc_main$v), {
          variant: "ghost",
          "as-child": ""
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_NuxtLink, { to: "/user/login" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`\u767B\u5F55`);
                  } else {
                    return [
                      createTextVNode("\u767B\u5F55")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_NuxtLink, { to: "/user/login" }, {
                  default: withCtx(() => [
                    createTextVNode("\u767B\u5F55")
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(_sfc_main$v), { "as-child": "" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_NuxtLink, { to: "/user/register" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`\u6CE8\u518C`);
                  } else {
                    return [
                      createTextVNode("\u6CE8\u518C")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_NuxtLink, { to: "/user/register" }, {
                  default: withCtx(() => [
                    createTextVNode("\u6CE8\u518C")
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<!--]-->`);
      }
      if (me.value) {
        _push(ssrRenderComponent(unref(_sfc_main$e), null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(_sfc_main$6), { "as-child": "" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(_sfc_main$v), {
                      variant: "ghost",
                      size: "icon",
                      class: "md:hidden",
                      "aria-label": "\u6253\u5F00\u83DC\u5355"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId3}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"${_scopeId3}></path></svg>`);
                        } else {
                          return [
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
                                d: "M4 6h16M4 12h16m-7 6h7"
                              })
                            ]))
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(_sfc_main$v), {
                        variant: "ghost",
                        size: "icon",
                        class: "md:hidden",
                        "aria-label": "\u6253\u5F00\u83DC\u5355"
                      }, {
                        default: withCtx(() => [
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
                              d: "M4 6h16M4 12h16m-7 6h7"
                            })
                          ]))
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(_sfc_main$b), {
                side: "right",
                class: "w-[250px] sm:w-[300px]"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(_sfc_main$8), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(_sfc_main$7), null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`\u5BFC\u822A`);
                              } else {
                                return [
                                  createTextVNode("\u5BFC\u822A")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(unref(_sfc_main$a), null, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(_sfc_main$7), null, {
                              default: withCtx(() => [
                                createTextVNode("\u5BFC\u822A")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$a))
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`<div class="flex flex-col gap-4 mt-6"${_scopeId2}><div class="flex items-center gap-3"${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(_sfc_main$5), { class: "w-10 h-10" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(_sfc_main$3), {
                            src: me.value?.avatarUrl || "/assets/images/xiaobai/xiaobai-2.png"
                          }, null, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(unref(_sfc_main$4), null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(me.value?.nickName?.slice(0, 2) || "\u7528\u6237")}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(me.value?.nickName?.slice(0, 2) || "\u7528\u6237"), 1)
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(_sfc_main$3), {
                              src: me.value?.avatarUrl || "/assets/images/xiaobai/xiaobai-2.png"
                            }, null, 8, ["src"]),
                            createVNode(unref(_sfc_main$4), null, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(me.value?.nickName?.slice(0, 2) || "\u7528\u6237"), 1)
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`<div class="flex flex-col"${_scopeId2}><span class="font-medium"${_scopeId2}>${ssrInterpolate(me.value?.nickName)}</span>`);
                    _push3(ssrRenderComponent(UserStatusSelector, {
                      "current-status": me.value?.status,
                      onUpdate: updateStatusHandler,
                      size: "sm"
                    }, null, _parent3, _scopeId2));
                    _push3(`</div></div><div class="flex items-center justify-between px-2 py-2"${_scopeId2}><span class="text-sm"${_scopeId2}>\u5916\u89C2\u6A21\u5F0F</span>`);
                    _push3(ssrRenderComponent(_component_DarkToggle, null, null, _parent3, _scopeId2));
                    _push3(`</div>`);
                    _push3(ssrRenderComponent(unref(_sfc_main$1), null, null, _parent3, _scopeId2));
                    _push3(`<nav class="flex flex-col gap-2" role="navigation" aria-label="\u79FB\u52A8\u7AEF\u5BFC\u822A"${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(_sfc_main$d), { "as-child": "" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_NuxtLink, {
                            to: "/",
                            class: "px-2 py-2 hover:bg-muted rounded-md transition-colors"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`\u9996\u9875`);
                              } else {
                                return [
                                  createTextVNode("\u9996\u9875")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_NuxtLink, {
                              to: "/",
                              class: "px-2 py-2 hover:bg-muted rounded-md transition-colors"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("\u9996\u9875")
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(_sfc_main$d), { "as-child": "" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_NuxtLink, {
                            to: "/daily",
                            class: "px-2 py-2 hover:bg-muted rounded-md transition-colors"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`\u65E5\u5E38`);
                              } else {
                                return [
                                  createTextVNode("\u65E5\u5E38")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_NuxtLink, {
                              to: "/daily",
                              class: "px-2 py-2 hover:bg-muted rounded-md transition-colors"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("\u65E5\u5E38")
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(_sfc_main$d), { "as-child": "" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_NuxtLink, {
                            to: "/anniversaries",
                            class: "px-2 py-2 hover:bg-muted rounded-md transition-colors"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`\u7EAA\u5FF5\u65E5`);
                              } else {
                                return [
                                  createTextVNode("\u7EAA\u5FF5\u65E5")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_NuxtLink, {
                              to: "/anniversaries",
                              class: "px-2 py-2 hover:bg-muted rounded-md transition-colors"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("\u7EAA\u5FF5\u65E5")
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(_sfc_main$d), { "as-child": "" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_NuxtLink, {
                            to: "/wishes",
                            class: "px-2 py-2 hover:bg-muted rounded-md transition-colors"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`\u613F\u671B\u6E05\u5355`);
                              } else {
                                return [
                                  createTextVNode("\u613F\u671B\u6E05\u5355")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_NuxtLink, {
                              to: "/wishes",
                              class: "px-2 py-2 hover:bg-muted rounded-md transition-colors"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("\u613F\u671B\u6E05\u5355")
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(_sfc_main$d), { "as-child": "" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_NuxtLink, {
                            to: "/messages",
                            class: "px-2 py-2 hover:bg-muted rounded-md transition-colors"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`\u7559\u8A00\u677F`);
                              } else {
                                return [
                                  createTextVNode("\u7559\u8A00\u677F")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_NuxtLink, {
                              to: "/messages",
                              class: "px-2 py-2 hover:bg-muted rounded-md transition-colors"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("\u7559\u8A00\u677F")
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</nav>`);
                    _push3(ssrRenderComponent(unref(_sfc_main$1), null, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(_sfc_main$d), { "as-child": "" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_NuxtLink, {
                            to: "/user/profile",
                            class: "px-2 py-2 hover:bg-muted rounded-md transition-colors"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`\u7528\u6237\u8D44\u6599`);
                              } else {
                                return [
                                  createTextVNode("\u7528\u6237\u8D44\u6599")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_NuxtLink, {
                              to: "/user/profile",
                              class: "px-2 py-2 hover:bg-muted rounded-md transition-colors"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("\u7528\u6237\u8D44\u6599")
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(_sfc_main$d), { "as-child": "" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(_sfc_main$v), {
                            variant: "ghost",
                            class: "w-full justify-start px-2 py-2 text-destructive hover:text-destructive hover:bg-destructive/10",
                            onClick: doLogout
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`\u9000\u51FA\u767B\u5F55`);
                              } else {
                                return [
                                  createTextVNode("\u9000\u51FA\u767B\u5F55")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(_sfc_main$v), {
                              variant: "ghost",
                              class: "w-full justify-start px-2 py-2 text-destructive hover:text-destructive hover:bg-destructive/10",
                              onClick: doLogout
                            }, {
                              default: withCtx(() => [
                                createTextVNode("\u9000\u51FA\u767B\u5F55")
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
                      createVNode(unref(_sfc_main$8), null, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$7), null, {
                            default: withCtx(() => [
                              createTextVNode("\u5BFC\u822A")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$a))
                        ]),
                        _: 1
                      }),
                      createVNode("div", { class: "flex flex-col gap-4 mt-6" }, [
                        createVNode("div", { class: "flex items-center gap-3" }, [
                          createVNode(unref(_sfc_main$5), { class: "w-10 h-10" }, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$3), {
                                src: me.value?.avatarUrl || "/assets/images/xiaobai/xiaobai-2.png"
                              }, null, 8, ["src"]),
                              createVNode(unref(_sfc_main$4), null, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(me.value?.nickName?.slice(0, 2) || "\u7528\u6237"), 1)
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode("div", { class: "flex flex-col" }, [
                            createVNode("span", { class: "font-medium" }, toDisplayString(me.value?.nickName), 1),
                            createVNode(UserStatusSelector, {
                              "current-status": me.value?.status,
                              onUpdate: updateStatusHandler,
                              size: "sm"
                            }, null, 8, ["current-status"])
                          ])
                        ]),
                        createVNode("div", { class: "flex items-center justify-between px-2 py-2" }, [
                          createVNode("span", { class: "text-sm" }, "\u5916\u89C2\u6A21\u5F0F"),
                          createVNode(_component_DarkToggle)
                        ]),
                        createVNode(unref(_sfc_main$1)),
                        createVNode("nav", {
                          class: "flex flex-col gap-2",
                          role: "navigation",
                          "aria-label": "\u79FB\u52A8\u7AEF\u5BFC\u822A"
                        }, [
                          createVNode(unref(_sfc_main$d), { "as-child": "" }, {
                            default: withCtx(() => [
                              createVNode(_component_NuxtLink, {
                                to: "/",
                                class: "px-2 py-2 hover:bg-muted rounded-md transition-colors"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("\u9996\u9875")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$d), { "as-child": "" }, {
                            default: withCtx(() => [
                              createVNode(_component_NuxtLink, {
                                to: "/daily",
                                class: "px-2 py-2 hover:bg-muted rounded-md transition-colors"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("\u65E5\u5E38")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$d), { "as-child": "" }, {
                            default: withCtx(() => [
                              createVNode(_component_NuxtLink, {
                                to: "/anniversaries",
                                class: "px-2 py-2 hover:bg-muted rounded-md transition-colors"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("\u7EAA\u5FF5\u65E5")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$d), { "as-child": "" }, {
                            default: withCtx(() => [
                              createVNode(_component_NuxtLink, {
                                to: "/wishes",
                                class: "px-2 py-2 hover:bg-muted rounded-md transition-colors"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("\u613F\u671B\u6E05\u5355")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$d), { "as-child": "" }, {
                            default: withCtx(() => [
                              createVNode(_component_NuxtLink, {
                                to: "/messages",
                                class: "px-2 py-2 hover:bg-muted rounded-md transition-colors"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("\u7559\u8A00\u677F")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ]),
                        createVNode(unref(_sfc_main$1)),
                        createVNode(unref(_sfc_main$d), { "as-child": "" }, {
                          default: withCtx(() => [
                            createVNode(_component_NuxtLink, {
                              to: "/user/profile",
                              class: "px-2 py-2 hover:bg-muted rounded-md transition-colors"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("\u7528\u6237\u8D44\u6599")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$d), { "as-child": "" }, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$v), {
                              variant: "ghost",
                              class: "w-full justify-start px-2 py-2 text-destructive hover:text-destructive hover:bg-destructive/10",
                              onClick: doLogout
                            }, {
                              default: withCtx(() => [
                                createTextVNode("\u9000\u51FA\u767B\u5F55")
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
                createVNode(unref(_sfc_main$6), { "as-child": "" }, {
                  default: withCtx(() => [
                    createVNode(unref(_sfc_main$v), {
                      variant: "ghost",
                      size: "icon",
                      class: "md:hidden",
                      "aria-label": "\u6253\u5F00\u83DC\u5355"
                    }, {
                      default: withCtx(() => [
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
                            d: "M4 6h16M4 12h16m-7 6h7"
                          })
                        ]))
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                createVNode(unref(_sfc_main$b), {
                  side: "right",
                  class: "w-[250px] sm:w-[300px]"
                }, {
                  default: withCtx(() => [
                    createVNode(unref(_sfc_main$8), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$7), null, {
                          default: withCtx(() => [
                            createTextVNode("\u5BFC\u822A")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$a))
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "flex flex-col gap-4 mt-6" }, [
                      createVNode("div", { class: "flex items-center gap-3" }, [
                        createVNode(unref(_sfc_main$5), { class: "w-10 h-10" }, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$3), {
                              src: me.value?.avatarUrl || "/assets/images/xiaobai/xiaobai-2.png"
                            }, null, 8, ["src"]),
                            createVNode(unref(_sfc_main$4), null, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(me.value?.nickName?.slice(0, 2) || "\u7528\u6237"), 1)
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode("div", { class: "flex flex-col" }, [
                          createVNode("span", { class: "font-medium" }, toDisplayString(me.value?.nickName), 1),
                          createVNode(UserStatusSelector, {
                            "current-status": me.value?.status,
                            onUpdate: updateStatusHandler,
                            size: "sm"
                          }, null, 8, ["current-status"])
                        ])
                      ]),
                      createVNode("div", { class: "flex items-center justify-between px-2 py-2" }, [
                        createVNode("span", { class: "text-sm" }, "\u5916\u89C2\u6A21\u5F0F"),
                        createVNode(_component_DarkToggle)
                      ]),
                      createVNode(unref(_sfc_main$1)),
                      createVNode("nav", {
                        class: "flex flex-col gap-2",
                        role: "navigation",
                        "aria-label": "\u79FB\u52A8\u7AEF\u5BFC\u822A"
                      }, [
                        createVNode(unref(_sfc_main$d), { "as-child": "" }, {
                          default: withCtx(() => [
                            createVNode(_component_NuxtLink, {
                              to: "/",
                              class: "px-2 py-2 hover:bg-muted rounded-md transition-colors"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("\u9996\u9875")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$d), { "as-child": "" }, {
                          default: withCtx(() => [
                            createVNode(_component_NuxtLink, {
                              to: "/daily",
                              class: "px-2 py-2 hover:bg-muted rounded-md transition-colors"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("\u65E5\u5E38")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$d), { "as-child": "" }, {
                          default: withCtx(() => [
                            createVNode(_component_NuxtLink, {
                              to: "/anniversaries",
                              class: "px-2 py-2 hover:bg-muted rounded-md transition-colors"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("\u7EAA\u5FF5\u65E5")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$d), { "as-child": "" }, {
                          default: withCtx(() => [
                            createVNode(_component_NuxtLink, {
                              to: "/wishes",
                              class: "px-2 py-2 hover:bg-muted rounded-md transition-colors"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("\u613F\u671B\u6E05\u5355")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$d), { "as-child": "" }, {
                          default: withCtx(() => [
                            createVNode(_component_NuxtLink, {
                              to: "/messages",
                              class: "px-2 py-2 hover:bg-muted rounded-md transition-colors"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("\u7559\u8A00\u677F")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode(unref(_sfc_main$1)),
                      createVNode(unref(_sfc_main$d), { "as-child": "" }, {
                        default: withCtx(() => [
                          createVNode(_component_NuxtLink, {
                            to: "/user/profile",
                            class: "px-2 py-2 hover:bg-muted rounded-md transition-colors"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("\u7528\u6237\u8D44\u6599")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$d), { "as-child": "" }, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$v), {
                            variant: "ghost",
                            class: "w-full justify-start px-2 py-2 text-destructive hover:text-destructive hover:bg-destructive/10",
                            onClick: doLogout
                          }, {
                            default: withCtx(() => [
                              createTextVNode("\u9000\u51FA\u767B\u5F55")
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
      } else {
        _push(`<!---->`);
      }
      _push(`</div></header><div class="h-[64px] pt-[env(safe-area-inset-top)] box-content"></div><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/DogHeader.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const DogHeader = Object.assign(_sfc_main, { __name: "DogHeader" });

export { DogHeader as D, _sfc_main$v as _, apiFetch as a, useApiFetch as b, cn as c, _sfc_main$2 as d, _sfc_main$5 as e, _sfc_main$3 as f, _sfc_main$4 as g, handleApiError as h, buttonVariants as i, useNotifications as j, useUnreadNotificationCount as k, login as l, markAllNotificationsAsRead as m, register as r, useAuthStore as u };
