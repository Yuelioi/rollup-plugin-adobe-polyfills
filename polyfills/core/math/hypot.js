if (!Math.hypot) {
  Math.hypot = function () {
    var sum = 0;
    for (var i = 0; i < arguments.length; i++) {
      sum += arguments[i] * arguments[i];
    }
    return Math.sqrt(sum);
  };
}
