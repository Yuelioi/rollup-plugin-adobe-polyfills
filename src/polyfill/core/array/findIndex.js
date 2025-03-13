if (!Array.prototype.findIndex) {
  Array.prototype.findIndex = function (predicate) {
    for (var i = 0; i < this.length; i++) {
      if (predicate(this[i], i, this)) return i;
    }
    return -1;
  };
}
