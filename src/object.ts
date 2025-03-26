import { Node } from "ts-morph";

const OBJECT_SUPPORTED_STATIC_METHODS = ["assign", "create", "entries", "getPrototypeOf", "keys", "setPrototypeOf", "values"] as const;
const OBJECT_SUPPORTED_INSTANCE_METHODS = ["hasOwnProperty"] as const;

export function processor(node: Node, detectedMethods: Set<string>): void {
  if (Node.isCallExpression(node)) {
    const expression = node.getExpression();
    if (Node.isPropertyAccessExpression(expression)) {
      const caller = expression.getExpression();
      const methodName = expression.getName();

      // Handle static methods (e.g., Object.assign)
      if (Node.isIdentifier(caller) && caller.getText() === "Object") {
        if ((OBJECT_SUPPORTED_STATIC_METHODS as readonly string[]).includes(methodName)) {
          detectedMethods.add(`object.${methodName}`);
          return;
        }
      }

      // Handle instance methods
      if (Node.isObjectLiteralExpression(caller) || Node.isIdentifier(caller)) {
        if ((OBJECT_SUPPORTED_INSTANCE_METHODS as readonly string[]).includes(methodName)) {
          detectedMethods.add(`object.${methodName}`);
        }
      }
    }
  }
}
