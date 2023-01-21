import WindowAbout from '@common/windows/WindowAbout';
import WindowAlert from '@common/windows/WindowAlert';
import WindowCredits from '@common/windows/WindowCredits';
import WindowHistory from '@common/windows/WindowHistory';
import WindowNews from '@common/windows/WindowNews';
import WindowRatings from '@common/windows/WindowRatings';
import WindowSettingsBackground from '@common/windows/WindowSettingsBackground';
import WindowSong from '@common/windows/WindowSong';
import WindowUser from '@common/windows/WindowUser';
import WindowUserEmail from '@common/windows/WindowUserEmail';
import WindowUserFavorites from '@common/windows/WindowUserFavorites';
import WindowUserLogin from '@common/windows/WindowUserLogin';
import WindowUserPassword from '@common/windows/WindowUserPassword';
import WindowUserRegister from '@common/windows/WindowUserRegister';
import WindowUserReset from '@common/windows/WindowUserReset';

export const commonWindows = (app) => {
  app.component('window-about', WindowAbout);
  app.component('window-alert', WindowAlert);
  app.component('window-credits', WindowCredits);
  app.component('window-history', WindowHistory);
  app.component('window-news', WindowNews);
  app.component('window-ratings', WindowRatings);
  app.component('window-settings-background', WindowSettingsBackground);
  app.component('window-song', WindowSong);
  app.component('window-user', WindowUser);
  app.component('window-user-email', WindowUserEmail);
  app.component('window-user-favorites', WindowUserFavorites);
  app.component('window-user-login', WindowUserLogin);
  app.component('window-user-password', WindowUserPassword);
  app.component('window-user-register', WindowUserRegister);
  app.component('window-user-reset', WindowUserReset);
}
