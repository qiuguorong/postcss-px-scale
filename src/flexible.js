const css = require('css');

let pxReg = null;
let pxGlobalReg = null;

module.exports = class Flexible {
  constructor(options) {
    const defaultConfig = {
      scale: 1,
      units: 'px',
    };
    this.config = Object.assign({}, defaultConfig, options);
    pxReg = new RegExp(`\\b(\\d+(\\.\\d+)?)${this.config.units}\\b`);
    pxGlobalReg = new RegExp(pxReg.source, 'g');
  }

  parse(code) {
    const astObj = css.parse(code);
    this.processRules(astObj.stylesheet.rules);
    return css.stringify(astObj);
  }

  processRules(rules) {
    const { units } = this.config;

    for (let i = 0; i < rules.length; i += 1) {
      const rule = rules[i];
      const ruleType = rule.type;

      if (ruleType === 'media' || ruleType === 'supports') {
        this.processRules(rule.rules);
      } else if (ruleType === 'keyframes') {
        this.processRules(rule.keyframes);
      } else if (ruleType !== 'rule' && ruleType !== 'keyframe') {
        // 不处理
      } else {
        const { declarations } = rule;
        for (let j = 0; j < declarations.length; j += 1) {
          const declaration = declarations[j];
          if (declaration.type === 'declaration' && pxReg.test(declaration.value)) {
            const nextDeclaration = declarations[j + 1];
            let mode;
            if (nextDeclaration && nextDeclaration.type === 'comment') {
              mode = nextDeclaration.comment.trim();
              if (['no'].indexOf(mode) !== -1) {
                if (mode !== 'no') {
                  declaration.value = this.getCalcValue(units, declaration.value);
                  declarations.splice(j + 1, 1); // delete corresponding comment
                } else {
                  declarations.splice(j + 1, 1); // delete corresponding comment
                }
              } else {
                declaration.value = this.getCalcValue(units, declaration.value);
              }
            } else {
              declaration.value = this.getCalcValue(units, declaration.value);
            }
          }
        }
      }
    }
  }

  getCalcValue(type, value) {
    const { scale } = this.config;

    function getValue(val, curType = type) {
      return val === 0 ? val : val + curType;
    }

    return value.replace(pxGlobalReg, (val, num) => {
      const number = Number(num);
      return number === 0 ? 0 : getValue(number * scale);
    });
  }
};
