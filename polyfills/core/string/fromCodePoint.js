if (!String.fromCodePoint) {
  String.fromCodePoint = function () {
    var codeUnits = [];
    for (var i = 0; i < arguments.length; i++) {
      var codePoint = arguments[i];
      codePoint = Number(codePoint);
      if (
        !isFinite(codePoint) ||
        codePoint < 0 ||
        codePoint > 0x10ffff ||
        Math.floor(codePoint) !== codePoint
      ) {
        throw new RangeError("Invalid code point " + codePoint);
      }
      if (codePoint <= 0xffff) {
        codeUnits.push(String.fromCharCode(codePoint));
      } else {
        codePoint -= 0x10000;
        codeUnits.push(String.fromCharCode((codePoint >> 10) + 0xd800));
        codeUnits.push(String.fromCharCode((codePoint % 0x400) + 0xdc00));
      }
    }
    return codeUnits.join("");
  };
}
