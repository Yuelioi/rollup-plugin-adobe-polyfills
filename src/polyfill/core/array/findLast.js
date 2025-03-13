if (!Array.prototype.findLast) {
  Array.prototype.findLast = function (predicate, thisArg) {
    if (this == null) {
      throw new TypeError('Array.prototype.findLast called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError(predicate + ' is not a function');
    }
    var array = Object(this);
    var length = array.length >>> 0;

    // 从后向前遍历
    for (var i = length - 1; i >= 0; i--) {
      if (i in array) {
        // 跳过稀疏数组的空位
        var value = array[i];
        if (predicate.call(thisArg, value, i, array)) {
          return value;
        }
      }
    }
    return undefined;
  };
}
