<template>
    <button class="close-button" @click="closeButtonClicked">
        <div class="close-button__line close-button__line--first"></div>
        <div class="close-button__line close-button__line--second"></div>
    </button>
</template>

<script>
export default{
    methods:{
        closeButtonClicked(){
            this.$emit("close")
        }
    }
}
</script>

<style scoped>
.close-button {
    /* Reset */
    background-color: transparent;
    border-color: transparent;

    /* Cursor */
    cursor: pointer;

    /* Size */
    height: 3rem;
    width: 3rem;

    /* Used to position the inner */
    position: relative;
}

.close-button__line {
    /* Background color */
    background-color: #d1d5db;
    /* Position */
    position: absolute;

    /* Size */
    height: 1px;
    width: 100%;
}

.close-button__line--first {
    /* Position */
    left: 0px;
    top: 50%;
    transform: translate(0%, -50%) rotate(45deg);

    /* Size */
    height: 1px;
    width: 100%;
}

.close-button__line--second {
    /* Position */
    left: 50%;
    top: 0px;
    transform: translate(-50%, 0%) rotate(45deg);

    /* Size */
    height: 100%;
    width: 1px;
}
</style>