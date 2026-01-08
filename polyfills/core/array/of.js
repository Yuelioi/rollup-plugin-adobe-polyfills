if (!Array.of) {
  Array.of = function () {
    var result = [];
    for (var i = 0; i < arguments.length; i++) {
      result.push(arguments[i]);
    }
    return result;
  };
}
