# Rollup Plugin for Adobe Script ES3 Polyfill Library

![License](https://img.shields.io/badge/license-MIT-blue)
[![npm version](https://badge.fury.io/js/your-package-name.svg)](https://www.npmjs.com/package/your-package-name)

[中文](README-CN.md) | [English](README.md)

A comprehensive polyfill collection for modern JavaScript APIs, organized by ECMAScript versions and feature categories.

## 🚀 Installation

```bash
npm install adobe-script-es3-polyfills
yarn add adobe-script-es3-polyfills
```

## 💡 Usage

Import polyfills by category:

```javascript
import adobePolyfills from "adobe-script-es3-polyfills";

...

plugins: [
  adobePolyfills({ include: "test/test.ts", disableCategories: ["number", "object","json"] }),
],

```

## 📚 Supported Polyfills

### Array Methods

| ES Version | Methods                                                                                                          |
| ---------- | ---------------------------------------------------------------------------------------------------------------- |
| ES5        | `forEach`, `map`, `filter`, `reduce`, `reduceRight`, `some`, `every`, `indexOf`, `lastIndexOf` |
| ES6        | `copyWithin`, `find`, `findIndex`, `fill`, `keys`, `values`, `entries`                             |
| ES2016     | `includes`                                                                                                     |
| ES2019     | `flat`, `flatMap`                                                                                            |
| ES2022     | `at`                                                                                                           |
| ES2023     | `findLast`, `findLastIndex`                                                                                  |

**Static Methods**
`isArray`, `from`, `of`

---

### Function Methods

| Methods            |
| ------------------ |
| `bind`, `name` |

---

### JSON

`json3` implementation (provides `JSON.parse`/`JSON.stringify` enhancements)

---

### Math Methods

`cbrt`, `clz32`, `expm1`, `fround`, `hypot`, `imul`, `log10`, `log1p`, `log2`, `sign`, `trunc`

---

### Number Methods

| Static Methods           |
| ------------------------ |
| `isInteger`, `isNaN` |

---

### Object Methods

**Static Methods**
`assign`, `create`, `entries`, `getPrototypeOf`, `keys`, `setPrototypeOf`, `values`

**Instance Methods**
`hasOwnProperty`

---

### String Methods

| ES Version | Methods                                                                 |
| ---------- | ----------------------------------------------------------------------- |
| ES5        | `trim`                                                                |
| ES6        | `codePointAt`, `repeat`, `startsWith`, `endsWith`, `includes` |
| ES2017     | `padStart`, `padEnd`                                                |
| ES2019     | `trimStart`, `trimEnd`                                              |
| ES2020     | `matchAll`                                                            |
| ES2021     | `replaceAll`                                                          |
| ES2022     | `at`                                                                  |

**Static Methods**
`fromCodePoint`, `raw`

## 🌟 Features

* Modular architecture - load only what you need
* Version-aware grouping
* TypeScript ready
* Zero dependencies

## 🤝 Contributing

1. Fork the repository
2. Add polyfills for new methods in dedicated version folders
3. Update supported methods lists
4. Submit a PR with test cases

## 📜 License

MIT
