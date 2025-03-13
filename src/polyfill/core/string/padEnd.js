// src/polyfill/string/es2017/padEnd.js
if (!String.prototype.padEnd) {
  String.prototype.padEnd = function (targetLength, padString) {
    targetLength = targetLength >> 0;
    padString = String(padString || ' ');
    if (this.length >= targetLength) return String(this);
    var pad = padString.repeat(Math.ceil((targetLength - this.length) / padString.length));
    return this + pad.slice(0, targetLength - this.length);
  };
}
