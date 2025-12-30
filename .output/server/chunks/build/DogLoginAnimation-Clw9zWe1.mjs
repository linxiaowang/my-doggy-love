import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';

const leftDog = "/assets/images/xiaobai/xiaobai-3.png";
const rightDog = "/assets/images/xiaojimao/xiaojimao-3.png";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DogLoginAnimation",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative w-full h-40 md:h-56 overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" }, _attrs))} data-v-aea83cce><img${ssrRenderAttr("src", leftDog)} alt="xiaobai" class="abs-dog left-dog" data-v-aea83cce><img${ssrRenderAttr("src", rightDog)} alt="xiaojimao" class="abs-dog right-dog" data-v-aea83cce><div class="absolute inset-x-0 bottom-2 text-center text-slate-500 dark:text-slate-400 text-sm" data-v-aea83cce>两只小狗一起登录中…</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/DogLoginAnimation.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const DogLoginAnimation = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-aea83cce"]]), { __name: "DogLoginAnimation" });

export { DogLoginAnimation as D };
