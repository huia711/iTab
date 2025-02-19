<template>
  <div class="other-setting">
    <setting-item :lable="t('other.lang')" horizontal>
      <el-select v-model = 'lang' style="width: 100px">
        <el-option v-for = "(value, key) in languages" :value="key" :key="key" :label="value">
          {{ value }}
        </el-option>
      </el-select>
    </setting-item>

<!--    <setting-item :lable="t('other.backup.text')">-->
<!--      <div class="backup-btn-warp">-->
<!--        <a-button @click="exportBackupFile">-->
<!--          <template #icon>-->
<!--            <DownloadOutlined />-->
<!--          </template>-->

<!--          {{ t("other.backup.export") }}-->
<!--        </a-button>-->
<!--        <a-upload-->
<!--          accept="application/json"-->
<!--          :show-upload-list="false"-->
<!--          :customRequest="importBackupFile"-->
<!--        >-->
<!--          <a-button>-->
<!--            <template #icon>-->
<!--              <UploadOutlined />-->
<!--            </template>-->

<!--            {{ t("other.backup.import") }}-->
<!--          </a-button>-->
<!--        </a-upload>-->
<!--      </div>-->
<!--    </setting-item>-->
  </div>
</template>

<script lang="ts" setup type="module">
  /**
   * 导入（import）
   */
  import { computed, ref } from "vue"
  import { useStore } from "@/store"
  import { SettingActions, SettingMutations } from "@/store/setting"
  // 导入组件Component
  import SettingItem from "@/components/SettingItem.vue"
  // 外部导入
  import { useI18n } from "vue-i18n"
  // import { UploadOutlined, DownloadOutlined } from "@ant-design/icons-vue"
  import { Option, SearchSetting } from "@/enum-interface"
  // import { deepComputed, otherKeys } from "@/utils/common"
  // import { Permis } from "@/plugins/extension"

  /**
   * 常/变量（const/let）的定义
   */
  // 获取当前应用使用的国际化 API 和支持的语言列表
  const { t, availableLocales } = useI18n()
  // 获取当前应用的 Store 实例
  const store = useStore()

  // 声明一个名为 `languages` 的响应式对象，并指定其类型为 Record<string, any>
  const languages = ref<Record<string, any>>({
    // 初始化 `auto` 属性为一个计算属性，使用 t() 函数获取 `common.auto` 翻译文本
    auto: computed(() => t("common.auto")),
    // 使用 availableLocales 数组生成一个对象，其中每个元素都会被转换成 key-value 对
    ...Object.fromEntries(
        // 遍历所有 availableLocales 数组元素，将它们转换为语言翻译的 key-value 对
        availableLocales.map(item => [item, t("lang", item, { locale: item })])
    )
  })

  /**
   * 响应式对象（reactive,computed）
   */
  // 创建一个计算属性 lang，用于读写应用的当前语言
  const lang = computed({
    // 读取 Store 中的语言设置
    get: () => store.state.setting.lang,
    // 更新 Store 中的语言设置
    set: lang => store.commit(SettingMutations.updateLanguage, lang)
  })

  // const searchSetting = deepComputed(
  //   () => store.state.setting.search,
  //   updateSearchSetting,
  //   ...otherKeys(store.state.setting.search, "overwriteSearch")
  // )

  // 导入一个备份文件
  // async function importBackupFile(e) {
  //   try {
  //     const file: File = e.file
  //     await store.dispatch(SettingActions.importSetting, file)
  //   } catch (e) {
  //     console.log(e)
  //   }
  //
  //   // 导入成功刷新页面
  //   location.reload()
  // }

  // function exportBackupFile() {
  //   store.dispatch(SettingActions.exportSetting)
  // }
  //
  // function updateSearchSetting(data: Option<SearchSetting>) {
  //   store.commit(SettingMutations.updateSearchSetting, data)
  // }
</script>

<style lang="less">
  .other-setting {
    .backup-btn-warp {
      display: flex;
      justify-content: space-around;

      button {
        width: 156px;
      }
    }
  }
</style>
