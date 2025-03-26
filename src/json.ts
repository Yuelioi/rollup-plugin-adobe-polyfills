import { Node } from "ts-morph";

export function processor(node: Node, detectedMethods: Set<string>): void {
  if (Node.isCallExpression(node)) {
    const expression = node.getExpression();
    if (Node.isPropertyAccessExpression(expression)) {
      const caller = expression.getExpression();
      if (Node.isIdentifier(caller) && caller.getText() === "JSON") {
        detectedMethods.add("json.json2");
      }
    }
  }
}
