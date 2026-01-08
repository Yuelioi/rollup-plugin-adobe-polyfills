if (!Math.expm1) {
  Math.expm1 = function (x) {
    if (isNaN(x)) return NaN;
    if (x === Infinity) return Infinity;
    if (x === -Infinity) return -1;
    if (x === 0) return x;

    if (Math.abs(x) < 1e-5) {
      return x + (x * x) / 2 + (x * x * x) / 6;
    }

    return Math.exp(x) - 1;
  };
}
