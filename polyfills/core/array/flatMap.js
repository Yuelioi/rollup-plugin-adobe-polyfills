if (!Array.prototype.flatMap) {
  Array.prototype.flatMap = function (callback, thisArg) {
    if (this === null || this === undefined) {
      throw new TypeError(
        "Array.prototype.flatMap called on null or undefined"
      );
    }
    var result = [];
    for (var i = 0; i < this.length; i++) {
      if (i in this) {
        var mapped = callback.call(thisArg, this[i], i, this);
        if (Array.isArray(mapped)) {
          for (var j = 0; j < mapped.length; j++) {
            result.push(mapped[j]);
          }
        } else {
          result.push(mapped);
        }
      }
    }
    return result;
  };
}
