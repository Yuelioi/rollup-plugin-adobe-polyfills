if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (searchElement, fromIndex) {
    fromIndex = fromIndex || 0;
    for (var i = fromIndex; i < this.length; i++) {
      if (this[i] === searchElement) return i;
    }
    return -1;
  };
}
