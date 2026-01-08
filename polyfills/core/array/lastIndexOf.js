if (!Array.prototype.lastIndexOf) {
  Array.prototype.lastIndexOf = function (searchElement, fromIndex) {
    if (this === null || this === undefined) {
      throw new TypeError(
        "Array.prototype.lastIndexOf called on null or undefined"
      );
    }
    var len = this.length >>> 0;
    if (len === 0) return -1;

    var start = len - 1;
    if (fromIndex !== undefined) {
      start = fromIndex >> 0;
      if (start < 0) start = Math.max(0, len + start);
      else if (start >= len) start = len - 1;
    }

    for (var i = start; i >= 0; i--) {
      if (i in this && this[i] === searchElement) {
        return i;
      }
    }
    return -1;
  };
}
