<template>
  <!-- 背景 -->
  <div id="wallpaper">
    <div id="setting-background">
    <main id="main" class="main" @scroll="handleScroll">

      <section class="sec1" id="sec1">
        <!-- 搜索框 -->
        <search :value="searchText"/>
        <div style="margin-bottom: 20px">
          <el-button size="small" @click="addTab(page)">
            add tab
          </el-button>
        </div>
        <!-- 书签 -->
        <BookMark/>
      </section>

      <section class="sec" id="sec2">
        <div class="nouse"></div>
        <!-- 书签 -->
        <BookMark/>
      </section>
      <section class="sec" id="sec3">
        <div class="nouse"></div>
        <!-- 书签 -->
        <BookMark/>
      </section>
      <section class="sec" id="sec4">
        <div class="nouse"></div>
        <!-- 书签 -->
        <BookMark/>
      </section>

      <!-- 设置标签页 -->
      <el-tabs
          v-model="pagenow"
          class="el-tabs"
          tab-position="left"
          @tab-remove="removeTab"
      >
        <el-tab-pane
            v-for="item in tabs"
            :key="item.name"
            :label="item.title"
            :name="item.name"
            :closable="false"
        >
          <template #label>
            <span class="custom-tabs-label" @click="scroll(item.name)" :id="item.name">
              <el-icon><component :is="item.icon" /></el-icon>
              <span>{{ item.title }}</span>
            </span>
          </template>
        </el-tab-pane>
        <el-tab-pane
            v-for="item in tabsAdd"
            :key="item.name"
            :label="item.title"
            :name="item.title"
            closable
        >
          <template #label>
            <span class="custom-tabs-label" @click="scroll(item.name)" :id="item.name">
              <el-icon><IconMenu /></el-icon>
              <span>{{ item.title }}</span>
            </span>
          </template>
        </el-tab-pane>
      </el-tabs>

      <div class="entries">
        <div @click="userPageClicked"><el-button round><el-icon><User/></el-icon></el-button></div>
        <div @click="settingVisibleState">
          <el-button round :loading="isSettingUploading">
            <el-icon v-show="settingUploadSuccess !== 0">
              <Close v-show="settingUploadSuccess === -1"/>
              <Check v-show="settingUploadSuccess === 1"/>
            </el-icon>
            <el-icon>
              <Setting/>
            </el-icon>
          </el-button>
        </div>
      </div>

      <div id="user-page">
        <userPage
            v-click-outside="handleClickOutsideUserPage"
            @pageHide="handleClickOutsideUserPage"
        />
      </div>

      <div id="setting-page">
        <settingPage
            :is-visible="settingVisible"
            v-click-outside="handleClickOutsideSettingPage"
        />
      </div>
    </main>
    </div>
  </div>
</template>


<script lang="js">
/**
 * 导入（import）
 */
import {computed, onBeforeUnmount, onMounted, ref, watch} from "vue"
import Vue from 'vue'
import { useStore } from "@/store"
import { useRoute } from "vue-router"
// 导入组件Component
import Search from "@/views/home/IndexSearch.vue"
import settingPage from '@/views/settingPage/settingPage.vue'
import BookMark from '@/views/home/BookMark.vue'
import userPage from '@/views/userPage/userPage.vue'
import { SettingsMutationTypes } from '@/store/settings'


import { TabMutations } from "@/store/tab"
// 外部导入
import $ from 'jquery';
import { useI18n } from 'vue-i18n'
import {Check, Close, Menu as IconMenu, Setting, User} from '@element-plus/icons-vue'
import axios from "@/plugins/axios";
import { BookMarkMutations } from "@/store/bookmark";
import { SearchSuggestion,OpenPageTarget, LanguageType } from "@/enum-interface"
import { loginMethod } from "@/utils/loginMethod"
import {House, Document, SwitchButton, Collection} from '@element-plus/icons-vue'
const editableTabsValue = ref(2)


