if (!String.prototype.replaceAll) {
  String.prototype.replaceAll = function (searchValue, replaceValue) {
    if (this === null || this === undefined) {
      throw new TypeError(
        "String.prototype.replaceAll called on null or undefined"
      );
    }
    var str = String(this);
    var searchStr = String(searchValue);
    var replaceStr = String(replaceValue);

    if (searchStr.length === 0) {
      return str;
    }

    var result = "";
    var lastIndex = 0;
    var index = str.indexOf(searchStr);

    while (index !== -1) {
      result += str.slice(lastIndex, index) + replaceStr;
      lastIndex = index + searchStr.length;
      index = str.indexOf(searchStr, lastIndex);
    }

    result += str.slice(lastIndex);
    return result;
  };
}
