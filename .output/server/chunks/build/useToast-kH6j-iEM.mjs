import { i as useState } from './server.mjs';
import { readonly } from 'vue';

let toastIdCounter = 0;
function useToast() {
  const toasts = useState("toasts", () => []);
  function show(message, options = {}) {
    const {
      type = "info",
      duration = 3e3,
      closable = true
    } = options;
    const toast = {
      id: `toast-${++toastIdCounter}`,
      message,
      type,
      duration,
      closable
    };
    toasts.value.push(toast);
    if (duration > 0) {
      setTimeout(() => {
        remove(toast.id);
      }, duration);
    }
    return toast.id;
  }
  function success(message, duration) {
    return show(message, { type: "success", duration });
  }
  function error(message, duration) {
    return show(message, { type: "error", duration: duration || 5e3 });
  }
  function warning(message, duration) {
    return show(message, { type: "warning", duration });
  }
  function info(message, duration) {
    return show(message, { type: "info", duration });
  }
  function remove(id) {
    const index = toasts.value.findIndex((t) => t.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  }
  function clear() {
    toasts.value = [];
  }
  return {
    toasts: readonly(toasts),
    show,
    success,
    error,
    warning,
    info,
    remove,
    clear
  };
}

export { useToast as u };
