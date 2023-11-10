import { resolve } from 'path'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, splitVendorChunkPlugin, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  // const base = process.env.VITE_APP === 'mobile' ? '' : '/'
  const root = resolve(__dirname, 'src/' + process.env.VITE_APP)
  const minify = process.env.VITE_USER_NODE_ENV !== 'development'
  const base = process.env.VITE_APP === 'mobile' ? '' : '/'

  return defineConfig({
    plugins: [
      vue(),
      // getSplitVendorChunkPlugin(process.env),
      getLegacyPlugin(process.env)
    ],

    root,
    base,
    publicDir: 'public',
    envDir: resolve(__dirname),
    build: {
      outDir: resolve(__dirname, process.env.VITE_BUILD_PATH),
      emptyOutDir: true,
      manifest: false,
      rollupOptions: {
        input: '/index.html'
      },
      // target: 'es2015',
      assetsInlineLimit: 4096,
      minify,
    },

    define: {
      __APP_VERSION__: getBuildDate(),
    },

    resolve: {
      alias: {
        '@common': fileURLToPath(new URL('./src/common', import.meta.url)),
        '@desktop': fileURLToPath(new URL('./src/desktop', import.meta.url)),
        '@mobile': fileURLToPath(new URL('./src/mobile', import.meta.url)),
      },
    },
  })
}

function getLegacyPlugin (env) {
  if (env.VITE_USER_NODE_ENV === 'development')
    return null
  else
    return legacy({
      targets: 'defaults, android >= 4.4.4, ios >= 7',
      externalSystemJS: true
    })
}

function getSplitVendorChunkPlugin (env) {
  if (env.VITE_APP === 'mobile') {
    return null
  } else {
    return splitVendorChunkPlugin()
  }
}

function getBuildDate () {
  return new Date().toISOString().slice(0, 10).replace(/-/g, '')
}
