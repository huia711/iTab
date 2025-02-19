/**
 * 导入（import）
 */
import { createStoreModule } from "./index"
import { copy } from "@/utils/common"
// import { wallpaperStore } from "@/plugins/localforage"
// import { isImageFile } from "@/utils/file"
import { getDailyWallpaperUrl } from "@/api/bing"
import { debounce } from "@/utils/async"
// import { isObjectURL } from "@/utils/browser"
// import { saveAs } from "file-saver"
import {
  BackgroundSetting,
  BackgroundType,
  ThemeMode,
  BookMarkSetting,
  Option,
  LayoutSetting,
  AlignType,
  PopupSettting,
  SearchSetting,
  OpenPageTarget,
  LanguageType
} from "@/enum-interface"
import { SearchSuggestion } from "@/enum-interface";

/**
 * 自定义类型（type）的定义
 */
export interface SettingState {
  lang: LanguageType
  themeMode: ThemeMode
  search: SearchSetting
  background: BackgroundSetting
  bookMark: BookMarkSetting
  layout: LayoutSetting
  popup: PopupSettting
}

// Mutations:避免直接修改 Store 的状态
// Mutations的枚举（类似数组）
export enum SettingMutations {
  updateLanguage = "UPDATE_LANGUAGE",  // 更新语言设置
  updateThemeMode = "UPDATE_THEME_MODE",  // 更新主题设置
  updateBackgroundSetting = "UPDATE_BACKGROUND_SETTING",  // 更新壁纸设置
  updateSearchSetting = "UPDATE_SEARCH_SETTING",  // 更新搜索设置
  updateBookMarkSetting = "UPDATE_BOOK_MARK_SETTING",  // 更新常用网站设置
  updateLayoutSetting = "UPDATE_LAYOUT_SETTING",  // 更新布局设置
  updatePopupSetting = "UPDATE_POPUP_SETTING"  // 更新弹出窗口设置
}

export enum SettingActions {
  uploadBackgroundImage = "UPLOAD_BACKGROUND_IMAGE",
  reloadBackgroundImage = "RELOAD_BACKGROUND_IMAGE",
  loadBingDailyWallpaper = "LOAD_BING_DAILY_WALLPAPER",
  exportSetting = "EXPORT_SETTING",
  importSetting = "IMPORT_SETTING"
}

/**
 * 常/变量（const/let）的定义
 */
// SETTING_STORAGE 常量用于表示应用设置的本地存储键名。
// BACKUP_FILE_MARK 常量用于在备份的文件名中区分备份文件的标记。
const SETTING_STORAGE = "setting-data"
const BACKUP_FILE_MARK = "_MARK_"

/**
 * 默认导出（export default）定义
 * module的定义
 */
