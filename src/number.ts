import { Node } from "ts-morph";

const NUMBER_SUPPORTED_METHODS = ["isInteger", "isNaN"] as const;

type DetectedMethod = `number.${(typeof NUMBER_SUPPORTED_METHODS)[number]}`;

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
        !(NUMBER_SUPPORTED_METHODS as readonly string[]).includes(methodName)
      ) {
        return;
      }

      if (Node.isIdentifier(caller) && caller.getText() === "Number") {
        detectedMethods.add(`number.${methodName}` as DetectedMethod);
      }
    }
  }
}
