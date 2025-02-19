<template>
    <div class="main">
        <p class="text">{{ text }}</p>
        <div class="base">
            <p class="text" style="justify-content: flex-end;">{{ curValue }}</p>
            <div class="slider" ref="Slider">
                <el-slider v-model="curValue"
                :min="range.start" :max="range.end">
                </el-slider>
            </div>
        </div>
    </div>
</template>

<script>

export default{
    created(){
        this.$nextTick(()=>{
            // 禁止选中
            document.onselectstart = new Function('event.returnValue = false')
        })
    },
    data(){
        return{
            curValue: this.range.baseNum
        }
    },
    watch:{
        range(newValue,oldValue){
            this.curValue = newValue.baseNum
        },
        curValue(newVal, oldVal){
            this.$emit("valueCallback",Number(newVal))
        }
    },
    props:{
        roundRadius:{
            type:Number,
            default: 8
        },
        range: {
          type: Object,
          required: true,
          default: function () {
            return {
              start: 0,
              end: 100,
              baseNum: 50
            }
          }
        },
        text:{
            type:String,
            default:"Test:"
        },
        borderBottomStyle:{
            type:String,
            default:""
        },
        width:{
            type:Number,
            default:600
        },
        maxSliderWidth:{
            type:Number,
            default:600
        },
        textWidth:{
            type:Number,
            default:100
        },
        fontColor:{
            type:String,
            default:"black"
        }
    }
}

</script>

<style scoped>

.main{
    display: flex;
    margin: 10px 0px 0px 0px;
    flex-direction: row;
    border-bottom: v-bind("borderBottomStyle");
    width: v-bind("width+'px'");
}

.base {
    display: flex;
    flex-direction: column-reverse;
    align-items: flex-end;
}

.text {
    display: flex;
    margin: 0px;
    width: v-bind("textWidth + 'px'");
    height: 20px;
    color: v-bind("fontColor");
}

.slider {
    /* Content is centered horizontally */
    align-items: center;
    display: flex;

    /* Size */
    height: 1rem;
    width: v-bind("width*3/4 + 'px'");
    max-width: v-bind("maxSliderWidth + 'px'");
}

.slider__left {
    height: 2px;

    /* Colors */
    background-color: #d1d5db;
}

.slider__circle {
    /* Size */
    height: v-bind("roundRadius*2 + 'px'");
    width: v-bind("roundRadius*2 + 'px'");

    /* Rounded border */
    border-radius: 9999px;

    /* Colors */
    background-color: #3b82f6;
    cursor: pointer;
}

.slider__right {
    /* Take the remaining width */
    flex: 1;
    height: 2px;

    /* Colors */
    background-color: #d1d5db;
}
</style>