const postcss = require('postcss')
const pkg = require('../package.json')
const Scale = require('./scale')

module.exports = postcss.plugin(pkg.name, opts => {
  opts = opts || {}
  return root => {
    const scale = new Scale(opts)
    scale.parse(root)
  }
})
