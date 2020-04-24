import React, {Component} from 'react'

import DynamicTabNavigator from '../navigator/dynamic-tab-navigator'
import NavigationUtil from '../navigator/navigation-util'

export default class HomePage extends Component {

  render () {
    // 解决DynamicTabNavigator中的页面无法跳转到外层导航页面的问题
    NavigationUtil.navigation = this.props.navigation;
    return (
      <DynamicTabNavigator />
    )
  }
}