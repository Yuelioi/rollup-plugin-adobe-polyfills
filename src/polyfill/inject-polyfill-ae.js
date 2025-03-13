import { createFilter } from '@rollup/pluginutils';
import { readFileSync } from 'fs';
import ts from 'typescript';

// PATH
const POLYFILLS_PATH = './src/polyfill/core';

// ARRAY
const ARRAY_SUPPORTED_METHODS_ES5 = [
  'forEach',
  'map',
  'filter',
  'reduce',
  'reduceRight',
  'some',
  'every',
  'indexOf',
  'lastIndexOf',
];
const ARRAY_SUPPORTED_METHODS_ES6 = ['copyWithin', 'find', 'findIndex', 'fill', 'keys', 'values', 'entries', 'splice'];
const ARRAY_SUPPORTED_METHODS_ES2016 = ['includes'];
const ARRAY_SUPPORTED_METHODS_ES2019 = ['flat', 'flatMap'];
const ARRAY_SUPPORTED_METHODS_ES2022 = ['at'];
const ARRAY_SUPPORTED_METHODS_ES2023 = ['findLast', 'findLastIndex'];

const ARRAY_SUPPORTED_STATIC_METHODS = ['isArray', 'from', 'of'];

// STRING
const STRING_SUPPORTED_METHODS_ES5 = ['trim'];
const STRING_SUPPORTED_METHODS_ES6 = ['codePointAt', 'repeat', 'startsWith', 'endsWith', 'includes'];
const STRING_SUPPORTED_METHODS_ES2017 = ['padStart', 'padEnd'];
const STRING_SUPPORTED_METHODS_ES2019 = ['trimStart', 'trimEnd'];
const STRING_SUPPORTED_METHODS_ES2020 = ['matchAll'];
const STRING_SUPPORTED_METHODS_ES2021 = ['replaceAll'];
const STRING_SUPPORTED_METHODS_ES2022 = ['at'];
const STRING_SUPPORTED_STATIC_METHODS = ['fromCodePoint', 'raw'];

// METHOD COMBINATIONS
const STRING_SUPPORTED_METHODS = [
  ...STRING_SUPPORTED_METHODS_ES5,
  ...STRING_SUPPORTED_METHODS_ES6,
  ...STRING_SUPPORTED_METHODS_ES2017,
  ...STRING_SUPPORTED_METHODS_ES2019,
  ...STRING_SUPPORTED_METHODS_ES2020,
  ...STRING_SUPPORTED_METHODS_ES2021,
  ...STRING_SUPPORTED_METHODS_ES2022,
];

const ARRAY_SUPPORTED_METHODS = [
  ...ARRAY_SUPPORTED_METHODS_ES5,
  ...ARRAY_SUPPORTED_METHODS_ES6,
  ...ARRAY_SUPPORTED_METHODS_ES2016,
  ...ARRAY_SUPPORTED_METHODS_ES2019,
  ...ARRAY_SUPPORTED_METHODS_ES2022,
  ...ARRAY_SUPPORTED_METHODS_ES2023,
];

function resolveType(checker, type) {
  // 处理联合类型
  if (type.isUnion()) {
    return type.types.map((t) => checker.getBaseTypeOfLiteralType(t));
  }

  // 获取基础类型（处理类型别名）
  const baseType = checker.getBaseTypeOfLiteralType(type);

  // 处理泛型（如 Array<T>）
  if (baseType.getSymbol()?.getName() === 'Array') {
    return checker.getApparentType(baseType);
  }

  return baseType;
}

// 数组类型判断
function isArrayType(checker, type) {
  try {
    return checker.isArrayType(type) || checker.isTupleType(type) || type.getSymbol()?.getName() === 'Array';
  } catch {
    return false;
  }
}

// 字符串类型判断
function isStringType(checker, type) {
  try {
    return (
      (type.flags & ts.TypeFlags.StringLike) !== 0 ||
      type.getSymbol()?.getName() === 'String' ||
      checker.typeToString(type) === 'string'
    );
  } catch {
    return false;
  }
}

export default function injectPolyfills(options) {
  const { include, exclude } = options;
  const filter = createFilter(include, exclude);

  return {
    name: 'inject-array-polyfills',

    transform(code, id) {
      if (!filter(id)) return null;

      const detectedMethods = new Set();

      const sourceFile = ts.createSourceFile(id, code, ts.ScriptTarget.Latest, true);
      const program = ts.createProgram([id], {});
      const checker = program.getTypeChecker();

      function visit(node) {
        if (ts.isCallExpression(node)) {
          const expression = node.expression;
          if (ts.isPropertyAccessExpression(expression)) {
            try {
              const methodName = expression.name.text;
              const objExpression = expression.expression;

              // 处理JSON
              if (ts.isIdentifier(objExpression) && objExpression.text === 'JSON') {
                detectedMethods.add('json.' + 'json3');
              }

              // 处理静态方法
              if (ts.isIdentifier(objExpression)) {
                if (objExpression.text === 'Array' && ARRAY_SUPPORTED_STATIC_METHODS.includes(methodName)) {
                  detectedMethods.add('array.' + methodName);
                }
                if (objExpression.text === 'String' && STRING_SUPPORTED_STATIC_METHODS.includes(methodName)) {
                  detectedMethods.add('string.' + methodName);
                }
              }

              // 处理实例方法
              // const symbol = checker.getSymbolAtLocation(objExpression);
              const type = checker.getTypeAtLocation(objExpression);
              const resolvedType = resolveType(checker, type);
              const isArray = isArrayType(checker, resolvedType);
              const isString = isStringType(checker, resolvedType);
              if (isArray && ARRAY_SUPPORTED_METHODS.includes(methodName)) {
                detectedMethods.add(`array.${methodName}`);
              }
              if (isString && STRING_SUPPORTED_METHODS.includes(methodName)) {
                detectedMethods.add(`string.${methodName}`);
              }
            } catch (error) {
              console.warn(`[Polyfill Injector] Failed to detect method call: ${error.message}`);
            }
          }
        }
        ts.forEachChild(node, visit);
      }

      visit(sourceFile);

      if (detectedMethods.size === 0) return null;

      const injections = [];
      for (const method of detectedMethods) {
        try {
          const [folder, file] = method.split('.');
          const content = readFileSync(`${POLYFILLS_PATH}/${folder}/${file}.js`, 'utf-8');
          injections.push(content);
        } catch (e) {
          console.warn(`[Polyfill Injector] Missing polyfill for ${method}: ${e.message}`);
        }
      }

      return {
        code: [`// Injected  polyfills: ${Array.from(detectedMethods).join(', ')}`, ...injections, code].join('\n\n'),
        map: null,
      };
    },
  };
}
