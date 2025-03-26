import { Node } from "ts-morph";

const MATH_SUPPORTED_METHODS = ["cbrt", "clz32", "expm1", "fround", "hypot", "imul", "log10", "log1p", "log2", "sign", "trunc"] as const;

export function processor(node: Node, detectedMethods: Set<string>): void {
  if (Node.isCallExpression(node)) {
    const expression = node.getExpression();
    if (Node.isPropertyAccessExpression(expression)) {
      const caller = expression.getExpression();
      const methodName = expression.getName();

      if (!(MATH_SUPPORTED_METHODS as readonly string[]).includes(methodName)) {
        return;
      }

      if (Node.isIdentifier(caller) && caller.getText() === "Math") {
        detectedMethods.add(`math.${methodName}`);
      }
    }
  }
}
