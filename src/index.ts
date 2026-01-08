import { createFilter, type FilterPattern } from "@rollup/pluginutils";
import { readFileSync } from "fs";
import type { Plugin, TransformResult } from "rollup";
import { Node, Project } from "ts-morph";
import path from "path";
import { fileURLToPath } from "url";

import { processor as arrayProcessor } from "./array";
import { processor as functionProcessor } from "./function";
import { processor as JSONProcessor } from "./json";
import { processor as mathProcessor } from "./math";
import { processor as numberProcessor } from "./number";
import { processor as objectProcessor } from "./object";
import { processor as stringProcessor } from "./string";

type PolyfillCategory =
  | "array"
  | "function"
  | "json"
  | "math"
  | "number"
  | "object"
  | "string";
type DetectedMethod = `${PolyfillCategory}.${string}`;

interface AdobePolyfillsOptions {
  include?: FilterPattern;
  exclude?: FilterPattern;
  polyfillsPath?: string;
  disableCategories?: PolyfillCategory[];
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POLYFILLS_PATH_CORE = path.resolve(__dirname, "../polyfills/core");

const processors: Record<
  PolyfillCategory,
  (node: Node, detectedMethods: Set<string>) => void
> = {
  array: arrayProcessor as (node: Node, detectedMethods: Set<string>) => void,
  string: stringProcessor as (node: Node, detectedMethods: Set<string>) => void,
  math: mathProcessor as (node: Node, detectedMethods: Set<string>) => void,
  number: numberProcessor as (node: Node, detectedMethods: Set<string>) => void,
  object: objectProcessor as (node: Node, detectedMethods: Set<string>) => void,
  json: JSONProcessor as (node: Node, detectedMethods: Set<string>) => void,
  function: functionProcessor as (
    node: Node,
    detectedMethods: Set<string>
  ) => void,
};

function detectPolyfills(
  processorsMap: Record<
    PolyfillCategory,
    (node: Node, detectedMethods: Set<string>) => void
  >,
  node: Node,
  detectedMethods: Set<string>
): void {
  for (const processor of Object.values(processorsMap)) {
    processor(node, detectedMethods);
  }
}

export default function adobePolyfills(
  options: AdobePolyfillsOptions = {
    include: ["src/**/*"],
    exclude: ["node_modules/**"],
  }
): Plugin {
  const { include, exclude, disableCategories = [] } = options;
  const filter = createFilter(include, exclude);

  const filteredProcessors = Object.fromEntries(
    Object.entries(processors).filter(
      ([key]) => !disableCategories.includes(key as PolyfillCategory)
    )
  ) as Record<
    PolyfillCategory,
    (node: Node, detectedMethods: Set<string>) => void
  >;

  return {
    name: "adobe-script-polyfills",

    transform(code: string, id: string): TransformResult | null {
      if (!filter(id)) return null;

      const detectedMethods = new Set<string>();
      const project = new Project({
        useInMemoryFileSystem: true,
      });
      const sourceFile = project.createSourceFile(id, code);

      sourceFile.forEachDescendant((node) => {
        detectPolyfills(filteredProcessors, node, detectedMethods);
      });

      if (detectedMethods.size === 0) return null;

      const injections: string[] = [];
      for (const method of detectedMethods) {
        try {
          const [folder, file] = method.split(".") as [
            PolyfillCategory,
            string
          ];
          const content = readFileSync(
            `${POLYFILLS_PATH_CORE}/${folder}/${file}.js`,
            "utf-8"
          );
          injections.push(content);
        } catch (error: unknown) {
          console.warn(
            `[Polyfill Injector] Missing polyfill for ${method}: ${
              error instanceof Error ? error.message : String(error)
            }`
          );
        }
      }

      return {
        code: [
          `// Injected polyfills: ${Array.from(detectedMethods).join(", ")}`,
          ...injections,
          code,
        ].join("\n\n"),
        map: null,
      };
    },
  };
}
