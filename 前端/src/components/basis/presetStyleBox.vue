<template>
    <div class="basic">
        <div class="presetStyle" @mouseenter="mouseOn(true)" @mouseleave="mouseOn(false)" @click="selected">
            <p class="text">{{ t('settingPage.common.settings.theme.preview') }}</p>
            <modernButton :buttonText="t('settingPage.common.settings.theme.preview')" :customButtonStyle="btnStyle"/>
        </div>
        <p :style="'color:' + fontColor">{{ textUnderBox }}</p>
    </div>
</template>

<script>
import modernButton from './modernButton.vue';
import cal from '@/utils/calculation'
import { useI18n } from 'vue-i18n';
export default{
    data(){
        const {t} = useI18n();
        return{
            bkgColorStyle: cal.hexToRgb(this.presetStyle.backgroundColor.hex),
            btnAlpha: this.presetStyle.buttonColor.alpha,
            btnStyle:{
                backgroundColor: this.presetStyle.buttonColor.hex,
                width: "70px",
                height: "35px",
                borderColor:"transparent",
                borderRadius:"6px",
                fontColor: this.presetStyle.fontColor,
                cursor:"pointer",
                outlineColor:"transparent",
                wordSpacing:"50px",
                divHeight:"4rem"
            },
            outlineStyle: this.isSelected === true ? "2px solid purple" : "0px",
            isMouseOn: false,
            t
        }
    },
    methods:{
        mouseOn(state){
            this.isMouseOn = state
            if(state === true)
                this.outlineStyle = "2px solid black"
            else{
                if(this.isSelected === true)
                    this.outlineStyle = "2px solid purple"
                else
                    this.outlineStyle = "0px"
            }
        },
        selected(){
            this.outlineStyle = "2px solid purple"
            this.$emit("selected")
        }
    },
    watch:{
        isSelected(newVal,oldVal){
            this.outlineStyle = newVal === true ? "2px solid purple" : "0px"
        }
    },
    props:{
        presetStyle:{
            type:Object,
            required:true
        },
        isSelected:{
            type:Boolean,
            required:true
        },
        textUnderBox:{
            type:String,
            required:true
        },
        fontColor:{
            type: String,
            default: "black"
        }
    },
    components:{
        modernButton
    }
}
</script>

<style scoped>
.basic{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0px;
    padding: 0px;
    height: 110px;
    width: 110px;
}

.text{
    color: v-bind("presetStyle.fontColor");
}

.presetStyle{
    height: 100px;
    width: 100px;
    border-radius: 15px;
    outline: v-bind("outlineStyle");
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-color: v-bind("'rgba(' + bkgColorStyle.r + ',' + bkgColorStyle.g + ',' + bkgColorStyle.b + ',' + presetStyle.backgroundColor.alpha + ')'");
}
</style>