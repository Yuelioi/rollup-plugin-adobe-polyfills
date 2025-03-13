if (!Array.prototype.reduce) {
  Array.prototype.reduce = function (callback, initialValue) {
    var accumulator = initialValue === undefined ? this[0] : initialValue;
    var startIndex = initialValue === undefined ? 1 : 0;
    for (var i = startIndex; i < this.length; i++) {
      accumulator = callback(accumulator, this[i], i, this);
    }
    return accumulator;
  };
}
