/**
 * 导入（import）
 */
import {createStoreModule} from "./index"
// import { getBrowserTopSites, getFavicon } from "@/plugins/extension"
import {BookMarkItem, BookMarks, SortData} from "@/enum-interface"
import {copy} from "@/utils/common"
import {debounce} from "@/utils/async"
import axios from "@/plugins/axios";
import {ElMessage} from "element-plus";
import {useI18n} from "vue-i18n";
// import { verifyImageUrl } from "@/utils/file"

/**
 * 自定义类型（type）的定义
 */
// state
export interface BookMarkState {
  bookMarks: BookMarks
  lastUpdateTime?: number
  pageNow: number
  pageCount: number[]
}

//
export interface BookMarkItemVo extends BookMarkItem {
  index: number
}

// mutations
export enum BookMarkMutations {
  addBookMark = "ADD_BOOK_MARK",
  updateBookMark = "UPDATE_BOOK_MARK",
  deleteBookMark = "DELETE_BOOK_MARK",
  sortBookMarks = "SORT_BOOK_MARKS",
  updateBookMarks = "UPDATE_BOOK_MARKS",
  editLastUpdateTime = "EDIT_LAST_UPDATE_TIME",
  updatePageNow = "UPDATE_PAGE_NOW"
}

// getter
export enum BookMarkGetters {
  getCurrentBookMarks = "GET_CURRENT_BOOK_MARK"
}

// action
export enum BookMarkActions {
  syncBrowserBookMarks = "SYNC_BROWSER_BOOK_MARKS"
}


/**
 * 常/变量（const/let）的定义
 */
// key
const BOOK_MARK_STORAGE = "book-mark-data"

/**
 * 默认导出（export default）定义
 * module的定义
 */
