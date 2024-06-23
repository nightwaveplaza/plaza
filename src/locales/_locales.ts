import en from '@locales/en.json'
import es from '@locales/es.json'
import ru from '@locales/ru.json'
import de from '@locales/de.json'
import pt_BR from '@locales/pt_BR.json'

interface JSONValue {
  [key: string]: string | JSONValue
}

interface LocaleArray {
  [key: string]: JSONValue
}

export default {
  'en': en,
  'de': de,
  'pt-BR': pt_BR,
  'ru': ru,
  'es': es,
} as LocaleArray
