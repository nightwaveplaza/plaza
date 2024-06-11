export const AndroidBridge = {
  audioPlay: ()
    : void => AndroidInterface.audioPlay(),
  audioStop: ()
    : void => AndroidInterface.audioStop(),
  setSleepTimer: (time: number)
    : void => AndroidInterface.setSleepTimer(time),
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
}
