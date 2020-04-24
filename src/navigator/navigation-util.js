
export default class NavigationUtil {
  static restToHomePage (params) {
    const {navigation} = params
    navigation.navigate('HomePage')
  }
}