import {combineReducers} from 'redux'

import theme from './theme'
import popular from './popular'
import trending from './trending'
import favorite from './favorite'
import language from './language'

/**
 * 1.合并reducer
 */
const index = combineReducers(
  {
    theme: theme,
    popular: popular,
    trending: trending,
    favorite: favorite,
    language: language,
  }
)
export default index