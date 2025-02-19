<template>
  <slot/>
</template>

<script lang="ts" setup type="module">
  /**
   * 导入（import）
   */
  import {computed, watchEffect, watch} from "vue"
  import {useStore} from "@/store"
  import { SettingMutations } from "@/store/setting"
  // 导入外部定义
  import {LanguageType, ThemeMode} from "@/enum-interface"
  import { usePreferredDark } from "@/utils/use"
  // 外部
  import dayjs from "@/plugins/dayjs"
  import { useI18n } from "vue-i18n"
  import { useDark, useToggle } from '@vueuse/core'


  /**
   * 常/变量（const/let）的定义
   */
  // 获取本地化工具用于国际化日期格式和语言设置
  const store = useStore()
  const { locale } = useI18n()

  // 定义Dark（useDark）控制Theme
  const Dark = useDark ({
    // 存储到localStorage/sessionStorage中的Key 根据自己的需求更改
    storageKey: 'useDarkKEY',
    // 暗黑class名字
    valueDark: 'dark',
    // 高亮class名字
    valueLight: 'light',
  })
  const toggle = useToggle(Dark);

  // 获取系统主题
  const isDark = usePreferredDark()


  /**
   * 使用 computed 进行响应计算（自动跟踪）
   * 这里用于实现自动选择（Auto）
   */
  // 设置的主体（theme）
  const theme = computed({
    get: () => store.state.setting.themeMode,
    set: theme => store.commit(SettingMutations.updateThemeMode, theme)
  })
  const lang = computed(() => store.state.setting.lang)

  // 获取实时的系统主题（theme）
  // 使用computed自动更新：如果props传入主题为 "auto" 并且prefer-dark为真，则返回 "dark" 主题，否则返回 "light" 主题
  const currentTheme = computed(() => {
      {
        if ( theme.value === ThemeMode.Auto) {
          return isDark.value ? ThemeMode.Dark : ThemeMode.Light
        } else {
          return theme.value
        }
      }
    })

  // 当前语言，使用computed自动更新：如果props传入语言为 "auto" 则返回浏览器的当前语言配置，否则返回props传入的语言
  const currentLang = computed(() => {
    return lang.value === LanguageType.Auto ? navigator.language : lang.value
  })


  /**
   * 使用 watchEffect 进行响应计算（自动跟踪）
   * 这里用于更新 DOM
   */
  // 监听并设置主题
  watch(() => currentTheme.value, (newValue, oldValue) => {
    // 改变了 && 不是第一次
    if (newValue !== oldValue && oldValue !== undefined) {
      toggle()
      if(newValue === ThemeMode.Dark){
        // 黑夜模式
        const tempPageColorStyle = Object({
          backgroundColor:{
            hex:"#000000",
            alpha:1
          },
          buttonColor: {
            hex:"#ffffff",
            alpha:0.3
          },
          fontColor:"white",
          customBackgroundColor: store.state.settings.pageColorStyle.customBackgroundColor,
          customButtonColor: store.state.settings.pageColorStyle.customButtonColor,
          presetColor: 1
        })
        store.commit("setPageColorStyle",tempPageColorStyle)
      } else if (newValue === ThemeMode.Light) {
        // 白天模式
        const tempPageColorStyle = Object({
          backgroundColor:{
            hex:"#ffffff",
            alpha:1
          },
          buttonColor: {
            hex:"#000000",
            alpha:0.3
          },
          fontColor:"black",
          customBackgroundColor: store.state.settings.pageColorStyle.customBackgroundColor,
          customButtonColor: store.state.settings.pageColorStyle.customButtonColor,
          presetColor: 0
        })
        store.commit("setPageColorStyle",tempPageColorStyle)
      }
    }
  }, {
    deep: true,      // 深度监听属性的变化
    immediate: true, // 立即执行一次回调函数
    flush: 'async'   // 在下一次事件循环时刷新
  })

  watch(() => isDark.value, (newValue, oldValue) => {
    if (oldValue ? ThemeMode.Dark : ThemeMode.Light === currentTheme.value) {
      store.commit(SettingMutations.updateThemeMode, newValue ? ThemeMode.Dark : ThemeMode.Light)
    }

    if (oldValue === undefined) {
      if(newValue){
        // 黑夜模式
        const tempPageColorStyle = Object({
          backgroundColor:{
            hex:"#000000",
            alpha:1
          },
          buttonColor: {
            hex:"#ffffff",
            alpha:0.3
          },
          fontColor:"white",
          customBackgroundColor: store.state.settings.pageColorStyle.customBackgroundColor,
          customButtonColor: store.state.settings.pageColorStyle.customButtonColor,
          presetColor: 1
        })
        store.commit("setPageColorStyle",tempPageColorStyle)
      } else {
        // 白天模式
        const tempPageColorStyle = Object({
          backgroundColor:{
            hex:"#ffffff",
            alpha:1
          },
          buttonColor: {
            hex:"#000000",
            alpha:0.3
          },
          fontColor:"black",
          customBackgroundColor: store.state.settings.pageColorStyle.customBackgroundColor,
          customButtonColor: store.state.settings.pageColorStyle.customButtonColor,
          presetColor: 0
        })
        store.commit("setPageColorStyle",tempPageColorStyle)
      }
    }
  }, {
    deep: true,      // 深度监听属性的变化
    immediate: true, // 立即执行一次回调函数
    flush: 'async'   // 在下一次事件循环时刷新
  })

  // 监听并设置语言
  watchEffect(() => {
    const lang = currentLang.value

    locale.value = lang
    dayjs.locale(lang)
  })
</script>





<!--虽然 watchEffect 和 computed 都是响应式数据的派生值，但是它们有着本质的区别。-->
<!-- - 数据来源不同： computed 的派生值是根据其他响应式数据计算得出的，而 watchEffect 中的回调函数可以使用任何数据，并且可以包含副作用。-->
<!-- - 执行时机不同： computed 的派生值是惰性求值的，只会在依赖的响应式数据发生变化时才重新计算；而 watchEffect 中的回调函数在初始化时会执行一次，并在其中追踪响应式数据的变化来执行相应的副作用，即使没有使用到任何响应式数据也会立即执行一次。-->
<!-- - 返回值不同： computed 返回一个新的响应式数据，而 watchEffect 不返回数据，仅在回调函数中执行副作用。-->
<!--因此，可以简单地总结为：computed 用于派生新的响应式数据并对数据进行操作，而 watchEffect 用于在特定的数据变化时执行副作用。-->
<!--在实际开发中，通常可以根据不同的需求来选择使用 computed 或 watchEffect。如果需要用到 computed 的特殊属性（如：get 或 set），或需要计算出一个新的响应式数据，可以使用 computed。而如果需要执行一些副作用操作（如：更新 DOM，发送请求等），则应该使用 watchEffect-->