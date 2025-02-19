<template>
    <div class="fileChooser">
        <div @click="openFileBrowser" class="chooser">
            <img v-if="imageURL" :src="imageURL" alt="Invalid resource" style="height: auto; width: auto; max-height: 300px;" />
            <p class="textDisplay">{{ t('settingPage.wallpaper.uploadImages.tips') }}</p>
        </div>
        <inputBox :visibleButton="false" 
        :placeHolder="t('settingPage.wallpaper.uploadImages.links')" 
        :widthExpand="50" style="margin: 20px;"
        :defaultContent="displayPath"
        :clearAllButton="true"
        @dataChanged="getdisplayPath"
        @inputFinished="checkURL"
        />
        <modernButton :buttonText="t('settingPage.wallpaper.confirm')" 
        :customButtonStyle="buttonStyle" 
        @buttonClicked="uploadPicture"
        />
        <input ref="fileInput" type="file" style="display:none;" accept="image/*" @change="handleFileChange" />
    </div>
</template>

<script>
import modernButton from '@/components/basis/modernButton.vue'
import inputBox from '@/components/basis/inputBox.vue'
import { useStore } from '@/store'
import { computed } from '@vue/reactivity'
import cal from '@/utils/calculation'
import { mapMutations } from 'vuex'
import { useI18n } from 'vue-i18n'
import axios from "@/plugins/axios"
export default {
  setup(){
    const store = useStore();
    const {t} = useI18n();
    return{
      curAlpha: 0,
      pageColorStyle: computed(() => store.state.settings.pageColorStyle),
      selectWindowColor: computed(() => cal.rgbaTextSpawn(cal.hexToRgb(store.state.settings.pageColorStyle.buttonColor.hex), 0.3)),
      id: computed(()=> store.state.settings.userId),
      store,
      t
    }
  },
  data(){
    return{
      displayPath: "",
      imageURL: "",
      imageData: null,
      message: "",
      messageTitle: "",
      messageVisible: false,
      buttonStyle:{
        backgroundColor: this.pageColorStyle.buttonColor.hex,
        fontColor: this.pageColorStyle.fontColor,
        width: "100px",
        height: "30px",
        borderColor: "transparent",
        borderRadius: "15px",
        cursor: "pointer"
      },
    }
  },
  methods: {
    ...mapMutations(['setBackgroundImage','setBackgroundURL']),
    openFileBrowser() {
      // 手动触发点击事件，打开文件选择框
      this.$refs.fileInput.click();
    },
    handleFileChange(event) {
      // 获取文件路径并设置到 data 中
      const file = event.target.files[0];
      this.imageURL = URL.createObjectURL(file);
      this.displayPath = this.imageURL.replace("blob:","")

      // 创建 FileReader 对象
      const reader = new FileReader();
      reader.onload = (event) => {
        // 获取图片 base64 数据并设置到 data 中
        this.imageData = event.target.result.toString();
      };
      // 读取文件数据
      reader.readAsDataURL(file);
    },
    checkURL(){
      if(this.displayPath!==""){
        // 从用户输入的URL获取图片
        axios.get(this.displayPath, { responseType: 'arraybuffer' }).then(response=>{
          this.imageData = response.data;
          const imageBlob = new Blob([this.imageData], { type: 'image/jpeg' });
          const imageUrl = URL.createObjectURL(imageBlob);
        // 现在，你可以将 imageUrl 用作 img 标签的 src 属性了。
          this.imageURL = imageUrl
          this.displayPath = imageUrl.replace("blob:","")
        }, error=>{
          this.$emit("error",this.t('elDialog.errorMessages.title'),
          this.t('elDialog.errorMessages.errorTypes.fetchFailure')+error.message)
        })
      }
    },
    getdisplayPath(path){
      this.displayPath = path.replace("blob:","")
    },
    uploadPicture(){
      if(this.imageURL !== ""){
        let data = {
          "id": this.id,
          "imageData": this.imageData,
          "description": "Customized background"
        }
        // 推送用户图片数据
        axios.post('http://localhost:2020/user/uploadBackground',data).then(response=>
        {
          if(response.data.code!==200){
            this.$emit("error",this.t('elDialog.errorMessages.title'),
            this.t('elDialog.errorMessages.errorTypes.uploadFailure')+response.data.msg)
          } else {
            this.setBackgroundURL(response.data.data.URL)
          }
        }, error=>{
          this.$emit("error",this.t('elDialog.errorMessages.title'),
          this.t('elDialog.errorMessages.errorTypes.uploadFailure')+error.message)
        })
        // 推送完后加载背景图片
        this.setBackgroundImage(this.imageURL)
      }
    },
    handleClearEvent(){
      this.imageURL = ""
    },
  },
  watch:{
    pageColorStyle(newVal,oldVal){
      this.buttonStyle.backgroundColor = newVal.buttonColor.hex
    },
    'pageColorStyle.fontColor'(newVal){
      this.buttonStyle.fontColor = newVal
    }
  },
  components:{
    modernButton,
    inputBox
  }
}
</script>

<style scoped>

.chooser{
    display: flex;
    flex-direction: column;
    padding: 0px;
    margin: 0px;
    border-radius: 10px;
    min-height: 200px;
    height: auto;
    width: 300px;
    background-color: v-bind("selectWindowColor");
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.textDisplay{
    display: flex;
    position: fixed;
    z-index: 100;
    color: v-bind("pageColorStyle.fontColor");
}

.fileChooser{
    margin: 0px;
    padding: 0px;
    width: 600px;
    height: 600px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

</style>