if (!Array.prototype.findLastIndex) {
  Array.prototype.findLastIndex = function (predicate, thisArg) {
    if (this == null || this === undefined) {
      throw new TypeError(
        "Array.prototype.findLastIndex called on null or undefined"
      );
    }
    if (typeof predicate !== "function") {
      throw new TypeError(predicate + " is not a function");
    }
    var array = Object(this);
    var length = array.length >>> 0;

    for (var i = length - 1; i >= 0; i--) {
      if (i in array && predicate.call(thisArg, array[i], i, array)) {
        return i;
      }
    }
    return -1;
  };
}