export default {
  data(){
    const store = useStore();
    return{
      settingVisible: false,
      userVisible: false,
      imgStyle: computed(() => store.state.settings.imgStyle),
      backgroungImage: computed(() => store.state.settings.backgroundImg),
      pageShadow: 0,
      settingUploadSuccess: 0,
      userId: computed( ()=> store.state.settings.userId),
      isSettingUploading: false,
      store
    }
  },
  methods:{
    userPageClicked () {
      if(this.userId !== ""){
        // 个人页面
        this.userVisible = true
        this.pageShadow = 0.6
      } else {
        this.$router.push('/register')
      }
    },
    settingVisibleState () {
      this.settingVisible = true
      this.pageShadow = 0.6
      this.settingUploadSuccess = 0
    },
    handleClickOutsideUserPage(){
      this.userVisible = false
      this.pageShadow = 0
    },
    handleClickOutsideSettingPage(){
      this.settingVisible = false
      this.pageShadow = 0
      if(this.store.state.settings.userId !== ""){
        this.isSettingUploading = true
        let apiStr = ''
        let langStr = ''
        switch (this.store.state.setting.search.suggestion) {
          case SearchSuggestion.baidu:
            apiStr = 'Baidu';
            break;
          case SearchSuggestion.google:
            apiStr = 'Google';
            break;
          case SearchSuggestion.bing:
            apiStr = 'Bing';
            break;
          default:
            apiStr = 'None'
            break;
        }
        switch(this.store.state.setting.lang) {
          case LanguageType.English:
            langStr = 'English';
            break;
          case LanguageType.SimplifiedChinese:
            langStr = 'SimplifiedChinese';
            break;
          case LanguageType.TraditionalChinese:
            langStr = 'TraditionalChinese';
            break;
          default:
            langStr = 'Auto';
            break;
        }
        let data = {
          "Id": this.store.state.settings.userId,
          "backgroundURL": this.store.state.settings.backgroundURL,
          "backgroundColor": this.store.state.settings.pageColorStyle.backgroundColor.hex,
          "backgroundAlpha": this.store.state.settings.pageColorStyle.backgroundColor.alpha,
          "buttonColor": this.store.state.settings.pageColorStyle.buttonColor.hex,
          "buttonAlpha": this.store.state.settings.pageColorStyle.buttonColor.alpha,
          "customBackgroungColor": this.store.state.settings.pageColorStyle.customBackgroundColor,
          "customButtonColor": this.store.state.settings.pageColorStyle.customButtonColor,
          "presetColor": this.store.state.settings.pageColorStyle.presetColor,
          "fontColor": this.store.state.settings.pageColorStyle.fontColor,
          "language": langStr,
          "searchItemCount": this.store.state.settings.searchItemCount,
          "searchEngine": this.store.state.setting.search.currentEngine,
          "suggestAPI": apiStr,
          "openNewPage": this.store.state.setting.search.openPageTarget === OpenPageTarget.Blank ? 'Blank' : 'Self',
          "showEngineIcon": this.store.state.setting.search.showEngineIcon ? 'true' : 'false',
          "showEngineList": this.store.state.setting.search.showEngineSelect ? 'true' : 'false'
        }
        axios.post('http://localhost:2020/user/settings', data).then(response=>{
          if(response.data.code === 400){
            // 同步失败
            this.settingUploadSuccess = -1
            console.log(response.data)
            setTimeout(()=>{
              this.settingUploadSuccess = 0
            },5000)
          } else {
            this.settingUploadSuccess = 1
          }
          this.isSettingUploading = false
        },error=>{
          this.settingUploadSuccess = -1
          this.isSettingUploading = false
          console.log("ERROR:",error.message)
          setTimeout(()=>{
            this.settingUploadSuccess = 0
          },5000)
        })
      } else {
        this.settingUploadSuccess = -1
        setTimeout(()=>{
          this.settingUploadSuccess = 0
        },5000)
      }
    }
  },
  watch:{
    settingVisible(newVal, oldVal){
      if (newVal) {
        $("#setting-page").removeClass("slide_out").addClass("slide_in");
      } else {
        $("#setting-page").removeClass("slide_in").addClass("slide_out");
      }
    },
    userVisible(newVal, oldVal){
      if (newVal) {
        $("#user-page").removeClass("slide_out").addClass("slide_in");
      } else {
        $("#user-page").removeClass("slide_in").addClass("slide_out");
      }
    },
    backgroungImage(newVal, oldVal){
      if(newVal !== ""){
        $("#wallpaper").addClass("backgroundImg");
      } else {
        $("#wallpaper").removeClass("backgroundImg");
      }
    },
  },
  setup(){
    /**
     * 常/变量（const/let）的定义
     */
        // 导入路由和Vuex（状态管理）
    const route = useRoute()
    const store = useStore()
    const { commit } = useStore()
    const { t } = useI18n()

    const menu1 = ref(t('home.MainTab'))
    let pagenow = ref('1')

    const pageNow = computed({
      get: () => store.state.bookMark.pageNow,
      set: pageNow => store.commit(BookMarkMutations.updatePageNow, pageNow)
    })

    const tabs =  computed(() => store.state.tab.Tabs)
    const tabsAdd = computed(() => store.state.tab.TabsAdd)
    let tabIndex = computed(() => store.state.tab.tabIndex)

    const handleScroll = () => {
      for (let i=0; i<tabIndex.value; i++) {
        if (document.getElementById('main').scrollTop === (document.getElementById('main').clientHeight)*i) {
          pagenow.value = (i+1).toString()
          pageNow.value = i+1
          console.log("page"+pageNow.value)
        }
      }
    }

    const scroll = (sec) => {
      // console.log("success")
      const element = document.getElementById('sec'+sec)
      pagenow.value = sec.toString()
      pageNow.value = sec
      console.log("page"+pageNow.value)
      element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
    }

    const addTab = (targetName) => {
      const newTabName = `${++tabIndex.value}`

      const newTab = {
        title: 'New Tab',
        num: newTabName,
        content: 'New Tab content',
      }
      commit(TabMutations.addTab, newTab)

      // 新增DOM
      const main = document.getElementById('main')
      const newSection = document.createElement('section')
      newSection.id = "sec"+newTabName
      newSection.className = "sec"

      main.appendChild(newSection)

      //
      pageNow.value = newTabName
    }

    const removeTab = (targetName) => {
      commit(TabMutations.deleteTab, targetName)
    }

    // 钩子
    onMounted(()=>{
      if(store.state.settings.backgroundImg !== ""){
        $("#wallpaper").addClass("backgroundImg");
      } else {
        $("#wallpaper").removeClass("backgroundImg");
      }
      window.addEventListener('scroll', handleScroll)
      // 组件挂载后自动读取本地数据并尝试登录
      const account = localStorage.getItem("userId")
      commit(SettingsMutationTypes.setUserId, account)
      const password = localStorage.getItem("userPassword")
      if(account && password){
        // 存在数据，尝试登录
        loginMethod({
          "Id": account,
          "passwd": password
        })
    }
    })

    onBeforeUnmount(() => {
      window.removeEventListener('scroll', handleScroll)
    })
    return {
      menu1,
      handleScroll,
      scroll,
      removeTab,
      addTab,
      tabs,
      tabsAdd,
      pageNow: computed(() => pageNow).value,
      pagenow,

      fixedSearch: computed(() => route.path !== "/"), // 是否固定搜索框
      searchText: computed(() => route.params.text), // 搜索框默认文本 // params 是 Vue Router 提供的一种路由参数获取方式，用于在路由中传递参数
      fontColor: computed(() => store.state.settings.buttonColor.hex)
    }
  },
  components:{
    Setting,
    Check,
    Close,
    User,
    Search,
    settingPage,
    BookMark,
    IconMenu,
    userPage
  }
}

