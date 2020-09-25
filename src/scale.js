let pxReg = null
let pxGlobalReg = null

const defaultConfig = {
  scale: 1, // 缩放数值
  units: 'px', // 匹配的css单位
  ignoreValue: [] // 需要忽略的数值，如1px，则ignoreValue: 1或ignoreValue: [1]
}

function isArray (value) {
  return Array.isArray(value)
}

function inArray (arr, value) {
  return arr.indexOf(value) !== -1
}

module.exports = class Scale {
  constructor(options) {
    this.config = { ...defaultConfig, ...options}
    const { units, ignoreValue } = this.config
    if (ignoreValue && !isArray(ignoreValue)) {
      this.config.ignoreValue = [ignoreValue]
    }
    pxReg = new RegExp(`\\b(\\d+(\\.\\d+)?)${units}\\b`)
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
    const { scale, units, ignoreValue } = this.config
    return value.replace(pxGlobalReg, (val, num) => {
      const number = Number(num)
      if (!number) return val
      if (ignoreValue && inArray(ignoreValue, number)) return val
      return `${number * scale}${units}`
    })
  }
}
