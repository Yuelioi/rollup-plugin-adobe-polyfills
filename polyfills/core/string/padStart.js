if (!String.prototype.padStart) {
  String.prototype.padStart = function (targetLength, padString) {
    targetLength = targetLength >> 0;
    padString = String(padString || " ");
    if (this.length >= targetLength) return String(this);
    var pad = padString.repeat(Math.ceil((targetLength - this.length) / padString.length));
    return pad.slice(0, targetLength - this.length) + this;
  };
}
