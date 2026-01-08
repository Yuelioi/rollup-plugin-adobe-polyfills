if (!String.prototype.startsWith) {
  String.prototype.startsWith = function (searchString, position) {
    if (this === null || this === undefined) {
      throw new TypeError(
        "String.prototype.startsWith called on null or undefined"
      );
    }
    var str = String(this);
    var searchStr = String(searchString);
    var pos = position === undefined ? 0 : position >>> 0;
    return str.slice(pos, pos + searchStr.length) === searchStr;
  };
}
