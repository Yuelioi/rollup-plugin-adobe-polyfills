if (!Array.prototype.find) {
  Array.prototype.find = function (callback, thisArg) {
    if (this === null || this === undefined) {
      throw new TypeError("Array.prototype.find called on null or undefined");
    }
    for (var i = 0; i < this.length; i++) {
      if (i in this && callback.call(thisArg, this[i], i, this)) {
        return this[i];
      }
    }
    return undefined;
  };
}
