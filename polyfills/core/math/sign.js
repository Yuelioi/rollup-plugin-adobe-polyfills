if (!Math.sign) {
  Math.sign = function (x) {
    x = Number(x);
    if (isNaN(x)) return NaN;
    if (x > 0) return 1;
    if (x < 0) return -1;
    return x === 0 ? x : 0;
  };
}
