<template>
  <!-- Setting Item 组件 -->
  <div :class="['setting-item', { horizontal: props.horizontal !== false }]">
    <!-- Label 标签 -->
    <div class="setting-lable">
      <!-- 通过插槽slot，实现自定义Label标签内容 -->
      <slot name="lable">
        <span>{{ props.lable }}</span>
      </slot>
    </div>
    <!-- Setting Item 内容 -->
    <slot />
  </div>
</template>

<script lang="ts" setup type="module">
import {defineProps, withDefaults} from 'vue'
// Setting Item 组件 Props 定义
interface SettingItemProps {
  lable?: string // 标签内容
  horizontal?: boolean // 是否水平布局
}

// Props 默认值
const props = withDefaults(defineProps<SettingItemProps>(), {
  horizontal: false
})
</script>

<style lang="less">
.setting-item {
  min-height: 38px;

  .setting-lable {
    margin: 8px 0;

    span {
      font-size: 16px;
    }
  }

  // 如果 horizontal 属性被设置且为 true，则设置水平布局
  &.horizontal {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .setting-lable {
      margin: 0;
    }
  }
}
</style>
