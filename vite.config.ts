import { resolve } from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv, type UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import legacy from '@vitejs/plugin-legacy';
import type { Plugin } from 'vite';
import nginxRoutesPlugin from './vite-plugin-nginx-routes';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default ({ mode }: { mode: string }): UserConfig => {
  const env = loadEnv(mode, process.cwd(), '');

  const appType = env.VITE_APP;

  if (!appType) {
    throw new Error('VITE_APP is not defined');
  }

  const root: string = resolve(__dirname, 'src/' + appType);
  const minify: boolean = env.NODE_ENV !== 'development';
  const base: string = env.VITE_APP === 'mobile' ? '' : '/';

  return defineConfig({
    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: tag => tag.startsWith('altcha-'),
          },
        },
      }),
      getLegacyPlugin(env),
      nginxRoutesPlugin({
        routesFile: 'src/app/router/routes.ts',
        outDir: 'dist',
        mapVar: '$spa_match',
      }),
      basicSsl(),
    ],

    root,
    base,
    publicDir: 'assets/public',
    envDir: resolve(__dirname),
    build: {
      outDir: resolve(__dirname, env.VITE_BUILD_PATH ?? 'dist'),
      emptyOutDir: true,
      manifest: false,
      rollupOptions: {
        input: '/index.html',
        output: {
          manualChunks: id => {
            if (id.includes('hls.js')) {
              return 'hls';
            }
            if (id.includes('node_modules')) {
              return 'vendor';
            }
            if (id.includes('app/styles/ui')) {
              return 'ui';
            }
            if (id.includes('app/styles/app')) {
              return 'app';
            }
            if (id.includes('app/styles/dist')) {
              return 'dist';
            }
          },
        },
      },
      target: ['es2015'],
      assetsInlineLimit: 4096,
      minify,
    },

    define: {
      __APP_VERSION__: JSON.stringify(getBuildDate()),
    },

    resolve: {
      alias: {
        '@app': fileURLToPath(new URL('./src/app', import.meta.url)),
        '@mobile': fileURLToPath(new URL('./src/mobile', import.meta.url)),
        '@locales': fileURLToPath(new URL('./src/locales', import.meta.url)),
        'hls.js': 'hls.js/dist/hls.light.mjs',
      },
    },

    css: {
      preprocessorOptions: {
        scss: {
          quietDeps: true,
          silenceDeprecations: ['mixed-decls', 'color-functions', 'global-builtin', 'import'],
        },
      },
    },
  });
};

function getLegacyPlugin(env: NodeJS.ProcessEnv): Plugin[] | null {
  if (env.VITE_APP !== 'mobile' || env.NODE_ENV === 'development') {
    return null;
  }

  return legacy({
    targets: ['chrome >= 51', 'ios >= 12'],
    polyfills: [
      'es.symbol',
      'es.promise',
      'es.promise.finally',
      'es.array.iterator',
      'es.object.assign',
    ],
    renderLegacyChunks: true,
    modernPolyfills: true,
  });
}

function getBuildDate(): string {
  return new Date().toISOString().slice(0, 10).replace(/-/g, '');
}
