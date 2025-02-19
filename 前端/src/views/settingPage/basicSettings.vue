<template>
    <div class="basis">
    <el-scrollbar height="550px">
        <div>
            <p class="text">{{ t('settingPage.common.settings.theme.title') }}</p>
            <div>
                <switcher :texts="t('settingPage.common.settings.theme.customizedBackgroundColor')" 
                :initialstate="curCustomBackgroundColorState" :font-color="pageColorStyle.fontColor"
                @stateChange="customBackgroundColorStateChange"/>
                <colorPixer v-if="curCustomBackgroundColorState" 
                @colorChangeCallback="backgroundColorChange" :colorStyle="backgroundColorStyle" :fontColor="pageColorStyle.fontColor"/>
            </div>
            <div>
                <switcher :texts="t('settingPage.common.settings.theme.customizedButtonColor')" 
                :initialstate="curCustomButtonColorState" :font-color="pageColorStyle.fontColor"
                @stateChange="customButtonColorStateChange"/>
                <colorPixer v-if="curCustomButtonColorState" 
                @colorChangeCallback="buttonColorChange" :colorStyle="buttonColorStyle" :fontColor="pageColorStyle.fontColor"/>
            </div>
            <div>
                <switcher :texts="t('settingPage.common.settings.theme.fontColor') + pageColorStyle.fontColor" 
                :initialstate="pageColorStyle.fontColor === 'white'"  :font-color="pageColorStyle.fontColor"
                @stateChange="fontColorChange"/>
            </div>
            <div>
                <switcher :texts="t('settingPage.common.settings.theme.presetColor')" :initialstate="curPresetColorState" 
                @stateChange="presetColorStateChange"  :font-color="pageColorStyle.fontColor"/>
                <div v-if="curPresetColorState === true" class="boxs">
                    <presetStyleBox :presetStyle="presetStyles[0]" :textUnderBox="t('settingPage.common.settings.theme.dayMode')" 
                    :font-color="pageColorStyle.fontColor" :isSelected="selectedPresetStyle === 0 ? true : false"
                    @selected="presetColorChange(0)"/>
                    <presetStyleBox :presetStyle="presetStyles[1]" :textUnderBox="t('settingPage.common.settings.theme.nightMode')" 
                    :font-color="pageColorStyle.fontColor" :isSelected="selectedPresetStyle === 1 ? true : false"
                    @selected="presetColorChange(1)"/>
                </div>
            </div>
        </div>
        <div>
            <blankSeparator :blank-color-style="pageColorStyle.buttonColor.hex" height="20px 0px 20px 0px"/>
            <p class="text">{{ t('settingPage.common.settings.lang.title') }}</p>
            <otherSetting  class="text"/>
        </div>
    </el-scrollbar>
    </div>
</template>

<script>
import switcher from '@/components/basis/SwitcherComponent.vue';
import colorPixer from '@/components/basis/colorPixer.vue';
import blankSeparator from '@/components/basis/blankSeparator.vue';
import presetStyleBox from '@/components/basis/presetStyleBox.vue';
import otherSetting from '@/views/settingPage/OtherSetting.vue';
import { useStore } from '@/store';
import { mapMutations } from 'vuex';
import { computed } from '@vue/reactivity';
import { useI18n } from 'vue-i18n'
import {SettingMutations} from "@/store/setting";
import {ThemeMode} from "@/enum-interface";
import {watch} from "vue";

