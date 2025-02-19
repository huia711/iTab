import {createStoreModule} from "./index";
import {
    ImgStyle,
    PageColorStyle, SearchEngineData,
} from "@/enum-interface"
import {SearchGetters} from "@/store/search";

export interface SettingsState {
    imgStyle: ImgStyle
    pageColorStyle: PageColorStyle
    searchItemCount: number
    backgroundImg: string
    userId: string
    userName: string
    userPassword: string
    avatar: string
    backgroundURL: string
}

export enum SettingsMutationTypes {
    setSearchItemCount = "SET_SEARCH_ITEM_COUNT",
    setUserId = "SET_USERID"
}

export default createStoreModule<SettingsState>({
    state() {
        const defaultState: SettingsState = {
            imgStyle: {
                backgroundColor: "transparent",
                borderColor: "transparent",
                outlineColor: "transparent",
                cursor: "pointer",
                width: "64px",
                height: "64px",
            },
            pageColorStyle: {
                fontColor: "black",
                customBackgroundColor: false,
                customButtonColor: false,
                presetColor: 0,
                backgroundColor: {
                    hex: "#ffffff",
                    alpha: 1
                },
                buttonColor: {
                    hex: "#000000",
                    alpha: 0.3
                }
            },
            searchItemCount: 5,
            backgroundImg: "",
            userId: "",
            userName: "Guest",
            userPassword: "",
            avatar: "img/userHead.png",
            backgroundURL: "",
        }

        return defaultState
    },
    mutations: {
        setPageColorStyle(state, payload:PageColorStyle) {
            state.pageColorStyle = payload;
        },
        setFontColor(state, payload:string) {
            state.pageColorStyle.fontColor = payload;
        },

        /** 
        *@param state
        *@param searchItemCount
        */
        [SettingsMutationTypes.setSearchItemCount]: (state, payload:number) => {
            state.searchItemCount = payload;
        },
        [SettingsMutationTypes.setUserId]: (state, payload:string) => {
            state.userId = payload;
        },

        initSettings(state, payload: any) {
            state.pageColorStyle = payload.pageColorStyle;
            state.searchItemCount = payload.searchItemCount;
        },
        setBackgroundURL(state, payload:string) {
            state.backgroundURL = payload;
        },
        setAvatar(state, payload:string) {
            state.avatar = payload;
        },
        setBackgroundImage(state, payload:string) {
            state.backgroundImg = payload;
        },
        setUserId(state, payload:string) {
            state.userId = payload;
        },
        setUserPassword(state, payload:string) {
            state.userPassword = payload;
        },
        setUserName(state, payload:string) {
            state.userName = payload;
        }
    }
})