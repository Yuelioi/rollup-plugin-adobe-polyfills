if (!Number.isInteger) {
  Number.isInteger = function (value) {
    if (typeof value !== "number") {
      return false;
    }
    if (isNaN(value) || !isFinite(value)) {
      return false;
    }
    return value === Math.floor(value);
  };
}
