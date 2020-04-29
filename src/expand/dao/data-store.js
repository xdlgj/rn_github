import {AsyncStorage} from 'react-native'
import Trending from 'GitHubTrending'

const AUTH_TOKEN = 'fd82d1e882462e23b8e88aa82198f166'
export const FLAG_STORAGR = {flag_popular: 'popular', flag_trending: 'trending'}

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
   * @param {} flag
   */
  fecthNetData(url, flag) {
    return new Promise((resolve, reject) => {
      if (flag !== FLAG_STORAGR.flag_trending){
        fetch(url, flag)
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
      } else {
        console.log(url)
        new Trending(AUTH_TOKEN).fetchTrending(url)
          .then(items => {
            if (!items){
              throw new Error('responseData is null')
            }
            this.saveData(url, items)
            resolve(items)
          })
          .catch(error => {
            reject(error)
          })
      }
    })
  }
  /**
   * 离线缓存入口, 优先获取本地数据，如果无本地数据或本地数据过期则获取网络数据
   * @param {*} url 
   * @param {*} flag
   */
  fetchData(url, flag) {
    return new Promise((resolve, reject) => {
      this.fetchLocalData(url).then((wrapData) => {
        if (wrapData && DataStore.checkTimestampValid(wrapData.timestamp)){
          resolve(wrapData)
        } else {
          this.fecthNetData(url, flag).then((data) => {
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
    if (currentDate.getHours() - targetDate.getHours() > 1) return false;
    return true
  }
}