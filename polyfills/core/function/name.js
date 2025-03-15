if (!Function.prototype.name) {
  Object.defineProperty(Function.prototype, "name", {
    get: function () {
      return this.toString().match(/^\s*function\s*([^\(\s]*)/)[1];
    },
  });
}
