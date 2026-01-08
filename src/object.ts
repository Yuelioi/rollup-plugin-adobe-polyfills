import { Node } from "ts-morph";

const OBJECT_SUPPORTED_STATIC_METHODS = [
  "assign",
  "create",
  "entries",
  "getPrototypeOf",
  "keys",
  "setPrototypeOf",
  "values",
] as const;
const OBJECT_SUPPORTED_INSTANCE_METHODS = ["hasOwnProperty"] as const;

type DetectedMethod = `object.${
  | (typeof OBJECT_SUPPORTED_STATIC_METHODS)[number]
  | (typeof OBJECT_SUPPORTED_INSTANCE_METHODS)[number]}`;

function isObjectType(declaration: Node): boolean {
  if (Node.isObjectLiteralExpression(declaration)) {
    return true;
  }

  if (Node.isVariableDeclaration(declaration)) {
    const initializer = declaration.getInitializer();
    if (!initializer) return false;

    if (Node.isObjectLiteralExpression(initializer)) {
      return true;
    }

    if (Node.isCallExpression(initializer)) {
      const expression = initializer.getExpression();
      if (Node.isIdentifier(expression) && expression.getText() === "Object") {
        return true;
      }
    }

    const type = declaration.getType();
    const typeText = type.getText();
    return (
      typeText === "object" ||
      typeText.includes("{}") ||
      typeText.includes("Record")
    );
  }

  if (Node.isParameterDeclaration(declaration)) {
    const type = declaration.getType();
    const typeText = type.getText();
    return (
      typeText === "object" ||
      typeText.includes("{}") ||
      typeText.includes("Record")
    );
  }

  return false;
}

function detectObjectType(caller: Node): boolean {
  if (Node.isObjectLiteralExpression(caller)) {
    return true;
  }

  if (Node.isIdentifier(caller)) {
    const symbol = caller.getSymbol();
    if (!symbol) return false;

    const declarations = symbol.getDeclarations();
    return declarations.some((decl) => isObjectType(decl));
  }

  return false;
}

export function processor(
  node: Node,
  detectedMethods: Set<DetectedMethod>
): void {
  if (Node.isCallExpression(node)) {
    const expression = node.getExpression();

    if (Node.isPropertyAccessExpression(expression)) {
      const caller = expression.getExpression();
      const methodName = expression.getName();

      if (Node.isIdentifier(caller) && caller.getText() === "Object") {
        if (
          (OBJECT_SUPPORTED_STATIC_METHODS as readonly string[]).includes(
            methodName
          )
        ) {
          detectedMethods.add(`object.${methodName}` as DetectedMethod);
          return;
        }
      }

      if (detectObjectType(caller)) {
        if (
          (OBJECT_SUPPORTED_INSTANCE_METHODS as readonly string[]).includes(
            methodName
          )
        ) {
          detectedMethods.add(`object.${methodName}` as DetectedMethod);
        }
      }
    }
  }
}
