import { Node } from "ts-morph";

const STRING_SUPPORTED_METHODS_ES5 = ["trim"] as const;
const STRING_SUPPORTED_METHODS_ES6 = ["codePointAt", "repeat", "startsWith", "endsWith", "includes"] as const;
const STRING_SUPPORTED_METHODS_ES2017 = ["padStart", "padEnd"] as const;
const STRING_SUPPORTED_METHODS_ES2019 = ["trimStart", "trimEnd"] as const;
const STRING_SUPPORTED_METHODS_ES2020 = ["matchAll"] as const;
const STRING_SUPPORTED_METHODS_ES2021 = ["replaceAll"] as const;
const STRING_SUPPORTED_METHODS_ES2022 = ["at"] as const;
const STRING_SUPPORTED_STATIC_METHODS = ["fromCodePoint", "raw"] as const;

// 方法组合
const STRING_SUPPORTED_METHODS = [
  ...STRING_SUPPORTED_METHODS_ES5,
  ...STRING_SUPPORTED_METHODS_ES6,
  ...STRING_SUPPORTED_METHODS_ES2017,
  ...STRING_SUPPORTED_METHODS_ES2019,
  ...STRING_SUPPORTED_METHODS_ES2020,
  ...STRING_SUPPORTED_METHODS_ES2021,
  ...STRING_SUPPORTED_METHODS_ES2022,
] as string[];

export function processor(node: Node, detectedMethods: Set<string>): void {
  if (Node.isCallExpression(node)) {
    const expression = node.getExpression();
    if (Node.isPropertyAccessExpression(expression)) {
      const caller = expression.getExpression();
      const methodName = expression.getName();

      if (!STRING_SUPPORTED_METHODS.includes(methodName) && !(STRING_SUPPORTED_STATIC_METHODS as readonly string[]).includes(methodName)) {
        return;
      }

      // string literal type
      if (Node.isStringLiteral(caller)) {
        detectedMethods.add(`string.${methodName}`);
        return;
      }

      if (Node.isIdentifier(caller)) {
        // Static Method
        if (caller.getText() === "String") {
          detectedMethods.add(`string.${methodName}`);

          return;
        }

        // Instance Method
        const symbol = caller.getSymbol();
        if (!symbol) return;

        const declarations = symbol.getDeclarations();
        for (const declaration of declarations) {
          if (Node.isVariableDeclaration(declaration)) {
            const initializer = declaration.getInitializer();
            if (initializer && Node.isStringLiteral(initializer)) {
              detectedMethods.add(`string.${methodName}`);

              break;
            }
          }
        }
      }
    }
  }
}
