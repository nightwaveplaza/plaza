import '@mobile/styles/dist.scss';
import '@app/styles/ui/ui.scss';
import '@mobile/styles/app.scss';

import { createApp, h } from 'vue';
import plazaComponents from '@app/components/basic';
import plazaExtraComponents from '@app/components/extra';
import plazaPlayer from '@app/components/player';
import plazaWindows from '@app/components/windows';
import App from '@mobile/App.vue';
import { i18n } from '@locales/_i18n.ts';

const app = createApp({
  render: () => h(App),
});

// Fix button active state on iOS
if ('ontouchstart' in document.documentElement) {
  document.body.addEventListener('touchstart', () => {}, { passive: true });
}

app.use(i18n);

app.use(plazaComponents);
app.use(plazaExtraComponents);
app.use(plazaPlayer);
app.use(plazaWindows);

app.component('app', App);
app.mount('#app');
