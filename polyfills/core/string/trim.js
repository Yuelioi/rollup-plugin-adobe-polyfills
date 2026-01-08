if (!String.prototype.trim) {
  String.prototype.trim = function () {
    if (this === null || this === undefined) {
      throw new TypeError("String.prototype.trim called on null or undefined");
    }
    return String(this).replace(/^\s+|\s+$/g, "");
  };
}
