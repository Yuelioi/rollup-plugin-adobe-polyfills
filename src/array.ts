import { Node } from "ts-morph";

const ARRAY_SUPPORTED_METHODS_ES5 = [
  "forEach",
  "map",
  "filter",
  "reduce",
  "reduceRight",
  "some",
  "every",
  "indexOf",
  "lastIndexOf",
] as const;
const ARRAY_SUPPORTED_METHODS_ES6 = [
  "copyWithin",
  "find",
  "findIndex",
  "fill",
  "keys",
  "values",
  "entries",
] as const;
const ARRAY_SUPPORTED_METHODS_ES2016 = ["includes"] as const;
const ARRAY_SUPPORTED_METHODS_ES2019 = ["flat", "flatMap"] as const;
const ARRAY_SUPPORTED_METHODS_ES2022 = ["at"] as const;
const ARRAY_SUPPORTED_METHODS_ES2023 = ["findLast", "findLastIndex"] as const;
const ARRAY_SUPPORTED_STATIC_METHODS = ["isArray", "from", "of"] as const;

const ARRAY_SUPPORTED_METHODS = [
  ...ARRAY_SUPPORTED_METHODS_ES5,
  ...ARRAY_SUPPORTED_METHODS_ES6,
  ...ARRAY_SUPPORTED_METHODS_ES2016,
  ...ARRAY_SUPPORTED_METHODS_ES2019,
  ...ARRAY_SUPPORTED_METHODS_ES2022,
  ...ARRAY_SUPPORTED_METHODS_ES2023,
] as const;

type DetectedMethod = `array.${string}`;

function isArrayType(declaration: Node): boolean {
  if (Node.isVariableDeclaration(declaration)) {
    const initializer = declaration.getInitializer();
    if (!initializer) return false;

    if (Node.isArrayLiteralExpression(initializer)) {
      return true;
    }

    if (Node.isCallExpression(initializer)) {
      const expression = initializer.getExpression();
      if (Node.isIdentifier(expression) && expression.getText() === "Array") {
        return true;
      }
    }
  }

  if (Node.isParameterDeclaration(declaration)) {
    const type = declaration.getType();
    const typeText = type.getText();
    return typeText.includes("Array") || typeText.includes("[]");
  }

  return false;
}

function detectCallerType(caller: Node): boolean {
  if (Node.isArrayLiteralExpression(caller)) {
    return true;
  }

  if (Node.isIdentifier(caller)) {
    const symbol = caller.getSymbol();
    if (!symbol) return false;

    const declarations = symbol.getDeclarations();
    return declarations.some((decl) => isArrayType(decl));
  }

  if (Node.isCallExpression(caller)) {
    const expression = caller.getExpression();
    if (Node.isIdentifier(expression) && expression.getText() === "Array") {
      return true;
    }
    if (Node.isPropertyAccessExpression(expression)) {
      const callerName = expression.getName();
      return ARRAY_SUPPORTED_METHODS.includes(callerName as any);
    }
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

      if (
        !ARRAY_SUPPORTED_METHODS.includes(methodName as any) &&
        !ARRAY_SUPPORTED_STATIC_METHODS.includes(methodName as any)
      ) {
        return;
      }

      if (Node.isIdentifier(caller) && caller.getText() === "Array") {
        if (ARRAY_SUPPORTED_STATIC_METHODS.includes(methodName as any)) {
          detectedMethods.add(`array.${methodName}` as DetectedMethod);
        }
        return;
      }

      if (detectCallerType(caller)) {
        detectedMethods.add(`array.${methodName}` as DetectedMethod);
      }
    }
  }
}
