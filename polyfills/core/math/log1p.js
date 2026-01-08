if (!Math.log1p) {
  Math.log1p = function (x) {
    if (isNaN(x)) return NaN;
    if (x === Infinity) return Infinity;
    if (x === -Infinity) return -Infinity;
    if (x < -1) return NaN;
    if (x === -1) return -Infinity;
    if (x === 0) return x;

    if (Math.abs(x) < 1e-5) {
      return x - (x * x) / 2 + (x * x * x) / 3;
    }

    return Math.log(1 + x);
  };
}
