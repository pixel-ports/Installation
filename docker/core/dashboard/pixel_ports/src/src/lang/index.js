import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementFrLocale from 'element-ui/lib/locale/lang/fr' // element-ui lang
import elementEsLocale from 'element-ui/lib/locale/lang/es' // element-ui lang
import elementItLocale from 'element-ui/lib/locale/lang/it' // element-ui lang
import elementElLocale from 'element-ui/lib/locale/lang/el' // element-ui lang
import enLocale from './en'
import frLocale from './fr'
import esLocale from './es'
import itLocale from './it'
import elLocale from './el'

Vue.use(VueI18n)
const
  messages = {
    en: {
      ...enLocale,
      ...elementEnLocale
    },
    fr: {
      ...frLocale,
      ...elementFrLocale
    },
    es: {
      ...esLocale,
      ...elementEsLocale
    },
    it: {
      ...itLocale,
      ...elementItLocale
    },
    el: {
      ...elLocale,
      ...elementElLocale
    }
  }
export function getLanguage() {
  const chooseLanguage = Cookies.get('language')
  if (chooseLanguage) return chooseLanguage

  // if has not choose language
  const language = (
    navigator.language || navigator.browserLanguage
  ).toLowerCase()
  const locales = Object.keys(messages)
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      return locale
    }
  }
  return 'en'
}
const i18n = new VueI18n({
  // set locale
  // options: en | zh | es
  locale: getLanguage(),
  // set locale messages
  messages
})

export default i18n
