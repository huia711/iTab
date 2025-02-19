<template>
  <div class="theme-setting">
    <setting-item :lable="t('theme.mode')">

      <div class="theme-mode">
        <el-tooltip v-bind = "themeMode" v-for="item in themeModes" :content="item.name" :key="item.name">
          <div class="theme-item" @click="onThemeChange(item.mode)">
            <img :src="item.icon" />
            <transition name="scale">
              <check-circle-filled class="select-icon" v-if="item.mode === themeMode" />
            </transition>
          </div>
        </el-tooltip>
      </div>
    </setting-item>
  </div>
</template>

<script lang="ts" setup type="module">
  /**
   * 导入（import）
   */
  import { computed } from "vue"
  import { useStore } from "@/store"
  import { SettingMutations } from "@/store/setting"
  // 导入组件Component
  import SettingItem from "@/components/SettingItem.vue"
  // 导入外部定义
  import { ThemeMode } from "@/enum-interface"
  // 外部导入
  import { useI18n } from "vue-i18n"
  import { CheckCircleFilled } from "@ant-design/icons-vue"
  import AutoMode from "@/assets/auto-mode.svg"
  import LightMode from "@/assets/light-mode.svg"
  import DarkMode from "@/assets/dark-mode.svg"

  /**
   * 常/变量（const/let）的定义
   */
  const themeModes = [
    {
      name: "跟随系统",
      mode: ThemeMode.Auto,
      icon: AutoMode
    },
    {
      name: "浅色模式",
      mode: ThemeMode.Light,
      icon: LightMode
    },
    {
      name: "深色模式",
      mode: ThemeMode.Dark,
      icon: DarkMode
    }
  ]

  const { t } = useI18n()
  const store = useStore()

  /**
   * 响应式对象（reactive,computed）
   */
  const themeMode = computed(() => store.state.setting.themeMode)

  /**
   * 函数（function）定义
   */
  function onThemeChange(themeMode: ThemeMode) {
    store.commit(SettingMutations.updateThemeMode, themeMode)
  }
</script>

<style lang="less">
  .theme-setting {
    .theme-mode {
      display: flex;
      column-gap: 8px;

      .theme-item {
        position: relative;
        cursor: pointer;

        img {
          height: 45px;
          width: 52px;
        }

        .select-icon {
          //color: @primary-color;
          position: absolute;
          bottom: 8px;
          right: 8px;
        }
      }
    }
  }
</style>
