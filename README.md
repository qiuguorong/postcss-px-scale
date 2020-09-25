## postcss-px-scale
px值放大/缩小n倍
> 注意：该插件依赖`postcss.process(css, { from: file })` 或者使用`postcss-loader`自动注入`file`信息，请把该插件放置在`px2rem`类型的插件前执行

### Installation
```shell
npm install postcss-px-scale
```

### Example
```js
const postcss = require('postcss')
const pxScale = require('postcss-px-scale')
const input = fs.readFileSync("input.css", "utf8")
const output = postcss().use(pxScale({
  scale: 2,
  ignoreValue: 1 // 或者ignoreValue: [1]
})).process(input).css
```
before:
```css
.element {
  font-size: 16px;
  width: 100px;
  border: 1px solid #ccc;
}
```
after:
```css
.element {
  font-size: 32px;
  width: 200px;
  border: 1px solid #ccc;
}
```

### API
```js
pxScale({
  scale: 2,
  includes: 'bxs-ui-vue'
})
```
* `scale`: 放大/缩小倍数，默认值 `1`，类型 Number
* `units`: 匹配需要放大/缩小的单位，默认值 `px`，类型 String
* `ignoreValue`: 需要忽略的数值，如`1px`，则配置`ignoreValue: 1`或`ignoreValue: [1]`，类型 String|Array
* `includes`: 仅处理匹配到`includes`中的文件，默认值 空，类型 String|Array
* `excludes`: 不处理匹配到`excludes`中的文件，默认值 空，类型 String|Array

### Node
```js
const postcss = require('postcss')
const pxScale = require('postcss-px-scale')
const input = 'body { font-size: 16px }';
const output = postcss().use(pxScale({
  scale: 2,
  ignoreValue: [1, 2] // 忽略数值为1和2的数值缩放
})).process(input).css
```

### Gulp
```js
const gulp = require('gulp')
const postcss = require('gulp-postcss')
const pxScale = require('postcss-px-scale')
gulp.task('default', function () {
  var processors = [pxScale({ scale: 2 })]
  return gulp.src('./src/*.css')
    .pipe(postcss(processors))
    .pipe(gulp.dest('./dest'))
});
```

### Webpack
```js
const pxScale = require('postcss-px-scale')
module.exports = {
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: "style-loader!css-loader!postcss-loader"
      }
    ]
  },
  postcss: function () {
    return [pxScale({ scale: 2 })]
  }
}
```