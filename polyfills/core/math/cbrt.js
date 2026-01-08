if (!Math.cbrt) {
  Math.cbrt = function (x) {
    if (isNaN(x)) return NaN;
    if (x === 0) return x;
    if (x === Infinity) return Infinity;
    if (x === -Infinity) return -Infinity;

    var sign = x < 0 ? -1 : 1;
    return sign * Math.pow(Math.abs(x), 1 / 3);
  };
}