export default createStoreModule<BookMarkState>({
  /**
   * state
   */
  state() {
    // 设置默认状态值
    const defaultState: BookMarkState = {
      // 创建一个数组保存网站
      bookMarks: [],
      lastUpdateTime: undefined,
      pageNow: 1,
      pageCount: []
    }

    // 从本地存储中读取
    const bookMarkData = JSON.parse(localStorage[BOOK_MARK_STORAGE] ?? "[]")
    copy(bookMarkData, defaultState, true)
    //初始化pageNow
    defaultState.pageNow = 1
    //初始化pageCount
    defaultState.pageCount = new Array(100).fill(0)
    for(let i=1; i < defaultState.pageCount.length; i++) {
      defaultState.pageCount[i] = defaultState.bookMarks.reduce((acc, curr) => {
        return curr.page === i ? acc + 1 : acc;
      }, 0);
    }

    console.log(defaultState.pageCount)
    console.log(defaultState.bookMarks)

    return defaultState
  },

  // getter
  getters: {
    /**
     * 获取当前的导航栏数据
     * @param param0
     * @param rootState
     * @returns
     */
    [BookMarkGetters.getCurrentBookMarks]: ({ bookMarks }, _, rootState) => {
      // 从根状态中获取topSite配置对象
      const bookMarkSetting = rootState.setting.bookMark
      // 根据配置筛选出前topSiteSetting.col * topSiteSetting.row项网站数据
      return bookMarks.filter((item, _index) => item.page === rootState.bookMark.pageNow)
    }
  },
  mutations: {
    /**
     * 添加单个导航
     * @param state
     * @param data
     */
    [BookMarkMutations.addBookMark]: (state, payload: { data: BookMarkItem, userId: string }) => {
      const { data, userId } = payload
      if (state.pageCount[0] < 12 && state.pageCount[state.pageNow] < 18)
      state.bookMarks.push(data)
      state.pageCount[state.pageNow]++
      console.log(data)
      console.log(state.pageCount)
      saveBookMarkState(state, userId)
    },
    /**
     * 更新单个导航
     * @param state
     * @param data
     */
    [BookMarkMutations.updateBookMark]: (state, payload: { data: BookMarkItemVo, userId: string }) => {
      const { data, userId } = payload
      state.bookMarks[data.index] = data
      saveBookMarkState(state, userId)
    },
    /**
     * 删除导航
     * @param state
     * @param index
     */
    [BookMarkMutations.deleteBookMark]: (state, payload: { index: number, userId: string }) => {
      const { index, userId } = payload
      state.bookMarks.splice(index, 1) // splice(index, 1) 的意思是从 index 开始删除一个元素，并返回被删除的元素（如果存在）的数组
      state.pageCount[state.pageNow]--
      saveBookMarkState(state, userId)
    },

    /**
     * 对导航栏排序
     * @param state
     * @param sort
     */
    [BookMarkMutations.sortBookMarks]: (state, payload: { sort: SortData, userId: string }) => {
      const { sort, userId } = payload
      const bookMarks = state.bookMarks
      const from = bookMarks[sort.from]

      bookMarks.splice(sort.from, 1) // 移除 from 索引位置的元素
      bookMarks.splice(sort.to, 0, from) // 将已经移除的元素 from 插入到目标位置 to
      saveBookMarkState(state, userId)
    },

    /**
     * （从服务端）更新导航栏
     * @param state
     * @param bookMarks
     */
    // [BookMarkMutations.updateBookMarks]: (state, bookMarks: BookMarks) => {
    //   state.bookMarks = bookMarks
    //   // save
    //   const settingJson = JSON.stringify(state)
    //   localStorage.setItem(BOOK_MARK_STORAGE, settingJson)
    // },

    updateBookMarks (state, bookMarks: any) {
      state.bookMarks = bookMarks
      // save
      const settingJson = JSON.stringify(state)
      localStorage.setItem(BOOK_MARK_STORAGE, settingJson)
      //初始化pageCount
      for(let i=1; i < state.pageCount.length; i++) {
        state.pageCount[i-1] = state.bookMarks.reduce((acc, curr) => {
          return curr.page === i ? acc + 1 : acc;
        }, 0);
      }
      console.log(state.pageCount)
    },

    /**
     * 更新上次更新时间
     * @param state
     * @param newTime
     */
    [BookMarkMutations.editLastUpdateTime]: (state, payload: { newTime: number, userId: string }) => {
      const { newTime, userId } = payload
      state.lastUpdateTime = newTime
      saveBookMarkState(state, userId)
    },

    /**
     * 更新页面
     */
    [BookMarkMutations.updatePageNow]: (state, pageNow: string) => {
      state.pageNow = parseInt(pageNow)
    }
  },
  actions: {
    /**
     * 同步浏览器导航
     * 从浏览器获取最近浏览
     * @param param0
     */
    [BookMarkActions.syncBrowserBookMarks]: async ({ state, commit }) => {
      const now = Date.now()
      // 找出自定义标签
      const customBookMarks = state.bookMarks.filter(item => item.custom)
      commit(BookMarkMutations.updateBookMarks, customBookMarks.concat(customBookMarks))

      console.log("load browser top-sites:", `${Date.now() - now}ms`)
      commit(BookMarkMutations.editLastUpdateTime, now)
    }
  }
})

/**
 * 保存数据节流防抖
 */
const saveBookMarkState = debounce((data: BookMarkState, userId: string) => {
  const settingJson = JSON.stringify(data)
  localStorage.setItem(BOOK_MARK_STORAGE, settingJson)

  const postData = data.bookMarks.map(item => JSON.parse(`{"title":"${item.title}", "url":"${item.url}", "icon":"${item.icon}", "textIcon":"${item.textIcon}", "custom":"${item.custom}", "page":"${item.page}"}`));
  console.log(JSON.stringify(postData))
  /**
   * 上传新标签页到服务器
   */
  try {
    console.log(userId)
    axios.post('http://localhost:2020/user/newURL/'+userId, postData).then(response=> {
      if (response.data.code === 200) {
        ElMessage({
          message: "已连接服务器",
          type: "success",
        })
      }
    },(error)=>{
      ElMessage({
        message: "无法连接服务器",
        type: 'warning',
      })
    })
  } catch (error) {
    console.log(error)
  }
}, 250)
