
import Types from '../types'

export function onChangeTheme(theme) {
  return {type: Types.THEME_CHANGE, theme: theme}
}