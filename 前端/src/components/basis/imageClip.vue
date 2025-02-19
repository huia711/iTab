<template>
  <div v-loading="loading" element-loading-background="rgba(0,0,0,0.6)" class="base">
    <div class="clipContainer">
      <p class="text">{{ t('userPage.imageClip.clipWindow') }}</p>
      <div class="viewer">
        <!-- 图片 -->
        <div 
        style="display: flex; padding: 15px;"
        @mousedown="startSelect" @mousemove="moveSelect" @mouseup="endSelect" @mouseleave="endSelect"
        >
          <img ref="sourceImage" 
          :src="sourceImageUrl" 
          class="image"
          />
          <!-- 选择框 -->
          <div ref="selectWrapper" class="wrapper"></div>
        </div>
        <div style="height: 330px; width: 1px;" :style="'backgroundColor:' + buttonColor"></div>
        <!-- 确认按钮 -->
        <div class="selectionContainer">
          <p class="text">{{ t('userPage.imageClip.preview') }}</p>
          <div style="width: 160px; height: 160px;">
            <img v-show="previewImg" :src="previewImg" alt="NaN" style="width: 100%; height: 100%;"/>
          </div>
          <modernButton :buttonText="t('userPage.imageClip.upload')" :customButtonStyle="buttonStyle" 
          @buttonClicked="clip"/>
          <modernButton :buttonText="t('userPage.imageClip.close')" :customButtonStyle="buttonStyle" 
          @buttonClicked="cancle"/>
        </div>
      </div>
    </div>
    <el-dialog :title="messageTitle" v-model="messageVisible" width="30%">
      <span>{{ message }}</span>
      <template #footer>
      <span class="dialog-footer">
          <el-button type="primary" @click="messageVisible = false">{{ t('elDialog.buttons.confirm') }}</el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import cal from '@/utils/calculation'
