import en from '@locales/en.json'
import es from '@locales/es.json'
import ru from '@locales/ru.json'
import de from '@locales/de.json'

interface JSONValue {
  [key: string]: string | JSONValue
}

interface LocaleArray {
  [key: string]: JSONValue
}

export default {
  'de': de,
  'en': en,
  'es': es,
  'ru': ru
} as LocaleArray
