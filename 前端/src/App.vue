<template>
  <!-- ConfigProvider 组件用来管理 全局的主题和语言配置 -->
  <config-provider>
    <!--router:路由表——组件与 URL 之间的映射-->
    <router-view/>
  </config-provider>
</template>

<script>
  import ConfigProvider from "@/components/ConfigProvider.vue";
  export default{
    components: {ConfigProvider},
    beforeCreate(){
      document.querySelector('body').setAttribute('style','margin:auto')
    }
  }
</script>

<style>
</style>
