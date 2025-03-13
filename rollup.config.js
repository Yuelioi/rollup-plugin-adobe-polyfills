import { defineConfig } from "rollup";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve"; // 修正导入方式
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

import del from "rollup-plugin-delete";

export default defineConfig({
  input: "src/index.ts",
  output: [
    {
      file: "dist/esm/index.mjs",
      format: "esm",
      sourcemap: true,
    },
    {
      file: "dist/cjs/index.cjs",
      format: "cjs",
      sourcemap: true,
      exports: "auto",
    },
  ],
  external: ["fs", "typescript", "@rollup/pluginutils"],
  plugins: [
    del({ targets: "dist" }),
    nodeResolve(),

    commonjs({
      transformMixedEsModules: true,
    }),
    typescript(),
    terser(),
  ],
});
