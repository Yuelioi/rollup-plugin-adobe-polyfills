if (!Array.prototype.keys) {
  Array.prototype.keys = function () {
    throw new TypeError(
      "Array.prototype.keys is not supported in ES3 environment"
    );
  };
}
