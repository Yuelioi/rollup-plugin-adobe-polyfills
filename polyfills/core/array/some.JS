if (!Array.prototype.some) {
  Array.prototype.some = function (callback, thisArg) {
    if (this === null || this === undefined) {
      throw new TypeError("Array.prototype.some called on null or undefined");
    }
    for (var i = 0; i < this.length; i++) {
      if (i in this && callback.call(thisArg, this[i], i, this)) {
        return true;
      }
    }
    return false;
  };
}
