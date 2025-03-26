import { Node } from "ts-morph";

// Array 方法定义
const ARRAY_SUPPORTED_METHODS_ES5 = ["forEach", "map", "filter", "reduce", "reduceRight", "some", "every", "indexOf", "lastIndexOf"] as const;

const ARRAY_SUPPORTED_METHODS_ES6 = ["copyWithin", "find", "findIndex", "fill", "keys", "values", "entries"] as const;

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
] as string[];

export function processor(node: Node, detectedMethods: Set<string>): void {
  if (Node.isCallExpression(node)) {
    const expression = node.getExpression();
    if (Node.isPropertyAccessExpression(expression)) {
      const caller = expression.getExpression();
      const methodName = expression.getName();

      if (!ARRAY_SUPPORTED_METHODS.includes(methodName) && !(ARRAY_SUPPORTED_STATIC_METHODS as readonly string[]).includes(methodName)) {
        return;
      }

      // array literal type
      if (Node.isArrayLiteralExpression(caller)) {
        detectedMethods.add(`array.${methodName}`);
        return;
      }

      if (Node.isIdentifier(caller)) {
        // Static Method
        if (caller.getText() === "Array") {
          detectedMethods.add(`array.${methodName}`);
          return;
        }

        // Instance Method
        const symbol = caller.getSymbol();
        if (!symbol) return;

        const declarations = symbol.getDeclarations();
        for (const declaration of declarations) {
          if (Node.isVariableDeclaration(declaration)) {
            const initializer = declaration.getInitializer();
            if (initializer && Node.isArrayLiteralExpression(initializer)) {
              detectedMethods.add(`array.${methodName}`);
              break;
            }
          }
        }
      }
    }
  }
}
