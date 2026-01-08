Array.prototype.reduceRight = function (callback, initialValue) {
  if (this === null || this === undefined) {
    throw new TypeError(
      "Array.prototype.reduceRight called on null or undefined"
    );
  }
  var hasInitial = arguments.length > 1;
  var accumulator = hasInitial ? initialValue : undefined;
  var startIndex = this.length - 1;

  if (!hasInitial) {
    for (var i = this.length - 1; i >= 0; i--) {
      if (i in this) {
        accumulator = this[i];
        startIndex = i - 1;
        break;
      }
    }
    if (!hasInitial && startIndex === this.length - 1) {
      throw new TypeError("Reduce of empty array with no initial value");
    }
  }

  for (var i = startIndex; i >= 0; i--) {
    if (i in this) {
      accumulator = callback.call(undefined, accumulator, this[i], i, this);
    }
  }
  return accumulator;
};
