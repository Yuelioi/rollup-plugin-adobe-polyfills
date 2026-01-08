if (!Array.prototype.every) {
  Array.prototype.every = function (callback, thisArg) {
    if (this === null || this === undefined) {
      throw new TypeError("Array.prototype.every called on null or undefined");
    }
    for (var i = 0; i < this.length; i++) {
      if (i in this && !callback.call(thisArg, this[i], i, this)) {
        return false;
      }
    }
    return true;
  };
}
