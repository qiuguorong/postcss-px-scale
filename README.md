## postcss-px-scale
px值放大/缩小n倍

### Installation
```shell
npm install postcss-px-scale
```

### Example
```js
const postcss = require('postcss')
const pxScale = require('postcss-px-scale')
const input = fs.readFileSync("input.css", "utf8")
const output = postcss().use(pxScale({ scale: 2 })).process(input).css
```
before:
```css
.element {
  font-size: 16px;
  width: 100px;
  border: 1px solid #ccc; /*no*/
}
```
after:
```css
.element {
  font-size: 32px;
  width: 200px;
  border: 1px solid #ccc; /*no*/
}
```

### API
```js
pxScale({
  scale: 2
})
```
* `scale`: 放大/缩小倍数，默认值 `1`
* `units`: 匹配需要放大/缩小的单位，默认值 `px`

### Node
```js
const postcss = require('postcss')
const pxScale = require('postcss-px-scale')
const input = 'body { font-size: 16px }';
const output = postcss().use(pxScale({ scale: 2 })).process(input).css
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