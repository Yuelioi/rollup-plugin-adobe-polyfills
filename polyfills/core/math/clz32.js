if (!Math.clz32) {
  Math.clz32 = function (x) {
    x = x >>> 0;
    if (x === 0) return 32;

    var count = 0;
    if ((x & 0xffff0000) === 0) {
      count += 16;
      x <<= 16;
    }
    if ((x & 0xff000000) === 0) {
      count += 8;
      x <<= 8;
    }
    if ((x & 0xf0000000) === 0) {
      count += 4;
      x <<= 4;
    }
    if ((x & 0xc0000000) === 0) {
      count += 2;
      x <<= 2;
    }
    if ((x & 0x80000000) === 0) {
      count += 1;
    }

    return count;
  };
}
