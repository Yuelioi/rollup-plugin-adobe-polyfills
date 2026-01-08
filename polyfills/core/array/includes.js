if (!Array.prototype.includes) {
  Array.prototype.includes = function (searchElement, fromIndex) {
    if (this === null || this === undefined) {
      throw new TypeError(
        "Array.prototype.includes called on null or undefined"
      );
    }
    var len = this.length >>> 0;
    if (len === 0) return false;

    var start = 0;
    if (fromIndex !== undefined) {
      start = fromIndex >> 0;
      if (start < 0) start = Math.max(0, len + start);
    }

    for (var i = start; i < len; i++) {
      var element = this[i];
      if (
        element === searchElement ||
        (isNaN(element) && isNaN(searchElement))
      ) {
        return true;
      }
    }
    return false;
  };
}
