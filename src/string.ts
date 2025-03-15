import ts from "typescript";
import { handleInstanceMethod } from "./checker";

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

const isStringType = (checker: ts.TypeChecker, type: ts.Type): type is ts.StringLiteralType => {
  try {
    return (type.flags & ts.TypeFlags.StringLike) !== 0 || type.getSymbol()?.getName() === "String" || checker.typeToString(type) === "string";
  } catch {
    return false;
  }
};

export function processor(node: ts.Node, detectedMethods: Set<string>, checker: ts.TypeChecker): void {
  if (ts.isCallExpression(node)) {
    const expression = node.expression;

    if (ts.isPropertyAccessExpression(expression)) {
      const methodName = expression.name.text;
      const objExpression = expression.expression;

      try {
        // 处理静态方法
        if (ts.isIdentifier(objExpression)) {
          const staticType = objExpression.text;

          if (staticType === "String" && (STRING_SUPPORTED_STATIC_METHODS as readonly string[]).includes(methodName)) {
            detectedMethods.add(`string.${methodName}`);
            return;
          }
        }

        handleInstanceMethod(checker, objExpression, (checker, t) => {
          if (isStringType(checker, t)) {
            if (STRING_SUPPORTED_METHODS.includes(methodName)) {
              detectedMethods.add(`string.${methodName}`);
              return true;
            }
          }
          return false;
        });
      } catch (error: unknown) {
        console.warn(`[Polyfill Injector] Failed to detect method: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }
}
