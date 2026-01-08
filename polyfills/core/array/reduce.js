if (!Array.prototype.reduce) {
  Array.prototype.reduce = function (callback, initialValue) {
    if (this === null || this === undefined) {
      throw new TypeError("Array.prototype.reduce called on null or undefined");
    }
    var hasInitial = arguments.length > 1;
    var accumulator = hasInitial ? initialValue : undefined;
    var startIndex = 0;

    if (!hasInitial) {
      for (var i = 0; i < this.length; i++) {
        if (i in this) {
          accumulator = this[i];
          startIndex = i + 1;
          break;
        }
      }
      if (!hasInitial && startIndex === 0) {
        throw new TypeError("Reduce of empty array with no initial value");
      }
    }

    for (var i = startIndex; i < this.length; i++) {
      if (i in this) {
        accumulator = callback.call(undefined, accumulator, this[i], i, this);
      }
    }
    return accumulator;
  };
}
