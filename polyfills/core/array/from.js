if (!Array.from) {
  Array.from = function (arrayLike, mapFn, thisArg) {
    if (arrayLike === null || arrayLike === undefined) {
      throw new TypeError("Array.from requires an array-like object");
    }
    var result = [];
    var len = arrayLike.length >>> 0;
    for (var i = 0; i < len; i++) {
      var value = arrayLike[i];
      result[i] = mapFn ? mapFn.call(thisArg, value, i) : value;
    }
    return result;
  };
}
