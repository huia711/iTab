<template>
  <main className="base">
    <div id="wallpaper">
      <div v-loading="spinnerVisible" element-loading-background="rgba(0,0,0,0.6)" className="pageLayout">
        <closeButton @close="closePage"/>
        <div className="global">
          <modernButton
              :srcPath="userHeadImgPath"
              :autoCalculation="false"
              :textUnderButton="registerMode === true ? 'Register' : 'Login'"
              :customButtonStyle="imgStyle"/>
          <div className="loginPage">
            <!-- 显示登录/注册界面 -->
            <p v-show="registerMode" className="inputBoxs">{{ t('loginPage.userName') }}
              <inputBox :visibleButton="false" :widthExpand="32" @dataChanged="registerNameGet"/>
            </p>
            <p v-show="!registerMode" className="inputBoxs">{{ t('loginPage.account') }}
              <inputBox :visibleButton="false" :defaultContent="account" :widthExpand="32" @dataChanged="accountGet"/>
            </p>
            <p className="inputBoxs">{{ t('loginPage.password') }}
              <inputBox :visibleButton="true" :widthExpand="32" @dataChanged="passwdGet"/>
            </p>
            <p v-show="registerMode" className="inputBoxs">{{ t('loginPage.confirmPassword') }}
              <inputBox :visibleButton="true" @dataChanged="confPasswdGet"/>
            </p>
            <modernButton :buttonText="t('loginPage.login')" :customButtonStyle="buttonStyle" @buttonClicked="loginButtonClicked"/>
            <modernButton :buttonText="t('loginPage.register')" :customButtonStyle="buttonStyle" @buttonClicked="regButtonClicked"/>
            <p style="color: red;height: 20px;">{{ warningMsg }}</p>
          </div>
        </div>
      </div>
    </div>
  </main>

</template>

<script lang="js">

import modernButton from '@/components/basis/modernButton.vue';
import inputBox from '@/components/basis/inputBox.vue';
import closeButton from '@/components/basis/closeButton.vue';
import { computed } from '@vue/reactivity';
import cal from '@/utils/calculation';
import { useStore } from '@/store';
import { useI18n } from 'vue-i18n'
import $ from 'jquery'
import axios from "@/plugins/axios"
import { mapMutations } from 'vuex';
import { SettingMutations } from '@/store/setting';
import { LanguageType, OpenPageTarget, SearchSuggestion } from '@/enum-interface';

