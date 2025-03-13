if (!Array.prototype.reduceRight) {
  Array.prototype.reduceRight = function (callback, initialValue) {
    if (this == null) {
      throw new TypeError('Array.prototype.reduceRight called on null or undefined');
    }
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }
    var array = Object(this);
    var length = array.length >>> 0;
    var accumulator = initialValue;
    var i = length - 1;

    if (arguments.length < 2) {
      if (length === 0) {
        throw new TypeError('Reduce of empty array with no initial value');
      }
      accumulator = array[i--];
    }

    for (; i >= 0; i--) {
      if (i in array) {
        accumulator = callback(accumulator, array[i], i, array);
      }
    }
    return accumulator;
  };
}
