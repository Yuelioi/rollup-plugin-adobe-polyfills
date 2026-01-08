if (!Function.prototype.bind) {
  Function.prototype.bind = function (context) {
    if (typeof this !== "function") {
      throw new TypeError(
        "Function.prototype.bind - what is trying to be bound is not callable"
      );
    }

    var originalFn = this;
    var boundArgs = Array.prototype.slice.call(arguments, 1);

    var boundFn = function () {
      var args = boundArgs.concat(Array.prototype.slice.call(arguments));
      return originalFn.apply(this instanceof boundFn ? this : context, args);
    };

    var Empty = function () {};
    if (originalFn.prototype) {
      Empty.prototype = originalFn.prototype;
      boundFn.prototype = new Empty();
    }

    return boundFn;
  };
}
