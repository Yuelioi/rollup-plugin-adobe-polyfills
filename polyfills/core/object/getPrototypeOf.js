if (!Object.getPrototypeOf) {
  Object.getPrototypeOf = function (obj) {
    return obj.__proto__ || obj.constructor.prototype;
  };
}
