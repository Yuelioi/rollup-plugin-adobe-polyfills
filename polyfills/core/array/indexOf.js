if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (searchElement, fromIndex) {
    if (this === null || this === undefined) {
      throw new TypeError(
        "Array.prototype.indexOf called on null or undefined"
      );
    }
    var len = this.length >>> 0;
    if (len === 0) return -1;

    var start = 0;
    if (fromIndex !== undefined) {
      start = fromIndex >> 0;
      if (start < 0) start = Math.max(0, len + start);
    }

    for (var i = start; i < len; i++) {
      if (i in this && this[i] === searchElement) {
        return i;
      }
    }
    return -1;
  };
}
