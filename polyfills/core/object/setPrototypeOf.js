if (!Object.setPrototypeOf) {
  Object.setPrototypeOf = function (obj, proto) {
    if (obj === null || obj === undefined) {
      throw new TypeError("Object.setPrototypeOf called on null or undefined");
    }
    if (typeof proto !== "object" && proto !== null) {
      throw new TypeError("Object prototype may only be an Object or null");
    }
    if (obj.__proto__ !== undefined) {
      obj.__proto__ = proto;
      return obj;
    }
    var newObj = Object.create(proto);
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        newObj[key] = obj[key];
      }
    }
    return newObj;
  };
}
