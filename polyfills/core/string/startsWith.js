if (!String.prototype.startsWith) {
  String.prototype.startsWith = function (search, pos) {
    pos = Math.max(pos >>> 0, 0);
    return this.substr(pos, search.length) === search;
  };
}
