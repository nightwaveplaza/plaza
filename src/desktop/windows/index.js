import WindowMobile from '@desktop/windows/WindowMobile';
import WindowPlayer from '@desktop/windows/WindowPlayer';
import WindowSupport from '@desktop/windows/WindowSupport';
import WindowUserResetPassword from '@desktop/windows/WindowUserResetPassword';

export const desktopWindows = (app) => {
  app.component('window-mobile', WindowMobile);
  app.component('window-player', WindowPlayer);
  app.component('window-support', WindowSupport);
  app.component('window-user-reset-password', WindowUserResetPassword);
}
