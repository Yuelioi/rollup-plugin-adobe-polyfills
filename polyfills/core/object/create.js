if (!Object.create) {
  Object.create = function (proto, propertiesObject) {
    if (typeof proto !== "object" && proto !== null) {
      throw new TypeError("Object prototype may only be an Object or null");
    }
    var object = {};
    if (proto !== null) {
      object.__proto__ = proto;
    }
    if (propertiesObject !== undefined) {
      for (var key in propertiesObject) {
        if (Object.prototype.hasOwnProperty.call(propertiesObject, key)) {
          var descriptor = propertiesObject[key];
          if (descriptor && typeof descriptor === "object") {
            if ("value" in descriptor) {
              object[key] = descriptor.value;
            }
          }
        }
      }
    }
    return object;
  };
}
