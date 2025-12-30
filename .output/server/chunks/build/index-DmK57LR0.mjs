import { _ as __nuxt_component_0 } from './nuxt-link-qMRI1Itf.mjs';
import { defineComponent, ref, watch, mergeProps, withCtx, createTextVNode, unref, computed, h, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrRenderTeleport, ssrInterpolate } from 'vue/server-renderer';
import { u as useAuthStore, D as DogHeader, a as apiFetch, _ as _sfc_main$v } from './DogHeader-WAUZOG8S.mjs';
import { _ as _export_sfc, o as onClickOutside } from './server.mjs';
import dayjs from 'dayjs';
import { Solar } from 'lunar-typescript';
import { u as useAnniversaries } from './anniversaries-Gt0Z5ZnN.mjs';
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
import 'vue-router';

const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "AnniversaryCountdown",
  __ssrInlineRender: true,
  setup(__props) {
    const anniversaries = ref([]);
    const loading = ref(true);
    const formatType = ref("days");
    function calculateCountdown(anniversary) {
      const today = /* @__PURE__ */ new Date();
      const date = new Date(anniversary.date);
      const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
      const t1 = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
      const diffDays = Math.round((t1 - t0) / (24 * 60 * 60 * 1e3));
      return {
        days: diffDays,
        overdue: diffDays < 0
      };
    }
    function formatDate(dateStr) {
      const date = new Date(dateStr);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${month}\u6708${day}\u65E5`;
    }
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
    const displayText = computed(() => {
      if (countdown.value.days === 0) {
        return "";
      }
      return formatCountdown(countdown.value.days, formatType.value, upcomingAnniversary.value?.date);
    });
    const upcomingAnniversary = computed(() => {
      if (anniversaries.value.length === 0) return null;
      const future = anniversaries.value.map((a) => ({ anniversary: a, countdown: calculateCountdown(a) })).filter((item) => !item.countdown.overdue).sort((a, b) => a.countdown.days - b.countdown.days);
      if (future.length > 0 && future[0]) {
        return future[0].anniversary;
      }
      const past = anniversaries.value.map((a) => ({ anniversary: a, countdown: calculateCountdown(a) })).filter((item) => item.countdown.overdue).sort((a, b) => b.countdown.days - a.countdown.days);
      return past.length > 0 && past[0] ? past[0].anniversary : null;
    });
    const countdown = computed(() => {
      if (!upcomingAnniversary.value) {
        return { days: 0, overdue: false };
      }
      return calculateCountdown(upcomingAnniversary.value);
    });
    watch(upcomingAnniversary, () => {
      formatType.value = "days";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      if (!loading.value && upcomingAnniversary.value) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "card" }, _attrs))}><div class="flex items-center justify-between gap-4"><div class="flex-1 min-w-0"><div class="text-xs text-text-muted mb-1.5">\u7EAA\u5FF5\u65E5\u63D0\u9192</div><div class="text-base font-semibold text-text-main mb-1 truncate">${ssrInterpolate(upcomingAnniversary.value.title)}</div><div class="text-xs text-text-secondary">${ssrInterpolate(formatDate(upcomingAnniversary.value.date))}</div></div><div class="text-right flex-shrink-0">`);
        if (countdown.value.days === 0) {
          _push(`<div class="text-xl font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-lg whitespace-nowrap"> \u{1F389} \u5C31\u662F\u4ECA\u5929\uFF01 </div>`);
        } else if (countdown.value.overdue) {
          _push(`<div class="text-right"><div class="text-xs text-text-muted mb-0.5">\u5DF2\u7ECF</div><div class="text-xl font-bold text-red-600 cursor-pointer hover:opacity-80 transition-opacity" title="\u70B9\u51FB\u5207\u6362\u663E\u793A\u683C\u5F0F">${ssrInterpolate(displayText.value)}</div></div>`);
        } else {
          _push(`<div class="text-right"><div class="text-xs text-text-muted mb-0.5">\u8FD8\u6709</div><div class="text-xl font-bold text-primary-800 cursor-pointer hover:opacity-80 transition-opacity" title="\u70B9\u51FB\u5207\u6362\u663E\u793A\u683C\u5F0F">${ssrInterpolate(displayText.value)}</div></div>`);
        }
        _push(`</div></div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/anniversaries",
          class: "mt-3 block text-center text-xs text-text-secondary hover:text-primary-700 underline transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` \u67E5\u770B\u6240\u6709\u7EAA\u5FF5\u65E5 \u2192 `);
            } else {
              return [
                createTextVNode(" \u67E5\u770B\u6240\u6709\u7EAA\u5FF5\u65E5 \u2192 ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AnniversaryCountdown.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const AnniversaryCountdown = Object.assign(_sfc_main$3, { __name: "AnniversaryCountdown" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "Calendar",
  __ssrInlineRender: true,
  setup(__props) {
    const StarIcon = {
      render: () => h("svg", {
        class: "w-4 h-4",
        fill: "currentColor",
        viewBox: "0 0 24 24"
      }, [
        h("path", {
          d: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        })
      ])
    };
    const HeartIcon = {
      render: () => h("svg", {
        class: "w-4 h-4",
        fill: "currentColor",
        viewBox: "0 0 24 24"
      }, [
        h("path", {
          d: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        })
      ])
    };
    const FlowerIcon = {
      render: () => h("svg", {
        class: "w-4 h-4",
        fill: "currentColor",
        viewBox: "0 0 24 24"
      }, [
        h("path", {
          d: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
        })
      ])
    };
    const weekdays = ["\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D", "\u65E5"];
    const monthNames = ["\u4E00\u6708", "\u4E8C\u6708", "\u4E09\u6708", "\u56DB\u6708", "\u4E94\u6708", "\u516D\u6708", "\u4E03\u6708", "\u516B\u6708", "\u4E5D\u6708", "\u5341\u6708", "\u5341\u4E00\u6708", "\u5341\u4E8C\u6708"];
    const currentDate = ref(/* @__PURE__ */ new Date());
    const currentYear = computed(() => currentDate.value.getFullYear());
    const currentMonth = computed(() => currentDate.value.getMonth());
    const showYearPicker = ref(false);
    const showMonthPicker = ref(false);
    const yearPickerRef = ref(null);
    const monthPickerRef = ref(null);
    onClickOutside(yearPickerRef, () => {
      showYearPicker.value = false;
    });
    onClickOutside(monthPickerRef, () => {
      showMonthPicker.value = false;
    });
    const selectedDate = ref(null);
    const showDetailModal = ref(false);
    const { data: anniversariesData } = useAnniversaries();
    const anniversaries = computed(() => anniversariesData.value?.items || []);
    const anniversariesByDate = computed(() => {
      const map = /* @__PURE__ */ new Map();
      anniversaries.value.forEach((anniversary) => {
        const dateStr = dayjs(anniversary.date).format("YYYY-MM-DD");
        if (!map.has(dateStr)) {
          map.set(dateStr, []);
        }
        map.get(dateStr).push(anniversary);
      });
      return map;
    });
    const isCurrentMonth = computed(() => {
      const today = /* @__PURE__ */ new Date();
      return currentYear.value === today.getFullYear() && currentMonth.value === today.getMonth();
    });
    const ganzhiYear = computed(() => {
      try {
        const solar = Solar.fromYmd(currentYear.value, currentMonth.value + 1, 1);
        const lunarObj = solar.getLunar();
        const yearGanzhi = lunarObj.getYearInGanZhi();
        const zodiac = lunarObj.getYearShengXiao();
        return `${yearGanzhi}\u5E74 ${zodiac}\u5E74`;
      } catch (e) {
        return "";
      }
    });
    const yearRange = computed(() => {
      const current = currentYear.value;
      const years = [];
      for (let i = current - 10; i <= current + 10; i++) {
        years.push(i);
      }
      return years;
    });
    const calendarDays = computed(() => {
      const year = currentYear.value;
      const month = currentMonth.value;
      const today = /* @__PURE__ */ new Date();
      `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      let firstDayWeek = firstDay.getDay();
      firstDayWeek = firstDayWeek === 0 ? 7 : firstDayWeek;
      const totalDays = lastDay.getDate() + (firstDayWeek - 1);
      const rowsNeeded = Math.ceil(totalDays / 7);
      const days = [];
      const prevMonthLastDay = new Date(year, month, 0).getDate();
      for (let i = firstDayWeek - 1; i > 0; i--) {
        const date = prevMonthLastDay - i + 1;
        const fullDate = new Date(year, month - 1, date);
        days.push(createDayData(fullDate, false));
      }
      for (let date = 1; date <= lastDay.getDate(); date++) {
        const fullDate = new Date(year, month, date);
        days.push(createDayData(fullDate, true));
      }
      const remainingDays = rowsNeeded * 7 - days.length;
      for (let date = 1; date <= remainingDays; date++) {
        const fullDate = new Date(year, month + 1, date);
        days.push(createDayData(fullDate, false));
      }
      return days;
    });
    function createDayData(date, isCurrentMonth2, todayStr) {
      const today = /* @__PURE__ */ new Date();
      const isToday = date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate();
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      let lunar = "";
      let lunarFull = "";
      let ganzhi = "";
      let yi = "";
      let ji = "";
      let jieqi = "";
      let displayText = "";
      let isFestival = false;
      try {
        const solar = Solar.fromDate(date);
        const lunarObj = solar.getLunar();
        lunar = lunarObj.getDayInChinese();
        lunarFull = lunarObj.toFullString();
        ganzhi = `${lunarObj.getYearInGanZhi()}\u5E74 ${lunarObj.getMonthInGanZhi()}\u6708 ${lunarObj.getDayInGanZhi()}\u65E5`;
        const yiList = lunarObj.getDayYi();
        const jiList = lunarObj.getDayJi();
        if (yiList && yiList.length > 0) {
          yi = yiList.join(" ");
        }
        if (jiList && jiList.length > 0) {
          ji = jiList.join(" ");
        }
        const jieqiStr = lunarObj.getJieQi();
        if (jieqiStr) {
          jieqi = jieqiStr;
          displayText = jieqi;
          isFestival = true;
        }
        if (!displayText) {
          const festivals = lunarObj.getFestivals();
          if (festivals && festivals.length > 0) {
            displayText = festivals[0];
            isFestival = true;
          }
        }
        if (!displayText) {
          displayText = lunar;
        }
      } catch (e) {
        console.error("\u8BA1\u7B97\u519C\u5386\u5931\u8D25:", e, date);
      }
      const dateKey = dayjs(date).format("YYYY-MM-DD");
      const dayAnniversaries = anniversariesByDate.value.get(dateKey) || [];
      return {
        date: date.getDate(),
        fullDate: dayjs(date).format("YYYY\u5E74MM\u6708DD\u65E5"),
        dateKey,
        isCurrentMonth: isCurrentMonth2,
        isToday,
        isWeekend,
        lunar,
        lunarFull,
        ganzhi,
        yi,
        ji,
        jieqi,
        displayText,
        isFestival,
        anniversaries: dayAnniversaries
      };
    }
    const AnniversaryIcon = defineComponent({
      props: {
        date: {
          type: Number,
          required: true
        }
      },
      setup(props) {
        const iconIndex = props.date % 3;
        const icons = [StarIcon, HeartIcon, FlowerIcon];
        const IconComponent = icons[iconIndex];
        return () => h(IconComponent, { class: "anniversary-icon" });
      }
    });
    function goToToday() {
      currentDate.value = /* @__PURE__ */ new Date();
      showYearPicker.value = false;
      showMonthPicker.value = false;
    }
    watch(showDetailModal, (val) => {
      if (val) {
        (void 0).body.style.overflow = "hidden";
      } else {
        (void 0).body.style.overflow = "";
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Button = _sfc_main$v;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white dark:bg-slate-800 rounded-lg shadow-lg border-2 border-slate-900 dark:border-slate-600 overflow-hidden" }, _attrs))} data-v-da5c1ac3><div class="flex flex-col md:flex-row" data-v-da5c1ac3><div class="flex-1 p-3 md:p-4" data-v-da5c1ac3><div class="relative mb-4" data-v-da5c1ac3><div class="flex items-start justify-between mb-3" data-v-da5c1ac3><div class="flex flex-col" data-v-da5c1ac3><button class="text-2xl md:text-3xl font-bold text-red-600 hover:text-red-700 dark:hover:text-red-500 transition-colors cursor-pointer drop-shadow-sm" data-v-da5c1ac3>${ssrInterpolate(currentYear.value)}</button><div class="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium" data-v-da5c1ac3>${ssrInterpolate(ganzhiYear.value)}</div></div><div class="flex items-center" data-v-da5c1ac3><button class="text-2xl md:text-3xl font-bold text-yellow-500 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors cursor-pointer drop-shadow-sm" data-v-da5c1ac3>${ssrInterpolate(currentMonth.value + 1)}\u6708 </button></div></div><div class="flex items-center justify-end gap-2" data-v-da5c1ac3><button class="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200" title="\u4E0A\u4E00\u4E2A\u6708" data-v-da5c1ac3><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-da5c1ac3><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" data-v-da5c1ac3></path></svg></button>`);
      if (!isCurrentMonth.value) {
        _push(ssrRenderComponent(_component_Button, {
          class: "ml-auto px-3 py-1 text-sm bg-amber-600 hover:bg-amber-700 text-white shadow-sm rounded",
          onClick: goToToday,
          title: "\u56DE\u5230\u4ECA\u5929"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` \u4ECA\u5929 `);
            } else {
              return [
                createTextVNode(" \u4ECA\u5929 ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200" title="\u4E0B\u4E00\u4E2A\u6708" data-v-da5c1ac3><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-da5c1ac3><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-v-da5c1ac3></path></svg></button></div>`);
      if (showYearPicker.value) {
        _push(`<div class="absolute top-full left-1/2 -translate-x-1/2 w-64 mt-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-20 p-4 max-h-64 overflow-y-auto" data-v-da5c1ac3><div class="grid grid-cols-4 gap-2" data-v-da5c1ac3><!--[-->`);
        ssrRenderList(yearRange.value, (year) => {
          _push(`<button class="${ssrRenderClass([year === currentYear.value ? "bg-amber-600 text-white hover:bg-amber-700" : "", "px-3 py-2 text-sm rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-400"])}" data-v-da5c1ac3>${ssrInterpolate(year)}</button>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showMonthPicker.value) {
        _push(`<div class="absolute top-full left-1/2 -translate-x-1/2 w-64 mt-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-20 p-4 max-h-64 overflow-y-auto" data-v-da5c1ac3><div class="grid grid-cols-4 gap-2" data-v-da5c1ac3><!--[-->`);
        ssrRenderList(monthNames, (month, index) => {
          _push(`<button class="${ssrRenderClass([index === currentMonth.value ? "bg-amber-600 text-white hover:bg-amber-700" : "", "px-3 py-2 text-sm rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-400"])}" data-v-da5c1ac3>${ssrInterpolate(month)}</button>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="w-full relative" data-v-da5c1ac3><div class="grid grid-cols-7 gap-1 mb-2" data-v-da5c1ac3><!--[-->`);
      ssrRenderList(weekdays, (day, index) => {
        _push(`<div class="${ssrRenderClass([index >= 5 ? "bg-red-500 text-white rounded-full w-8 h-8 mx-auto flex items-center justify-center shadow-sm" : "", "text-center text-sm md:text-base font-semibold text-slate-900 dark:text-slate-100 py-2"])}" data-v-da5c1ac3>${ssrInterpolate(day)}</div>`);
      });
      _push(`<!--]--></div><div class="grid grid-cols-7 gap-1" data-v-da5c1ac3><!--[-->`);
      ssrRenderList(calendarDays.value, (day, index) => {
        _push(`<div class="${ssrRenderClass([{
          "opacity-40": !day.isCurrentMonth,
          "bg-amber-50 dark:bg-amber-900/30 border-2 border-amber-600 dark:border-amber-500 shadow-sm": day.isToday,
          "bg-pink-50/50 dark:bg-pink-900/20": day.anniversaries && day.anniversaries.length > 0,
          "bg-red-50/20 dark:bg-red-900/20": day.isWeekend
        }, "relative min-h-[60px] md:min-h-[80px] p-2 rounded border border-transparent hover:border-amber-600/50 hover:bg-amber-50/50 dark:hover:bg-amber-900/20 transition-all cursor-pointer flex flex-col items-center"])}" data-v-da5c1ac3><div class="${ssrRenderClass([{ "text-red-600 dark:text-red-400": day.isWeekend, "text-amber-600 dark:text-amber-500 font-bold": day.isToday }, "text-sm md:text-base font-semibold text-slate-900 dark:text-slate-100 mb-0.5"])}" data-v-da5c1ac3>${ssrInterpolate(day.date)}</div>`);
        if (day.displayText) {
          _push(`<div class="${ssrRenderClass([{ "text-red-600 dark:text-red-400 font-medium": day.isFestival }, "text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap w-full text-center"])}" data-v-da5c1ac3>${ssrInterpolate(day.displayText)}</div>`);
        } else if (day.lunar) {
          _push(`<div class="text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap w-full text-center" data-v-da5c1ac3>${ssrInterpolate(day.lunar)}</div>`);
        } else {
          _push(`<!---->`);
        }
        if (day.anniversaries && day.anniversaries.length > 0) {
          _push(`<div class="absolute top-1 right-1" data-v-da5c1ac3>`);
          _push(ssrRenderComponent(unref(AnniversaryIcon), {
            date: day.date,
            class: "text-pink-400 drop-shadow-sm"
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div></div></div></div>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (selectedDate.value && showDetailModal.value) {
          _push2(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" data-v-da5c1ac3><div class="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700" data-v-da5c1ac3><div class="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700" data-v-da5c1ac3><h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100" data-v-da5c1ac3>\u9EC4\u5386\u8BE6\u60C5</h3><button class="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-400" data-v-da5c1ac3><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-da5c1ac3><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-da5c1ac3></path></svg></button></div>`);
          if (selectedDate.value) {
            _push2(`<div class="p-4 space-y-4" data-v-da5c1ac3><div class="space-y-2" data-v-da5c1ac3><div class="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1" data-v-da5c1ac3>\u516C\u5386</div><div class="text-base text-slate-900 dark:text-slate-100" data-v-da5c1ac3>${ssrInterpolate(selectedDate.value.fullDate)}</div></div>`);
            if (selectedDate.value.lunarFull) {
              _push2(`<div class="space-y-2" data-v-da5c1ac3><div class="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1" data-v-da5c1ac3>\u519C\u5386</div><div class="text-base text-slate-900 dark:text-slate-100" data-v-da5c1ac3>${ssrInterpolate(selectedDate.value.lunarFull)}</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (selectedDate.value.ganzhi) {
              _push2(`<div class="space-y-2" data-v-da5c1ac3><div class="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1" data-v-da5c1ac3>\u5E72\u652F</div><div class="text-base text-slate-900 dark:text-slate-100" data-v-da5c1ac3>${ssrInterpolate(selectedDate.value.ganzhi)}</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (selectedDate.value.yi || selectedDate.value.ji) {
              _push2(`<div class="space-y-2" data-v-da5c1ac3>`);
              if (selectedDate.value.yi) {
                _push2(`<div class="mb-2" data-v-da5c1ac3><div class="inline-block px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded mr-2" data-v-da5c1ac3>\u5B9C</div><div class="text-sm text-slate-600 dark:text-slate-400 mt-1" data-v-da5c1ac3>${ssrInterpolate(selectedDate.value.yi)}</div></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (selectedDate.value.ji) {
                _push2(`<div class="mb-2" data-v-da5c1ac3><div class="inline-block px-2 py-1 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded mr-2" data-v-da5c1ac3>\u5FCC</div><div class="text-sm text-slate-600 dark:text-slate-400 mt-1" data-v-da5c1ac3>${ssrInterpolate(selectedDate.value.ji)}</div></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (selectedDate.value.jieqi) {
              _push2(`<div class="space-y-2" data-v-da5c1ac3><div class="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1" data-v-da5c1ac3>\u8282\u6C14</div><div class="text-base text-amber-600 dark:text-amber-500 font-semibold" data-v-da5c1ac3>${ssrInterpolate(selectedDate.value.jieqi)}</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (selectedDate.value.anniversaries && selectedDate.value.anniversaries.length > 0) {
              _push2(`<div class="space-y-2" data-v-da5c1ac3><div class="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1" data-v-da5c1ac3>\u7EAA\u5FF5\u65E5</div><div class="space-y-2" data-v-da5c1ac3><!--[-->`);
              ssrRenderList(selectedDate.value.anniversaries, (anniversary) => {
                _push2(`<div class="px-3 py-2 bg-amber-50 dark:bg-amber-900/30 border border-amber-600/30 dark:border-amber-500/30 rounded text-sm text-slate-900 dark:text-slate-100" data-v-da5c1ac3>${ssrInterpolate(anniversary.title)}</div>`);
              });
              _push2(`<!--]--></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/Calendar.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const Calendar = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-da5c1ac3"]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "MemoryTree",
  __ssrInlineRender: true,
  props: {
    images: {}
  },
  setup(__props) {
    const activeItems = ref([]);
    const fallenItems = ref([]);
    const treeContainer = ref(null);
    const treeHeight = ref(700);
    const previewIndex = ref(0);
    const previewImage = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "treeContainer",
        ref: treeContainer,
        class: "relative w-full h-full min-h-[600px] overflow-hidden rounded-2xl bg-gradient-to-b from-rose-50 via-pink-50 to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border border-rose-200/30 dark:border-slate-700/50 shadow-xl"
      }, _attrs))} data-v-f903f1f2><svg class="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-0"${ssrRenderAttr("viewBox", `0 0 500 ${treeHeight.value}`)} preserveAspectRatio="xMidYMax meet" data-v-f903f1f2><defs data-v-f903f1f2><linearGradient id="trunkGradient" x1="0%" y1="0%" x2="100%" y2="0%" data-v-f903f1f2><stop offset="0%" style="${ssrRenderStyle({ "stop-color": "#8B4513", "stop-opacity": "0.9" })}" data-v-f903f1f2></stop><stop offset="50%" style="${ssrRenderStyle({ "stop-color": "#A0522D", "stop-opacity": "0.95" })}" data-v-f903f1f2></stop><stop offset="100%" style="${ssrRenderStyle({ "stop-color": "#8B4513", "stop-opacity": "0.9" })}" data-v-f903f1f2></stop></linearGradient><linearGradient id="leafGradient" x1="0%" y1="0%" x2="0%" y2="100%" data-v-f903f1f2><stop offset="0%" style="${ssrRenderStyle({ "stop-color": "#90EE90", "stop-opacity": "0.95" })}" data-v-f903f1f2></stop><stop offset="100%" style="${ssrRenderStyle({ "stop-color": "#228B22", "stop-opacity": "0.9" })}" data-v-f903f1f2></stop></linearGradient><filter id="glow" data-v-f903f1f2><feGaussianBlur stdDeviation="3" result="coloredBlur" data-v-f903f1f2></feGaussianBlur><feMerge data-v-f903f1f2><feMergeNode in="coloredBlur" data-v-f903f1f2></feMergeNode><feMergeNode in="SourceGraphic" data-v-f903f1f2></feMergeNode></feMerge></filter><filter id="shadow" data-v-f903f1f2><feDropShadow dx="2" dy="4" stdDeviation="3" flood-opacity="0.2" data-v-f903f1f2></feDropShadow></filter></defs><ellipse cx="250"${ssrRenderAttr("cy", treeHeight.value - 20)} rx="180" ry="25" class="fill-amber-200/60 dark:fill-amber-900/40" data-v-f903f1f2></ellipse><path${ssrRenderAttr("d", `M 235,${treeHeight.value - 100} Q 233,${treeHeight.value * 0.75} 230,${treeHeight.value * 0.5} L 235,${treeHeight.value * 0.45} Q 237,${treeHeight.value * 0.5} 240,${treeHeight.value * 0.5} Q 242,${treeHeight.value * 0.75} 250,${treeHeight.value - 100} Z`)} fill="url(#trunkGradient)" filter="url(#shadow)" data-v-f903f1f2></path><ellipse cx="180"${ssrRenderAttr("cy", treeHeight.value * 0.6)} rx="70" ry="50" class="fill-emerald-500/90" filter="url(#shadow)" data-v-f903f1f2></ellipse><ellipse cx="320"${ssrRenderAttr("cy", treeHeight.value * 0.6)} rx="70" ry="50" class="fill-emerald-500/90" filter="url(#shadow)" data-v-f903f1f2></ellipse><ellipse cx="250"${ssrRenderAttr("cy", treeHeight.value * 0.55)} rx="80" ry="55" class="fill-emerald-400/95" filter="url(#shadow)" data-v-f903f1f2></ellipse><ellipse cx="200"${ssrRenderAttr("cy", treeHeight.value * 0.45)} rx="60" ry="45" class="fill-green-500/90" filter="url(#shadow)" data-v-f903f1f2></ellipse><ellipse cx="300"${ssrRenderAttr("cy", treeHeight.value * 0.45)} rx="60" ry="45" class="fill-green-500/90" filter="url(#shadow)" data-v-f903f1f2></ellipse><ellipse cx="250"${ssrRenderAttr("cy", treeHeight.value * 0.42)} rx="65" ry="48" class="fill-green-400/95" filter="url(#shadow)" data-v-f903f1f2></ellipse><ellipse cx="220"${ssrRenderAttr("cy", treeHeight.value * 0.33)} rx="50" ry="38" class="fill-lime-500/90" filter="url(#shadow)" data-v-f903f1f2></ellipse><ellipse cx="280"${ssrRenderAttr("cy", treeHeight.value * 0.33)} rx="50" ry="38" class="fill-lime-500/90" filter="url(#shadow)" data-v-f903f1f2></ellipse><ellipse cx="250"${ssrRenderAttr("cy", treeHeight.value * 0.3)} rx="55" ry="40" class="fill-lime-400/95" filter="url(#shadow)" data-v-f903f1f2></ellipse><ellipse cx="250"${ssrRenderAttr("cy", treeHeight.value * 0.22)} rx="35" ry="28" class="fill-teal-300/95" filter="url(#shadow)" data-v-f903f1f2></ellipse><g class="animate-pulse" style="${ssrRenderStyle({ "animation-duration": "3s" })}" data-v-f903f1f2><path${ssrRenderAttr("d", `M 170,${treeHeight.value * 0.52} C 170,${treeHeight.value * 0.51} 173,${treeHeight.value * 0.49} 176,${treeHeight.value * 0.52} C 179,${treeHeight.value * 0.55} 182,${treeHeight.value * 0.52} 182,${treeHeight.value * 0.52} C 182,${treeHeight.value * 0.52} 179,${treeHeight.value * 0.56} 176,${treeHeight.value * 0.58} C 173,${treeHeight.value * 0.56} 170,${treeHeight.value * 0.52} 170,${treeHeight.value * 0.52} Z`)} class="fill-pink-400/80" data-v-f903f1f2></path></g><g class="animate-pulse" style="${ssrRenderStyle({ "animation-duration": "2.5s" })}" data-v-f903f1f2><path${ssrRenderAttr("d", `M 320,${treeHeight.value * 0.38} C 320,${treeHeight.value * 0.37} 323,${treeHeight.value * 0.35} 326,${treeHeight.value * 0.38} C 329,${treeHeight.value * 0.41} 332,${treeHeight.value * 0.38} 332,${treeHeight.value * 0.38} C 332,${treeHeight.value * 0.38} 329,${treeHeight.value * 0.42} 326,${treeHeight.value * 0.44} C 323,${treeHeight.value * 0.42} 320,${treeHeight.value * 0.38} 320,${treeHeight.value * 0.38} Z`)} class="fill-rose-400/80" data-v-f903f1f2></path></g><g class="animate-pulse" style="${ssrRenderStyle({ "animation-duration": "3.5s" })}" data-v-f903f1f2><path${ssrRenderAttr("d", `M 245,${treeHeight.value * 0.26} C 245,${treeHeight.value * 0.255} 247,${treeHeight.value * 0.24} 249,${treeHeight.value * 0.26} C 251,${treeHeight.value * 0.28} 253,${treeHeight.value * 0.26} 253,${treeHeight.value * 0.26} C 253,${treeHeight.value * 0.26} 251,${treeHeight.value * 0.29} 249,${treeHeight.value * 0.3} C 247,${treeHeight.value * 0.29} 245,${treeHeight.value * 0.26} 245,${treeHeight.value * 0.26} Z`)} class="fill-red-400/90" filter="url(#glow)" data-v-f903f1f2></path></g><g class="animate-pulse" style="${ssrRenderStyle({ "animation-duration": "2s" })}" data-v-f903f1f2><circle cx="200"${ssrRenderAttr("cy", treeHeight.value * 0.5)} r="3" class="fill-yellow-300/90" data-v-f903f1f2></circle></g><g class="animate-pulse" style="${ssrRenderStyle({ "animation-duration": "2.3s" })}" data-v-f903f1f2><circle cx="290"${ssrRenderAttr("cy", treeHeight.value * 0.35)} r="3" class="fill-yellow-300/90" data-v-f903f1f2></circle></g><g class="animate-pulse" style="${ssrRenderStyle({ "animation-duration": "1.8s" })}" data-v-f903f1f2><circle cx="250"${ssrRenderAttr("cy", treeHeight.value * 0.48)} r="2.5" class="fill-amber-300/90" data-v-f903f1f2></circle></g></svg><div class="absolute inset-0 z-10 overflow-hidden pointer-events-none" data-v-f903f1f2><div${ssrRenderAttrs({
        "enter-active-class": "falling-enter-active",
        "leave-active-class": "falling-leave-active"
      })} data-v-f903f1f2>`);
      ssrRenderList(activeItems.value, (item) => {
        _push(`<div class="${ssrRenderClass([item.type === "photo" ? "w-20 md:w-28 lg:w-32" : "w-8 h-8 md:w-10 md:h-10", "absolute transform-gpu"])}" style="${ssrRenderStyle({
          top: "0%",
          left: `${item.leftPosition}%`,
          "--sway": `${item.swayAmplitude}px`,
          transform: `translateX(-50%) rotate(${item.rotation}deg) scale(${item.scale})`,
          animationDuration: `${item.animationDuration}s`,
          animationDelay: "0s"
        })}" data-v-f903f1f2>`);
        if (item.type === "heart") {
          _push(`<svg viewBox="0 0 24 24" class="w-full h-full drop-shadow-md" data-v-f903f1f2><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" class="fill-pink-400/80" data-v-f903f1f2></path></svg>`);
        } else if (item.type === "photo") {
          _push(`<div class="relative p-2 bg-white dark:bg-slate-800 shadow-xl rounded-xl transform transition-transform hover:scale-105" data-v-f903f1f2><div class="relative aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-rose-100 to-pink-100 dark:from-slate-700 dark:to-slate-600" data-v-f903f1f2><img${ssrRenderAttr("src", item.src)} class="w-full h-full object-cover" alt="Memory" draggable="false" data-v-f903f1f2></div><div class="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-rose-400 rounded-tr-sm" data-v-f903f1f2></div><div class="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-rose-400 rounded-bl-sm" data-v-f903f1f2></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`</div><!--[-->`);
      ssrRenderList(fallenItems.value, (item) => {
        _push(`<div class="${ssrRenderClass([item.type === "photo" ? "w-16 md:w-20 z-10" : "w-6 h-6 md:w-7 md:h-7 z-0", "absolute -translate-x-1/2 origin-center transition-all duration-700 opacity-90 hover:opacity-100 hover:scale-110 hover:z-30 cursor-pointer pointer-events-auto"])}" style="${ssrRenderStyle({
          bottom: item.type === "photo" ? "30px" : "35px",
          left: `${item.leftPosition}%`,
          transform: `rotate(${item.rotation}deg) scale(${item.scale})`
        })}" data-v-f903f1f2>`);
        if (item.type === "photo") {
          _push(`<div class="relative p-1.5 bg-white dark:bg-slate-800 shadow-lg rounded-lg" data-v-f903f1f2><div class="relative aspect-square overflow-hidden rounded-md bg-gradient-to-br from-rose-100 to-pink-100 dark:from-slate-700 dark:to-slate-600" data-v-f903f1f2><img${ssrRenderAttr("src", item.src)} class="w-full h-full object-cover" draggable="false" data-v-f903f1f2></div></div>`);
        } else if (item.type === "heart") {
          _push(`<svg viewBox="0 0 24 24" class="w-full h-full drop-shadow-sm" data-v-f903f1f2><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" class="fill-pink-400/70" data-v-f903f1f2></path></svg>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (previewImage.value !== null) {
          _push2(`<div class="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-sm" tabindex="-1" data-v-f903f1f2><button class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-50 transition-all duration-200 hover:scale-110 active:scale-95 border-none cursor-pointer" data-v-f903f1f2><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f903f1f2><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-f903f1f2></path></svg></button>`);
          if (previewIndex.value > 0) {
            _push2(`<button class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-50 cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 border-none" type="button" data-v-f903f1f2><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f903f1f2><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" data-v-f903f1f2></path></svg></button>`);
          } else {
            _push2(`<!---->`);
          }
          if (previewIndex.value < __props.images.length - 1) {
            _push2(`<button class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-50 cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 border-none" type="button" data-v-f903f1f2><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f903f1f2><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-v-f903f1f2></path></svg></button>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="max-w-[90vw] max-h-[90vh] flex items-center justify-center w-full h-full p-4" data-v-f903f1f2>`);
          if (previewImage.value !== null) {
            _push2(`<img${ssrRenderAttr("src", previewImage.value)} class="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-sm select-none" alt="\u9884\u89C8" data-v-f903f1f2>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div>`);
          if (__props.images.length > 1) {
            _push2(`<div class="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-sm font-medium border border-white/5" data-v-f903f1f2>${ssrInterpolate(previewIndex.value + 1)} / ${ssrInterpolate(__props.images.length)}</div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/MemoryTree.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const MemoryTree = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__scopeId", "data-v-f903f1f2"]]), { __name: "MemoryTree" });
const __default__ = {};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...__default__,
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const presetImages = [
      "/assets/images/couple/couple-1.png",
      "/assets/images/couple/couple-2.png",
      "/assets/images/couple/couple-3.png",
      "/assets/images/couple/couple-4.png"
    ];
    const images = ref([...presetImages]);
    const authStore = useAuthStore();
    async function loadDailyImages() {
      try {
        if (authStore.user) {
          const res = await apiFetch("/api/daily?take=100");
          const media = (res.items || []).flatMap((i) => Array.isArray(i.mediaUrls) ? i.mediaUrls : []);
          if (media.length > 0) {
            if (media.length < 5) {
              images.value = [...media, ...presetImages];
            } else {
              images.value = media;
            }
          } else {
            images.value = [...presetImages];
          }
        } else {
          images.value = [...presetImages];
        }
      } catch (e) {
        console.error("\u52A0\u8F7D\u9996\u9875\u7167\u7247\u5931\u8D25", e);
      }
    }
    watch(() => authStore.user, (newUser) => {
      if (newUser) {
        loadDailyImages();
      } else {
        images.value = [...presetImages];
      }
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br from-surface-100 via-surface-50 to-surface-100" }, _attrs))}>`);
      _push(ssrRenderComponent(DogHeader, null, null, _parent));
      _push(`<div class="min-h-screen flex flex-col items-center pt-12 pb-8 px-4 relative"><div class="fixed top-20 left-10 w-64 h-64 bg-primary/8 rounded-full blur-3xl pointer-events-none z-0"></div><div class="fixed bottom-20 right-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none z-0"></div><div class="w-full max-w-4xl z-10 flex flex-col items-center space-y-8"><div class="bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm px-6 py-2 rounded-full border border-white/50 dark:border-slate-700/50 shadow-sm animate-fade-in shrink-0"><h1 class="text-xl md:text-2xl font-serif text-text-secondary tracking-widest text-center opacity-90"> \u7231\u7684\u5C0F\u4E8B\uFF0C\u503C\u5F97\u88AB\u6E29\u67D4\u8BB0\u5F55 </h1></div><div class="w-full animate-fade-in shrink-0" style="${ssrRenderStyle({ "animation-delay": "0.2s" })}">`);
      _push(ssrRenderComponent(MemoryTree, {
        images: images.value,
        class: "h-[400px] md:h-[500px] !rounded-xl"
      }, null, _parent));
      _push(`</div><div class="flex flex-col items-center space-y-8 w-full animate-slide-up shrink-0" style="${ssrRenderStyle({ "animation-delay": "0.4s" })}"><div class="flex gap-6"><button class="px-8 py-2.5 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 hover:scale-105 transition-all shadow-lg active:scale-95 text-sm md:text-base"> \u5F00\u59CB\u8BB0\u5F55 </button>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/daily",
        class: "px-8 py-2.5 rounded-full bg-background text-foreground font-medium border border-border hover:bg-accent hover:border-accent-foreground/20 transition-all shadow-sm text-sm md:text-base"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` \u67E5\u770B\u65E5\u5E38 `);
          } else {
            return [
              createTextVNode(" \u67E5\u770B\u65E5\u5E38 ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(authStore).user) {
        _push(`<div class="w-full max-w-md opacity-90 hover:opacity-100 transition-opacity">`);
        _push(ssrRenderComponent(AnniversaryCountdown, { class: "!bg-transparent !shadow-none !backdrop-blur-none" }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(authStore).user) {
        _push(`<section class="w-full pt-4 animate-fade-in opacity-90 shrink-0" style="${ssrRenderStyle({ "animation-delay": "0.6s" })}">`);
        _push(ssrRenderComponent(Calendar, null, null, _parent));
        _push(`</section>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
