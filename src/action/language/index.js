import Types from '../types';
import DataStore, {FLAG_STORAGE} from '../../expand/dao/data-store';
import {_projectModels, handleData} from '../action-util';
import FavoriteDao from '../../expand/dao/favorite-dao';
import ProjectModel from '../../model/project-model';
import LanguageDao from '../../expand/dao/language-dao';

/**
 * 加载标签
 * @param flagKey
 * @returns {function(*)}
 */
export function onLoadLanguage(flagKey) {
  return async dispatch => {
    try {
      let languages = await new LanguageDao(flagKey).fetch();
      dispatch({type: Types.LANGUAGE_LOAD_SUCCESS, languages: languages, flag: flagKey});
    } catch (e) {
      console.log(e);
    }
  };
}