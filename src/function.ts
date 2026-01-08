import { Node } from "ts-morph";

const FUNCTION_SUPPORTED_METHODS = ["bind", "name"] as const;

type DetectedMethod = `function.${(typeof FUNCTION_SUPPORTED_METHODS)[number]}`;

function isCallableFunction(node: Node): boolean {
  return (
    Node.isFunctionDeclaration(node) ||
    Node.isArrowFunction(node) ||
    Node.isFunctionExpression(node) ||
    Node.isMethodDeclaration(node)
  );
}

function unwrapExpression(node: Node): Node {
  if (Node.isParenthesizedExpression(node)) {
    return unwrapExpression(node.getExpression());
  }
  if (Node.isAsExpression(node)) {
    return unwrapExpression(node.getExpression());
  }
  return node;
}

function isFunctionType(declaration: Node): boolean {
  if (isCallableFunction(declaration)) {
    return true;
  }

  if (Node.isVariableDeclaration(declaration)) {
    const initializer = declaration.getInitializer();
    if (!initializer) return false;

    const unwrapped = unwrapExpression(initializer);
    if (isCallableFunction(unwrapped)) {
      return true;
    }

    const type = declaration.getType();
    const typeText = type.getText();
    return (
      typeText.includes("Function") ||
      typeText.includes("=>") ||
      typeText.includes("(...")
    );
  }

  if (Node.isParameterDeclaration(declaration)) {
    const type = declaration.getType();
    const typeText = type.getText();
    return (
      typeText.includes("Function") ||
      typeText.includes("=>") ||
      typeText.includes("(...")
    );
  }

  return false;
}

function detectCallerType(caller: Node): boolean {
  if (isCallableFunction(caller)) {
    return true;
  }

  const unwrapped = unwrapExpression(caller);
  if (isCallableFunction(unwrapped)) {
    return true;
  }

  if (Node.isIdentifier(caller)) {
    const symbol = caller.getSymbol();
    if (!symbol) return false;

    const declarations = symbol.getDeclarations();
    return declarations.some((decl) => isFunctionType(decl));
  }

  return false;
}

export function processor(
  node: Node,
  detectedMethods: Set<DetectedMethod>
): void {
  if (Node.isPropertyAccessExpression(node)) {
    const caller = node.getExpression();
    const methodName = node.getName();

    if (
      !(FUNCTION_SUPPORTED_METHODS as readonly string[]).includes(methodName)
    ) {
      return;
    }

    if (detectCallerType(caller)) {
      detectedMethods.add(`function.${methodName}` as DetectedMethod);
    }
  }
}
