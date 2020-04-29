

export default class Utils {
  /**
   * 检查item是否已经被收藏
   * @param {*} item 
   * @param {*} keys 
   */
  static checkFavorite(item, keys=[]){
    if (!key) {
      return false;
    }
    for (let i = 0, len = keys.length; i < len; i++) {
      let id = item.id ? item.id : item.fullName;
      if (id.toString() === keys[i]) {
        return true;
      }
    }
    return false;
  }
  /**
   * 检查key是否已经存在keys中
   * @param {*} keys 
   * @param {*} key 
   */
  static checkKeyIsExist(keys, key) {
    for (let i = 0, len = keys.length; i < len; i++) {
      if (key.toLowerCase() === keys[i].name.toLowerCase()) {
        return true;
      }
    }
    return false
  }
}