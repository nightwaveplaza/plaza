//prettier-ignore
export const iOSBridge = {
  playAudio: (): Promise<void> =>
    sendMessage<void>('playAudio'),
  stopAudio: (): Promise<void> =>
    sendMessage<void>('stopAudio'),
  setSleepTimer: (time: number): Promise<void> =>
    sendMessage<void>('setSleepTimer', [time]),
  getAuthToken: (): Promise<string> =>
    sendMessage<string>('getAuthToken'),
  setAuthToken: (token: string | null): Promise<void> =>
    sendMessage<void>('setAuthToken', [token ?? '']),
  setAudioQuality: (lowQuality: boolean): Promise<void> =>
    sendMessage<void>('setAudioQuality', [lowQuality]),
  toggleFullscreen: (): Promise<void> =>
    sendMessage<void>('toggleFullscreen'),
  openDrawer: (): Promise<void> =>
    sendMessage<void>('openDrawer'),
  onReady: (): Promise<void> =>
    sendMessage<void>('onReady'),
  socketReconnect: (): Promise<void> =>
    sendMessage<void>('socketReconnect'),
  getUserAgent: (): Promise<string> =>
    sendMessage<string>('getUserAgent'),
  getAppVersion: (): Promise<string> =>
    sendMessage<string>('getAppVersion'),
  setBackground: (background: string): Promise<void> =>
    sendMessage<void>('setBackground', [background]),
  setLanguage: (lang: string): Promise<void> =>
    sendMessage<void>('setLanguage', [lang]),
  setThemeColor: (theme: string): Promise<void> =>
    sendMessage<void>('setThemeColor', [theme]),
};

async function sendMessage<T>(method: string, args: Array<any> = []): Promise<T> {
  if (!window.webkit?.messageHandlers?.ios_app) {
    return Promise.reject(new Error(`Unable to send message to iOS. Message handler not found`));
  }

  try {
    const response = await window.webkit.messageHandlers.ios_app.postMessage({
      method,
      args,
    });
    return response as T;
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
}
