if (!Object.keys) {
  Object.keys = function (obj) {
    if (obj === null || obj === undefined) {
      throw new TypeError("Cannot convert undefined or null to object");
    }
    var keys = [];
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
}
