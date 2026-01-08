if (!String.raw) {
  String.raw = function (template) {
    if (template === null || template === undefined) {
      throw new TypeError("String.raw requires a template object");
    }
    var strings = template.raw;
    if (strings === null || strings === undefined) {
      throw new TypeError("template.raw is null or undefined");
    }
    var len = strings.length >>> 0;
    if (len === 0) return "";

    var result = "";
    for (var i = 0; i < len; i++) {
      result += strings[i];
      if (i < arguments.length - 1) {
        result += arguments[i + 1];
      }
    }
    return result;
  };
}
