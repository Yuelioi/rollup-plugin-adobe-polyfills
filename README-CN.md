# Rollup 插件 - Adobe 脚本 ES3 Polyfill 库

![许可证](https://img.shields.io/badge/license-MIT-blue)
[![npm 版本](https://badge.fury.io/js/adobe-script-es3-polyfills.svg)](https://www.npmjs.com/package/adobe-script-es3-polyfills)

[中文](README-CN.md) | [English](README.md)

为 Adobe 脚本环境量身定制的 ES3 兼容 polyfill 库，按 ECMAScript 版本和功能模块分类的现代 JavaScript API 集合。

## 🚀 安装

```bash
npm install rollup-plugin-adobe-polyfills
# 或
yarn add rollup-plugin-adobe-polyfills
```

## 使用方式

```javascript
import adobePolyfills from "rollup-plugin-adobe-polyfills";

// Rollup 配置示例
export default {
  plugins: [
    adobePolyfills({ 
      include: "src/main.ts",
      disableCategories: ["number", "object", "json"] 
    }),
  ],
};
```

## 📚 支持的 Polyfill

### 数组方法

| ES 版本 | 支持的方法                                                                                                       |
| ------- | ---------------------------------------------------------------------------------------------------------------- |
| ES5     | `forEach`, `map`, `filter`, `reduce`, `reduceRight`, `some`, `every`, `indexOf`, `lastIndexOf` |
| ES6     | `copyWithin`, `find`, `findIndex`, `fill`, `keys`, `values`, `entries`                             |
| ES2016  | `includes`                                                                                                     |
| ES2019  | `flat`, `flatMap`                                                                                            |
| ES2022  | `at`                                                                                                           |
| ES2023  | `findLast`, `findLastIndex`                                                                                  |

**静态方法**
`isArray`, `from`, `of`

---

### 函数方法

| 方法               |
| ------------------ |
| `bind`, `name` |

---

### JSON

`json3` 实现 (增强的 `JSON.parse`/`JSON.stringify`)

---

### 数学方法

`cbrt`, `clz32`, `expm1`, `fround`, `hypot`, `imul`, `log10`, `log1p`, `log2`, `sign`, `trunc`

---

### 数值方法

| 静态方法                 |
| ------------------------ |
| `isInteger`, `isNaN` |

---

### 对象方法

**静态方法**
`assign`, `create`, `entries`, `getPrototypeOf`, `keys`, `setPrototypeOf`, `values`

**实例方法**
`hasOwnProperty`

---

### 字符串方法

| ES 版本 | 支持的方法                                                              |
| ------- | ----------------------------------------------------------------------- |
| ES5     | `trim`                                                                |
| ES6     | `codePointAt`, `repeat`, `startsWith`, `endsWith`, `includes` |
| ES2017  | `padStart`, `padEnd`                                                |
| ES2019  | `trimStart`, `trimEnd`                                              |
| ES2020  | `matchAll`                                                            |
| ES2021  | `replaceAll`                                                          |
| ES2022  | `at`                                                                  |

**静态方法**
`fromCodePoint`, `raw`

## 🌟 核心特性

* 模块化架构 - 按需加载所需 polyfill
* 版本感知分组
* 开箱即用的 TypeScript 支持
* 零外部依赖

## 🤝 参与贡献

1. Fork 本仓库
2. 在指定版本目录中添加新方法的 polyfill
3. 更新支持方法列表
4. 提交包含测试用例的 Pull Request

## 📜 许可证

MIT 许可证 - 详见 [LICENSE](https://license/) 文件
