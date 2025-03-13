// src/polyfill/string/es6/fromCodePoint.js
if (!String.fromCodePoint) {
  String.fromCodePoint = function () {
    var codeUnits = [];
    for (var i = 0; i < arguments.length; i++) {
      var codePoint = Number(arguments[i]);
      if (codePoint < 0 || codePoint > 0x10ffff || Math.floor(codePoint) !== codePoint) {
        throw new RangeError('Invalid code point: ' + codePoint);
      }
      if (codePoint <= 0xffff) {
        codeUnits.push(codePoint);
      } else {
        codePoint -= 0x10000;
        codeUnits.push((codePoint >> 10) + 0xd800, (codePoint % 0x400) + 0xdc00);
      }
    }
    return String.fromCharCode.apply(null, codeUnits);
  };
}