export default createStoreModule<SettingState>({
  /**
   * state
   */
  state() {
    // 返回应用状态的默认值(defaultState)
    const defaultState: SettingState = {
      lang: LanguageType.Auto,
      themeMode: ThemeMode.Auto,
      background: {
        id: "",
        type: BackgroundType.None,
        url: "",
        blur: 0,
        maskColor: "#000",
        maskOpacity: 0,
        autoOpacity: true
      },
      search: {
        // overwriteSearch: false,
        currentEngine: "bing",
        openPageTarget: OpenPageTarget.Blank, // OpenPageTarget.Blank，则搜索结果页面将在一个新的浏览器窗口或选项卡中打开；如果定义为OpenPageTarget.Self，则搜索结果页面将在当前窗口或选项卡中打开。
        showEngineIcon: true,
        showEngineSelect: true,
        searchInputRadius: 4,
        useSearchEngines: ["bing", "google", "baidu"],
        suggestion: SearchSuggestion.none
      },
      bookMark: {
        enable: false,
        col: 6,
        row: 2,
        gap: 16,
        iconSize: 32,
        boardSize: 64,
        boardRadius: 4,
        boardColor: "#fff",
        boardOpacity: 0.8
      },
      // 搜索框在整个页面中的对齐方式
      layout: {
        align: AlignType.searchCenter
      },
      // 弹出窗口的索引
      popup: {
        current: 0
      }
    }

    // 下面的代码用于将已存储的设置恢复成为默认值，而不是每次打开都是默认
    // JSON.parse:将存储在本地存储中的字符串转换为一个对象
    // localStorage[SETTING_STORAGE]:存储在本地存储中 key 为 SETTING_STORAGE 的数据
    const settingData = JSON.parse(localStorage[SETTING_STORAGE] ?? "{}")
    // copy():用于将 settingData 对象中的属性值复制到 defaultState 对象中。
    // 它接受五个参数：第一个参数是源对象，第二个参数是目标对象，第三个参数表示仅复制目标对象中已存在的属性，第四个参数表示是否跳过空属性值，第五个参数表示递归复制子对象的深度。
    copy(settingData, defaultState, true, true, 1)

    return defaultState
  },

  /**
   * mutations
   */
  mutations: {
    /**
     * 更新语言
     * @param state
     * @param lang
     */
    [SettingMutations.updateLanguage]: (state, lang: LanguageType) => {
      state.lang = lang
      saveSettingState(state)
    },

    /**
     * 更新主题模式
     * @param state
     * @param mode
     */
    [SettingMutations.updateThemeMode]: (state, mode: ThemeMode) => {
      state.themeMode = mode
      saveSettingState(state)
    },

    /**
     * 更新背景设置
     * @param state
     * @param background
     */
    [SettingMutations.updateBackgroundSetting]: (state, background: Option<BackgroundSetting>) => {
      // copy 函数可以确保更新后的对象不会影响到原对象，从而有效地避免了修改原对象的问题
      copy(background, state.background)
      saveSettingState(state)
    },

    /**
     * 更新搜索设置
     * @param state
     * @param setting
     */
    [SettingMutations.updateSearchSetting]: (state, search: SearchSetting) => {
      copy(search, state.search)
      saveSettingState(state)
    },

    /**
     * 更新导航栏设置
     * @param state
     * @param topSite
     */
    [SettingMutations.updateBookMarkSetting]: (state, topSite: Option<BookMarkSetting>) => {
      copy(topSite, state.bookMark)
      saveSettingState(state)
    },

    /**
     * 更新布局设置
     * @param state
     * @param topSite
     */
    [SettingMutations.updateLayoutSetting]: (state, layout: Option<LayoutSetting>) => {
      copy(layout, state.layout)
      saveSettingState(state)
    },

    /**
     * 更新Popup菜单设置
     * @param state
     * @param popup
     */
    [SettingMutations.updatePopupSetting]: (state, popup: Option<PopupSettting>) => {
      copy(popup, state.popup)
      saveSettingState(state)
    }
  },

  /**
   * action
   */
  actions: {
    // /**
    //  * 上传壁纸
    //  * @param param0
    //  * @param imageFile
    //  */
    // [SettingActions.uploadBackgroundImage]: async ({ state, commit }, imageFile: File) => {
    //   if (!isImageFile(imageFile)) throw new Error("这不是一个图片文件")
    //
    //   const id = uuid(),
    //     url = URL.createObjectURL(imageFile),
    //     url_old = state.background.url
    //
    //   // 清除上次壁纸，ObjectURL可能导致内存溢出
    //   await wallpaperStore.clear()
    //   if (url_old && isObjectURL(url_old)) {
    //     URL.revokeObjectURL(url_old)
    //   }
    //
    //   // 保存图片到IndexedDB
    //   await wallpaperStore.setItem<Blob>(id, imageFile)
    //   commit(SettingMutations.updateBackgroundSetting, {
    //     id,
    //     url
    //   })
    // },

    // /**
    //  * 重新加载壁纸
    //  * 壁纸使用BlobUrl实现，数据生命周期为session
    //  * @param param0
    //  */
    // // async 关键字用于标记每个 Action 函数为异步函数。这些函数将执行一些异步操作（如获取数据、上传文件等），并使用 await 来等待这些操作完成。
    // // 用 await 关键字等待一个异步操作的完成
    // [SettingActions.reloadBackgroundImage]: async ({ state, commit }) => {
    //   // ？：在属性不存在的情况下返回 undefined，而不是抛出 TypeError 异常。这样可以避免繁琐的判断操作，使代码更加简洁。
    //   // ！：用于告诉 TypeScript 编译器，我们可以确定某个值不会是 null 或 undefined
    //   const id = state.background?.id!
    //   // 指定该函数的返回类型必须是 Blob 类型。
    //   const file = await wallpaperStore.getItem<Blob>(id)
    //
    //   // 校验图片数据是否可用，否则删除该数据
    //   if (file && isImageFile(file)) {
    //     const url = URL.createObjectURL(file)
    //     commit(SettingMutations.updateBackgroundSetting, { url })
    //   } else {
    //     commit(SettingMutations.updateBackgroundSetting, { id: null, url: null })
    //     await wallpaperStore.removeItem(id)
    //   }
    // },

    /**
     * 加载Bing每日壁纸
     * @param param0
     * @param imageFile
     */
    [SettingActions.loadBingDailyWallpaper]: async ({ commit }) => {
      const url = await getDailyWallpaperUrl()

      if (url === undefined || null) return
      commit(SettingMutations.updateBackgroundSetting, { url })
    }
  }
})

// debounce():限制函数的调用次数。
/**
 * 1. 使用 JSON.stringify() 方法将 data 参数转换为一个 JSON 字符串，并赋值给 settingJson 常量。
 * 2. 使用 localStorage.setItem() 方法将 settingJson 数据存储到本地存储中，SETTING_STORAGE 表示存储的键名。
 * 3. 由于保存设置数据是一个频繁的操作，为了减少存储操作对应用程序性能的影响，使用了 debounce() 函数来控制函数的调用次数。该函数接受一个函数作为其参数，并返回一个新的函数。新函数可接受任意数量和类型的参数，但只有当最后一个调用结束后，等待一段时间（例如 250ms）后才会执行初始函数。这可以确保在快速连续的执行过程中，只有最后一个函数调用才会被执行（即函数防抖）。
 */
const saveSettingState = debounce((data: SettingState) => {
  const settingJson = JSON.stringify(data)
  localStorage.setItem(SETTING_STORAGE, settingJson)
}, 250)
