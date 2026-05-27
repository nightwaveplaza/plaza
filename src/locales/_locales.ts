import ca_ES from '@locales/ca-ES.json';
import de_DE from '@locales/de-DE.json';
import en_US from '@locales/en-US.json';
import es_ES from '@locales/es-ES.json';
import it_IT from '@locales/it-IT.json';
import ja_JP from '@locales/ja-JP.json';
import pt_BR from '@locales/pt-BR.json';
import ru_RU from '@locales/ru-RU.json';
import tr_TR from '@locales/tr-TR.json';
import zh_TW from '@locales/zh-TW.json';

interface JSONValue {
  [key: string]: string | JSONValue;
}

interface LocaleArray {
  [key: string]: JSONValue;
}

export default {
  'ca-ES': ca_ES,
  'de-DE': de_DE,
  'en-US': en_US,
  'es-ES': es_ES,
  'it-IT': it_IT,
  'ja-JP': ja_JP,
  'pt-BR': pt_BR,
  'ru-RU': ru_RU,
  'tr-TR': tr_TR,
  'zh-TW': zh_TW,
} as LocaleArray;
