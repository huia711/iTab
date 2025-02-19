import axios from "@/plugins/axios";
import { useStore } from "@/store";
import cal from "./calculation";
import { LanguageType,SearchSuggestion,OpenPageTarget } from "@/enum-interface";
import { SettingMutations } from "@/store/setting";

export interface UserInfo {
    Id: string;
    passwd: string;
}


export function loginMethod(userInfo : UserInfo){
    // 登录方法
    const store = useStore();
    const data = {
        "id": userInfo.Id,
        "password": userInfo.passwd,
      }
      // console.log(JSON.stringify(data))
      try {
        axios.post('http://localhost:2020/user/login', data).then(response => {
          if (response.data.code === 200) {
            store.commit("setuserId", userInfo.Id)
            store.commit("setuserPassword", userInfo.passwd)
            // 登陆成功
            /**
             * 返回消息内容格式：
             * {
             *  code:...
             *  data:
             *      {
             *          userName:...
             *          backgroundColor:...         <= 背景颜色
             *          backgroundAlpha:...         <= 背景颜色Alpha
             *          buttonColor:...             <= 按钮颜色
             *          backgroundAlpha:...         <= 按钮颜色Alpha
             *          customBackgroundColor:...
             *          customButtonColor:...
             *          presetColor:...
             *          fontColor:...
             *          searchItemCount:...
             *          avatar:...              <= 用户头像URL，无则返回"null"
             *          backgroundURL:...       <= 用户背景图片URL，无则返回"null"
             *          searchEngine:...        <= 搜索引擎
             *          suggestAPI:...          <= 搜索建议API
             *          openNewPage:...         <= 是否在新的页面打开搜索结果
             *          showEngineIcon:...      <= 是否显示搜索引擎图标
             *          showEngineList:...      <= 是否显示搜索引擎下拉列表
             * 
             *          bookMarks:...           <= 标签页，无则返回"null"
             *          record:...              <= 搜索历史，无则返回"null"
             *          ...                     <= 后期可能增加的其它用户数据
             *      }
             *  ...
             * }
             */
            store.commit("setUserName",response.data.data.userName)
            store.commit("setUserPassword",userInfo.passwd)
            store.commit("setUserId",userInfo.Id)
            // 初始化用户设置
            store.commit("initSettings",{
              pageColorStyle: {
                fontColor: response.data.data.fontColor,
                customBackgroundColor: response.data.data.customBackgroundColor,
                customButtonColor: response.data.data.customButtonColor,
                presetColor: cal.min(cal.max(response.data.data.presetColor, 0),1),
                backgroundColor: {
                  hex: response.data.data.backgroundColor,
                  alpha: response.data.data.backgroundAlpha
                },
                buttonColor: {
                  hex: response.data.data.buttonColor,
                  alpha: response.data.data.buttonAlpha
                },
              },
              searchItemCount: response.data.data.searchItemCount
            })
            // 设置语言
            let lang = null
            switch(response.data.data.language){
              case 'English':
                lang = LanguageType.English;
                break;
              case 'SimplifiedChinese':
                lang = LanguageType.SimplifiedChinese;
                break;
              case 'TraditionalChinese':
                lang = LanguageType.TraditionalChinese;
                break;
              default:
                lang = LanguageType.Auto;
                break;
            }
            store.commit(SettingMutations.updateLanguage, lang)
            // 设置搜索设置
            let searchSettings = null
            let suggestAPI = null
            switch (response.data.data.suggestAPI) {
              case 'Baidu':
                suggestAPI = SearchSuggestion.baidu;
                break;
              case 'Google':
                suggestAPI = SearchSuggestion.google;
                break;
              case 'Bing':
                suggestAPI = SearchSuggestion.bing;
                break;
              default:
                suggestAPI = SearchSuggestion.none;
                break;
            }
            searchSettings = {
              currentEngine: response.data.data.searchEngine,
              openPageTarget: response.data.data.openNewPage === 'Blank' ? OpenPageTarget.Blank : OpenPageTarget.Self,
              showEngineIcon: response.data.data.showEngineIcon === 'true' ? true : false,
              showEngineSelect: response.data.data.showEngineList === 'true' ? true : false,
              searchRadius: 0,
              useSearchEngines: ["bing", "google", "baidu"],
              suggestion: suggestAPI
            }
            store.commit(SettingMutations.updateSearchSetting, searchSettings)
            // 获取用户头像
            /**
             * 返回格式：
             * {
             *  code:...
             *  data:...  <= 图片数据
             * }
             */
            if (response.data.data.avatar !== "null")
              axios.get(response.data.data.avatar).then(response => {
                const imagestr = window.atob(response.data.data.image);
                const imageBytes = new Uint8Array(imagestr.length);
                for (let i = 0; i < imagestr.length; i++)
                  imageBytes[i] = imagestr.charCodeAt(i);
                const avatarBlob = new Blob([imageBytes], {type: 'iamge/jpeg'});
                store.commit("setAvatar",URL.createObjectURL(avatarBlob))
              })
            // 获取用户背景图片，格式同上方头像
            store.commit("setBackgroundURL", response.data.data.backgroundURL)
            if (response.data.data.backgroundURL !== "null")
              axios.get(response.data.data.backgroundURL).then(response => {
                if (response.data.code === 200) {
                  const imagestr = window.atob(response.data.data.image);
                  const imageBytes = new Uint8Array(imagestr.length);
                  for (let i = 0; i < imagestr.length; i++)
                    imageBytes[i] = imagestr.charCodeAt(i);
                  const backgroundBlob = new Blob([imageBytes], {type: 'image/jpeg'});
                  store.commit("setBackgroundImage",URL.createObjectURL(backgroundBlob))
                }
              })
            // 获取标签页
            /**
             * 返回格式：
             * {
             *  code:...
             *  data:...  <= 标签页数据
             * }
             */
            if (response.data.data.title !== "null") {
              let title = []
              let url = []
              let icon = []
              let textIcon = []
              let custom = []
              let page = []
              const bookMarks = []
              title = response.data.data.title.split(' ')
              url = response.data.data.url.split(' ')
              icon = response.data.data.icon.split(' ')
              textIcon = response.data.data.textIcon.split(' ')
              custom = response.data.data.custom.split(' ')
              page = response.data.data.page.split(' ')

              // 遍历5个数组，初始化bookmark
              for (let i = 0; i < title.length - 1; i++) {
                const bookMark = {
                  title: title[i],
                  url: url[i],
                  icon: icon[i],
                  textIcon: Boolean(textIcon[i]),
                  custom: Boolean(custom[i]),
                  page: parseInt(page[i])
                }
                console.log(bookMark)
                bookMarks.push(bookMark)
              }
              store.commit("updateBookMarks", bookMarks)
            }
            /**
             * 返回格式：
             * {
             *  code:...
             *  data:...  <= 历史记录数据
             * }
             */

            if (response.data.data.record !== "null") {
              const record = response.data.data.record.split(' ')
              const historys = []
              // 遍历5个数组，初始化bookmark
              for (let i = 0; i < record.length - 1; i++) {
                const history = {
                  searchText: record[i]
                }
                historys.push(history)
              }
              store.commit("updateHistory", historys)
            }
          }
        }, (error) => {
          console.log(error)
        })
      } catch (error) {
        console.log(error)
      }
}