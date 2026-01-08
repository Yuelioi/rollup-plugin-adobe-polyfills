if (!Object.values) {
  Object.values = function (obj) {
    if (obj === null || obj === undefined) {
      throw new TypeError("Cannot convert undefined or null to object");
    }
    var values = [];
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        values.push(obj[key]);
      }
    }
    return values;
  };
}
