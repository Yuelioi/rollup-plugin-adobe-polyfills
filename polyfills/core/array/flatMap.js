if (!Array.prototype.flatMap) {
  Array.prototype.flatMap = function (callback) {
    var mapped = [];
    for (var i = 0; i < this.length; i++) {
      var item = callback(this[i], i, this);
      if (Array.isArray(item)) {
        mapped = mapped.concat(item);
      } else {
        mapped.push(item);
      }
    }
    return mapped;
  };
}
