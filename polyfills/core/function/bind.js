if (!Function.prototype.bind) {
  Function.prototype.bind = function (context) {
    if (typeof this !== "function") {
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var originalFunction = this;
    var boundArgs = Array.prototype.slice.call(arguments, 1);
    var EmptyFunction = function () {};
    var boundFunction = function () {
      var args = boundArgs.concat(Array.prototype.slice.call(arguments));
      var isNewCall = this instanceof boundFunction;
      return originalFunction.apply(isNewCall ? this : context, args);
    };

    if (originalFunction.prototype) {
      EmptyFunction.prototype = originalFunction.prototype;
      boundFunction.prototype = new EmptyFunction();
      EmptyFunction.prototype = null;
    }

    return boundFunction;
  };
}
