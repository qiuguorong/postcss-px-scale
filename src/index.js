const postcss = require('postcss')
const pkg = require('../package.json')
const Scale = require('./scale')

function isMatch(filepath, matchs) {
  if (Array.isArray(matchs)) {
    return matchs.some(match => filepath.match(match) !== null)
  } else {
    return filepath.match(matchs) !== null
  }
}

module.exports = postcss.plugin(pkg.name, opts => {
  opts = opts || {}
  return root => {
    const filepath = root.source.input.file
    if (filepath && opts.excludes && isMatch(filepath, opts.excludes)) {
      return false
    }
    if (!opts.includes || (filepath && opts.includes && isMatch(filepath, opts.includes))) {
      const scale = new Scale(opts)
      scale.parse(root)
    }
  }
})
