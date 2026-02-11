import type { AlertWindowParams, WindowState } from '@app/types'

const glob = import.meta.glob(
  '@app/assets/icons/*.png', { eager: true, import: 'default' },
) as Record<string, string>

export interface IconData {
  src: string;
  srcset: string;
}

const icons: Record<string, IconData> = {}

const tempStore: Record<string, { x1?: string; x2?: string }> = {}

for (const path in glob) {
  const fileUrl = glob[path]

  const fileName = path.split('/').pop() || ''

  let iconName = ''
  let is2x = false

  if (fileName.includes('@2x')) {
    iconName = fileName.replace('@2x.png', '')
    is2x = true
  } else {
    iconName = fileName.replace('.png', '')
    is2x = false
  }

  if (!tempStore[iconName]) {
    tempStore[iconName] = {}
  }

  if (is2x) {
    tempStore[iconName]!.x2 = fileUrl
  } else {
    tempStore[iconName]!.x1 = fileUrl
  }
}

for (const [name, urls] of Object.entries(tempStore)) {
  if (urls.x1) {
    icons[name] = {
      src: urls.x1,
      srcset: urls.x2 ? `${urls.x1} 1x, ${urls.x2} 2x` : `${urls.x1} 1x`,
    }
  }
}

const getWindowIcon = (state: WindowState): IconData => {
  let iconName: string

  if (state.isAlert) {
    const params = state.params as AlertWindowParams
    iconName = params.type === 'info' ? 'msg_information' : 'msg_warning'
  } else {
    iconName = state.icon ?? 'ball'
  }

  return icons[iconName] || icons['ball']!
}

export { getWindowIcon }