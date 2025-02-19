// 使用了 vue-i18n 库创建一个多语言应用程序

import { createI18n } from "vue-i18n"
import enLocale from "@/locales/en"
import zh_cnLocale from "@/locales/zh-cn"
import zh_twLocale from "@/locales/zh-tw"

const messages = {
  zh_tw: zh_twLocale,
  zh_cn: zh_cnLocale,
  en: enLocale
}

const i18n = createI18n({
  legacy: false, // 启用或禁用“旧版”API
  locale: navigator.language,
  fallbackLocale: "zh_cn",
  missingWarn: false,
  fallbackWarn: false,
  messages // 一个对象，它包含有关翻译消息的信息，可以使用 @intlify/vite-plugin-vue-i18n 插件自动加载和管理。该对象通常包含语言环境对应的键值对。
})

export default i18n;

