import { defineConfig } from "rollup";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve"; // 修正导入方式
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

import del from "rollup-plugin-delete";

// import adobePolyfills from "./dist/esm/index.mjs";
import adobePolyfills from "rollup-plugin-adobe-polyfill";

export default defineConfig({
  input: "test/test.ts",
  output: [
    {
      file: "dist/index.js",
      format: "cjs",
      sourcemap: true,
    },
  ],
  plugins: [
    nodeResolve(),
    adobePolyfills({ include: "test/test.ts", disableCategories: [] }),
    typescript({
      tsconfig: "tsconfig.test.json",
    }),
    commonjs({
      transformMixedEsModules: true,
    }),
  ],
});
