<template>
  <div class="gbl">
    <!-- 选项 -->
    <div class="radioSwitch">
      <radioSwitch :text-array="textArray" @changeSelection="backgroundSource"/>
    </div>
    
    <div class="show">
      <!-- 网络图片展示 -->
      <el-scrollbar>
      <div class="basis" v-loading="state.pictureLoading" element-loading-background="transparent">
        <div style="display: flex;flex-direction: column;align-items: center;justify-content: center; cursor: pointer;"
        @click="loadWebPicture">
          <closeButton v-show="!state.pictureLoaded"/>
          <p v-show="!state.pictureLoaded" :style="'color:'+fontColor">{{ t('settingPage.wallpaper.reload') }}</p>
        </div>
        <!-- 从本地读取图片，仅供测试使用 -->
        <!-- <input type="file" style="width: 600px; height: 100px;" ref="testInput" multiple @change="testFunc"> -->
        <div v-for="(image, index) in state.images" :key="index">
          <imageViewer :local-url="image.localUrl" :web-url="image.webUrl" :imageDescription="image.description" />
        </div>
      </div>
      </el-scrollbar>
      <!-- 本地图片上传 -->
      <div>
        <fileChoose @error="handleError"/>
      </div>
    </div>
    <el-dialog :title="state.messageTitle" v-model="state.messageVisible" width="30%">
      <span>{{ state.message }}</span>
      <template #footer>
      <span class="dialog-footer">
          <el-button type="primary" @click="state.messageVisible = false">{{ t('elDialog.buttons.confirm') }}</el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
// 引入 axios 库
import axios from '@/plugins/axios';
import { ref, onMounted, reactive, watch } from 'vue';
import imageViewer from '@/components/basis/imageViewer.vue';
import radioSwitch from '@/components/basis/radioSwitch.vue';
import fileChoose from '@/components/basis/fileChoose.vue';
import closeButton from '@/components/basis/closeButton.vue';
import { useStore } from '@/store';
import { useI18n } from 'vue-i18n';
import { computed } from '@vue/reactivity';

const { t , locale } = useI18n();
const webImages = t('settingPage.wallpaper.webImages');
const uploadImages = t('settingPage.wallpaper.uploadImages.title');
const textArray = ref([webImages, uploadImages]);

watch(locale,(newLocale)=>{
  const newWebImages = t('settingPage.wallpaper.webImages');
  const newUploadImages = t('settingPage.wallpaper.uploadImages.title');
  textArray.value.splice(0, textArray.value.length, newWebImages, newUploadImages);
})

// 定义图片数据类型
interface ImageInfo {
  localUrl: string,
  webUrl: string,
  description: string
}

// 在组件加载完成时获取图片数据并更新 images 数据
onMounted(() => {
  loadWebPicture()
});

async function loadWebPicture(){
  try {
    state.pictureLoading = true
    state.pictureLoaded = true
    // 清空旧数据
    while(state.images.length > 0){
      URL.revokeObjectURL(state.images[0].url)
      state.images.pop()
    }
    // 从服务器获取背景图片URL
    axios.get<any>('http://localhost:2020/user/web-images').then(response=>{
      const imageURLs = String(response.data.data.url).split(',')
      const imageDescriptions = String(response.data.data.description).split(',')
      var i = 0
      for(i = 0; i < imageURLs.length - 1; i++){
        // 根据URL数组从服务器获取图片数据
        let description = imageDescriptions[i]??''
        let url = imageURLs[i]
        axios.get(imageURLs[i]).then(response=>{
          let imageStr = window.atob(response.data.data.image);
          const imageDat = new Uint8Array(imageStr.length)
          for(let j = 0; j < imageStr.length; j++)
            imageDat[j] = imageStr.charCodeAt(j)
          const imageBlob = new Blob([imageDat], { type: 'image/jpeg' });
          state.images.push({
            localUrl: URL.createObjectURL(imageBlob),
            webUrl: url,
            description: description
          })
        },error=>{
          console.log('ERROR ',error.message)
          state.pictureLoaded = false
        })
      }
      state.images.push({
        localUrl: "",
        webUrl: "",
        description: "✖"
      })
    }, error=>{
      console.log(error);
      state.pictureLoaded = false
    });
  } catch (error) {
    console.log(error);
    state.pictureLoaded = false
  }
  state.pictureLoading = false
}

const state = reactive({
  backgroundSourceIndex: 0,
  pictureLoading: true,
  pictureLoaded: true,
  // 使用 ref 定义响应式数据
  images: ref<Array<ImageInfo>>([]),
  message: "",
  messageTitle: "",
  messageVisible: false
});

const backgroundSource = (index:number)=>{
  state.backgroundSourceIndex = index
}

const handleError = (title: string, msg: string)=>{
  state.messageTitle = title
  state.message = msg
  state.messageVisible = true
}

const store = useStore();
const fontColor = computed(()=> store.state.settings.pageColorStyle.fontColor)

// 仅供测试使用
// const testFunc = (eve:any)=>{
//    // 获取文件路径并设置到 images 中
//   while(state.images.length>0)
//     state.images.pop();
//   var i = 0;
//   var file:any;
//   for(i = 0;i < eve.target.files.length;i++){
//     file = eve.target.files[i]
//     console.log(file)
//     state.images.push({
//       url: URL.createObjectURL(file),
//       alt: "error:" + file,
//       description: "Test"
//     });
//   }
// }
</script>

<style scoped>

.gbl{
  display: flex;
  flex-direction: row;
  padding: 10px 30px 10px 30px;
  margin: 0px;
  width: 1200px;
  max-width: 600px;
  height: 600px;
  overflow: hidden;
  justify-content: center;
  z-index: 1;
}

.show{
  display: flex;
  flex-direction: row;
  transition: all 0.5s ease;
  transform: v-bind("'translate(' + (-state.backgroundSourceIndex/textArray.length*100+25).toFixed(0) + '%,0%)'")
}

.radioSwitch{
  display: flex;
  position: fixed;
  height: 30px;
  z-index: 100;
}

.basis{
  background-color: transparent;
  margin: 0px;
  padding: 0px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  position: relative;
  height: auto;
  min-height: 600px;
  width: 600px;
  overflow: hidden scroll;
  z-index: 1;
  align-items: center;
  justify-content: center;
}

.basis::-webkit-scrollbar{
  display: none;
}
</style>