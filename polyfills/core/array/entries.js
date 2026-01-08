if (!Array.prototype.entries) {
  Array.prototype.entries = function () {
    throw new TypeError(
      "Array.prototype.entries is not supported in ES3 environment"
    );
  };
}
