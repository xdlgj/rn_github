import {combineReducers} from 'redux'

import theme from './theme'

/**
 * 1.合并reducer
 */
const index = combineReducers(
  {
    theme: theme
  }
)
export default index