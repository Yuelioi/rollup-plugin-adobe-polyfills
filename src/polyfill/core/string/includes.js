if (!String.prototype.includes) {
  String.prototype.includes = function (search, start) {
    if (typeof start !== 'number') start = 0;
    return this.indexOf(search, start) !== -1;
  };
}
