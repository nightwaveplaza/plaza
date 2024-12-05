import en from '@locales/en.json'
import es from '@locales/es.json'
import ru from '@locales/ru.json'
import de from '@locales/de.json'
import it from '@locales/it.json'
import ca from '@locales/ca.json'
import ja from '@locales/ja.json'
import pt_BR from '@locales/pt_BR.json'

interface JSONValue {
  [key: string]: string | JSONValue
}

interface LocaleArray {
  [key: string]: JSONValue
}

export default {
  'ca': ca,
  'de': de,
  'en': en,
  'es': es,
  'it': it,
  'ja': ja,
  'pt-BR': pt_BR,
  'ru': ru,
} as LocaleArray
