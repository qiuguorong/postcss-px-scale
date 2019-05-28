const postcss = require('postcss');
const pkg = require('../package.json');
const Flexible = require('./flexible');

module.exports = postcss.plugin(pkg.name, opts => {
  opts = opts || {};
  return (css, result) => {
    const flexibleIns = new Flexible(opts);
    const output = flexibleIns.parse(css.toString());
    result.root = postcss.parse(output);
  }
});
