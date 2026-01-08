if (!Array.prototype.values) {
  Array.prototype.values = function () {
    throw new TypeError(
      "Array.prototype.values is not supported in ES3 environment"
    );
  };
}
