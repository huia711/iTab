<!--suppress TypeScriptValidateTypes -->
<template>
  <div class="calendar">
    <el-calendar >
      <template #header="{ date }">
        <span>日程</span>
        <span>{{ date }}</span>
      </template>

      <template #date-cell="{ data }">
        <p :class="data.isSelected ? 'is-selected' : ''">
          {{ data.day.split('-').slice(1).join('-') }}
          {{ data.isSelected ? '✔️' : '' }}
        </p>
        <p>
          {{ getMessage(data.day) }}
        </p>
        <el-dialog v-model="data.isSelected">
          <el-form-item label="日程" prop="title">
            <el-input v-model="log" placeholder="今天要……" />
          </el-form-item>
          <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click=Save(data.day)>
              确定
            </el-button>
          </span>
          </template>
        </el-dialog>
      </template>
    </el-calendar>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from "@vue/reactivity"
  import axios from "@/plugins/axios";
  import { ElMessage } from "element-plus";
  import {computed, onBeforeMount, watch} from "vue";
  import { useStore } from "@/store"
  import { debounce } from "@/utils/async";

  interface post {
    id: string
    date: string
    log: string
  }

  const { state } = useStore()

  let logs: post[] = []
  const userID = computed(() => state.settings.userId ).value

  let log = ref('')

  watch(() => logs.length, (newValue, oldValue) => {
    logs = newValue
    console.log(":"+logs.length)
  })

  function getMessage (date: Date) {
    console.log(":"+logs.length)
    for (let i in logs) {
      if (date === logs[i].date) {
        return logs[i].log
      }
    }
  }


  function Save(date: Date) {
    const post = {
      id: userID,
      date: date,
      log: log.value
    }
    logs.push(post)
    Postlog(post, userID)

  }

  const Postlog = debounce((data: post) => {
    /**
     * 上传新标签页到服务器
     */
    try {
      console.log(data)
      axios.post('http://localhost:2020/user/log', data).then(response=> {
        if (response.data.code === 200) {
          ElMessage({
            message: "已连接服务器",
            type: "success",
          })
        }
      },(error)=>{
        ElMessage({
          message: "无法连接服务器",
          type: 'warning',
        })
      })
    } catch (error) {
      console.log(error)
    }
  }, 250)

  async function getContent() {
    try {
      await axios.get('http://localhost:2020/user/myLog/' + userID).then(response => {
        if (response.data.code === 200 && response.data.data !== null) {
          const date = response.data.data.Date
          const log = response.data.data.log
          console.log(date)
          console.log(log)
          logs=[]
          for (let i = 0; i < log.length - 1; i++) {
            const Log = {
              date: date[i],
              log: log[i]
            }
            logs.push(Log)
            console.log(logs)
          }
          return response.data.data.data
        }
      }, (error) => {
        ElMessage({
          message: "无法连接服务器",
          type: 'warning',
        })
      })
    } catch (error) {
      console.log(error)
    }
  }

  onBeforeMount(getContent)

</script>

<style>
  .is-selected {
    color: #1989fa;
  }

  .calendar {
    width: 970px;

    align-items: center;
    justify-content: center;
  }
</style>
