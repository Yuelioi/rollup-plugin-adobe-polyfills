if (!Math.trunc) {
  Math.trunc = function (x) {
    x = Number(x);
    if (isNaN(x)) return NaN;
    if (x === Infinity) return Infinity;
    if (x === -Infinity) return -Infinity;
    if (x === 0) return x;

    return x > 0 ? Math.floor(x) : Math.ceil(x);
  };
}
