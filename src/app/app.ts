import '@app/styles/dist.scss';
import '@app/styles/ui/ui.scss';
import '@app/styles/app.scss';

import { createApp, h } from 'vue';
import { router } from '@app/router';
import { i18n } from '@locales/_i18n';
import plazaComponents from '@app/components/basic';
import plazaExtraComponents from '@app/components/extra';
import plazaPlayer from '@app/components/player';
import plazaWindows from '@app/components/windows';
import App from '@app/views/App.vue';

// Fix button active state on iOS
if ('ontouchstart' in document.documentElement) {
  document.body.addEventListener('touchstart', () => {}, { passive: true });
}

const app = createApp({
  render: () => h(App),
});

app.use(router);
app.use(i18n);

// Components
app.use(plazaComponents);
app.use(plazaExtraComponents);
app.use(plazaPlayer);
app.use(plazaWindows);

app.component('App', App);
app.mount('#app');
