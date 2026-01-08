import { Node } from "ts-morph";

const STRING_SUPPORTED_METHODS_ES5 = ["trim"] as const;
const STRING_SUPPORTED_METHODS_ES6 = [
  "codePointAt",
  "repeat",
  "startsWith",
  "endsWith",
  "includes",
] as const;
const STRING_SUPPORTED_METHODS_ES2017 = ["padStart", "padEnd"] as const;
const STRING_SUPPORTED_METHODS_ES2019 = ["trimStart", "trimEnd"] as const;
const STRING_SUPPORTED_METHODS_ES2020 = ["matchAll"] as const;
const STRING_SUPPORTED_METHODS_ES2021 = ["replaceAll"] as const;
const STRING_SUPPORTED_METHODS_ES2022 = ["at"] as const;
const STRING_SUPPORTED_STATIC_METHODS = ["fromCodePoint", "raw"] as const;

const STRING_SUPPORTED_METHODS = [
  ...STRING_SUPPORTED_METHODS_ES5,
  ...STRING_SUPPORTED_METHODS_ES6,
  ...STRING_SUPPORTED_METHODS_ES2017,
  ...STRING_SUPPORTED_METHODS_ES2019,
  ...STRING_SUPPORTED_METHODS_ES2020,
  ...STRING_SUPPORTED_METHODS_ES2021,
  ...STRING_SUPPORTED_METHODS_ES2022,
] as const;

type DetectedMethod = `string.${
  | (typeof STRING_SUPPORTED_METHODS)[number]
  | (typeof STRING_SUPPORTED_STATIC_METHODS)[number]}`;

const METHOD_DEPENDENCIES: Record<string, string[]> = {
  padStart: ["repeat"],
  padEnd: ["repeat"],
};

function isStringType(declaration: Node): boolean {
  if (Node.isVariableDeclaration(declaration)) {
    const initializer = declaration.getInitializer();
    if (!initializer) return false;

    if (Node.isStringLiteral(initializer)) {
      return true;
    }

    if (Node.isCallExpression(initializer)) {
      const expression = initializer.getExpression();
      if (Node.isIdentifier(expression) && expression.getText() === "String") {
        return true;
      }
    }

    if (Node.isTemplateExpression(initializer)) {
      return true;
    }

    const type = declaration.getType();
    const typeText = type.getText();
    return typeText === "string";
  }

  if (Node.isParameterDeclaration(declaration)) {
    const type = declaration.getType();
    const typeText = type.getText();
    return typeText === "string";
  }

  return false;
}

function detectStringType(caller: Node): boolean {
  if (Node.isStringLiteral(caller)) {
    return true;
  }

  if (Node.isTemplateExpression(caller)) {
    return true;
  }

  if (Node.isIdentifier(caller)) {
    const symbol = caller.getSymbol();
    if (!symbol) return false;

    const declarations = symbol.getDeclarations();
    return declarations.some((decl) => isStringType(decl));
  }

  return false;
}

function addDependencies(
  method: string,
  detectedMethods: Set<DetectedMethod>
): void {
  const deps = METHOD_DEPENDENCIES[method];
  if (!deps) return;

  for (const dep of deps) {
    const depMethod = `string.${dep}` as DetectedMethod;
    if (!detectedMethods.has(depMethod)) {
      detectedMethods.add(depMethod);
      addDependencies(dep, detectedMethods);
    }
  }
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
        !(STRING_SUPPORTED_METHODS as readonly string[]).includes(methodName) &&
        !(STRING_SUPPORTED_STATIC_METHODS as readonly string[]).includes(
          methodName
        )
      ) {
        return;
      }

      if (Node.isIdentifier(caller) && caller.getText() === "String") {
        if (
          (STRING_SUPPORTED_STATIC_METHODS as readonly string[]).includes(
            methodName
          )
        ) {
          detectedMethods.add(`string.${methodName}` as DetectedMethod);
          addDependencies(methodName, detectedMethods);
          return;
        }
      }

      if (detectStringType(caller)) {
        detectedMethods.add(`string.${methodName}` as DetectedMethod);
        addDependencies(methodName, detectedMethods);
      }
    }
  }
}
