if (!("name" in Function.prototype)) {
  Object.defineProperty(Function.prototype, "name", {
    get: function () {
      var name = this.toString().match(/^\s*function\s+([^\s(]+)/);
      return name ? name[1] : "";
    },
    enumerable: false,
    configurable: true,
  });
}
