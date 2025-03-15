import { defineConfig } from "rolldown";
// import commonjs from "@rollup/plugin-commonjs";
// import nodeResolve from "@rollup/plugin-node-resolve"; // 修正导入方式
import typescript from "@rollup/plugin-typescript";
// import terser from "@rollup/plugin-terser";

// import del from "rollup-plugin-delete";

import adobePolyfills from "./dist/esm/index.mjs";

export default defineConfig({
  input: "test/test.ts",
  output: [
    {
      file: "dist/index.js",
      format: "cjs",
      sourcemap: true,
    },
  ],
  external: ["fs", "typescript", "@rollup/pluginutils"],
  plugins: [
    typescript(),
    // adobePolyfills({ include: ["test/test.ts"] }),
    // nodeResolve(),
    // typescript(),
  ],
});
