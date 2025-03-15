if (!Array.prototype.filter) {
  Array.prototype.filter = function (callback, thisArg) {
    var result = [];
    for (var i = 0; i < this.length; i++) {
      if (callback.call(thisArg, this[i], i, this)) {
        result.push(this[i]);
      }
    }
    return result;
  };
}
