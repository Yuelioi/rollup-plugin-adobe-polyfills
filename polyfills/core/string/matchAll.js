if (!String.prototype.matchAll) {
  String.prototype.matchAll = function (regexp) {
    if (!regexp.global) throw new TypeError("RegExp must have the global flag");
    var matches = [];
    var str = this;
    var match;
    while ((match = regexp.exec(str)) !== null) {
      matches.push(match);
    }
    return matches;
  };
}
