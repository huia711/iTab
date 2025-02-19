<template>
    <!-- 用户界面，包括上传头像（点击头像上传）、修改用户名、登录密码、退出登录以及删除账号 -->
    <div v-loading="loading" element-loading-background="rgba(0,0,0,0.6)" class="base">
        <div class="basis">
            <!-- 用户头像 -->
            <div class="userHeadImg">
                <modernButton :customButtonStyle="imgStyle" :srcPath="userHeadImgPath" :autoCalculation="false" @buttonClicked="openFileBrowser" />
            </div>
            <div class="blankContainer"></div>
            <div class="selectionContainer">
                <!-- 各个选项 -->
                <div class="selection">
                    <!-- 用户名 -->
                    <p style="width: 150px;" class="text">{{ t('userPage.username') + userName }}</p>
                    <div class="editPen" @click="editNamePageVisible(true)"><el-icon><EditPen/></el-icon></div>
                </div>
                <div class="selection">
                    <!-- 密码 -->
                    <p style="width: 150px;" class="text">{{t('userPage.password')  }}</p>
                    <div class="editPen" @click="editPasswordPageVisible(true)"><el-icon><EditPen/></el-icon></div>
                </div>
                <!-- 退出登录 -->
                <modernButton :buttonText="t('userPage.logout')" :customButtonStyle="logoutButtonStyle" 
                @buttonClicked="logout"/>
                <!-- 删除账号 -->
                <modernButton :buttonText="t('userPage.deleteAccount')" :customButtonStyle="deleteAccountButtonStyle" :autoCalculation="false"
                @buttonClicked="deleteWarning" @mouseOn="deleteAccountButtonState(true)" @mouseLeave="deleteAccountButtonState(false)"/>
            </div>
        </div>
        <!-- 截图页面 -->
        <imageClip v-if="avatarProcessWindowVisible" 
        :imageUrl="avatarSrc" @pageHide="avatarClipPageVisible(false)" v-click-outside="handleClickOutsideClipPage"
        style="display: flex; z-index: 200; position: fixed;"/>
        <input ref="fileInput" type="file" style="display:none;" accept="image/*" @change="handleFileChange" 
        />
        <!-- 编辑昵称页面 -->
        <editName v-if="editNameWindowVisible" v-click-outside="handleClickOutsideNamePage"
        @hidePage="editNamePageVisible(false)"
        style="display: flex; z-index: 200; position: fixed;"/>
        <!-- 编辑密码页面 -->
        <editPassword v-if="editPasswordWindowVisible" v-click-outside="handleClickOutsidePasswordPage"
        @hidePage="editPasswordPageVisible(false)"
        style="display: flex; z-index: 200; position: fixed;"/>
        <!-- 提示框 -->
        <el-dialog :title="t('elDialog.messages.warningTitle')" v-model="dialogVisible" width="30%">
            <span>{{ t('elDialog.messages.deleteWarning') }}</span>
            <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">{{ t('elDialog.buttons.cancle') }}</el-button>
                <el-button @click="deleteAccount">{{ t('elDialog.buttons.confirm') }}</el-button>
            </span>
            </template>
        </el-dialog>
        <el-dialog :title="messageTitle" v-model="messageVisible" width="30%">
            <span>{{ message }}</span>
            <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="handleMessageConfirm">{{ t('elDialog.buttons.confirm') }}</el-button>
            </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import modernButton from '@/components/basis/modernButton.vue';
