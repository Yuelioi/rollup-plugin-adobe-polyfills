if (!Array.prototype.values) {
  Array.prototype.values = function () {
    var values = [];
    for (var i = 0; i < this.length; i++) {
      values.push(this[i]);
    }
    return values[Symbol.iterator] ? values[Symbol.iterator]() : values;
  };
}
