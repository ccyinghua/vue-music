# singer歌手页面

> 歌手页面

## 目录
[**1-歌手数据抓取**](#1-歌手数据抓取)
- [1.1 xxx](#11-xxx)

## <a id="1-歌手数据抓取"></a>1-歌手数据抓取

jsonp抓取数据方式参考02-recommend.md <br>[https://github.com/ccyinghua/vue-music/blob/master/02-recommend.md](https://github.com/ccyinghua/vue-music/blob/master/02-recommend.md)
<br>
<br>
歌手数据的获取来源于qq音乐 [https://y.qq.com/portal/singer_list.html](https://y.qq.com/portal/singer_list.html)<br>
例：[https://c.y.qq.com/v8/fcg-bin/v8.fcg?channel=singer&page=list&key=all_all_all&pagesize=100&pagenum=1&g_tk=1664029744&jsonpCallback=GetSingerListCallback&loginUin=280309453&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0](https://c.y.qq.com/v8/fcg-bin/v8.fcg?channel=singer&page=list&key=all_all_all&pagesize=100&pagenum=1&g_tk=1664029744&jsonpCallback=GetSingerListCallback&loginUin=280309453&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0)
![](resource/3-singer/1.jpg)

src/api/singer.js
```javascript
// 歌手页面获取数据
import jsonp from 'common/js/jsonp.js'
import {commonParams, options} from './config.js'

/**
 * 歌手数据抓取
 */
export function getSingerList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pageSize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    g_tk: 1664029744
  })
  return jsonp(url, data, options)
}
```
src/components/singer/singer.vue
```javascript
import { getSingerList } from 'api/singer'
import { ERR_OK } from 'api/config'

export default {
  data() {
    return {
      singers: []
    }
  },
  created() {
    this._getSingerList()
  },
  methods: {
    // 获取歌手数据
    _getSingerList() {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singers = res.data.list
          console.log(this.singers)
        }
      })
    }
  }
}
```

## <a id="2-规范化数据"></a>2-规范化数据

将歌手数据规范成页面所需格式，提取所需数据，按照热门+字母分类整理。

src/common/singer.js
```javascript
/**
 * 构造Singer类
 */
export default class Singer {
  constructor({id, name}) {
    this.id = id
    this.name = name
    this.avatar = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg?max_age=2592000`
  }
}
```
src/components/singer/singer.vue

```javascript
const HOT_NAME = '热门'
const HOT_SINGRT_LEN = 10 // 热门数据为10条

// 规范化歌手数据:提取页面所需数据，将歌手数据按照热门+字母分类处理
methods:{
  _normalLizeSinger(list) {
    let map = {
      hot: {
        title: HOT_NAME,
        items: []
      }
    }
    list.forEach((item, index) => {
      // 填充热门数据
      if (index < HOT_SINGRT_LEN) {
        map.hot.items.push(new Singer({
          id: item.Fsinger_mid,
          name: item.Fsinger_name
        }))
      }
      const key = item.Findex
      if (!map[key]) {
        map[key] = {
          title: key,
          items: []
        }
      }
      map[key].items.push(new Singer({
        id: item.Fsinger_mid,
        name: item.Fsinger_name
      }))
    })
    // console.log(map)
    /**
     * 为了得到有序列表，处理 map
     */
    let hot = []
    let ret = []
    for (let key in map) {
      let val = map[key]
      if (val.title.match(/[a-zA-Z]/)) { // 匹配字母
        ret.push(val)
      } else if (val.title === HOT_NAME) { // 匹配"热门"
        hot.push(val)
      }
    }
    // 对ret数组进行字母排序a-z
    ret.sort((a, b) => {
      return a.title.charCodeAt(0) - b.title.charCodeAt(0)
    })
    return hot.concat(ret)
  }
}
```
`console.log(this._normalLizeSinger(this.singers))`输出结果，处理map前：
![](resource/3-singer/2.jpg)

处理map后：
![](resource/3-singer/3.jpg)

## <a id="3-列表组件渲染-右侧字母列表"></a>3-列表组件渲染-右侧字母列表

1、在规范化数据，得到想要的格式的数据之后，将数据渲染在歌手页中，列表的渲染在 [base/listview/listview.vue](https://github.com/ccyinghua/vue-music/blob/master/src/base/listview/listview.vue) 中，列表的渲染包括：
- 歌手数据渲染(歌手数据由父组件singer.vue提供)
- 右侧字母列表渲染(字母列表提取歌手数据的title)

2、字母列表添加点击事件

