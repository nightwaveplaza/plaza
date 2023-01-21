import WinAlerts from '@common/components/WinAlerts';
import WinButton from '@common/components/WinButton';
import WinCaptcha from '@common/components/WinCaptcha';
import WinList from '@common/components/WinList';
import WinMemo from '@common/components/WinMemo';
import WinNewsLoader from '@common/components/WinNewsLoader';
import WinPagination from '@common/components/WinPagination';
import WinPlayerReactions from '@common/components/WinPlayerReactions';
import WinPlayerTime from '@common/components/WinPlayerTime';
import WinSongInfo from '@common/components/WinSongInfo';
import WinTaskbar from '@common/components/WinTaskbar';
import WinWindow from '@common/components/WinWindow.vue';

export const commonComponents = (app) => {
  app.component('win-alerts', WinAlerts);
  app.component('win-btn', WinButton);
  app.component('win-captcha', WinCaptcha);
  app.component('win-list', WinList);
  app.component('win-memo', WinMemo);
  app.component('win-news-loader', WinNewsLoader);
  app.component('win-pagination', WinPagination);
  app.component('win-player-reactions', WinPlayerReactions);
  app.component('win-player-time', WinPlayerTime);
  app.component('win-song-info', WinSongInfo);
  app.component('win-taskbar', WinTaskbar);
  app.component('win-window', WinWindow);
};
