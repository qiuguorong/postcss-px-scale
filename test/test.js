const fs = require('fs')
const postcss = require('postcss')
const { expect } = require('chai')
const pxScale = require('../src/index')

// 读取文件内容
function readFile(filepath) {
  if (fs.existsSync(filepath)) {
    return fs.readFileSync(filepath, { encoding: 'utf-8' }) || ''
  }
  return ''
}

describe('test', () => {
  it('normal', () => {
    const fixture = readFile('test/source.css')
    const expected = readFile('test/target.css')
    const output = postcss().use(pxScale({
      scale: 2,
    })).process(fixture).css
    expect(output).is.a.string
    expect(output).eql(expected)
  })
})
