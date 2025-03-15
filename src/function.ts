import ts from "typescript";
import { resolveBaseType } from "./checker";

const FUNCTION_SUPPORTED_METHODS = ["bind", "name"] as const;

export function processor(node: ts.Node, detectedMethods: Set<string>, checker: ts.TypeChecker): void {
  if (ts.isCallExpression(node)) {
    const expression = node.expression;

    if (ts.isPropertyAccessExpression(expression)) {
      const methodName = expression.name.text;
      const objExpression = expression.expression;

      if ((FUNCTION_SUPPORTED_METHODS as readonly string[]).includes(methodName)) {
        try {
          const type = checker.getTypeAtLocation(objExpression);

          if (isFunctionType(checker, type)) {
            detectedMethods.add(`function.${methodName}`);
          }
        } catch (error: unknown) {
          console.warn(`[Polyfill Injector] Failed to detect method: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    }
  }
}

function isFunctionType(checker: ts.TypeChecker, type: ts.Type): boolean {
  const baseTypeOrTypes = resolveBaseType(checker, type);
  const baseTypes = Array.isArray(baseTypeOrTypes) ? baseTypeOrTypes : [baseTypeOrTypes];
  return baseTypes.some((t) => {
    const symbol = t.getSymbol();
    return symbol?.getName() === "Function" || checker.getSignaturesOfType(t, ts.SignatureKind.Call).length > 0;
  });
}
