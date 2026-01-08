if (!Math.imul) {
  Math.imul = function (a, b) {
    a = a >>> 0;
    b = b >>> 0;

    var ah = (a >>> 16) & 0xffff;
    var al = a & 0xffff;
    var bh = (b >>> 16) & 0xffff;
    var bl = b & 0xffff;

    var mid = ah * bl + al * bh;
    var lo = al * bl + ((mid & 0xffff) << 16);

    return lo >>> 0;
  };
}
