if (!Array.prototype.filter) {
  Array.prototype.filter = function (callback, thisArg) {
    if (this === null || this === undefined) {
      throw new TypeError("Array.prototype.filter called on null or undefined");
    }
    var result = [];
    for (var i = 0; i < this.length; i++) {
      if (i in this && callback.call(thisArg, this[i], i, this)) {
        result.push(this[i]);
      }
    }
    return result;
  };
}
