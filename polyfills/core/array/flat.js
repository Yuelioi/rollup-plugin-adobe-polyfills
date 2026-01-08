Array.prototype.flat = function (depth) {
  depth = depth === undefined ? 1 : depth >>> 0;
  var result = [];

  var flatten = function (arr, d) {
    for (var i = 0; i < arr.length; i++) {
      if (d > 0 && Array.isArray(arr[i])) {
        flatten(arr[i], d - 1);
      } else {
        result.push(arr[i]);
      }
    }
  };

  flatten(this, depth);
  return result;
};
