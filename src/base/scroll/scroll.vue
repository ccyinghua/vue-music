<!-- scroll组件 -->
<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'

export default {
  name: 'slider',
  props: {
    probeType: { // 帮助知道滚动的位置
      type: Number,
      default: 1
    },
    click: { // 是否派发click事件, better-scroll默认会阻止浏览器的原生 click 事件
      type: Boolean,
      default: true
    },
    /**
     * data变化时，需要 refresh，重新计算 better-scroll，
     * _initScroll()是在mounted中，初始化时异步获取的数据可能还没请求回来
     * 监听data变化，重新refresh，实现滚动
     */
    data: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  mounted() {
    setTimeout(() => {
      this._initScroll()
    }, 20)
  },
  methods: {
    // 初始化滚动
    _initScroll() {
      if (!this.$refs.wrapper) {
        return
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })
    },
    disable() { // 禁用 better-scroll
      this.scroll && this.scroll.disable()
    },
    enable() { // 启用 better-scroll
      this.scroll && this.scroll.enable()
    },
    refresh() { // 重新计算 better-scroll
      this.scroll && this.scroll.refresh()
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this.refresh()
      }, 20)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
