import {AsyncStorage} from 'react-native'

export default class DataStore {
  /**
   * 保存数据
   * @param {*} url 
   * @param {*} data 
   * @param {*} callback 
   */
  saveData(url, data, callback) {
    if (!data || !url) return;
    AsyncStorage.setItem(url, JSON.stringify(this._wrapData(data)), callback)
  }
  /**
   * 获取本地数据
   * @param {} url 
   */
  fetchLocalData(url) {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(url, (error, result) => {
        if (!error) {
          try {
            resolve(JSON.parse(result));
          } catch (e) {
            reject(e);
            console.error(e);
          }
        } else {
          reject(error);
          console.error(error);
        }
      })
    })
  }
  /**
   * 获取网络数据
   * @param {} url 
   */
  fecthNetData(url) {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Network response was not ok.');
        })
        .then((responseData) => {
          this.saveData(url, responseData)
          resolve(responseData);
        })
        .catch((error) => {
          reject(error);
        })
    })
  }
  /**
   * 离线缓存入口, 优先获取本地数据，如果无本地数据或本地数据过期则获取网络数据
   * @param {*} url 
   */
  fetchData(url) {
    return new Promise((resolve, reject) => {
      this.fetchLocalData(url).then((wrapData) => {
        if (wrapData && DataStore.checkTimestampValid(wrapData.timestamp)){
          resolve(wrapData)
        } else {
          this.fecthNetData(url).then((data) => {
            resolve(this._wrapData(data));
          }).catch((error) => {
            reject(error);
          })
        }
      }).catch((error) => {
        this.fecthNetData(url).then((data) => {
          resolve(this._wrapData);
        }).catch((error) => {
          reject(error);
        })
      })
    })
  }
  /**
   * 为网络数据添加时间戳
   * @param {*} data 
   */
  _wrapData(data) {
    return {data: data, timestamp: new Date().getTime()}
  }
  /**
   * 检查timestamp是否在有效期内
   * @param {*} timestamp 项目更新时间
   * @return {boolean} true 不需要更新 false 需要更新
   */
  static checkTimestampValid(timestamp) {
    const currentDate = new Date();
    const targetDate = new Date();
    targetDate.setTime(timestamp);
    if (currentDate.getMonth() !== targetDate.getMonth()) return false;
    if (currentDate.getDate() !== targetDate.getDate()) return false;
    if (currentDate.getHours() - targetDate.getHours() > 4) return false;
    return true
  }


}