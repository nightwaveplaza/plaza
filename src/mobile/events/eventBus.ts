import mitt from 'mitt'
import type { EventBus } from '@app/types/types.ts'

export const eventBus = mitt<EventBus>()
