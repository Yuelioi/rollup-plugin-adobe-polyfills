if (!Array.from) {
  Array.from = function (object) {
    var result = [];
    for (var i = 0; i < object.length; i++) {
      result.push(object[i]);
    }
    return result;
  };
}
