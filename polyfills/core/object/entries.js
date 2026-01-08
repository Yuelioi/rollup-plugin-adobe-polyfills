if (!Object.entries) {
  Object.entries = function (obj) {
    if (obj === null || obj === undefined) {
      throw new TypeError("Cannot convert undefined or null to object");
    }
    var entries = [];
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        entries.push([key, obj[key]]);
      }
    }
    return entries;
  };
}
