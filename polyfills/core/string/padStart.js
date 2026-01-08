if (!String.prototype.padStart) {
  String.prototype.padStart = function (targetLength, padString) {
    if (this === null || this === undefined) {
      throw new TypeError(
        "String.prototype.padStart called on null or undefined"
      );
    }
    var str = String(this);
    targetLength = targetLength >>> 0;
    var padStr = padString === undefined ? " " : String(padString);

    if (targetLength <= str.length || padStr.length === 0) {
      return str;
    }

    var padLength = targetLength - str.length;
    var repeatCount = Math.ceil(padLength / padStr.length);
    var padding = padStr.repeat
      ? padStr.repeat(repeatCount)
      : Array(repeatCount + 1).join(padStr);

    return padding.slice(0, padLength) + str;
  };
}
