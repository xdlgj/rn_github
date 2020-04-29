import Types from '../types'
import DataStore, { FLAG_STORAGR } from '../../expand/dao/data-store'
import {handleData} from '../action-util'

/**
 * 获取最热数据的异步action
 * @param {*} storeName 
 * @param {*} url 
 * @param {*} pageSize 
 */
export function onRefreshTrending (storeName, url, pageSize){
  return dispatch => {
    dispatch({type: Types.TRENDING_REFRESH, storeName: storeName});
    let dataStore = new DataStore();
    dataStore.fetchData(url, FLAG_STORAGR.flag_trending)//异步action与数据流
      .then(data => {
        handleData(Types.TRENDING_REFRESH_SUCCESS, dispatch, storeName, data, pageSize);
      })
      .catch(error => {
        console.log(error)
        dispatch({type: Types.TRENDING_REFRESH_FAIL, storeName, error})
      })
  }
}
/**
 * 加载更多
 * @param {*} storeName 
 * @param {*} pageIndex 第几页
 * @param {*} pageSize 每页显示多少条数据
 * @param {*} dataArray 原始数据
 * @param {*} callBack 回调函数。可以通过回调函数来向调用页面通信： 如果异常信息的展示，没有更多等待
 */
export function onLoadMoreTrending(storeName, pageIndex, pageSize, dataArray= [], callBack) {
  return dispatch => {
    setTimeout(() =>  {//模拟网络请求
      if ((pageIndex - 1) * pageSize >= dataArray.length){//已加载完全部数据
        if (typeof callBack === 'function'){
          callBack('no more')
        }
        dispatch({
          type: Types.TRENDING_LOAD_MORE_FAIL,
          error: 'no more',
          storeName: storeName,
          pageIndex: --pageIndex,
          projectModes: dataArray,
        })
      } else {
        //本次和载入的最大数据量
        let max = pageIndex * pageSize > dataArray.length ? dataArray.length : pageIndex * pageSize;
        dispatch({
          type: Types.TRENDING_LOAD_MORE_SUCCESS,
          storeName: storeName,
          pageIndex: pageIndex,
          projectModes: dataArray.slice(0, max),
        })
      }

    }, 500)
  }
}
