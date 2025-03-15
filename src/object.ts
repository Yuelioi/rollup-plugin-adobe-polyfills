import ts from "typescript";
import { handleInstanceMethod } from "./checker";

const OBJECT_SUPPORTED_STATIC_METHODS = ["assign", "create", "entries", "getPrototypeOf", "keys", "setPrototypeOf", "values"] as const;

const OBJECT_SUPPORTED_INSTANCE_METHODS = ["hasOwnProperty"] as const;

const isObjectType = (checker: ts.TypeChecker, type: ts.Type): boolean => {
  try {
    const symbol = type.getSymbol();
    const isExplicitObject = symbol?.getName() === "Object";

    const typeFlags = checker.getApparentType(type).getFlags();
    const isObjectFlag = (typeFlags & ts.TypeFlags.Object) !== 0;

    return isExplicitObject || isObjectFlag;
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
        // 处理静态方法（如 Object.assign）
        if (ts.isIdentifier(objExpression)) {
          if (objExpression.text === "Object" && (OBJECT_SUPPORTED_STATIC_METHODS as readonly string[]).includes(methodName)) {
            detectedMethods.add(`object.${methodName}`);
            return;
          }
        }

        handleInstanceMethod(checker, objExpression, (checker, t) => {
          if (isObjectType(checker, t)) {
            if ((OBJECT_SUPPORTED_INSTANCE_METHODS as readonly string[]).includes(methodName)) {
              detectedMethods.add(`object.${methodName}`);
              return true;
            }
          }
          return false;
        });
      } catch (error: unknown) {
        console.warn(`[Object Processor] Error: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }
}
