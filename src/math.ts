import ts from "typescript";
import { resolveBaseType } from "./checker";

const MATH_SUPPORTED_METHODS = ["cbrt", "clz32", "expm1", "fround", "hypot", "imul", "log10", "log1p", "log2", "sign", "trunc"] as const;
import { handleInstanceMethod } from "./checker";

/**
 * 判断是否是 Math 调用的类型
 */
const isMathType = (checker: ts.TypeChecker, type: ts.Type): boolean => {
  try {
    // 先解析基础类型（处理联合类型）
    const baseTypeOrTypes = resolveBaseType(checker, type);
    const baseTypes = Array.isArray(baseTypeOrTypes) ? baseTypeOrTypes : [baseTypeOrTypes];

    // 检查所有基础类型中是否包含 Math
    return baseTypes.some((t) => {
      const symbol = t.getSymbol();
      return symbol?.getName() === "Math";
    });
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
        handleInstanceMethod(checker, objExpression, (checker, t) => {
          if (isMathType(checker, t)) {
            if ((MATH_SUPPORTED_METHODS as readonly string[]).includes(methodName)) {
              detectedMethods.add(`math.${methodName}`);
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
