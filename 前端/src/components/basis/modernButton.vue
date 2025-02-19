<template>
    <div class="avatar">
        <button class="buttonStyle" @click="clicked" @mouseenter="buttonMouseOn(true)" @mouseleave="buttonMouseLeave(true)">
            <div>
                <img v-if="srcPath !== ''" class="avatar_img" :src="srcPath" />
            </div>
        {{ buttonText }}</button>
        
        <p v-if="textUnderButton !== ''" class="avatar_textUnderImage">{{ textUnderButton }}</p>
    </div>
    
</template>

<script>
import cal from '@/utils/calculation'
export default{
    data(){
        let defaultColor = null
        if(this.autoCalculation === true){
            defaultColor = cal.rgbaTextSpawn(cal.hexToRgb(this.customButtonStyle.backgroundColor), 0.3)
        } else {
            defaultColor = this.customButtonStyle.backgroundColor
        }
        return{
            mouseOn: false,
            realBackgroundColor: defaultColor,
            buttonAlpha: 0.3
        }
    },
    methods:{
        clicked(){
            this.$emit("buttonClicked")
        },
        buttonMouseOn(mode){
            if(this.autoCalculation === true){
                this.buttonAlpha = 0.6
                if(this.customButtonStyle.backgroundColor === "transparent")
                    this.realBackgroundColor = this.customButtonStyle.onColor
                else
                    this.realBackgroundColor = cal.rgbaTextSpawn(cal.hexToRgb(this.customButtonStyle.backgroundColor), this.buttonAlpha)
            } else {
                this.realBackgroundColor = this.customButtonStyle.backgroundColor
            }
            this.mouseOn = true
            if(mode === true)
                this.$emit("mouseOn")
        },
        buttonMouseLeave(mode){
            if(this.autoCalculation === true){
                this.buttonAlpha = 0.3
                if(this.customButtonStyle.backgroundColor === "transparent")
                    this.realBackgroundColor = "transparent"
                else
                    this.realBackgroundColor = cal.rgbaTextSpawn(cal.hexToRgb(this.customButtonStyle.backgroundColor), this.buttonAlpha)
            } else {
                this.realBackgroundColor = this.customButtonStyle.backgroundColor
            }
            this.mouseOn = false
            if(mode === true)
                this.$emit("mouseLeave")
        },
    },
    watch:{
        autoCalculation(newVal, oldVal){
            if(this.mouseOn)
                this.buttonMouseOn(false)
            else
                this.buttonMouseLeave(false)
        },
        'customButtonStyle.onColor'(newVal){
            if(this.mouseOn)
                this.buttonMouseOn(false)
            else
                this.buttonMouseLeave(false)
        },
        'customButtonStyle.backgroundColor'(newVal){
            if(this.mouseOn)
                this.buttonMouseOn(false)
            else
                this.buttonMouseLeave(false)
        }
    },
    props:{
        autoCalculation:{
            type: Boolean,
            default: true
        },
        srcPath:{
            type: String,
            default: ""
        },
        textUnderButton:{
            default: "",
            type: String
        },
        customButtonStyle: {
          type: Object,
          default: function () {
            return {
                backgroundColor: "transparent",
                width: "auto",
                height: "auto",
                borderColor: "black",
                borderRadius: "6px",
                cursor: "pointer",
                outlineColor: "transparent",
                fontColor: "black",
                onColor: "#ffffff",
                fontSize: "12",
                wordSpacing: "10px",
                divHeight: "4rem"
            }
          }
        },
        buttonText:{
            type: String,
            default: ""
        }
    }
}
</script>

<style scoped>
.avatar {
    /* Rounded border */
    border-radius: 50%;

    /* Center the content */
    align-items: center;
    display: flex;
    justify-content: center;
    flex-direction: column;

    /* Size */
    height: v-bind("customButtonStyle.divHeight");
    width: auto;
}

.avatar_textUnderImage {
    margin: auto
}

.avatar_img {
    width: 100%;
    height: 100%;
    background-color: transparent;
}

.buttonStyle {
    background-color: v-bind("realBackgroundColor");
    width: v-bind("customButtonStyle.width");
    height: v-bind("customButtonStyle.height");
    color: v-bind("customButtonStyle.fontColor");
    border-color: v-bind("customButtonStyle.borderColor");
    border-radius: v-bind("customButtonStyle.borderRadius");
    cursor: v-bind("customButtonStyle.cursor");
    outline-color: v-bind("customButtonStyle.outlineColor");
    font-size: v-bind("customButtonStyle.fontSize");
    word-spacing: v-bind("customButtonStyle.wordSpacing");
    font-family: serif;
}
</style>