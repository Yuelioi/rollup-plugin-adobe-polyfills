if (!Array.prototype.map) {
  Array.prototype.map = function (callback, thisArg) {
    var result = [];
    for (var i = 0; i < this.length; i++) {
      result.push(callback.call(thisArg, this[i], i, this));
    }
    return result;
  };
}
