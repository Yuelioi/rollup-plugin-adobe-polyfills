if (!Array.prototype.at) {
  Array.prototype.at = function (index) {
    var len = this.length;
    var relativeIndex = index < 0 ? len + index : index;
    return relativeIndex >= 0 && relativeIndex < len ? this[relativeIndex] : undefined;
  };
}
