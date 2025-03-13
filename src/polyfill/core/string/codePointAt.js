if (!String.prototype.codePointAt) {
  String.prototype.codePointAt = function (pos) {
    var str = String(this);
    var size = str.length;
    pos = pos ? Number(pos) : 0;
    if (isNaN(pos)) pos = 0;
    if (pos < 0 || pos >= size) return undefined;

    var first = str.charCodeAt(pos);
    if (first < 0xd800 || first > 0xdbff || pos + 1 === size) return first;

    var second = str.charCodeAt(pos + 1);
    if (second < 0xdc00 || second > 0xdfff) return first;

    return (first - 0xd800) * 0x400 + second - 0xdc00 + 0x10000;
  };
}
