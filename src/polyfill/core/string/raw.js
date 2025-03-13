// src/polyfill/string/es6/raw.js
if (!String.raw) {
  String.raw = function (callSite) {
    var rawStr = callSite.raw;
    var result = '';
    for (var i = 0; i < rawStr.length; i++) {
      result += rawStr[i];
      if (i < arguments.length - 1) {
        result += arguments[i + 1];
      }
    }
    return result;
  };
}
