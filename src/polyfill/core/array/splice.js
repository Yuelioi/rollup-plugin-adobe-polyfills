// ES3 原生已支持 splice，但需要覆盖某些现代行为时可用此实现
if (!Array.prototype.splice) {
  Array.prototype.splice = function (start, deleteCount) {
    var len = this.length >>> 0;
    start = start >> 0;
    if (start < 0) start = Math.max(len + start, 0);
    deleteCount = Math.min(Math.max(deleteCount >> 0, 0), len - start);

    var elements = [];
    for (var i = 2; i < arguments.length; i++) {
      elements.push(arguments[i]);
    }

    var deleted = [];
    for (i = 0; i < deleteCount; i++) {
      var index = start + i;
      if (index in this) {
        deleted.push(this[index]);
      }
      delete this[index];
    }

    var insertCount = elements.length;
    if (insertCount > deleteCount) {
      for (i = len - 1; i >= start + deleteCount; i--) {
        this[i + insertCount - deleteCount] = this[i];
      }
    } else if (insertCount < deleteCount) {
      for (i = start + deleteCount; i < len; i++) {
        this[i + insertCount - deleteCount] = this[i];
        delete this[i];
      }
    }
    for (i = 0; i < insertCount; i++) {
      this[start + i] = elements[i];
    }

    this.length = len - deleteCount + insertCount;
    return deleted;
  };
}
