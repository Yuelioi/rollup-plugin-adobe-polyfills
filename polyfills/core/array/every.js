if (!Array.prototype.every) {
  Array.prototype.every = function (callback, thisArg) {
    for (var i = 0; i < this.length; i++) {
      if (!callback.call(thisArg, this[i], i, this)) return false;
    }
    return true;
  };
}