</script>

<style scoped>
  /* .main-wrap 类表示页面的主体部分 */
  .main {
    scroll-snap-type: y mandatory; /* 定义垂直方向上的滚动对齐 */
    overflow: scroll; /* 溢出时出现滚动条 */
    overflow-x: hidden; /* 不允许水平方向上的滚动 */
    height: 100vh; /* 高度等于视窗高度 */

    justify-content: center; /* 将内容在水平方向上居中对齐 */
    align-items: center; /* 将内容在垂直方向上居中对齐 */
    row-gap: 42px; /* 将每个子元素之间的间距设置为 42 像素 */
  }

  #wallpaper{
    display: flex;
    /* position: fixed; */
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
  }

  #wallpaper.backgroundImg {
    background-image: v-bind("'url(\"' + backgroungImage + '\")'");
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
  }

  .sec1 {
    height: 100vh; /* 元素的高度为 viewport 的高度 */
    width: 100vw; /* 元素的宽度为 viewport 的宽度 */
    scroll-snap-align: start; /* 滚动时该元素的开始位置将与滚动容器的开始位置对齐 */

    display: flex; /* 盒类型：表示该元素应该采用 Flexbox 布局模型，使子元素能够在其中垂直或水平居中 */
    flex-direction: column; /* 设置弹性盒 flex 容器的主轴方向为纵向，即垂直排列子元素 */
    justify-content: center; /* 表示子元素应水平居中 */
    align-items: center; /* 表示子元素应垂直居中 */
    row-gap: 42px; /* 将每个子元素之间的间距设置为 42 像素 */
  }
  .nouse {
    width: 700px;
    height: 177.5px;
  }
  .sec {
    height: 100vh; /* 元素的高度为 viewport 的高度 */
    width: 100vw; /* 元素的宽度为 viewport 的宽度 */
    scroll-snap-align: start; /* 滚动时该元素的开始位置将与滚动容器的开始位置对齐 */

    display: flex; /* 盒类型：表示该元素应该采用 Flexbox 布局模型，使子元素能够在其中垂直或水平居中 */
    flex-direction: column; /* 设置弹性盒 flex 容器的主轴方向为纵向，即垂直排列子元素 */
    align-items: center; /* 表示子元素应垂直居中 */
    row-gap: 42px; /* 将每个子元素之间的间距设置为 42 像素 */
  }

  .el-tabs {
    position: fixed;
    top: 40%;
    left: 1%;
    z-index: 10;

    .custom-tabs-label .el-icon {
      vertical-align: middle;
    }
    .custom-tabs-label span {
      vertical-align: middle;
      margin-left: 4px;
    }
  }

  @import '@/font/font.css';
  body {
    font-family: SmileySans,serif;
  }
  .temp{
    display: flex;
    flex-direction: column;
    font-family: 'SmileySans';
    justify-content: space-around;
    position: fixed;
    top: 5%;
    left: 90%;
    z-index: 0;
  }

  .entries{
    display: flex;
    flex-direction: row;
    font-family: 'SmileySans';
    justify-content: space-around;
    position: fixed;
    top: 5%;
    right: 5%;
    z-index: 0;
  }

  #user-page {
    width: 100%;
    height: 100%;
    position: fixed;
    top: -40%;
    left: 35%;
    transform: scale(0.1);
    z-index: -100;
    opacity: 0;
    transition: all 0.3s ease;
  }

  #user-page.slide_in{
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%) scale(1);
    z-index: 100;
    opacity: 1;
  }

  #user-page.slide_out{
    opacity: 0;
  }

  #setting-page{
    width: 100%;
    height: 100%;
    position: fixed;
    top: -30%;
    left: 40%;
    transform: scale(0.1);
    z-index: -100;
    opacity: 0;
    transition: all 0.3s ease;
  }

  #setting-page.slide_in{
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%) scale(1);
    z-index: 100;
    opacity: 1;
  }

  #setting-page.slide_out{
    opacity: 0;
  }

  #setting-background {
    display: flex;
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 100;
    transition: all 0.3s linear;
    background-color: v-bind("'rgba(0,0,0,' + pageShadow +')'");
  }
</style>