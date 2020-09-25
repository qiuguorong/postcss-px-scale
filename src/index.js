const postcss = require('postcss')
const pkg = require('../package.json')
const Scale = require('./scale')

function isMatch(filepath, matchs) {
  if (Array.isArray(matchs)) {
    return matchs.some(match => filepath.match(match) !== null)
  }
  return filepath.match(matchs) !== null
}

module.exports = postcss.plugin(pkg.name, opts => {
  opts = opts || {}
  return (root, result) => {
    // 依赖postcss.process(css, { from: file }) 或者「postcss-loader」自动注入file
    const filepath = root.source.input.file || result.opts.from
    if (filepath && opts.excludes && isMatch(filepath, opts.excludes)) return
    if (!opts.includes || (filepath && opts.includes && isMatch(filepath, opts.includes))) {
      const scale = new Scale(opts)
      scale.parse(root)
    }
  }
})