export default{
    setup(){
        const store = useStore();
        const {t} = useI18n();
        const theme = computed({
          get: () => store.state.setting.themeMode,
          set: theme => store.commit(SettingMutations.updateThemeMode, theme)
        });

        return{
            pageColorStyle: computed(()=>store.state.settings.pageColorStyle),
            selectedPresetStyle: computed(()=>store.state.settings.pageColorStyle.presetColor),
            t,
            theme
        }
    },
    data(){
        return{
            curCustomBackgroundColorState: this.pageColorStyle.customBackgroundColor,
            curCustomButtonColorState: this.pageColorStyle.customButtonColor,
            curPresetColorState: !(this.pageColorStyle.customBackgroundColor || this.pageColorStyle.customButtonColor),
            curSelectedPresetColorStyle: this.pageColorStyle.presetColor,
            backgroundColorStyle: this.pageColorStyle.backgroundColor,
            buttonColorStyle: this.pageColorStyle.buttonColor,
            tempPageColorStyle: this.pageColorStyle,
            presetStyles:[
                Object({
                fontColor:"black",
                backgroundColor:{
                    hex:"#ffffff",
                    alpha:1
                },
                buttonColor:{
                    hex:"#000000",
                    alpha:0.3
                }}),
                Object({
                fontColor:"white",
                backgroundColor:{
                    hex:"#000000",
                    alpha:0.6
                },
                buttonColor:{
                    hex:"#ffffff",
                    alpha:0.3
                }})]
        }
    },
    methods:{
        ...mapMutations(['setPageColorStyle','setFontColor']),
        customBackgroundColorStateChange(state){
            this.curCustomBackgroundColorState = state
            if(state === false){
                this.backgroundColorStyle = this.presetStyles[this.selectedPresetStyle].backgroundColor
                if(this.curCustomButtonColorState === false){
                    this.curPresetColorState = true
                    this.curSelectedPresetColorStyle = this.selectedPresetStyle
                    this.backgroundColorStyle = this.presetStyles[this.selectedPresetStyle].backgroundColor
                    this.buttonColorStyle = this.presetStyles[this.selectedPresetStyle].buttonColor
                }
            }
            else{
                this.curPresetColorState = false
                this.curCustomButtonColorState = true
            }
            this.tempPageColorStyle = Object({
                backgroundColor: this.backgroundColorStyle,
                buttonColor: this.buttonColorStyle,
                fontColor: this.pageColorStyle.fontColor,
                customBackgroundColor: this.curCustomBackgroundColorState,
                customButtonColor: this.curCustomButtonColorState,
                presetColor: this.curSelectedPresetColorStyle
            })
            this.setPageColorStyle(this.tempPageColorStyle)
        },
        customButtonColorStateChange(state){
            this.curCustomButtonColorState = state
            if(state === false){
                this.buttonColorStyle = this.presetStyles[this.selectedPresetStyle].buttonColor
                if(this.curCustomBackgroundColorState === false){
                    this.curPresetColorState = true
                    this.curSelectedPresetColorStyle = this.selectedPresetStyle
                    this.backgroundColorStyle = this.presetStyles[this.selectedPresetStyle].backgroundColor
                    this.buttonColorStyle = this.presetStyles[this.selectedPresetStyle].buttonColor
                }
            }
            else{
                this.curPresetColorState = false
                this.curCustomBackgroundColorState = true
            }
            this.tempPageColorStyle = Object({
                    backgroundColor: this.backgroundColorStyle,
                    buttonColor: this.buttonColorStyle,
                    fontColor: this.pageColorStyle.fontColor,
                    customBackgroundColor: this.curCustomBackgroundColorState,
                    customButtonColor: this.curCustomButtonColorState,
                    presetColor: this.curSelectedPresetColorStyle
                })
            this.setPageColorStyle(this.tempPageColorStyle)
        },
        fontColorChange(){
            if(this.pageColorStyle.fontColor === "black")
                this.setFontColor("white")
            else
                this.setFontColor("black")
        },
        presetColorStateChange(state){
            if(state === true){
              this.curCustomBackgroundColorState = false
              this.curCustomButtonColorState = false
              this.curPresetColorState = true
              // 默认选中原来的预设方案
              this.curSelectedPresetColorStyle = this.selectedPresetStyle
              this.presetColorChange(this.selectedPresetStyle)
            }
            else{
                if(this.curPresetColorState === true){
                    this.curCustomBackgroundColorState = true
                    this.curCustomButtonColorState = true
                    this.curPresetColorState = false
                }
            }
        },
        backgroundColorChange(newColor){
            this.backgroundColorStyle = newColor
            this.tempPageColorStyle = Object({
                backgroundColor: this.backgroundColorStyle,
                buttonColor: this.buttonColorStyle,
                fontColor: this.pageColorStyle.fontColor,
                customBackgroundColor: this.curCustomBackgroundColorState,
                customButtonColor: this.curCustomButtonColorState,
                presetColor: this.curSelectedPresetColorStyle
            })
        },
        buttonColorChange(newColor){
            this.buttonColorStyle = newColor
            this.tempPageColorStyle = Object({
                backgroundColor: this.backgroundColorStyle,
                buttonColor: this.buttonColorStyle,
                fontColor: this.pageColorStyle.fontColor,
                customBackgroundColor: this.curCustomBackgroundColorState,
                customButtonColor: this.curCustomButtonColorState,
                presetColor: this.curSelectedPresetColorStyle
            })
        },
        presetColorChange(index){
          this.curSelectedPresetColorStyle = index
          this.backgroundColorStyle = this.presetStyles[index].backgroundColor
          this.buttonColorStyle = this.presetStyles[index].buttonColor
          this.tempPageColorStyle = Object({
            backgroundColor: this.backgroundColorStyle,
            buttonColor: this.buttonColorStyle,
            fontColor: this.presetStyles[index].fontColor,
            customBackgroundColor: this.curCustomBackgroundColorState,
            customButtonColor: this.curCustomButtonColorState,
            presetColor: this.curSelectedPresetColorStyle
          })
          this.setPageColorStyle(this.tempPageColorStyle)
          this.theme = index +1
        }
    },
    components:{
        switcher,
        colorPixer,
        blankSeparator,
        presetStyleBox,
        otherSetting
    },
    props:{
        isVisible:{
            type: Boolean,
            required: true
        }
    },
    watch:{
        isVisible(newVal, oldVal){
            if(newVal === false)
                this.setPageColorStyle(this.tempPageColorStyle)
        },
        pageColorStyle(newVal, oldVal){
            this.tempPageColorStyle = newVal
        }
    }
}
</script>

<style scoped>

.basis{
    background-color: transparent;
    margin: 0px;
    padding: 10px 30px 10px 30px;
    display: flex;
    flex-direction: column;
    max-height: 600px;
    min-height: 600px;
    width: 600px;
    overflow: hidden scroll;
}

.text{
    color: v-bind("pageColorStyle.fontColor");
}

.basis::-webkit-scrollbar{
    display: none;
}

.boxs{
    display: flex;
    flex-direction: row;

  padding: 20px 0 0 0 ;
}
</style>