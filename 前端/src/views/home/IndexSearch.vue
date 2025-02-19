<template>
  <!-- 搜索框的外层容器 -->
  <div class="search" ref="searchWarp">

    <!-- 如果配置项中要求，显示搜索引擎图标 -->
    <div class="search-logo"  v-if="searchSetting.showEngineIcon ">
       <img :src="searchEngines[currentEngine].icon" class="logo" alt="logo" draggable="false" />
    </div>

    <!-- 输入框容器 -->
    <el-affix :offset="offset" position="top">
      <div class="search-input" ref="searchInput">
        <!--自动完成搜索建议-->
        <!-- 搜索输入框，按下回车键或点击搜索按钮时触发搜索事件 -->
        <el-autocomplete :placeholder="t('home.search')"
                         v-model="inputSearch"
                         type="text"
                         class="input-with-select"
                         clearable
                         autofocus
                         highlight-first-item
                         fit-input-width
                         @keyup.enter="onSearch(inputSearch)"
                         @keydown="onSwitchEngines"

                         :fetch-suggestions="querySearch"
                         popper-class="my-autocomplete"
                         @clear="commit(SearchMutations.cleanHistory)"
        >
          <!-- 搜索引擎选项卡 -->
          <template #prepend v-if="searchSetting.showEngineSelect">
            <el-select v-model = "currentEngine">
              <el-option v-for = "(value, key) in searchEngines" :value="key" :key="key" :label="value.name" class="option">
                {{ value.name }}
              </el-option>
            </el-select>
          </template>
          <!-- 搜索按钮 -->
          <template #append>
            <el-button :icon="Search" @click = "onSearch(inputSearch)"></el-button>
          </template>

          <template #default>

          </template>
        </el-autocomplete>
      </div>
    </el-affix>
  </div>
</template>

