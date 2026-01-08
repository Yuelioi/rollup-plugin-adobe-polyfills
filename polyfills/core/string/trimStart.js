if (!String.prototype.trimStart) {
  String.prototype.trimStart = function () {
    if (this === null || this === undefined) {
      throw new TypeError(
        "String.prototype.trimStart called on null or undefined"
      );
    }
    return String(this).replace(/^\s+/, "");
  };
}
