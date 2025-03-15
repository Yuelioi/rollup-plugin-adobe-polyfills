if (!String.prototype.repeat) {
  String.prototype.repeat = function (count) {
    var str = "" + this;
    count = Math.floor(count);
    if (count < 0) throw new RangeError("Invalid count value");
    var result = "";
    for (var i = 0; i < count; i++) result += str;
    return result;
  };
}
