<template>
    <div>
        <div class="nevigator">
            <div class="previewer">
                <p :style="'color:'+fontColor">{{ t('settingPage.common.settings.theme.preview') }}</p>
            </div>
            <inputBox :visibleButton="false" :widthExpand="-203" :defaultContent="String(currentColorStyle.R)" @dataChanged="rChange"/>
            <inputBox :visibleButton="false" :widthExpand="-203" :defaultContent="String(currentColorStyle.G)" @dataChanged="gChange"/>
            <inputBox :visibleButton="false" :widthExpand="-203" :defaultContent="String(currentColorStyle.B)" @dataChanged="bChange"/>
            <inputBox :visibleButton="false" :widthExpand="-203" :defaultContent="String(currentColorStyle.alpha)" @dataChanged="alphaChange"/>
        </div>
        <div>
            <slider text="R" :range="rangeR" @valueCallback="rChange" :fontColor="fontColor"/>
            <slider text="G" :range="rangeG" @valueCallback="gChange" :fontColor="fontColor"/>
            <slider text="B" :borderBottomStyle="borderBottom" :range="rangeB" @valueCallback="bChange" :fontColor="fontColor"/>
            <slider text="Alpha" :range="rangeAlpha" @valueCallback="alphaChange" :fontColor="fontColor"/>
        </div>
    </div>
</template>

<script>
import slider from './SliderComponent.vue';
import inputBox from './inputBox.vue';
import cal from '@/utils/calculation'
import { useI18n } from 'vue-i18n'

export default{
    data(){
        const {t} = useI18n();
        return{
            borderBottom: "1px solid lightgrey",
            currentColorStyle:{
                R:cal.hexToRgb(this.colorStyle.hex).r,
                G:cal.hexToRgb(this.colorStyle.hex).g,
                B:cal.hexToRgb(this.colorStyle.hex).b,
                alpha:this.colorStyle.alpha*100
            },
            percentages:{
                R:cal.hexToRgb(this.colorStyle.hex).r/255*100,
                G:cal.hexToRgb(this.colorStyle.hex).g/255*100,
                B:cal.hexToRgb(this.colorStyle.hex).b/255*100,
                Alpha:this.colorStyle.alpha*100
            },
            rangeR:{
                start: 0,
                end: 255,
                baseNum:cal.hexToRgb(this.colorStyle.hex).r
            },
            rangeG:{
                start: 0,
                end: 255,
                baseNum:cal.hexToRgb(this.colorStyle.hex).g
            },
            rangeB:{
                start: 0,
                end: 255,
                baseNum:cal.hexToRgb(this.colorStyle.hex).b
            },
            rangeAlpha:{
                start: 0,
                end: 100,
                baseNum:this.colorStyle.alpha*100
            },
            t
        }
    },
    methods:{
        rChange(newVal){
            var validNum = cal.max(cal.min(newVal,255),0)
            this.currentColorStyle.R = validNum
            this.rangeR = Object({
                start: 0,
                end: 255,
                baseNum: Number(validNum)
            })
            this.$emit("colorChangeCallback",cal.rgbaToObj(this.currentColorStyle))
        },
        gChange(newVal){
            var validNum = cal.max(cal.min(newVal,255),0)
            this.currentColorStyle.G = validNum
            this.rangeG = Object({
                start: 0,
                end: 255,
                baseNum: Number(validNum)
            })
            this.$emit("colorChangeCallback",cal.rgbaToObj(this.currentColorStyle))
        },
        bChange(newVal){
            var validNum = cal.max(cal.min(newVal,255),0)
            this.currentColorStyle.B = validNum
            this.rangeB = Object({
                start: 0,
                end: 255,
                baseNum: Number(validNum)
            })
            this.$emit("colorChangeCallback",cal.rgbaToObj(this.currentColorStyle))
        },
        alphaChange(newVal){
            var validNum = cal.max(cal.min(newVal,100),0)
            this.currentColorStyle.alpha = validNum
            this.rangeAlpha = Object({
                start: 0,
                end: 100,
                baseNum: Number(validNum)
            })
            this.$emit("colorChangeCallback",cal.rgbaToObj(this.currentColorStyle))
        }
    },
    props:{
        colorStyle: {
          type: Object,
          default: function () {
            return {
              hex: "#ffffff",
              alpha: 1
            }
          }
        },
        fontColor:{
            type: String,
            default: "black"
        }
    },
    components:{
        slider,
        inputBox
    }
}

</script>

<style>

.previewer{
    border: 1px solid black;
    border-radius: 15px;
    width: 60px;
    height: 20px;
    padding: 0px 10px 0px 10px;
    background-color: v-bind("'rgba(' + currentColorStyle.R + ',' + currentColorStyle.G + ',' + currentColorStyle.B + ',' + currentColorStyle.alpha/100 + ')'");
    display:flex;
    align-items: center;
    justify-content: center;
}

.nevigator{
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 30px;
}

</style>