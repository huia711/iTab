
<template>
    <div class="background">
        <!-- Blue background -->
        <div class="sliderContainer">
            <div class="slider"></div>
        </div>
        <!-- Radio container -->
        <div class="radio-switch">
            <div v-for="(val,index) of textArray" :key="index">
                <label class="radio-switch__label" @mousedown="changeSelection(index)">
                    <input type="radio" class="radio-switch__input"/>
                <!-- Text -->
                    <p>{{ val }}</p>
                </label>
            </div>
        </div>
    </div>
    
</template>

<script>
export default{
    data(){
        return {
            curSelected: 0,
            selectionCount: this.textArray.length
        }
    },
    methods:{
        changeSelection(index){
            this.curSelected = index
            this.$emit('changeSelection',index)
        }
    },
    props:{
        textArray:{
            type: Array,
            required: true
        }
    }
}

</script>

<style scoped>
.background{
    background-color: #d1d5db;
    height: 36px;
    border-radius: 5px;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.slider{
    background-color: #3b82f6;
    width: 100px;
    height: 30px;
    border-radius: 4px;
    color: #fff;
    transition: all 0.3s ease;
    transform: v-bind("'translate(' + (curSelected/(selectionCount-1)*100).toFixed(0) + '%,0%)'");
    display: flex;
}

.sliderContainer{
    position: fixed;
    z-index: 1;
    width: 200px;
    height: 30px;
    margin: 0px;
    padding: 0px;
}

.radio-switch {
    background-color: transparent;
    position: relative;
    border-radius: 9999px;
    display: inline-flex;
    padding: 0.25rem;
    display: flex;
    flex-direction: row;
    height: 30px;
    width: 200px;
    z-index: 500;
}

.radio-switch__label {
    border-radius: 9999px;
    cursor: pointer;
    padding: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30px;
    width: 100px;
}

.radio-switch__input {
    display: none;
}
</style>