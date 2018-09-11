<!-- 推荐页面 -->
<template>
  <div class="recommend">
    <!-- better-scroll滚动refresh在于两个地方的数据变化：轮播数据与歌单数据变化时都需重新计算 -->
    <!-- 传入data:discList歌单数据,因为recommends轮播数据在discList之前获取，有内容了，所以这里传入discList即可 -->
    <!-- recommends轮播数据存在img图片异步，轮播的内容是由img高度撑起来的，so在img加载时需重新计算better-scroll，即loadImage方法 -->
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <!-- 轮播 -->
        <div v-if="recommends.length" class="slider-wrapper">
          <slider>
            <div v-for="(item, index) in recommends" :key="index">
              <a :href="item.linkUrl">
                <img :src="item.picUrl" @load="loadImage" alt="">
              </a>
            </div>
          </slider>
        </div>
        <!-- 歌单列表 -->
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li class="item" v-for="(item, index) in discList" :key="index">
              <div class="icon">
                <img width="60" height="60" v-lazy="item.picUrl" alt="">
              </div>
              <div class="text">
                <h2 class="name">{{item.songListDesc}}</h2>
                <p class="author">{{item.songListAuthor}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- loading -->
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import Slider from 'base/slider/slider'
import Loading from 'base/loading/loading'
import { getRecommend } from 'api/recommend.js'
import { ERR_OK } from 'api/config.js'

export default {
  data() {
    return {
      recommends: [], // 轮播图数据
      discList: [] // 歌单数据
    }
  },
  created() {
    this._getRecommend()
  },
  methods: {
    // 推荐数据获取
    _getRecommend() {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider // 轮播图数据
          this.discList = res.data.songList // 歌单数据
        }
      })
    },
    // 轮播img加载时重新计算better-scroll
    loadImage() {
      if (!this.checkLoaded) { // 一次加载，一张img加载即达到目的，防止多张img重复刷新
        this.checkLoaded = true
        this.$refs.scroll.refresh()
      }
    }
  },
  components: {
    Slider,
    Scroll,
    Loading
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .author
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
