<template>
    <div class="separator">
    </div>
</template>

<script>
import cal from '@/utils/calculation'
import { computed } from '@vue/reactivity';

export default{
    data(){
        return{
            colorStyle: computed(()=>cal.rgbaTextSpawn(cal.hexToRgb(this.blankColorStyle),1))
        }
    },
    watch:{
        // blankColorStyle(newVal,oldVal){
        //     colorStyle = cal.hexToRgb(newVal.backgroundColor.hex)
        //     colorAlpha = newVal.backgroundColor.alpha
        // }
    },
    props:{
        width:{
            type:String,
            default:"auto"
        },
        height:{
            type:String,
            default:"auto"
        },
      blankColorStyle: {
        type: String,
        default: "#000000"
      }
    }
}
</script>

<style>
.separator{
    width: v-bind("width");
    height: 1px;
    outline: 0px;
    margin: v-bind("height");
    padding: 0px;
    background-color: v-bind("colorStyle");
}
</style>