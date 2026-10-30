import { ref } from 'vue';
import { type AlertWindowParams, type SongWindowParams, Win, type WindowState } from '@app/types';
import { registry } from '@app/utils/windowsConfig.ts';

const windows = ref(<Record<string, WindowState>>{});
const activeWindow = ref('');
const activeZIndex = ref(100);

function applyInstanceParams(
  state: WindowState,
  win: Win,
  params?: AlertWindowParams | SongWindowParams,
): void {
  if (params === undefined) {
    return;
  }

  state.params = params;

  if ('title' in params && params.title) {
    state.title = params.title;
  } else {
    state.title = registry[win].title;
  }
}

function topVisibleWindowId(): string {
  const visible = Object.values(windows.value).filter(w => !w.isMinimized);
  if (visible.length === 0) {
    return '';
  }

  let top = visible[0]!;
  for (const win of visible) {
    if (win.zIndex > top.zIndex) {
      top = win;
    }
  }
  return top.id;
}

/**
 * Shared singleton state for opened desktop windows (stack, geometry, minimize)
 */
export function useWindows() {
  /**
   * Open window and pass properties to it
   * @param win
   * @param id
   * @param params
   */
  const openWindow = (
    win: Win,
    id?: string,
    params?: AlertWindowParams | SongWindowParams,
  ): void => {
    const winId = id ?? win;

    if (winId in windows.value) {
      applyInstanceParams(windows.value[winId]!, win, params);
      restore(winId);
      return;
    }

    activeZIndex.value++;

    windows.value[winId] = {
      ...registry[win],
      params,
      id: winId,
      x: 0,
      y: 0,
      isMinimized: false,
      zIndex: activeZIndex.value,
      component: 'window-' + win,
    };

    applyInstanceParams(windows.value[winId]!, win, params);
    activeWindow.value = winId;
  };

  const pullUp = (winId?: string): void => {
    const targetId = winId ?? topVisibleWindowId();
    if (targetId === '') {
      activeWindow.value = '';
      return;
    }

    activeWindow.value = targetId;
    activeZIndex.value++;
    windows.value[targetId]!.zIndex = activeZIndex.value;
  };

  const closeWindow = (winId: string): void => {
    if (winId in windows.value) {
      delete windows.value[winId];
    }

    pullUp();
  };

  const minimizeWindow = (winId: string): void => {
    if (!(winId in windows.value)) {
      return;
    }

    windows.value[winId]!.isMinimized = true;

    if (activeWindow.value === winId) {
      activeWindow.value = topVisibleWindowId();
    }
  };

  const restore = (winId: string): void => {
    if (winId in windows.value) {
      windows.value[winId]!.isMinimized = false;
      pullUp(winId);
    }
  };

  const toggleMinimize = (winId: Win | string): void => {
    if (!(winId in windows.value)) {
      return;
    }

    if (windows.value[winId]!.isMinimized) {
      restore(winId);
    } else {
      if (activeWindow.value === winId) {
        minimizeWindow(winId);
      } else {
        pullUp(winId);
      }
    }
  };

  const moveTo = (winId: Win | string, x: number, y: number): void => {
    if (winId in windows.value) {
      windows.value[winId]!.x = x;
      windows.value[winId]!.y = y;
    }
  };

  return {
    openWindow,
    closeWindow,
    openedWindows: windows,
    activeWindow,
    minimizeWindow,
    toggleMinimize,
    pullUp,
    moveTo,
  };
}
