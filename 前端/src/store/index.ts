// store (ts) -> module (Vue) { state、mutation、action、getter }
/**
 * 导入（import）
 */
import type { App, InjectionKey } from 'vue'
import { createStore, useStore as HomeUseStore, Module, Store } from 'vuex' //将导入的 useStore 方法起了一个别名 baseUseStore
import search, { SearchState } from './search'
import setting, { SettingState } from './setting'
import bookMark, { BookMarkState } from './bookmark'
import settings, { SettingsState } from './settings'
import tab, { TabState } from  './tab'

/**
 * 自定义类型（type）的定义
 */
// 定义根状态的type
export type RootState = {
  search: SearchState;
  setting: SettingState;
  bookMark: BookMarkState;
  settings: SettingsState;
  tab: TabState;
};

/**
 * store的定义
 */
// InjectionKey:Vue提供的一个接口，它是一个继承自 Symbol 的泛型类型，可以用来在提供者和消费者之间 规定 注入值的类型（Store<RootState>）
const STORE_KEY = Symbol('store_key') as InjectionKey<Store<RootState>>;

// 创建 Vuex 的 Store 实例
const store = createStore<RootState>({
  // 包含多个模块
  modules: {
    search,
    setting,
    bookMark,
    settings,
    tab
  },
});

/**
 * 函数（function）定义
 */
// 用于定义导出 Vuex Module 的函数
export function createStoreModule<S>(module: Module<S, RootState>) {
  return module;
}

// useStore: useStore 是 Vue.js 3 中提供的一个函数，用于在组件中访问 Vuex 数据仓库的实例
// 在 Vuex 中，如果在创建数据仓库时为其指定了 key，则可以在组件中使用 useStore 函数并传入该 key，来访问指定的数据仓库实例。
// 在组件（module）中使用 useStore 函数获取 Store 实例
export function useStore() {
  return HomeUseStore(STORE_KEY);
}

/**
 * 默认导出（export default）定义
 * 可用import导入（不用{})
 */
// 在 app 中注册 Store 实例
export default {
  install(app: App) {
    app.use(store, STORE_KEY);
  }
};

