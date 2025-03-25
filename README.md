# Rollup Plugin for Adobe Script ES3 Polyfill Library

![License](https://img.shields.io/badge/license-MIT-blue)
[![npm version](https://badge.fury.io/js/your-package-name.svg)](https://www.npmjs.com/package/your-package-name)

[中文](README-CN.md) | [English](README.md)

An ES3-compatible polyfill library specifically designed for Adobe scripting environments, providing modern JavaScript APIs categorized by ECMAScript versions and functional modules.

## 🚀 Installation

```bash
npm i rollup-plugin-adobe-polyfills
yarn add rollup-plugin-adobe-polyfills
```

## 💡 Usage

Import polyfills:

```javascript
import adobePolyfills from "rollup-plugin-adobe-polyfills";

...

plugins: [
  adobePolyfills({ include: 'src/**/*.tsx', disableCategories: ["number", "object","json"] }),
],

```

## ⚙️ Parameters

| Parameter             | Type                                                      | Default             | Description                                                                                                     |
| --------------------- | --------------------------------------------------------- | ------------------- | --------------------------------------------------------------------------------------------------------------- |
| `include`           | `string`,`RegExp`,`string[]`, `RegExp[]`,`null` | ['src/**/*']        | A glob pattern to match files to include in the bundle.                                                         |
| `exclude`           | `string`,`RegExp`,`string[]`, `RegExp[]`,`null` | ["node_modules/**"] | A glob pattern to match files to exclude in the bundle.                                                         |
| `disableCategories` | `string[]`                                              | `[]`              | A list of categories to exclude from the bundle. ["array","function","json","math","number","object","string"] |

## 🌈 Demo Project

[Adobe-Scripting-With-Typescript-Demo](https://github.com/Yuelioi/Adobe-Scripting-With-Typescript-Demo)

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

`json2` implementation (provides `JSON.parse`/`JSON.stringify` )

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
