if (!Math.log10) {
  Math.log10 = function (x) {
    if (isNaN(x)) return NaN;
    if (x === Infinity) return Infinity;
    if (x === -Infinity) return NaN;
    if (x < 0) return NaN;
    if (x === 0) return -Infinity;

    return Math.log(x) / Math.LN10;
  };
}
