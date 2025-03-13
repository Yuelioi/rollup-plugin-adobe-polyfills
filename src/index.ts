import { createFilter, type FilterPattern } from "@rollup/pluginutils";
import { readFileSync } from "fs";
import ts from "typescript";
import type { Plugin, TransformResult } from "rollup";

// 类型定义
type PolyfillCategory = "array" | "string" | "json";
type DetectedMethod = `${PolyfillCategory}.${string}`;

interface InjectAdobePolyfillsOptions {
  include?: FilterPattern;
  exclude?: FilterPattern;
}

// 常量定义
const POLYFILLS_PATH = "./polyfill/core" as const;

// Array 方法定义
const ARRAY_SUPPORTED_METHODS_ES5 = ["forEach", "map", "filter", "reduce", "reduceRight", "some", "every", "indexOf", "lastIndexOf"] as const;

const ARRAY_SUPPORTED_METHODS_ES6 = ["copyWithin", "find", "findIndex", "fill", "keys", "values", "entries", "splice"] as const;

const ARRAY_SUPPORTED_METHODS_ES2016 = ["includes"] as const;
const ARRAY_SUPPORTED_METHODS_ES2019 = ["flat", "flatMap"] as const;
const ARRAY_SUPPORTED_METHODS_ES2022 = ["at"] as const;
const ARRAY_SUPPORTED_METHODS_ES2023 = ["findLast", "findLastIndex"] as const;
const ARRAY_SUPPORTED_STATIC_METHODS = ["isArray", "from", "of"] as const;

// String 方法定义
const STRING_SUPPORTED_METHODS_ES5 = ["trim"] as const;
const STRING_SUPPORTED_METHODS_ES6 = ["codePointAt", "repeat", "startsWith", "endsWith", "includes"] as const;
const STRING_SUPPORTED_METHODS_ES2017 = ["padStart", "padEnd"] as const;
const STRING_SUPPORTED_METHODS_ES2019 = ["trimStart", "trimEnd"] as const;
const STRING_SUPPORTED_METHODS_ES2020 = ["matchAll"] as const;
const STRING_SUPPORTED_METHODS_ES2021 = ["replaceAll"] as const;
const STRING_SUPPORTED_METHODS_ES2022 = ["at"] as const;
const STRING_SUPPORTED_STATIC_METHODS = ["fromCodePoint", "raw"] as const;

// 方法组合
const STRING_SUPPORTED_METHODS = [
  ...STRING_SUPPORTED_METHODS_ES5,
  ...STRING_SUPPORTED_METHODS_ES6,
  ...STRING_SUPPORTED_METHODS_ES2017,
  ...STRING_SUPPORTED_METHODS_ES2019,
  ...STRING_SUPPORTED_METHODS_ES2020,
  ...STRING_SUPPORTED_METHODS_ES2021,
  ...STRING_SUPPORTED_METHODS_ES2022,
] as string[];

const ARRAY_SUPPORTED_METHODS = [
  ...ARRAY_SUPPORTED_METHODS_ES5,
  ...ARRAY_SUPPORTED_METHODS_ES6,
  ...ARRAY_SUPPORTED_METHODS_ES2016,
  ...ARRAY_SUPPORTED_METHODS_ES2019,
  ...ARRAY_SUPPORTED_METHODS_ES2022,
  ...ARRAY_SUPPORTED_METHODS_ES2023,
] as string[];

// 类型解析函数
const resolveType = (checker: ts.TypeChecker, type: ts.Type): ts.Type | ts.Type[] => {
  if (type.isUnion()) {
    return type.types.map((t) => checker.getBaseTypeOfLiteralType(t));
  }

  const baseType = checker.getBaseTypeOfLiteralType(type);
  return baseType.getSymbol()?.getName() === "Array" ? checker.getApparentType(baseType) : baseType;
};

// 类型判断函数
const isArrayType = (checker: ts.TypeChecker, type: ts.Type): type is ts.TypeReference => {
  try {
    return checker.isArrayType(type) || checker.isTupleType(type) || type.getSymbol()?.getName() === "Array";
  } catch {
    return false;
  }
};

const isStringType = (checker: ts.TypeChecker, type: ts.Type): type is ts.StringLiteralType => {
  try {
    return (type.flags & ts.TypeFlags.StringLike) !== 0 || type.getSymbol()?.getName() === "String" || checker.typeToString(type) === "string";
  } catch {
    return false;
  }
};

// 主插件函数
export default function adobePolyfills(options: InjectAdobePolyfillsOptions = {}): Plugin {
  const { include, exclude } = options;
  const filter = createFilter(include, exclude);

  return {
    name: "adobe-script-polyfills",

    transform(code: string, id: string): TransformResult | null {
      if (!filter(id)) return null;

      const detectedMethods = new Set<DetectedMethod>();
      const sourceFile = ts.createSourceFile(id, code, ts.ScriptTarget.Latest, true);

      const program = ts.createProgram([id], {});
      const checker = program.getTypeChecker();

      const visit = (node: ts.Node): void => {
        if (ts.isCallExpression(node)) {
          const expression = node.expression;

          if (ts.isPropertyAccessExpression(expression)) {
            const methodName = expression.name.text;
            const objExpression = expression.expression;

            try {
              // 处理 JSON 静态方法
              if (ts.isIdentifier(objExpression) && objExpression.text === "JSON") {
                detectedMethods.add("json.json3");
                return;
              }

              // 处理静态方法
              if (ts.isIdentifier(objExpression)) {
                const staticType = objExpression.text;

                if (staticType === "Array" && (ARRAY_SUPPORTED_STATIC_METHODS as readonly string[]).includes(methodName)) {
                  detectedMethods.add(`array.${methodName}`);
                  return;
                }

                if (staticType === "String" && (STRING_SUPPORTED_STATIC_METHODS as readonly string[]).includes(methodName)) {
                  detectedMethods.add(`string.${methodName}`);
                  return;
                }
              }

              // 处理实例方法
              const type = checker.getTypeAtLocation(objExpression);
              const resolvedType = resolveType(checker, type);
              const types = Array.isArray(resolvedType) ? resolvedType : [resolvedType];

              for (const t of types) {
                if (isArrayType(checker, t)) {
                  if (ARRAY_SUPPORTED_METHODS.includes(methodName)) {
                    detectedMethods.add(`array.${methodName}`);
                    break;
                  }
                }

                if (isStringType(checker, t)) {
                  if (STRING_SUPPORTED_METHODS.includes(methodName)) {
                    detectedMethods.add(`string.${methodName}`);
                    break;
                  }
                }
              }
            } catch (error: unknown) {
              console.warn(`[Polyfill Injector] Failed to detect method: ${error instanceof Error ? error.message : String(error)}`);
            }
          }
        }
        ts.forEachChild(node, visit);
      };

      visit(sourceFile);

      if (detectedMethods.size === 0) return null;

      const injections: string[] = [];
      for (const method of detectedMethods) {
        try {
          const [folder, file] = method.split(".") as [PolyfillCategory, string];
          const content = readFileSync(`${POLYFILLS_PATH}/${folder}/${file}.js`, "utf-8");
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
