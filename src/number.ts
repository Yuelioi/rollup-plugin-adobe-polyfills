import ts from "typescript";
import { resolveBaseType } from "./checker";

const NUMBER_SUPPORTED_METHODS = ["isInteger", "isNaN"] as const;

/**
 * 判断是否是 Number 类型 (用于静态方法检测)
 */
const isNumberType = (checker: ts.TypeChecker, type: ts.Type): boolean => {
  try {
    const baseTypeOrTypes = resolveBaseType(checker, type);
    const baseTypes = Array.isArray(baseTypeOrTypes) ? baseTypeOrTypes : [baseTypeOrTypes];

    return baseTypes.some((t) => {
      const symbol = t.getSymbol();
      return symbol?.getName() === "Number";
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
        // 处理静态方法 (如 Number.isNaN)
        if (ts.isIdentifier(objExpression)) {
          if (objExpression.text === "Number" && (NUMBER_SUPPORTED_METHODS as readonly string[]).includes(methodName)) {
            detectedMethods.add(`number.${methodName}`);
            return;
          }
        }

        // TODO 处理实例方法 待补充
        // handleInstanceMethod(checker, objExpression, (checker, t) => {
        //   if (isNumberType(checker, t)) {
        //   }
        //   return false;
        // });
      } catch (error: unknown) {
        console.warn(`[Number Processor] Error: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }
}
