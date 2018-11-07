<!-- 字母列表组件 -->
<template>
  <scroll
    class="listview"
    ref="listview"
    :data="data"
    :probeType="probeType"
    :listenScroll="listenScroll"
    @scroll="scroll"
    >
    <!-- 歌手列表 -->
    <ul>
      <li v-for="group in data" :key="group.title" class="list-group" ref="listgroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="item in group.items" :key="item.id" class="list-group-item">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!-- 右侧字母列表 -->
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onshortcutTouchMove">
      <ul>
        <li v-for="(item, index) in shortcutList"
            :key="item"
            class="item"
            :class="{'current': currentIndex === index}"
            :data-index="index">
          {{item}}
        </li>
      </ul>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import { getData } from 'common/js/dom'

// const TITLE_HEIGHT = 30 // 左侧歌手列表title的高度
const ANCHOR_HEIGHT = 18 // 字母列表每个字母的高度

export default {
  name: '',
  props: {
    data: { // 歌手数据
      type: Array,
      default: function () {
        return []
      }
    }
  },
  created() {
    this.touch = {}
    this.probeType = 3 // 设置实时派发scroll事件
    this.listenScroll = true // 设置监听滚动传入子组件
    this.listHeight = [] // 左歌手列表每个group的所在高度集合
  },
  data() {
    return {
      scrollY: -1, // 实时滚动的y的距离
      currentIndex: 0 // 当前应高亮的index
    }
  },
  computed: {
    shortcutList() { // 获取字母列表(数组) shortcutList = ['热',A,...,Z]
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    }
  },
  mounted() {
  },
  methods: {
    // 字母列表手指按下
    onShortcutTouchStart(e) {
      // e.target为按下的字母： 例按下A字母输出 '<li data-index="1" class="item">A</li>'
      console.log(e.target)
      let anchorIndex = getData(e.target, 'index')
      let firstTouch = e.touches[0] // e.touches当前跟踪的触摸操作的touch对象的数组
      this.touch.y1 = firstTouch.pageY // 触摸目标在页面中的y坐标
      this.touch.anchorIndex = anchorIndex // 记录刚开始按下的index
      // this.$refs.listview.scrollToElement(this.$refs.listgroup[anchorIndex], 0)
      this._scrollTo(anchorIndex)
    },
    // 手指在字母列表滑动时
    onshortcutTouchMove(e) {
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0 // y轴的偏移个数
      let anchorIndex = parseInt(this.touch.anchorIndex + delta) // 得到手指移动后所在的字母index
      this._scrollTo(anchorIndex)
    },
    // 接收子组件派发的滚动事件
    scroll(pos) {
      this.scrollY = pos.y
    },
    // 设置滚动
    _scrollTo(anchorIndex) {
      this.$refs.listview.scrollToElement(this.$refs.listgroup[anchorIndex], 0)
    },
    // 计算左侧歌手列表每个group的高度
    _calculateHeight() {
      this.listHeight = []
      const list = this.$refs.listgroup
      let height = 0
      this.listHeight.push(height) // 第1个group所在高度为0
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY(newY) {
      const listHeight = this.listHeight
      for (let i = 0; i < listHeight.length; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (!height2 || (-newY > height1 && -newY < height2)) { // i是最后一个，或滚动到了上一个与下一个之间
          this.currentIndex = i // 第i个高亮
          console.log(this.currentIndex)
          return
        }
      }
      this.currentIndex = 0
    }
  },
  components: {
    Scroll
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