import modernButton from './modernButton.vue';
import axios from 'axios';
import { useStore } from '@/store';
import { useI18n } from 'vue-i18n'
import { computed } from '@vue/reactivity';
import { mapMutations } from 'vuex';
export default {
  setup(){
    const store = useStore();
    const {t} = useI18n();
    return{
      userId: computed(()=>store.state.settings.userId),
      pageColorStyle: computed(()=>store.state.settings.pageColorStyle),
      buttonAlpha: computed(()=>store.state.settings.pageColorStyle.buttonColor.alpha),
      buttonColor: computed(()=>store.state.settings.pageColorStyle.buttonColor.hex),
      t
    }
  },
  data() {
    return {
      previewImg: "",
      loading: false,
      message: "",
      messageTitle: "",
      messageVisible: false,
      backgroundColor: computed(()=>cal.rgbaTextSpawn(cal.hexToRgb(this.pageColorStyle.backgroundColor.hex), this.pageColorStyle.backgroundColor.alpha)),
      buttonStyle:{
        backgroundColor: this.pageColorStyle.buttonColor.hex,
        borderColor: "transparent",
        fontColor: this.pageColorStyle.fontColor,
        borderRadius: "5px",
        cursor: "pointer",
        height: "35px",
        width: "150px",
        divHeight: "3rem"
      },

      sourceImageUrl: this.imageUrl,
      sourceImageX: 0,        // 图片显示X
      sourceImageY: 0,        // 图片显示Y
      selectLeft: 0,          // 选择框（点击时）起始X
      selectTop: 0,           // 选择框（点击时）起始Y
      selectDrawLeft: 0,      // 选择框（渲染时）起始X
      selectDrawTop: 0,       // 选择框（渲染时）起始Y
      selectWidth: 0,         // 选择框宽度
      selectHeight: 0,        // 选择框高度
      selectDragging: false,  // 是否拖动鼠标
      canvas: null,           // 图片处理对象
    };
  },
  methods: {
    ...mapMutations(['setAvatar']),
    startSelect(event) {
      let sourceImage = this.$refs.sourceImage;
      this.sourceImageX = sourceImage.clientX;
      this.sourceImageY = sourceImage.clientY;
      this.selectLeft = event.clientX;
      this.selectTop = event.clientY;
      this.selectDrawLeft = event.clientX;
      this.selectDrawTop = event.clientY;
      this.selectWidth = 0;
      this.selectHeight = 0;
      this.selectDragging = true;
    },
    moveSelect(event) {
      event.preventDefault()
      if (this.selectDragging) {
        this.selectWidth = cal.min(cal.abs(event.clientX - this.selectLeft), cal.abs(event.clientY - this.selectTop));
        this.selectHeight = cal.min(cal.abs(event.clientX - this.selectLeft), cal.abs(event.clientY - this.selectTop));
        if(event.clientX < this.selectLeft)
          this.selectDrawLeft = this.selectLeft - this.selectWidth;
        if(event.clientY < this.selectTop)
          this.selectDrawTop = this.selectTop - this.selectHeight;
      }
    },
    endSelect() {
      this.selectDragging = false;
      let imgObj = new Image()
      imgObj.src = this.imageUrl
      imgObj.onload = () => {
        // 图片加载完毕后进行计算
        
        let sourceImage = this.$refs.sourceImage.getBoundingClientRect();
        let ratio = 300/cal.max(imgObj.width, imgObj.height)
        let sourceImageX = cal.max(this.selectDrawLeft - sourceImage.x, 0)/ratio;
        let sourceImageY = cal.max(this.selectDrawTop - sourceImage.y, 0)/ratio;
        let sourceImageWidth = cal.min(imgObj.width, this.selectWidth/ratio);
        let sourceImageHeight = cal.min(imgObj.height, this.selectHeight/ratio);

        this.canvas = document.createElement('canvas');
        this.canvas.width = 1024;
        this.canvas.height = 1024;

        if(!this.canvas){
          this.messageTitle = this.t('elDialog.errorMessages.title')
          this.message = this.t('elDialog.errorMessages.errorTypes.noCanvas')
          this.messageVisible = true
          return;
        }

        let ctx = this.canvas.getContext('2d');

        ctx.drawImage(imgObj,                            // 图像源
                      sourceImageX.toFixed(0),           // 裁剪起始X（从左往右）
                      sourceImageY.toFixed(0),           // 裁剪起始Y（从上往下）
                      sourceImageWidth.toFixed(0),       // 裁剪宽度
                      sourceImageHeight.toFixed(0),      // 裁剪高度
                      0, 0,                              // 裁剪后的图像在画布上放置的起始坐标
                      1024,     // 裁剪后的图像宽度
                      1024      // 裁剪后的图像高度
                      );

        const clippedData = this.canvas.toDataURL();
        this.previewImg = clippedData
      }
    },
    clip() {

      if(this.selectHeight*this.selectWidth === 0){
        this.message = this.t('elDialog.errorMessages.errorTypes.noImageClipped')
        this.messageTitle = this.t('elDialog.errorMessages.title')
        this.messageVisible = true
        return;
      }

      // 获取原始图片宽高
      let imgObj = new Image()
      imgObj.src = this.imageUrl
      imgObj.onload = () => {
        // 图片加载完毕后进行计算
        
        let sourceImage = this.$refs.sourceImage.getBoundingClientRect();
        let ratio = 300/cal.max(imgObj.width, imgObj.height)
        let sourceImageX = cal.max(this.selectDrawLeft - sourceImage.x, 0)/ratio;
        let sourceImageY = cal.max(this.selectDrawTop - sourceImage.y, 0)/ratio;
        let sourceImageWidth = cal.min(imgObj.width, this.selectWidth/ratio);
        let sourceImageHeight = cal.min(imgObj.height, this.selectHeight/ratio);

        this.canvas = document.createElement('canvas');
        this.canvas.width = 1024;
        this.canvas.height = 1024;

        if(!this.canvas){
          this.messageTitle = this.t('elDialog.errorMessages.title')
          this.message = this.t('elDialog.errorMessages.errorTypes.noCanvas')
          this.messageVisible = true
          return;
        }

        let ctx = this.canvas.getContext('2d');

        ctx.drawImage(imgObj,                            // 图像源
                      sourceImageX.toFixed(0),           // 裁剪起始X（从左往右）
                      sourceImageY.toFixed(0),           // 裁剪起始Y（从上往下）
                      sourceImageWidth.toFixed(0),       // 裁剪宽度
                      sourceImageHeight.toFixed(0),      // 裁剪高度
                      0, 0,                              // 裁剪后的图像在画布上放置的起始坐标
                      1024,     // 裁剪后的图像宽度
                      1024      // 裁剪后的图像高度
                      );

        const clippedData = this.canvas.toDataURL();
        this.previewImg = clippedData
        this.setAvatar(clippedData)
        // 获取图片数据并发送至后端
        let data = {
          "Id": this.userId,
          "ImageData": clippedData,  //base64编码的图片数据
          "description": "Customized avatar"
        }
        this.loading = true
        axios.post('http://localhost:2020/user/uploadAvatar',data).then(response =>{
          this.loading = false
          if(response.data.code !== 200){
            // 发送失败
            this.messageTitle = this.t('elDialog.errorMessages.title')
            this.message = this.t('elDialog.errorMessages.errorTypes.uploadFailure') + " Reply code " + response.data.code
            this.messageVisible = true
          }
          else{
            this.$emit("pageHide")
          }
        }, error=>{
          this.loading = false
          this.messageTitle = this.t('elDialog.errorMessages.title')
          this.message = this.t('elDialog.errorMessages.errorTypes.uploadFailure') + error.message
          this.messageVisible = true
        })
      }
    },
    cancle(){
      this.$emit("pageHide");
    }
  },
  props:{
    imageUrl:{
      type: String,
      required: true
    }
  },
  watch:{
    pageColorStyle(newVal, oldVal){
      this.buttonStyle.backgroundColor = cal.rgbaTextSpawn(cal.hexToRgb(newVal.buttonColor.hex), newVal.buttonColor.alpha);
    },
    'pageColorStyle.fontColor'(newVal){
      this.buttonStyle.fontColor = newVal
    }
  },
  components:{
    modernButton
  }
};
</script>

<style scoped>

.base{
  width: 100%;
  height:100%;
  display: flex;
  margin: auto;
  align-items: center;
  justify-content: center;
  font-family: serif;
}

.clipContainer{
  display: flex;
  position: fixed;
  border-radius: 10px;
  width: 550px;
  height: 400px;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  background-color: v-bind("backgroundColor");
  border: v-bind("'1px solid ' + pageColorStyle.buttonColor.hex");
}

.viewer{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.selectionContainer{
    padding: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 150px;
    background-color: transparent;
}

.image{
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 300px;
  max-height: 300px;
}

.text{
  color: v-bind("pageColorStyle.fontColor");
}

.wrapper{
  display: flex;
  position: fixed;
  top: v-bind("selectDrawTop + 'px'");
  left: v-bind("selectDrawLeft + 'px'");
  width: v-bind("selectWidth + 'px'");
  height: v-bind("selectHeight + 'px'");
  background-color: transparent;
  border: 1px solid aqua;
  z-index: 100;
}

</style>