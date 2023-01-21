import WinMenu from '@desktop/components/WinMenu';
import WinPlayer from '@desktop/components/WinPlayer';
import WinPlayerStatus from '@desktop/components/WinPlayerStatus';
import WinPlayerVolume from '@desktop/components/WinPlayerVolume';

export const desktopComponents = (app) => {
  app.component('win-menu', WinMenu);
  app.component('win-player', WinPlayer);
  app.component('win-player-status', WinPlayerStatus);
  app.component('win-player-volume', WinPlayerVolume);
}
