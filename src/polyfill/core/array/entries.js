if (!Array.prototype.entries) {
  Array.prototype.entries = function () {
    var entries = [];
    for (var i = 0; i < this.length; i++) {
      entries.push([i, this[i]]);
    }
    return entries[Symbol.iterator] ? entries[Symbol.iterator]() : entries;
  };
}
