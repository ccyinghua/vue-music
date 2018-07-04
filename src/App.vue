<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header.vue' // 头部组件
import Tab from 'components/tab/tab.vue' // tab栏
export default {
  components: {
    MHeader,
    Tab
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
