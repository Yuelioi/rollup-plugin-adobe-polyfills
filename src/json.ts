import { Node } from "ts-morph";

type DetectedMethod = `json.json2`;

export function processor(
  node: Node,
  detectedMethods: Set<DetectedMethod>
): void {
  if (Node.isCallExpression(node)) {
    const expression = node.getExpression();

    if (Node.isPropertyAccessExpression(expression)) {
      const caller = expression.getExpression();
      const methodName = expression.getName();

      if (
        Node.isIdentifier(caller) &&
        caller.getText() === "JSON" &&
        (methodName === "stringify" || methodName === "parse")
      ) {
        detectedMethods.add("json.json2" as DetectedMethod);
      }
    }
  }
}
