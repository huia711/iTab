<template>
  <div class="base">
      <div class="global">
          <div class="pageLayout">
          <!-- 设置页面 -->
                  <!-- 左侧按钮列表 -->
                  <ul class="listStyle">
                      <li v-for="(option,index) of options" :key="index">
                          <modernButton
                              :buttonText="t(option)"
                              :customButtonStyle="curSelected===index ? buttonSelectedStyle : buttonNotSelectedStyle"
                              :autoCalculation="index !== curSelected"
                              @buttonClicked="buttonClick(index)"
                              @mouseOn="buttonOn(index)"
                              @mouseLeave="buttonOn(-1)"
                          />
                      </li>
                  </ul>
                  <!-- 右侧具体内容 -->
                  <basicSettings v-show="curSelected === 0" :isVisible="isVisible" />
                  <backgroundPicture v-show="curSelected === 1" />
                  <advancePage v-show="curSelected === 2" />
                  <aboutPage v-show="curSelected === 3"/>
          </div>
      </div>
  </div>
</template>

<script>
import modernButton from '@/components/basis/modernButton.vue'
import basicSettings from './basicSettings.vue'
import aboutPage from './AboutSettings.vue'
import advancePage from './AdvanceSettings.vue'
import backgroundPicture from './backgroundPicture.vue'

import cal from '@/utils/calculation'
import { useStore } from '@/store'
import { mapMutations } from 'vuex'
import { computed } from '@vue/reactivity'
import { useI18n } from 'vue-i18n'

export default{
    setup(){
        const store = useStore();
        const {t} = useI18n();
        return{
            pageColorStyle: computed(() => store.state.settings.pageColorStyle),
            buttonColor: computed(()=>store.state.settings.pageColorStyle.buttonColor.hex),
            t
        }
    },
    data(){
        return{
            colorStyle: computed(()=>cal.rgbaTextSpawn(cal.hexToRgb(this.pageColorStyle.backgroundColor.hex), this.pageColorStyle.backgroundColor.alpha)),
            options:["settingPage.common.title","settingPage.wallpaper.title","settingPage.advance.title","settingPage.about.title"],
            curSelected: 0,
            curOn: -1,
            buttonSelectedStyle:{
                borderColor:"transparent",
                borderRadius:"5px",
                backgroundColor: cal.rgbaTextSpawn(cal.hexToRgb(this.pageColorStyle.buttonColor.hex), this.pageColorStyle.buttonColor.alpha),
                outlineColor:"transparent",
                fontColor:this.pageColorStyle.fontColor,
                cursor:"pointer",
                wordSpacing:"6px",
                width:"150px",
                height:"35px",
                divHeight:"3rem",
                fontSize:"20px",
            },
            buttonNotSelectedStyle:{
                borderColor:"transparent",
                borderRadius:"5px",
                backgroundColor: "transparent",
                onColor: cal.rgbaTextSpawn(cal.hexToRgb(this.pageColorStyle.buttonColor.hex), 0.15),
                outlineColor:"transparent",
                fontColor:this.pageColorStyle.fontColor,
                cursor:"pointer",
                wordSpacing:"6px",
                width:"150px",
                height:"35px",
                divHeight:"3rem",
                fontSize:"20px",
            },
        }
    },
    methods:{
        ...mapMutations(['setSettingPageShown']),
        buttonClick(index){
            this.curSelected = index
        },
        buttonOn(index){
            this.curOn = index
        },
    },
    props:{
        isVisible:{
            type: Boolean,
            required: true,
        }
    },
    watch:{
        pageColorStyle(newVal, oldVal){
            this.buttonSelectedStyle.backgroundColor = cal.rgbaTextSpawn(cal.hexToRgb(newVal.buttonColor.hex), newVal.buttonColor.alpha)
            this.buttonNotSelectedStyle.onColor = cal.rgbaTextSpawn(cal.hexToRgb(newVal.buttonColor.hex), 0.15)
        },
        'pageColorStyle.fontColor'(newVal){
            this.buttonSelectedStyle.fontColor = newVal
            this.buttonNotSelectedStyle.fontColor = newVal
        }
    },
    components:{
        modernButton,
        basicSettings,
        aboutPage,
        advancePage,
        backgroundPicture
    }
}
</script>

<style scoped>
.base{
  width: 100%;
  height:100%;
  display: flex;
  margin: auto;
  justify-content: center;
  align-items: center;
  background-size: cover;
  background-attachment: scroll;
  font-family: serif;
}

.global{
  display: flex;
  position: relative;
}

.pageLayout{
  display: flex;
  justify-content: center;
  flex-direction: row;
  background-color: v-bind("colorStyle");
  border-radius: 10px;
  border: v-bind("'1px solid ' + pageColorStyle.buttonColor.hex");
  width: auto;
  height: auto;
  background-attachment: scroll;
}

.listStyle{
  margin: 5px;
  padding: 5px;
  list-style: none;
  border-right: v-bind("'1px solid ' + buttonColor");
}

.listItem{
  padding: 0px;
}
</style>