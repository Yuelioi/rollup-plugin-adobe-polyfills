import ts from "typescript";

export function processor(node: ts.Node, detectedMethods: Set<string>, checker: ts.TypeChecker): void {
  if (ts.isCallExpression(node)) {
    const expression = node.expression;

    if (ts.isPropertyAccessExpression(expression)) {
      const objExpression = expression.expression;

      if (ts.isIdentifier(objExpression)) {
        const symbol = checker.getSymbolAtLocation(objExpression);
        if (symbol && symbol.getName() === "JSON") {
          detectedMethods.add("json.json3");
        }
      }
    }
  }
}
