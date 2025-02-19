<template>
  <el-table
      :data="content"
      style="width: 100%"
      height="322"
      size="large"
      highlight-current-row
      :row-class-name="tableRowClassName"
      @row-dblclick="handleTable"
      @header-click="refresh"
  >
    <el-table-column prop="rank" label="排行" width="80" />
    <el-table-column prop="name" :label="title" width="400" />
  </el-table>
</template>

<script lang="ts" setup>
import {defineProps} from "vue/dist/vue";
import axios from "@/plugins/axios";
import {ElMessage} from "element-plus";
import { onBeforeMount, ref } from "vue";

interface ContentIndex {
    rank: number
    name: string
    url: string
  }

  const props = defineProps({
    type: {
      type: String,
      required: true,
    },
  });

  const content = ref<ContentIndex[]>([])
  let isCreatedCalled = false

  let title = ''
  if (props.type === 'wbHot')  title = "微博热搜"
  if (props.type === 'bili')  title = "B站热搜"
  if (props.type === 'zhihuHot')  title = "知乎热搜"
  if (props.type === 'itInfo')  title = "IT之家资讯"

  async function getContent() {
    if ((props.type) === undefined) {
      return []
    } else {
      try {
        await axios.get('http://localhost:2020/user/getMoreInfo?type=' + props.type).then(response => {
          if (response.data.code === 200 && response.data.data !== null) {

            content.value = response.data.data.data;
            console.log(content.value)
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
  }

  function handleTable(row, event) {
    console.log(row.url)
    window.open(row.url, "_blank")
  }

  function refresh (column, event) {
    getContent()
  }

  const tableRowClassName = ({
                               row,
                               rowIndex,
                             }: {
    rowIndex: number
  }) => {
    if (rowIndex === 0) {
      return 'warning-row'
    } else {
      return 'success-row'
    }
  }
</script>

<style>

  .el-table .warning-row {
    --el-table-tr-bg-color: var(--el-color-warning-light-9);
  }
  .el-table .success-row {
    --el-table-tr-bg-color: var(--el-color-success-light-9);
  }
</style>