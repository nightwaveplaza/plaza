import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv, type Plugin, type UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'

export default ({ mode }: { mode: string }): UserConfig => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  const root: string = resolve(__dirname, 'src/' + process.env.VITE_APP)
  const minify: boolean = process.env.NODE_ENV !== 'development'
  const base: string = process.env.VITE_APP === 'mobile' ? '' : '/'

  return defineConfig({
    plugins: [
      vue(),
      //getLegacyPlugin(process.env),
    ],

    root,
    base,
    publicDir: 'assets/public',
    envDir: resolve(__dirname),
    build: {
      outDir: resolve(__dirname, process.env.VITE_BUILD_PATH!),
      emptyOutDir: true,
      manifest: false,
      rollupOptions: {
        input: '/index.html',
        output: {
          manualChunks: (id) => {
            if (id.includes('hls.js')) {return 'hls'}
            if (id.includes('node_modules')) {return 'vendor'}
          }
        },
      },
      // target: 'es2015',
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
      },
    },
  })
}

// function getLegacyPlugin (env: NodeJS.ProcessEnv): Plugin[] | null {
//   // todo do we really need polyfill?
//   if (env.VITE_APP === 'mobile') {
//     return legacy({
//       targets: 'defaults, android >= 5.0, ios >= 12',
//     })
//   } else {
//     return null
//   }
// }

function getBuildDate (): string {
  return new Date().toISOString().slice(0, 10).replace(/-/g, '')
}
