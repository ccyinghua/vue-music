import Vue from 'vue'
import Router from 'vue-router'
import Recommend from 'components/recommend/recommend.vue' // 推荐页面
import Singer from 'components/singer/singer.vue' // 歌手页面
import Rank from 'components/rank/rank.vue' // 排行页面
import Search from 'components/search/search.vue' // 搜索页面

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend
    },
    {
      path: '/singer',
      component: Singer
    },
    {
      path: '/rank',
      component: Rank
    },
    {
      path: '/search',
      component: Search
    }
  ]
})