import imageClip from '@/components/basis/imageClip.vue';
import editName from '@/components/basis/editName.vue';
import editPassword from '@/components/basis/editPassword.vue';
import { useStore } from '@/store'
import { useI18n } from 'vue-i18n'
import { EditPen } from '@element-plus/icons-vue';
import { computed } from '@vue/reactivity';
import cal from '@/utils/calculation'
import { mapMutations } from 'vuex';
import axios from 'axios';
export default{
    setup(){
        const store = useStore();
        const {t} = useI18n();
        return{
            userId: computed(()=>store.state.settings.userId),
            imgStyle: computed(()=>store.state.settings.imgStyle),
            pageColorStyle: computed(()=>store.state.settings.pageColorStyle),
            userHeadImgPath: computed(()=>store.state.settings.avatar),
            userName: computed(()=>store.state.settings.userName),
            t
        }
    },
    data(){
        return{
            avatarSrc: "",
            dialogVisible: false,
            message: "",
            messageTitle: "",
            messageVisible: false,
            loading: false,
            avatarProcessWindowVisible: false,
            editNameWindowVisible: false,
            editPasswordWindowVisible: false,
            backgroundColor: computed(()=>cal.rgbaTextSpawn(cal.hexToRgb(this.pageColorStyle.backgroundColor.hex), this.pageColorStyle.backgroundColor.alpha)),
            logoutButtonStyle:{
                backgroundColor: this.pageColorStyle.buttonColor.hex,
                borderColor: "transparent",
                borderRadius: "5px",
                fontColor: this.pageColorStyle.fontColor,
                cursor: "pointer",
                height: "35px",
                width: "100px",
                divHeight: "3rem"
            },
            deleteAccountButtonStyle:{
                backgroundColor: "#ee5454",
                borderColor: "transparent",
                borderRadius: "5px",
                fontColor: "black",
                cursor: "pointer",
                height: "35px",
                width: "100px",
                divHeight: "3rem"
            }
        }
    },
    methods:{
        ...mapMutations(['setAvatar','setUserId','setUserName','setUserPassword','setBackgroundImage']),
        openFileBrowser() {
            // 手动触发点击事件，打开文件选择框
            this.$refs.fileInput.click();
        },
        handleFileChange(event) {
            // 获取文件路径并设置到 data 中
            const file = event.target.files[0];
            if(file){
                this.avatarSrc = URL.createObjectURL(file);
                this.avatarClipPageVisible(true)
            }
        },
        deleteAccountButtonState(state){
            if(state === true){
                this.deleteAccountButtonStyle.backgroundColor="#df0101"
            }
            else{
                this.deleteAccountButtonStyle.backgroundColor="#ee5454"
            }
        },
        logout(){
            if(this.userId !== ""){
                this.setAvatar("img/userHead.png")
                this.setUserName("Guest")
                this.setUserId("")
                this.setUserPassword("")
                this.setBackgroundImage("")
                // 删除本地记录
                localStorage.removeItem("userId")
                localStorage.removeItem("userPassword")
                this.$emit("pageHide")
            }
            else
                this.unLogined()
        },
        deleteWarning(){
            this.dialogVisible = true
        },
        deleteAccount(){
            this.dialogVisible = false
            if(this.userId === ""){
                this.unLogined()
                return;
            }
            let data = {
                "Id": this.userId
            }
            this.loading = true
            axios.post("http://localhost:2020/user/deleteAccount",data).then(response=>{
                if(response.data.code === 200){
                    // 删除成功
                    this.setUserId("")
                    this.setUserName("Guest")
                    this.setUserPassword("")
                    this.setAvatar("img/userHead.png")
                    this.messageTitle = ""
                    this.message = this.t('elDialog.message.deleteSuccess')
                    this.messageVisible = true
                } else {
                    this.messageTitle = this.t('elDialog.errorMessages.title')
                    this.message = this.t('elDialog.errorMessages.errorTypes.deleteFailure') + "Reply code " + response.data.code
                    this.messageVisible = true
                }
                this.loading = false
            }, error =>{
                this.messageTitle = this.t('elDialog.errorMessages.title')
                this.message = this.t('elDialog.errorMessages.errorTypes.deleteFailure') + error.message
                this.loading = false
                this.messageVisible = true
            })
        },
        handleClickOutsideClipPage(){
            if(this.avatarProcessWindowVisible === true)
                this.avatarProcessWindowVisible = false
        },
        handleClickOutsideNamePage(){
            if(this.editNameWindowVisible === true)
                this.editNameWindowVisible = false
        },
        handleClickOutsidePasswordPage(){
            if(this.editPasswordWindowVisible === true)
                this.editPasswordWindowVisible = false
        },
        avatarClipPageVisible(state){
            if(this.userId !== "")
                this.avatarProcessWindowVisible = state
            else
                this.unLogined()
        },
        editNamePageVisible(state){
            if(this.userId !== "")
                this.editNameWindowVisible = state
            else
                this.unLogined()
        },
        editPasswordPageVisible(state){
            if(this.userId !== "")
                this.editPasswordWindowVisible = state
            else
                this.unLogined()
        },
        handleMessageConfirm(){
            this.messageVisible = false
            if(this.userId === "")
                this.$emit("pageHide")
        },
        unLogined(){
            this.messageTitle = this.t('elDialog.errorMessages.title')
            this.message = this.t('elDialog.errorMessages.errorTypes.notLogined')
            this.messageVisible = true
        }
    },
    watch:{
        pageColorStyle(newVal, oldVal){
            this.logoutButtonStyle.backgroundColor = newVal.buttonColor.hex
        },
        'pageColorStyle.fontColor'(newVal){
            this.logoutButtonStyle.fontColor = newVal
        }
    },
    components:{
        modernButton,
        imageClip,
        editName,
        editPassword,
        EditPen
    }
}
</script>

<style scoped>

.base{
  width: 100%;
  height:100%;
  display: flex;
  margin: auto;
  background-size: cover;
  background-attachment: scroll;
  font-family: serif;
}

.basis{
    width: 250px;
    top: 10%;
    left: 70%;
    position: relative;
    height: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 10px;
    border: v-bind("'1px solid ' + pageColorStyle.buttonColor.hex");
    background-color: v-bind("backgroundColor");
}

.text{
    color: v-bind("pageColorStyle.fontColor");
}

.userHeadImg{
    display: flex;
    position: fixed;
    top: 12%;
    z-index: 100;
}

.blankContainer{
    height: 70px;
    width: 150px;
    background-color: transparent;
}

.selectionContainer{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 150px;
    background-color: transparent;
}

.selection{
    display: flex;
    flex-direction: row;
    align-items: center;
}

.editPen{
    cursor: pointer;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}

</style>