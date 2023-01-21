import * as Vue from 'vue';
import * as WindowDonate from '@mobile/windows/WindowDonate';
import * as WindowLoading from '@mobile/windows/WindowLoading';
import * as WindowPlayer from '@mobile/windows/WindowPlayer';
import * as WindowPlayerTimer from '@mobile/windows/WindowPlayerTimer';
import * as WindowSettings from '@mobile/windows/WindowSettings';

Vue.component('window-donate', WindowDonate);
Vue.component('window-loading', WindowLoading);
Vue.component('window-player', WindowPlayer);
Vue.component('window-player-timer', WindowPlayerTimer);
Vue.component('window-settings', WindowSettings);
