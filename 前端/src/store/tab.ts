/**
 * 导入（import）
 */
import { TabItem, Tabs } from "@/enum-interface"
import { createStoreModule } from "@/store/index"
import { copy } from "@/utils/common";
import { debounce } from "@/utils/async"
import {House, Document,SwitchButton,Collection} from '@element-plus/icons-vue'

/**
 * 自定义类型（type）的定义
 */
// state
export interface TabState {
    Tabs: Tabs
    TabsAdd: Tabs
    tabIndex: number
    lastUpdateTime?: number
}

// mutations
export enum TabMutations {
    addTab = "ADD_TAB",
    deleteTab = "DELETE_TAB",
}

/**
 * 常/变量（const/let）的定义
 */
// key
const TAB_STORAGE = "tab-data"

/**
 * 默认导出（export default）定义
 * module的定义
 */
export default createStoreModule<TabState>({
    /**
     * state
     */
    state() {
        // 设置默认状态值
        const defaultState: TabState = {
            // 创建一个数组保存网站
            Tabs: [
            {
                title: '首页',
                name: '1',
                icon: SwitchButton,
            },
            {
                title: '主页面',
                name: '2',
                icon: House,
            },
            {
                title: '热榜',
                name: '3',
                icon: Document,
            },
            {
                title: '资讯',
                name: '4',
                icon: Collection,
            }
            ],
            TabsAdd: [],
            tabIndex: 4,
            lastUpdateTime: undefined
        }

        // // 从本地存储中读取
        // const TabsData = JSON.parse(localStorage[TAB_STORAGE] ?? "[]")
        // // 将本地存储中读取到的合并到默认状态中
        // copy(TabsData, defaultState, true)

        return defaultState
    },

    mutations: {
        /**
         * 添加单个导航
         * @param state
         * @param data
         */
        [TabMutations.addTab]: (state, data: TabItem) => {
            state.TabsAdd.push(data)
            state.tabIndex++;
            saveTabState(state)
        },

        /**
         * 删除导航
         * @param state
         * @param index
         */
        [TabMutations.deleteTab]: (state, index: number) => {
            state.TabsAdd.splice(index, 1) // splice(index, 1) 的意思是从 index 开始删除一个元素，并返回被删除的元素（如果存在）的数组
            state.tabIndex--;
            console.log(state.tabIndex)
            saveTabState(state)
        }
    }
})

// 保存数据节流防抖
const saveTabState = debounce((data: TabState) => {
    const settingJson = JSON.stringify(data)
    localStorage.setItem(TAB_STORAGE, settingJson)
}, 250)
