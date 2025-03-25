import { createFilter, type FilterPattern } from "@rollup/pluginutils";
import { readFileSync } from "fs";
import ts from "typescript";
import type { Plugin, TransformResult } from "rollup";

type PolyfillCategory = "array" | "function" | "json" | "math" | "number" | "object" | "string";
type DetectedMethod = `${PolyfillCategory}.${string}`;

interface AdobePolyfillsOptions {
  include?: FilterPattern;
  exclude?: FilterPattern;
  polyfillsPath?: string; // todo 自定义 polyfill 路径
  disableCategories?: PolyfillCategory[]; // 禁用的 polyfill
}

// 使用 Node.js 的 __dirname 和 path 模块
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const POLYFILLS_PATH_CORE = path.resolve(__dirname, "../polyfills/core");

import { processor as arrayProcessor } from "./array";
import { processor as functionProcessor } from "./function";
import { processor as JSONProcessor } from "./json";
import { processor as mathProcessor } from "./math";
import { processor as numberProcessor } from "./number";
import { processor as objectProcessor } from "./object";
import { processor as stringProcessor } from "./string";

const processors = {
  array: arrayProcessor,
  string: stringProcessor,
  math: mathProcessor,
  number: numberProcessor,
  object: objectProcessor,
  json: JSONProcessor,
  function: functionProcessor,
};

function detectPolyfills(
  processors: { [key in PolyfillCategory]: (node: ts.Node, detectedMethods: Set<string>, checker: ts.TypeChecker) => void },
  node: ts.Node,
  detectedMethods: Set<string>,
  checker: ts.TypeChecker
): void {
  for (const processor of Object.values(processors)) {
    processor(node, detectedMethods, checker);
  }
}

// 主插件函数
export default function adobePolyfills(options: AdobePolyfillsOptions = { include: ["src/**/*"], exclude: ["node_modules/**"] }): Plugin {
  const { include, exclude, disableCategories = [] } = options;
  const filter = createFilter(include, exclude);

  const filteredProcessors = Object.fromEntries(
    Object.entries(processors).filter(([key]) => !disableCategories.includes(key as PolyfillCategory))
  ) as typeof processors;

  return {
    name: "adobe-script-polyfills",

    transform(code: string, id: string): TransformResult | null {
      if (!filter(id)) return null;

      const detectedMethods = new Set<DetectedMethod>();
      const sourceFile = ts.createSourceFile(id, code, ts.ScriptTarget.Latest, true);

      const program = ts.createProgram([id], {});
      const checker = program.getTypeChecker();

      const visit = (node: ts.Node): void => {
        detectPolyfills(filteredProcessors, node, detectedMethods, checker);
        ts.forEachChild(node, visit);
      };

      visit(sourceFile);

      if (detectedMethods.size === 0) return null;

      const injections: string[] = [];
      for (const method of detectedMethods) {
        try {
          const [folder, file] = method.split(".") as [PolyfillCategory, string];
          const content = readFileSync(`${POLYFILLS_PATH_CORE}/${folder}/${file}.js`, "utf-8");
          injections.push(content);
        } catch (error: unknown) {
          console.warn(`[Polyfill Injector] Missing polyfill for ${method}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }

      return {
        code: [`// Injected polyfills: ${Array.from(detectedMethods).join(", ")}`, ...injections, code].join("\n\n"),
        map: null,
      };
    },
  };
}
