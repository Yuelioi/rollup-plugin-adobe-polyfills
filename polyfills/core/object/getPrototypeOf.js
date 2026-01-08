if (!Object.getPrototypeOf) {
  Object.getPrototypeOf = function (obj) {
    if (obj === null || obj === undefined) {
      throw new TypeError("Cannot convert undefined or null to object");
    }
    if (obj.__proto__ !== undefined) {
      return obj.__proto__;
    }
    if (obj.constructor && obj.constructor.prototype) {
      return obj.constructor.prototype;
    }
    return null;
  };
}
