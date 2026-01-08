if (!Array.prototype.fill) {
  Array.prototype.fill = function (value, start, end) {
    var len = this.length >>> 0;
    start = start >> 0;

    if (start < 0) start = Math.max(0, len + start);

    if (end === undefined) {
      end = len;
    } else {
      end = end >> 0;
      if (end < 0) end = Math.max(0, len + end);
    }

    for (var i = start; i < end && i < len; i++) {
      this[i] = value;
    }
    return this;
  };
}
