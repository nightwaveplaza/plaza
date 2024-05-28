import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv, type Plugin, type UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'

export default ({ mode }: { mode: string }): UserConfig => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  // const base = process.env.VITE_APP === 'mobile' ? '' : '/'
  const root: string = resolve(__dirname, 'src/' + process.env.VITE_APP)
  const minify: boolean = process.env.NODE_ENV !== 'development'
  const base: string = process.env.VITE_APP === 'mobile' ? '' : '/'

  return defineConfig({
    plugins: [
      vue(),
      // getSplitVendorChunkPlugin(process.env),
      getLegacyPlugin(process.env),
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

function getLegacyPlugin (env: NodeJS.ProcessEnv): Plugin[] | null {
  if (env.NODE_ENV === 'development') {
    return null
  }
  else {
    if (env.VITE_APP === 'mobile') {
      return legacy({
        targets: 'defaults, android >= 5.0, ios >= 12',
        externalSystemJS: true,
      })
    } else {
      return legacy({
        targets: 'defaults, android >= 4.4.4, ios >= 7',
        externalSystemJS: true,
      })
    }
  }
}

// function getSplitVendorChunkPlugin (env: NodeJS.ProcessEnv) {
//   if (env.VITE_APP === 'mobile') {
//     return null
//   } else {
//     return splitVendorChunkPlugin()
//   }
// }

function getBuildDate (): string {
  return new Date().toISOString().slice(0, 10).replace(/-/g, '')
}
