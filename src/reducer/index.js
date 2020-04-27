import {combineReducers} from 'redux'

import theme from './theme'
import popular from './popular'

/**
 * 1.合并reducer
 */
const index = combineReducers(
  {
    theme: theme,
    popular: popular,
  }
)
export default index