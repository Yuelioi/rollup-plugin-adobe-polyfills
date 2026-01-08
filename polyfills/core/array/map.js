if (!Array.prototype.map) {
  Array.prototype.map = function (callback, thisArg) {
    if (this === null || this === undefined) {
      throw new TypeError("Array.prototype.map called on null or undefined");
    }
    var result = new Array(this.length);
    for (var i = 0; i < this.length; i++) {
      if (i in this) {
        result[i] = callback.call(thisArg, this[i], i, this);
      }
    }
    return result;
  };
}
