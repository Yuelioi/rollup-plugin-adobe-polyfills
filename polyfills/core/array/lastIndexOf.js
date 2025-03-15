if (!Array.prototype.lastIndexOf) {
  Array.prototype.lastIndexOf = function (searchElement, fromIndex) {
    var len = this.length;
    fromIndex = fromIndex === undefined ? len - 1 : fromIndex;
    for (var i = fromIndex; i >= 0; i--) {
      if (this[i] === searchElement) return i;
    }
    return -1;
  };
}
