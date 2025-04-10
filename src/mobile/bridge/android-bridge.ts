export const AndroidBridge = {
  audioPlay: ()
    : void => AndroidInterface.audioPlay(),
  audioStop: ()
    : void => AndroidInterface.audioStop(),
  setSleepTimer: (time: number)
    : void => AndroidInterface.setSleepTimer(time),
  onReady: ()
    : void => AndroidInterface.onReady(),
  socketReconnect: ()
    : void => AndroidInterface.socketReconnect(),
  setAuthToken: (token: string)
    : void => AndroidInterface.setAuthToken(token),
  getAuthToken: ()
    : Promise<string> => Promise.resolve(AndroidInterface.getAuthToken()),
  setAudioQuality: (lowQuality: boolean)
    : void => AndroidInterface.setAudioQuality(lowQuality),
  toggleFullscreen: ()
    : void => AndroidInterface.toggleFullscreen(),
  openDrawer: ()
    : void => AndroidInterface.openDrawer(),
  getUserAgent: ()
    : Promise<string> => Promise.resolve(AndroidInterface.getUserAgent()),
  getAppVersion: ()
    : Promise<string> => Promise.resolve(AndroidInterface.getAppVersion()),
  setBackground: (background: string)
    : void => AndroidInterface.setBackground(background),
  setLanguage: (lang: string)
    : void => AndroidInterface.setLanguage(lang),
  setThemeColor: (color: string)
    : void => AndroidInterface.setThemeColor(color),
}
