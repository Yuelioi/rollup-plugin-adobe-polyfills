if (!String.prototype.includes) {
  String.prototype.includes = function (searchString, position) {
    if (this === null || this === undefined) {
      throw new TypeError(
        "String.prototype.includes called on null or undefined"
      );
    }
    var str = String(this);
    var searchStr = String(searchString);
    var pos = position === undefined ? 0 : position >>> 0;
    return str.indexOf(searchStr, pos) !== -1;
  };
}
