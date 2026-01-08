if (!String.prototype.at) {
  String.prototype.at = function (index) {
    var len = this.length;
    if (!isFinite(index)) return undefined;
    var relativeIndex = index < 0 ? len + index : index;
    return relativeIndex >= 0 && relativeIndex < len
      ? this[relativeIndex]
      : undefined;
  };
}
