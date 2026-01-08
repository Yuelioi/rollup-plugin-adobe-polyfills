if (!String.prototype.matchAll) {
  String.prototype.matchAll = function (regexp) {
    if (this === null || this === undefined) {
      throw new TypeError(
        "String.prototype.matchAll called on null or undefined"
      );
    }
    var str = String(this);
    if (regexp === null || regexp === undefined) {
      throw new TypeError("regexp cannot be null or undefined");
    }
    if (!(regexp instanceof RegExp)) {
      throw new TypeError("regexp must be a RegExp");
    }
    if (!regexp.global) {
      throw new TypeError(
        "String.prototype.matchAll called with a non-global RegExp"
      );
    }

    var results = [];
    var match;
    while ((match = regexp.exec(str)) !== null) {
      results.push(match);
    }
    return results;
  };
}
