if (!Array.prototype.copyWithin) {
  Array.prototype.copyWithin = function (target, start, end) {
    var len = this.length >>> 0;
    target = target >> 0;
    start = start >> 0;

    if (target < 0) target = Math.max(0, len + target);
    if (start < 0) start = Math.max(0, len + start);

    if (end === undefined) {
      end = len;
    } else {
      end = end >> 0;
      if (end < 0) end = Math.max(0, len + end);
    }

    if (start >= end || target >= len) return this;

    var count = Math.min(end - start, len - target);
    var direction = start < target && target < start + count ? -1 : 1;
    var i = direction > 0 ? 0 : count - 1;

    while (i < count && i >= 0) {
      var srcIdx = start + i;
      var targetIdx = target + i;
      if (srcIdx in this) {
        this[targetIdx] = this[srcIdx];
      } else {
        delete this[targetIdx];
      }
      i += direction;
    }
    return this;
  };
}
