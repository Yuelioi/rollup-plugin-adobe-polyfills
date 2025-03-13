// types/index.d.ts
import { Plugin } from "rollup";
import { FilterPattern } from "@rollup/pluginutils";

declare interface InjectAdobePolyfillsOptions {
  /** 包含的文件模式 */
  include?: FilterPattern;
  /** 排除的文件模式 */
  exclude?: FilterPattern;
}

/**
 * Adobe 系列产品专用 Polyfill 注入插件
 *
 * 功能特性：
 * - 自动检测 Array/String/JSON 的 ES5+ 方法使用
 * - 按需注入对应 polyfill
 * - 支持静态方法和实例方法检测
 * - 自动跳过已有实现的方法
 */
declare function injectAdobePolyfills(options?: InjectAdobePolyfillsOptions): Plugin;

export default injectAdobePolyfills;
