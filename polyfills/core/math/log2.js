if (!Math.log2) {
  Math.log2 = function (x) {
    if (isNaN(x)) return NaN;
    if (x === Infinity) return Infinity;
    if (x === -Infinity) return NaN;
    if (x < 0) return NaN;
    if (x === 0) return -Infinity;

    return Math.log(x) / Math.LN2;
  };
}
