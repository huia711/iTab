<template>
    <div class="imgBasis" @click="setBackgroundImg">
      <img class="imgStyle" :src="localUrl" :alt="imageAlt"/>
      <div class="imgDescription">
        <p style="font-size: 30px; word-spacing: 15px;">{{ imageDescription }}</p>
      </div>
    </div>
</template>
  
<script>
import { useStore } from '@/store';
import axios from 'axios';
import { mapMutations } from 'vuex';
export default {
data(){
  return{
    store: useStore()
  }
},
methods: {
  ...mapMutations(['setBackgroundImage','setBackgroundURL']),
  setBackgroundImg(){
    this.setBackgroundImage(this.localUrl)
    this.setBackgroundURL(this.webUrl)
  }
},
props: {
  localUrl: String,
  webUrl: String,
  imageAlt: String,
  imageDescription: String
}
};
</script>

<style scoped>

.imgBasis{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 250px;
    height: 150px;
    border-radius: 15px;
    overflow: hidden;
    cursor: pointer;
    margin: 20px;
}

.imgDescription{
  display: flex;
  position: absolute;
  margin: 0px;
  padding: 0px;
  z-index: 100;
}

.imgStyle{
  width: 250px;
  height: auto;
  margin: 0px;
  padding: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;

  transition: 0.3s linear;
}

.imgStyle:hover{
    transform: scale(1.25);
}

</style>