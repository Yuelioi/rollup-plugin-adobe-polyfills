if (!Math.fround) {
  Math.fround = function (x) {
    if (isNaN(x)) return NaN;
    if (x === 0) return x;
    if (x === Infinity) return Infinity;
    if (x === -Infinity) return -Infinity;

    if (typeof Float32Array === "undefined") {
      return x;
    }

    var float32array = new Float32Array(1);
    float32array[0] = x;
    return float32array[0];
  };
}
