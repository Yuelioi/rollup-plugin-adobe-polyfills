if (!String.prototype.codePointAt) {
  String.prototype.codePointAt = function (pos) {
    if (this === null || this === undefined) {
      throw new TypeError(
        "String.prototype.codePointAt called on null or undefined"
      );
    }
    var str = String(this);
    var len = str.length;
    pos = pos >>> 0;
    if (pos >= len) return undefined;

    var first = str.charCodeAt(pos);
    if (first >= 0xd800 && first <= 0xdbff && len > pos + 1) {
      var second = str.charCodeAt(pos + 1);
      if (second >= 0xdc00 && second <= 0xdfff) {
        return (first - 0xd800) * 0x400 + (second - 0xdc00) + 0x10000;
      }
    }
    return first;
  };
}
