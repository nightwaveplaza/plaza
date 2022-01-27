import { AndroidBridge } from './android-bridge'
import { iOSBridge } from './ios-bridge';

/**
 * Общий API для взаимодействия с Android и iOS
 */
export const Native = {
    getStatus: () => CurrentBridge().getStatus(),
    requestUiUpdate: () => CurrentBridge().requestUiUpdate(),
    audioPlay: () => CurrentBridge().audioPlay(),
    audioStop: () => CurrentBridge().audioStop(),
    setSleepTimer: (time) => CurrentBridge().setSleepTimer(time),
    getAuthToken: () => CurrentBridge().getAuthToken(),
    setAuthToken: (token) => CurrentBridge().setAuthToken(token),
    setLastfmToken: (token, username) => CurrentBridge().setLastfmToken(token, username),
    getLastfmUsername: () => CurrentBridge().getLastfmUsername(),
    getLastfmStatus: () => CurrentBridge().getLastfmStatus(),
    getAudioQuality: () => CurrentBridge().getAudioQuality(),
    setAudioQuality: (lowQuality) => CurrentBridge().setAudioQuality(lowQuality),
    toggleFullscreen: () => CurrentBridge().toggleFullscreen(),
    openDrawer: () => CurrentBridge().openDrawer(),
    showToast: (msg) => CurrentBridge().showToast(msg),
    getUserAgent: () => CurrentBridge().getUserAgent(),
    getAppVersion: () => CurrentBridge().getAppVersion(),
    setBackground: (background) => CurrentBridge().setBackground(background),
    setReaction: (score) => CurrentBridge().setReaction(score),
    getReaction: (score) => CurrentBridge().getReaction(score)
}


const CurrentBridge = () => {
    const isAndroid = (typeof AndroidInterface !== 'undefined');
    return isAndroid ? AndroidBridge : iOSBridge;
}
