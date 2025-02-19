<template>
    <div class="base" v-loading="uploading" element-loading-background="rgba(0,0,0,0.6)">
        <div class="container">
            <p class="text">{{ t('userPage.editName.edit') }}<inputBox :visibleButton="false" :clearAllButton="true" :widthExpand="100" @dataChanged="getNewName" :defaultContent="userName"/></p>
            <modernButton :customButtonStyle="buttonStyle" :buttonText="t('userPage.editName.confirm')" @buttonClicked="uploadName" element-loading-background="rgba(0,0,0,0.6)" />
            <modernButton :customButtonStyle="buttonStyle" :buttonText="t('userPage.editName.cancle')" @buttonClicked="cancle" />
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
import modernButton from './modernButton.vue';
import inputBox from './inputBox.vue';
import axios from 'axios';
import cal from '@/utils/calculation';
import { useStore } from '@/store';
import { useI18n } from 'vue-i18n';
import { computed } from '@vue/reactivity';
import { mapMutations } from 'vuex';
export default{
    setup(){
        const store = useStore();
        const {t} = useI18n();
        return{
            userId: computed(()=>store.state.settings.userId),
            userName: computed(()=>store.state.settings.userName),
            pageColorStyle: computed(()=>store.state.settings.pageColorStyle),
            t
        }
    },
    data(){
        return{
            curName: this.userName,
            message: "",
            messageTitle: "",
            messageVisible: false,
            uploading: false,
            backgroundColor: computed(()=>cal.rgbaTextSpawn(cal.hexToRgb(this.pageColorStyle.backgroundColor.hex), this.pageColorStyle.backgroundColor.alpha)),
            buttonStyle: {
                backgroundColor: this.pageColorStyle.buttonColor.hex,
                fontColor: this.pageColorStyle.fontColor,
                width:"250px",
                height:"35px",
                borderColor:"transparent",
                borderRadius:"6px",
                cursor:"pointer",
                outlineColor:"transparent",
                wordSpacing:"50px",
                divHeight:"4rem"
            }
        }
    },
    watch:{
        pageColorStyle(newVal, oldVal){
            this.buttonStyle.backgroundColor = newVal.buttonColor.hex
        },
        'pageColorStyle.fontColor'(newVal){
            this.buttonStyle.fontColor = newVal
        }
    },
    methods:{
        ...mapMutations(['setUserName']),
        getNewName(newVal){
            this.curName = newVal
        },
        cancle(){
            this.$emit("hidePage")
        },
        uploadName(){
            if(this.curName === ""){
                this.message = this.t('elDialog.errorMessages.errorTypes.blankName')
                this.messageTitle = this.t('elDialog.errorMessages.title')
                this.messageVisible = true
                return;
            }
            if(this.curName === this.userName){
                this.message = this.t('elDialog.errorMessages.errorTypes.repeatName')
                this.messageTitle = this.t('elDialog.errorMessages.title')
                this.messageVisible = true
                return;
            }

            let data = {
                "Id": this.userId,
                "userName": this.curName
            }
            this.uploading = true
            axios.post('http://localhost:2020/user/changeUserName',data).then(response=>{
                if(response.data.code === 200){
                    // 修改成功
                    this.setUserName(this.curName)
                    this.$emit("hidePage")
                } else {
                    // 修改失败
                    this.message = this.t('elDialog.errorMessages.errorTypes.uploadFailure') + "Reply code " + response.data.code
                    this.messageTitle = this.t('elDialog.errorMessages.title')
                    this.messageVisible = true
                }
                this.uploading = false
            }, error=>{
                this.message = this.t('elDialog.errorMessages.errorTypes.uploadFailure') + error.message
                this.messageTitle = this.t('elDialog.errorMessages.title')
                this.uploading = false
                this.messageVisible = true
            })
        }
    },
    components:{
        modernButton,
        inputBox
    }
}
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

.text{
    color: v-bind("buttonStyle.fontColor");
}

.container{
  display: flex;
  position: fixed;
  border-radius: 10px;
  width: 550px;
  height: 400px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: v-bind("backgroundColor");
  border: v-bind("'1px solid ' + pageColorStyle.buttonColor.hex");
}

</style>