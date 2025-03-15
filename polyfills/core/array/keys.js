if (!Array.prototype.keys) {
  Array.prototype.keys = function () {
    var keys = [];
    for (var i = 0; i < this.length; i++) {
      keys.push(i);
    }
    return keys[Symbol.iterator] ? keys[Symbol.iterator]() : keys;
  };
}