<script lang="ts" setup type="module">
  /**
   * 导入（import）
   */
  import { useStore } from "@/store"
  import {SearchActions, SearchGetters, SearchMutations} from "@/store/search" // 引入搜索业务模块中的 Actions 和 Getters
  import { SettingMutations } from "@/store/setting" // 引入设置业务模块中的 Mutations
  import {ref, computed, watch} from "vue"
  // 导入外部定义
  import {HistoryItem, Option, SearchSetting, SearchSuggestion} from "@/enum-interface" // 引入一些用于标记类型的枚举或接口类型
  import {isEmpty, matchPrefix} from "@/utils/common" // 引入一个工具函数用于判断一个值是否为空
  // 外部导入
  import { useI18n } from "vue-i18n"
  import { ElMessage } from "element-plus"
  import {Delete, Search} from '@element-plus/icons-vue'
  import {debounce} from "@/utils/async";
  import axios from "@/plugins/axios";

  // 联想项
  interface SuggestionItem {
    // 联想项的标题
    title?: string
    // 联想项的值
    value: string
  }

  /**
   * 常/变量（const/let）的定义
   */
  const { t } = useI18n()
  // 使用 useStore 函数，获取 store 对象，并解构出需要用到的 state，getters，commit，dispatch 函数
  const { state: stateX, getters, commit, dispatch } = useStore()
  // 搜索框输入值的变量
  const offset = ref(100)
  let inputSearch = ref("")
  let Result:string[] = []

  /**
   * 响应式对象（reactive,computed）
   */
  // 定义 reactive 变量，并使用 computed 进行响应计算
  const searchWarp = ref<HTMLElement>()
  const searchEngines = computed(() => getters[SearchGetters.getUseSearchEngines])
  const searchSetting = computed(() => stateX.setting.search)
  const userID = computed(() => stateX.settings.userId).value
  const MaxSearch = computed(() => stateX.settings.searchItemCount)

  // 当前搜索引擎
  const currentEngine = computed({
    get: () => searchSetting.value.currentEngine,
    // 在 set 函数中，更新 store 中的搜索设置
    set: currentEngine => updateSearchSetting({ currentEngine })
  })

  // 加载搜索记录
  const searchSuggestion = computed<SuggestionItem[]>(() => {
    const suggestionItems: SuggestionItem[] = stateX.search.history.map((item) => {
      return {
        title: '',
        value: item.searchText
      };
    });
    return suggestionItems
  })

  /**
   * 函数（function）定义
   */

  /**
   * 搜索框搜索事件
   * 将搜索内容重定向到搜索引擎
   */
  function onSearch(search: string) {
    // commit(SearchMutations.cleanHistory)
    if (isEmpty(search))
      ElMessage({
        title: 'Warning',
        message: t('home.warning'),
        type: 'warning',
      })
    else {
      dispatch(SearchActions.submitSearch, {search: search, userID: userID})
    }
  }

  /**
   * 搜索建议自动完成处理
   * 获取搜索建议数据
   */
  const querySearch = debounce(handleSearchSuggestion)
  async function handleSearchSuggestion(queryString: string, cb: any) {
    let results
    if (isEmpty(queryString)) {
      results = searchSuggestion.value
    } else {
      // 获得api搜索建议
      switch (stateX.setting.search.suggestion) {
        case SearchSuggestion.baidu:
          await getBaiduSuggestion(queryString)
          break;
        case SearchSuggestion.bing:
          await getBingSuggestion(queryString)
          break;
        case SearchSuggestion.google:
          await getGoogleSuggestion(queryString)
          break;
        default:
          break;
      }

      const suggestionObject = []

      Result.forEach(str => {
        const obj = {
          title: "",
          value: str
        }
        suggestionObject.push(obj)
      })

      results = searchSuggestion.value.filter(createFilter(queryString)).concat(suggestionObject);
      console.log(results)
    }
    cb(results)
  }

  // 同步获取baidu搜索建议
  async function getBaiduSuggestion(keyword: string): Promise<string[]> {
    try {
      await axios.get('http://localhost:2020/user/baiduSuggestion?keyword='+keyword).then(response => {
        if (response.data.code === 200 && response.data.data.suggestion.s !== null) {
          Result = response.data.data.suggestion.s
        }
        return Result
      }, (error) => {
        ElMessage({
          message: "无法连接服务器",
          type: 'warning',
        })
      })
    } catch (error) {
      console.log(error)
    }
  }
  // 同步获取bing搜索建议
  async function getBingSuggestion(keyword: string): Promise<string[]> {
    try {
      await axios.get('http://localhost:2020/user/bingSuggestion?keyword='+keyword).then(response => {
        console.log(response.data.data.suggestion.Txt)
        if (response.data.code === 200 && response.data.data.suggestion.Txt !== null) {
          Result = response.data.data.suggestion.Txt
        }
        return Result
      }, (error) => {
        ElMessage({
          message: "无法连接服务器",
          type: 'warning',
        })
      })
    } catch (error) {
      console.log(error)
    }
  }
  // 同步获取google搜索建议
  async function getGoogleSuggestion(keyword: string): Promise<string[]> {
    try {
      await axios.get('http://localhost:2020/user/googleSuggestion?keyword='+keyword).then(response => {
        if (response.data.code === 200 && response.data.data.suggestion.Txt !== null) {
          Result = response.data.data.suggestion.Txt
        }
        return Result
      }, (error) => {
        ElMessage({
          message: "无法连接服务器",
          type: 'warning',
        })
      })
    } catch (error) {
      console.log(error)
    }
  }
  // filter 方法过滤 restaurants 列表，找到和查询字符串前缀匹配的项，将结果存储到 results 中
  const createFilter = (queryString: string) => {
    return function(searchSuggestion) {
      return matchPrefix(searchSuggestion.value, queryString)
    }
  }

  /**
   * 搜索框按 Tab / Shift+Tab
   * 切换当前的搜索引擎
   */
  function onSwitchEngines(e: KeyboardEvent) {
    // 如果按下的不是 Tab 键，直接返回
    if (e.key !== 'Tab') return

    // 取消 Tab 键的默认行为
    e.preventDefault()

    // 获取所有搜索引擎的键值 // Object.keys:获取其所有的键名 // searchEngines 是一个对象，它包含了三个搜索引擎的配置信息
    const engineKeys = Object.keys(searchEngines.value)
    // 计算搜索引擎数量
    const length = engineKeys.length
    // 获取当前搜索引擎的索引
    let currentIndex = engineKeys.indexOf(currentEngine.value)
    // 根据按下的 Shift 键，判断是向前还是向后切换搜索引擎
    currentIndex += e.shiftKey ? -1 : 1
    // 计算新的搜索引擎键值  // 三种情况
    // 如果新的索引值小于 0，就返回最后一个搜索引擎键值 // 如果新的索引值小于搜索引擎数量，就返回当前索引对应的搜索引擎键值 // 如果新的索引值大于搜索引擎数量，就返回第一个搜索引擎键值
    currentEngine.value = currentIndex < 0 ? engineKeys[length - 1] : currentIndex < length ? engineKeys[currentIndex] : engineKeys[0]
  }

  /**
   * 更新搜索设置
   */
   // Option<SearchSetting>:可能包含SearchSetting类型的值或者空值（即 null 或 undefined）的类型
  function updateSearchSetting(data: Option<SearchSetting>) {
    // commit 是 Vuex 中的一个核心方法，用于提交 mutation
    commit(SettingMutations.updateSearchSetting, data)
  }

</script>


<style lang="less">

.search {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  row-gap: 64px;

  .search-logo img {
    height: 64px;
    width: auto;
  }

  // 输入框容器
  .search-input {
    width: 700px;

    overflow: hidden;  /* 当子元素的高度大于父元素时，隐藏溢出的部分 */
    border-radius: 10px; /* 设置元素的圆角为 10 像素 */

    box-shadow: 0 0 10px rgba(50, 59, 88, 0.8); /* 添加阴影效果，使元素产生视觉上的浮起感 */
    backdrop-filter: blur(5px); /* 使用模糊效果 */

    transition: 0.3s linear; /* 设置元素过渡的持续时间为 0.3 秒，过渡方式为线性（hover的时候） */

    // el的输入框
    .input-with-select {
      width: 100%;
    }

    .my-autocomplete li {
      line-height: normal;
      padding: 7px;
    }

    //el的按钮
    .el-button {
      height: 44px;
      width: 72px;
      border-radius: 20px;

      transition: 0.3s linear;
    }
    .el-button:hover {
      transform: scale(1.3); /* 缩放比例增加到 1.02 */
    }

    // el的选择框
    .el-select {
      height: 44px;
      width: 100px;
      border-radius: 10px;

      // 内框
      .el-input {
        height: 44px;
        transition: 0.3s linear;
      }
    }

  }

  .search-input:hover {
    transform: scale(1.02); /* 缩放比例增加到 1.02 */
  }
}

//[data-theme="dark"] {
//  .search-warp.fixed {
//    background-color: rgba(0, 0, 0, 0.5);
//  }
//
//  // 深色模式搜索按钮半透明
//  .el-button {
//    opacity: 0.5;
//  }
//}
</style>
