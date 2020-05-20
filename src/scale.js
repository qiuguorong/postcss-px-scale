let pxReg = null
let pxGlobalReg = null

module.exports = class Scale {
  constructor(options) {
    const defaultConfig = {
      scale: 1,
      units: 'px',
    }
    this.config = { ...defaultConfig, ...options}
    pxReg = new RegExp(`\\b(\\d+(\\.\\d+)?)${this.config.units}\\b`)
    pxGlobalReg = new RegExp(pxReg.source, 'g')
  }

  parse(root) {
    this.processRules(root)
  }

  processRules(root) {
    // 遍历所有的rule（除了atRule）
    root.walkRules(rule => {
      this.processRule(rule)
    })
    // 单独处理media情况
    root.walkAtRules('media', rule => {
      rule.params = this.getCalcValue(rule.params)
    })
  }

  processRule(rule) {
    rule.walk((node, index) => {
      if (node.type === 'decl' && pxReg.test(node.value)) {
        const nextDecl = rule.nodes[index + 1]
        if (nextDecl && nextDecl.type === 'comment') {
          const mode = nextDecl.text
          if (mode !== 'no') {
            node.value = this.getCalcValue(node.value)
          }
        } else {
          node.value = this.getCalcValue(node.value)
        }
      }
    })
  }

  getCalcValue(value) {
    const { scale, units } = this.config
    return value.replace(pxGlobalReg, (val, num) => {
      const number = Number(num)
      return number === 0 ? 0 : number * scale + units
    })
  }
}
