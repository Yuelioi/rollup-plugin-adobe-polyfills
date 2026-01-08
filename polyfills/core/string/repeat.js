if (!String.prototype.repeat) {
  String.prototype.repeat = function (count) {
    if (this === null || this === undefined) {
      throw new TypeError(
        "String.prototype.repeat called on null or undefined"
      );
    }
    var str = String(this);
    count = count >>> 0;

    if (count < 0 || count === Infinity) {
      throw new RangeError("Invalid count value");
    }
    if (count === 0) return "";

    var result = "";
    while (count > 0) {
      if (count % 2 === 1) result += str;
      count = Math.floor(count / 2);
      if (count > 0) str += str;
    }
    return result;
  };
}
