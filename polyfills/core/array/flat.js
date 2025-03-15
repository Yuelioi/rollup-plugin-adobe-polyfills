if (!Array.prototype.flat) {
  Array.prototype.flat = function (depth) {
    depth = depth === undefined ? 1 : Math.floor(depth);
    var result = [];
    for (var i = 0; i < this.length; i++) {
      if (Array.isArray(this[i]) && depth > 0) {
        result = result.concat(this[i].flat(depth - 1));
      } else {
        result.push(this[i]);
      }
    }
    return result;
  };
}
