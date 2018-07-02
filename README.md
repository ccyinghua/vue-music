# vue-music

> vue移动端音乐WebApp

### 运行项目

```javascript
npm install

npm run dev
```

### 构建项目

```javascript
vue init webpack vue-music

cnpm install
npm run dev

npm install stylus stylus-loader --save-dev  // 安装stylus处理css

```
![](resource/1.jpg)


> 文件夹列表

```javascript
| - build
| - config
| - resource      -- Markdown文件所用资源图片(项目中可以不要)
| - src
    | - api             -- 放后端请求类的代码(ajax，json请求等)
    | - base            -- 基本通用组件
    | - common          -- 通用的静态资源
        | - fonts           -- 字体文件
        | - image           -- 图片文件
        | - js              -- js文件
        | - stylus          -- 样式文件
    | - components      -- 组件
    | - router          -- 路由配置文件
    | - store           -- vuex相关文件
    | - App.vue
    | - main.js
| - static   -- 项目所用图片，图标
......

```

> 配置修改

```javascript
1、修改路径配置
alias: {
    '@': resolve('src'),
    'common': resolve('src/common'),
    'components': resolve('src/components'),
    'base': resolve('src/base'),
    'api': resolve('src/api')
}


```

> Markdown说明文件




未完待续......












