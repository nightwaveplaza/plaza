import mitt from 'mitt'
import type { EventBus } from '@app/types'

export const eventBus = mitt<EventBus>()