export default {
  setup() {
    const store = useStore();
    const {t} = useI18n();
    return {
      pageColorStyle: computed(() => store.state.settings.pageColorStyle),
      backgroundImg: computed(() => store.state.settings.backgroundImg),
      imgStyle: computed(() => store.state.settings.imgStyle),
      userName: computed(() => store.state.settings.userName),
      userHeadImgPath: computed(() => store.state.settings.avatar),
      store,
      t
    }
  },
  mounted() {
    if (this.store.state.settings.backgroundImg !== "") {
      $("#wallpaper").addClass("backgroundImg");
    } else {
      $("#wallpaper").removeClass("backgroundImg");
    }
  },
  data() {
    return {
      account: "",
      passwd: "",
      confPasswd: "",
      warningMsg: "",
      registerName: "",
      registerMode: false,
      spinnerVisible: false,
      colorStyle: cal.hexToRgb(this.pageColorStyle.backgroundColor.hex),
      buttonColorStyle: cal.hexToRgb(this.pageColorStyle.buttonColor.hex),
      buttonStyle: {
        backgroundColor: this.pageColorStyle.buttonColor.hex,
        width: "250px",
        height: "35px",
        borderColor: "transparent",
        borderRadius: "6px",
        cursor: "pointer",
        outlineColor: "transparent",
        wordSpacing: "50px",
        divHeight: "4rem"
      }
    }
  },
  methods: {
    ...mapMutations(['setUserName', 'setUserId', 'setAvatar', 'initSettings', 'setBackgroundImage', 'setBackgroundURL', 'updateBookMarks', 'updateHistory', 'setUserPassword']),
    loginButtonClicked() {
      if (this.registerMode === false) {
        if (this.account === "" || this.passwd === "")
          this.warningMsg = this.t('loginPage.warnings.loginNotComplete')
        else {
          this.warningMsg = ""
          this.spinnerVisible = true
          // 登录
          this.loginMethod()
        }
      } else {
        // 转至登录页面
        this.registerMode = false
      }
    },
    regButtonClicked() {
      if (this.registerMode === false) {
        // 转至注册页面
        this.registerMode = true
      } else {
        if (this.registerName === "" || this.passwd === "")
          this.warningMsg = this.t('loginPage.warnings.registerNotComplete')
        else {
          if (this.passwd !== this.confPasswd)
            this.warningMsg = this.t('loginPage.warnings.passwordNotEqual')
          else {
            this.warningMsg = ""
            // 注册方法
            this.spinnerVisible = true
            let data = {
              "userName": this.registerName,
              "password": this.passwd,
              "confirmPassword": this.passwd
            }
            axios.post('http://localhost:2020/user/register', data).then(response => {
              if (response.data.code === 200) {
                // 注册成功
                this.setUserName(this.registerName)
                this.account = response.data.data.id
                this.passwd = ""
                this.confPasswd = ""
                this.registerMode = false
              }
              this.spinnerVisible = false
            }, error => {
              this.spinnerVisible = false
              this.warningMsg = this.t('loginPage.warnings.serverUnreachable')
            })
          }
        }
      }
    },
    loginMethod(){
      // 登录方法
      let data = {
        "id": this.account,
        "password": this.passwd,
      }
      // console.log(JSON.stringify(data))
      try {
        axios.post('http://localhost:2020/user/login', data).then(response => {
          if (response.data.code === 200) {
            // 登陆成功
            // 将用户信息存储到本地，下次打开时自动登录
            localStorage.setItem("userId",this.account)
            localStorage.setItem("userPassword",this.passwd)
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
             *
             *          log:...
             *          ...                     <= 后期可能增加的其它用户数据
             *      }
             *  ...
             * }
             */
            this.setUserName(response.data.data.userName)
            this.setUserPassword(this.passwd)
            this.setUserId(this.account)

            console.log(this.account)
            // 初始化用户设置
            this.initSettings({
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
            this.store.commit(SettingMutations.updateLanguage, lang)
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
            this.store.commit(SettingMutations.updateSearchSetting, searchSettings)
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
                let imagestr = window.atob(response.data.data.image);
                const imageBytes = new Uint8Array(imagestr.length);
                for (let i = 0; i < imagestr.length; i++)
                  imageBytes[i] = imagestr.charCodeAt(i);
                const avatarBlob = new Blob([imageBytes], {type: 'iamge/jpeg'});
                this.setAvatar(URL.createObjectURL(avatarBlob));
              })
            // 获取用户背景图片，格式同上方头像
            this.setBackgroundURL(response.data.data.backgroundURL)
            if (response.data.data.backgroundURL !== "null")
              axios.get(response.data.data.backgroundURL).then(response => {
                if (response.data.code === 200) {
                  let imagestr = window.atob(response.data.data.image);
                  const imageBytes = new Uint8Array(imagestr.length);
                  for (let i = 0; i < imagestr.length; i++)
                    imageBytes[i] = imagestr.charCodeAt(i);
                  const backgroundBlob = new Blob([imageBytes], {type: 'image/jpeg'});
                  this.setBackgroundImage(URL.createObjectURL(backgroundBlob));
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
              let bookMarks = []
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
              this.updateBookMarks(bookMarks)
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
              this.updateHistory(historys)
            }
            // /**
            //  * 返回格式：
            //  * {
            //  *  code:...
            //  *  data:...  <= 历史记录数据
            //  * }
            //  */
            // if (response.data.data.log !== "null") {
            //   const log = response.data.data.log
            //   const date = response.data.data.date
            //   const contents = []
            //   // 遍历5个数组，初始化bookmark
            //   for (let i = 0; i < log.length - 1; i++) {
            //     const content = {
            //       date: date[i],
            //       text: log[i]
            //     }
            //     contents.push(content)
            //   }
            //   this.updateHistory(contents)
            // }

            this.spinnerVisible = false
            this.closePage()
          } else {
            this.spinnerVisible = false
            this.warningMsg = response.data.msg
          }
        }, (error) => {
          this.spinnerVisible = false
          this.warningMsg = this.t('loginPage.warnings.serverUnreachable')
        })
      } catch (error) {
        console.log(error)
        this.spinnerVisible = false
      }
    },
    closePage() {
      this.$router.push('/')
    },
    registerNameGet(name) {
      this.registerName = name
      this.warningMsg = ""
    },
    accountGet(account) {
      this.account = account
      this.warningMsg = ""
    },
    passwdGet(passwd) {
      this.passwd = passwd
      this.confirmPasswd()
    },
    confPasswdGet(confPasswd) {
      this.confPasswd = confPasswd
      this.confirmPasswd()
    },
    confirmPasswd() {
      if (this.passwd !== this.confPasswd && this.registerMode === true) {
        // 两次输入的密码不一致
        this.warningMsg = this.t('loginPage.warnings.passwordNotEqual')
      } else {
        this.warningMsg = ""
      }
    }
  },
  components: {
    modernButton,
    inputBox,
    closeButton
  }
}
</script>

<style scoped>

.base {
  height: 750px;
  display: flex;
  margin: auto;
  justify-content: center;
  align-items: center;
}

.pageLayout {
  display: flex;
  justify-content: center;
  flex-direction: row-reverse;
  position: fixed;
  z-index: 100;
}

#spinnerLayer {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 200;
}

#wallpaper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

#wallpaper.backgroundImg {
  background-image: v-bind("'url(\"' + backgroundImg + '\")'");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}

.loginPage {
  width: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.global {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  height: 500px;
  width: 400px;
  background-color: rgba(v-bind("colorStyle.r"), v-bind("colorStyle.g"), v-bind("colorStyle.b"), v-bind("pageColorStyle.backgroundColor.alpha"));
  border: v-bind("'1px solid ' + pageColorStyle.buttonColor.hex");
  border-radius: 15px;
}

.inputBoxs {
  display: flex;
  align-items: baseline;
}

</style>