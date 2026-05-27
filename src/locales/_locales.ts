import ca from '@locales/ca.json';
import de from '@locales/de.json';
import en from '@locales/en_US.json';
import es from '@locales/es.json';
import it from '@locales/it.json';
import ja from '@locales/ja.json';
import pt_BR from '@locales/pt_BR.json';
import ru from '@locales/ru.json';
import tr from '@locales/tr.json';
import zh_Hant from '@locales/zh_Hant.json';

interface JSONValue {
  [key: string]: string | JSONValue;
}

interface LocaleArray {
  [key: string]: JSONValue;
}

export default {
  ca: ca,
  de: de,
  en: en,
  es: es,
  it: it,
  ja: ja,
  'pt-BR': pt_BR,
  ru: ru,
  tr: tr,
  'zh-Hant': zh_Hant,
} as LocaleArray;
