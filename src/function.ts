import { Node } from "ts-morph";

const FUNCTION_SUPPORTED_METHODS = ["bind", "name"] as const;

function isCallableFunction(node: Node): boolean {
  return Node.isFunctionDeclaration(node) || Node.isArrowFunction(node) || Node.isFunctionExpression(node) || Node.isMethodDeclaration(node);
}

export function processor(node: Node, detectedMethods: Set<string>): void {
  if (Node.isPropertyAccessExpression(node)) {
    const caller = node.getExpression();
    const methodName = node.getName();

    if (!(FUNCTION_SUPPORTED_METHODS as readonly string[]).includes(methodName)) {
      return;
    }

    // Handle direct function calls
    if (isCallableFunction(caller)) {
      detectedMethods.add(`function.${methodName}`);
      return;
    }

    // Handle property access on function variables
    if (Node.isIdentifier(caller)) {
      const symbol = caller.getSymbol();
      if (!symbol) return;

      const declarations = symbol.getDeclarations();
      for (const declaration of declarations) {
        // Handle function declare
        if (Node.isFunctionDeclaration(declaration)) {
          detectedMethods.add(`function.${methodName}`);
          return;
        }

        if (Node.isVariableDeclaration(declaration)) {
          const initializer = declaration.getInitializer();
          if (!initializer) continue;

          // Handle parenthesized expressions (e.g., (() => {}).name)
          if (Node.isParenthesizedExpression(initializer)) {
            const innerExpr = initializer.getExpression();
            if (isCallableFunction(innerExpr)) {
              detectedMethods.add(`function.${methodName}`);
              return;
            }
          }

          // Handle direct function assignments
          if (isCallableFunction(initializer)) {
            detectedMethods.add(`function.${methodName}`);
            break;
          }
        }
      }
    }
  }
}
