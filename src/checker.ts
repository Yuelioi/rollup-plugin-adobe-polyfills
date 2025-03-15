import ts from "typescript";

export const resolveBaseType = (checker: ts.TypeChecker, type: ts.Type): ts.Type | ts.Type[] => {
  // 处理联合类型：返回所有子类型的基础类型数组
  if (type.isUnion()) {
    return type.types.map((t) => checker.getBaseTypeOfLiteralType(t));
  }

  // 非联合类型：直接返回基础类型
  return checker.getBaseTypeOfLiteralType(type);
};

export const handleInstanceMethod = (
  checker: ts.TypeChecker,
  objExpression: ts.LeftHandSideExpression,
  callback: (checker: ts.TypeChecker, t: ts.Type) => boolean
) => {
  const type = checker.getTypeAtLocation(objExpression);
  const resolvedType = resolveBaseType(checker, type);
  const types = Array.isArray(resolvedType) ? resolvedType : [resolvedType];

  for (const t of types) {
    const shouldBreak = callback(checker, t);
    if (shouldBreak) break;
  }
};
