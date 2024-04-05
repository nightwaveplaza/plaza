import { getCurrentInstance } from 'vue'

export default function useEmitter() {
  const internalInstance = getCurrentInstance();
  return internalInstance!.appContext.config.globalProperties.emitter;
}
