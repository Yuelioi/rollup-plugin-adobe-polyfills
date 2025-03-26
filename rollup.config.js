import { defineConfig } from "rollup";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import copy from "rollup-plugin-copy";
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
  external: ["rollup", "typescript", "@rollup/pluginutils", "ts-morph"],
  plugins: [
    del({ targets: "dist" }),
    nodeResolve(),
    commonjs({
      transformMixedEsModules: true,
    }),
    typescript(),
    copy({
      targets: [{ src: "polyfills", dest: "dist" }],
    }),
    // terser(),
  ],
});
