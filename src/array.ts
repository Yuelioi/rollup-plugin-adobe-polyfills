import ts from "typescript";
import { handleInstanceMethod } from "./checker";

// Array 方法定义
const ARRAY_SUPPORTED_METHODS_ES5 = ["forEach", "map", "filter", "reduce", "reduceRight", "some", "every", "indexOf", "lastIndexOf"] as const;

const ARRAY_SUPPORTED_METHODS_ES6 = ["copyWithin", "find", "findIndex", "fill", "keys", "values", "entries"] as const;

const ARRAY_SUPPORTED_METHODS_ES2016 = ["includes"] as const;
const ARRAY_SUPPORTED_METHODS_ES2019 = ["flat", "flatMap"] as const;
const ARRAY_SUPPORTED_METHODS_ES2022 = ["at"] as const;
const ARRAY_SUPPORTED_METHODS_ES2023 = ["findLast", "findLastIndex"] as const;
const ARRAY_SUPPORTED_STATIC_METHODS = ["isArray", "from", "of"] as const;

const ARRAY_SUPPORTED_METHODS = [
  ...ARRAY_SUPPORTED_METHODS_ES5,
  ...ARRAY_SUPPORTED_METHODS_ES6,
  ...ARRAY_SUPPORTED_METHODS_ES2016,
  ...ARRAY_SUPPORTED_METHODS_ES2019,
  ...ARRAY_SUPPORTED_METHODS_ES2022,
  ...ARRAY_SUPPORTED_METHODS_ES2023,
] as string[];

const isArrayType = (checker: ts.TypeChecker, type: ts.Type): type is ts.TypeReference => {
  try {
    return checker.isArrayType(type) || checker.isTupleType(type) || type.getSymbol()?.getName() === "Array";
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
          if (objExpression.text === "Array" && (ARRAY_SUPPORTED_STATIC_METHODS as readonly string[]).includes(methodName)) {
            detectedMethods.add(`array.${methodName}`);
            return;
          }
        }

        handleInstanceMethod(checker, objExpression, (checker, t) => {
          if (isArrayType(checker, t)) {
            if (ARRAY_SUPPORTED_METHODS.includes(methodName)) {
              detectedMethods.add(`array.${methodName}`);
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
