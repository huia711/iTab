<template>
    <div class="base">
        <p class="text">{{ texts }}</p>
        <label class="switch" :class="slideClass" @mousedown="stateChange">
            <input type="checkbox" class="switch__input" />
            <!-- Circle -->
            <div class="switch__circle"></div>
        </label>
    </div>
    
</template>

<script>
export default{
    data(){
        return{
            state: this.initialstate,
            circlePosition: this.initialstate === true ? '100%' : '0%',
            slideClass: this.initialstate === true ? 'switchOn' : 'switchOff'
        }
    },
    methods:{
        stateChange(){
            this.state = !this.state
            this.slideClass = this.state === true ? 'switchOn' : 'switchOff'
            this.circlePosition = this.state === true ? '100%' : '0%'
            this.$emit("stateChange",this.state)
        }
    },
    watch:{
        initialstate(newVal,oldVal){
            this.state = newVal
            this.slideClass = this.state === true ? 'switchOn' : 'switchOff'
            this.circlePosition = this.state === true ? '100%' : '0%'
        }
    },
    props:{
        initialstate:{
            type: Boolean,
            default: false
        },
        fontColor:{
            type: String,
            default: "black"
        },
        texts:{
            type:String,
            default: ""
        }
    }
}
</script>

<style scoped>

.base{
    display: flex;
    align-items: center;
    flex-direction: row;
    height: auto;
}

.text{
    width: 530px;
    height: 60px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    word-spacing: 10px;
    margin: 0px;
    color: v-bind("fontColor");
}

.switch {
    display: flex;

    /* Rounded border */
    border-radius: 9999px;

    /* Size */
    height: 1.5rem;
    width: 3rem;

    /* Demo */
    margin-bottom: 0.5rem;
    transition: all 0.3s ease;
}

.switch__input {
    /* Hide the input */
    display: none;
}

.switch__circle {
    /* Rounded border */
    border-radius: 50%;

    /* Size */
    width: 1.5rem;
    height: 1.5rem;

    background-color: #fff;
    /* Push the circle to the position */
    transition: all 0.3s ease;
    transform: v-bind("'translate(' + circlePosition + ',0%)'");
}

.switchOn {
    background-color: #357edd;
    border: 1px solid #357edd;

    
}

/* OFF status */
.switchOff {
    background-color: #d1d5db;
    border: 1px solid #d1d5db;

}

</style>