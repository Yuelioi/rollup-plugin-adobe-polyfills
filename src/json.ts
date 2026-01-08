import { Node } from "ts-morph";

const JSON_SUPPORTED_METHODS = ["json2"] as const;

type DetectedMethod = `json.${(typeof JSON_SUPPORTED_METHODS)[number]}`;

export function processor(
  node: Node,
  detectedMethods: Set<DetectedMethod>
): void {
  if (Node.isCallExpression(node)) {
    const expression = node.getExpression();

    if (Node.isPropertyAccessExpression(expression)) {
      const caller = expression.getExpression();
      const methodName = expression.getName();

      if (!(JSON_SUPPORTED_METHODS as readonly string[]).includes(methodName)) {
        return;
      }

      if (Node.isIdentifier(caller) && caller.getText() === "JSON") {
        detectedMethods.add(`json.${methodName}` as DetectedMethod);
      }
    }
  }
}
