if (!Math.hypot) {
  Math.hypot = function () {
    if (arguments.length === 0) return 0;

    var hasNaN = false;
    var hasInfinity = false;
    var max = 0;

    for (var i = 0; i < arguments.length; i++) {
      var x = Math.abs(arguments[i]);
      if (isNaN(x)) {
        hasNaN = true;
      } else if (x === Infinity) {
        hasInfinity = true;
      }
      if (x > max) max = x;
    }

    if (hasNaN) return NaN;
    if (hasInfinity) return Infinity;
    if (max === 0) return 0;

    var sum = 0;
    for (var i = 0; i < arguments.length; i++) {
      var normalized = arguments[i] / max;
      sum += normalized * normalized;
    }

    return max * Math.sqrt(sum);
  };
}
