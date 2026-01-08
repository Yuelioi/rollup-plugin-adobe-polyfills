import { Plugin } from "rollup";
import { FilterPattern } from "@rollup/pluginutils";

type PolyfillCategory =
  | "array"
  | "function"
  | "json"
  | "math"
  | "number"
  | "object"
  | "string";

declare interface AdobePolyfillsOptions {
  /**
   * 包含的文件模式
   * @default ["src/**\/*"]
   */
  include?: FilterPattern;

  /**
   * 排除的文件模式
   * @default ["node_modules/**"]
   */
  exclude?: FilterPattern;

  /**
   * 禁用的 polyfill 分类
   * 在这个列表中的分类将不会被注入
   * @example ["json", "math"]
   */
  disableCategories?: PolyfillCategory[];
}

/**
 * Adobe 系列产品专用 Polyfill 注入插件
 *
 * 自动扫描代码中使用的 ES5+ API，并按需注入相应的 polyfill 实现。
 *
 * @param options - 插件配置选项
 * @returns Rollup 插件实例
 *
 * @example
 * ```typescript
 * import adobePolyfills from '@adobe/polyfill-injector';
 *
 * export default {
 *   input: 'src/main.ts',
 *   output: { file: 'dist/bundle.js', format: 'umd' },
 *   plugins: [
 *     adobePolyfills({
 *       include: ['src/**\/*.ts'],
 *       exclude: ['src/**\/*.test.ts'],
 *       disableCategories: ['json']
 *     })
 *   ]
 * };
 * ```
 *
 * @supported
 * - Array: forEach, map, filter, reduce, find, findIndex, flat, flatMap, at, etc.
 * - String: trim, includes, startsWith, endsWith, padStart, padEnd, at, etc.
 * - Object: assign, keys, values, entries, create, getPrototypeOf, etc.
 * - Math: cbrt, clz32, sign, trunc, log2, log10, etc.
 * - Number: isInteger, isNaN
 * - Function: bind, name
 * - JSON: json2
 *
 * @ES3-compatible 所有 polyfill 实现都完全兼容 ES3 环境
 */
declare function adobePolyfills(options?: AdobePolyfillsOptions): Plugin;

export default adobePolyfills;
export type { AdobePolyfillsOptions, PolyfillCategory };
