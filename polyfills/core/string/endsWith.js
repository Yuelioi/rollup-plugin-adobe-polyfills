if (!String.prototype.endsWith) {
  String.prototype.endsWith = function (searchString, length) {
    if (this === null || this === undefined) {
      throw new TypeError(
        "String.prototype.endsWith called on null or undefined"
      );
    }
    var str = String(this);
    if (searchString === null || searchString === undefined) {
      return false;
    }
    var endPosition = length === undefined ? str.length : length >>> 0;
    var searchLength = String(searchString).length;
    var start = endPosition - searchLength;
    if (start < 0) return false;
    return str.slice(start, endPosition) === searchString;
  };
}
