if (!String.prototype.trimEnd) {
  String.prototype.trimEnd = function () {
    if (this === null || this === undefined) {
      throw new TypeError(
        "String.prototype.trimEnd called on null or undefined"
      );
    }
    return String(this).replace(/\s+$/, "");
  };
}
