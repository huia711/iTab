<template>
  <div class="item-wrap">
      <!-- 如果需要使用文本图标或者没有传入图片地址，则渲染文本图标 -->
      <p
        v-if="textIcon || !src"
        class="text-icon"
        :style="{
          fontSize: toPixel(size)
        }"
      >
        {{ getFontIcon() }}
      </p>

      <!-- 如果传入了图片地址，则渲染图片 -->
      <img v-else class="img-icon" :src="src" alt="logo" draggable="false" />
  </div>

</template>

<script lang="ts" setup type="module">
// 引入常用工具方法
import { isEmpty } from "@/utils/common"
import { toPixel } from "@/utils/common"
import {defineProps, withDefaults} from 'vue'

// Icon 组件的 Props 定义
interface IconProps {
  src?: string // 图片地址
  textIcon?: boolean // 是否使用文本图标
  title?: string // 图标的提示文本
  size?: number // 图标的尺寸
}

// 使用 withDefaults 和 defineProps 方法为 Props 的每个属性定义默认值
const props = withDefaults(defineProps<IconProps>(), {
  textIcon: false,
  size: 38
})

// 获取文本图标
function getFontIcon() {
  if (isEmpty(props.title)) return "无"

  const firstChar = props.title.trim().charAt(0)
  return firstChar.toUpperCase()
}

</script>

<style>
.item-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative; /* 添加这一行 */

  width: 65px;
  height: 65px;

    /* 文本图标样式 */
    .text-icon {
      width: 65px;
      height: 65px;
      font-size: 38px;
      margin: 0;
      line-height: 0.9;

      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      user-select: none;
    }

    /* 图片样式 */
    .img-icon {
      height: 75%;
      width: 75%;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
    }
}

</style>
