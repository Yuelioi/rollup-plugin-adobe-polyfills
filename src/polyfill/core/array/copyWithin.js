if (!Array.prototype.copyWithin) {
  Array.prototype.copyWithin = function (target, start, end) {
    var len = this.length;
    target = target >> 0;
    start = start >> 0;
    end = end === undefined ? len : end >> 0;
    var count = Math.min(end - start, len - target);
    var direction = start < target && target < start + count ? -1 : 1;
    var i = direction > 0 ? 0 : count - 1;
    while (i < count && i >= 0) {
      var idx = target + i;
      var srcIdx = start + i;
      if (srcIdx in this) this[idx] = this[srcIdx];
      i += direction;
    }
    return this;
  };
}
