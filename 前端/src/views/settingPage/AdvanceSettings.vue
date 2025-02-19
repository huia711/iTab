<template>
    <div class="basis">
        <p class="text">{{ t('settingPage.advance.title') }}</p>
        <blankSeparator :blankColorStyle="blankSeparatorColorStyle" height="0px 0px 20px 0px"/>
        <slider :fontColor="fontColor" @valueCallback="itemCountChange" :range="countRange" 
        :textWidth="250" :maxSliderWidth="320" :width="570" :text="t('settingPage.advance.maxSearchCount')"/>
    
    <!--管理搜索引擎-->
    <setting-item horizontal>
      <template #lable>
        <span class="text">{{ t("search.engine") }}</span>
      </template>

      <el-select v-model = "currentEngine" style="width: 90px">
        <el-option v-for="(value, key) in searchEngines" :value="key" :key="key" :label="value.name">
          {{ value.name }}
        </el-option>
      </el-select>
    </setting-item>

    <!--管理接口-->
    <setting-item horizontal>
      <template #lable>
        <span class="text">{{ t("search.suggestApi") }}</span>
      </template>

      <el-select v-model = "searchSetting.suggestion" style="width: 100px" placement="bottom">
        <el-option :value="SearchSuggestion.none" > 不使用 </el-option>
        <el-option :value="SearchSuggestion.baidu"> 百度 API </el-option>
        <el-option :value="SearchSuggestion.bing"> Bing API </el-option>
        <el-option :value="SearchSuggestion.google"> Google API </el-option>
      </el-select>
    </setting-item>

<!--    <setting-item :lable="t('search.searchRound')">-->
<!--      <a-slider-->
<!--        v-model:value="searchSetting.searchInputRadius"-->
<!--        :max="22"-->
<!--        :tip-formatter="toPixel"-->
<!--      />-->
<!--    </setting-item>-->

    <setting-item :lable="t('search.newTabOpen')" class="text" horizontal>
      <el-switch v-model = "isOpenPageByBlank" />
    </setting-item>

    <setting-item :lable="t('search.showEngineIcon')" class="text" horizontal>
      <el-switch v-model = "searchSetting.showEngineIcon" />
    </setting-item>

    <setting-item :lable="t('search.showEngineSelet')" class="text" horizontal>
      <el-switch v-model = "searchSetting.showEngineSelect" />
    </setting-item>
    </div>
</template>

<script lang="ts" setup>
import { useStore } from '@/store'
import blankSeparator from '@/components/basis/blankSeparator.vue'
import slider from '@/components/basis/SliderComponent.vue';
import settingItem from '@/components/SettingItem.vue'
import { computed } from '@vue/reactivity';
import { OpenPageTarget, SearchEngineData, SearchSetting, Option, SearchSuggestion } from "@/enum-interface"
import { SearchGetters } from "@/store/search"
import { SettingMutations } from "@/store/setting"
import { SettingsMutationTypes } from '@/store/settings'
import { useI18n } from "vue-i18n"

  const store = useStore();
  const { t } = useI18n();

  function updateSearchSetting(data: Option<SearchSetting>) {
    store.commit(SettingMutations.updateSearchSetting, data)
  }

  /**
   * 响应式对象（reactive,computed）
   */
  const searchSetting = computed(() => store.state.setting.search)
  const searchEngines = computed<SearchEngineData>(() => store.getters[SearchGetters.getUseSearchEngines])
  const currentEngine = computed({
    get: () => searchSetting.value.currentEngine,
    // 在 set 函数中，更新 store 中的搜索设置
    set: currentEngine => updateSearchSetting({ currentEngine })
  })

  // 是否在新标签页中打开
  const isOpenPageByBlank = computed({
    get: () => store.state.setting.search.openPageTarget === OpenPageTarget.Blank,
    set: isOpenPageByBlank =>
      updateSearchSetting({
        openPageTarget: isOpenPageByBlank ? OpenPageTarget.Blank : OpenPageTarget.Self
      })
  })

  const searchItemNumber = computed({
    get: ()=>store.state.settings.searchItemCount,
    set: searchItemNumber => itemCountChange(searchItemNumber)
  });

  const blankSeparatorColorStyle = computed(()=>store.state.settings.pageColorStyle.buttonColor.hex)
  const fontColor = computed(()=>store.state.settings.pageColorStyle.fontColor)

  const countRange = {
                start: 0,
                end: 8,
                baseNum: searchItemNumber
            }
  
  function itemCountChange(newVal:number){
    store.commit(SettingsMutationTypes.setSearchItemCount,newVal)
  }

</script>

<style scoped>
.basis{
    background-color: transparent;
    margin: 0px;
    padding: 10px 30px 10px 30px;
    display: flex;
    flex-direction: column;
    max-height: 600px;
    min-height: 600px;
    width: 600px;
    overflow: hidden;
}

.text{
  color: v-bind("fontColor");
}
</style>