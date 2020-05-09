import React, {Component} from 'react'
import {connect} from 'react-redux'
import {View} from 'react-native'

import DynamicTabNavigator from '../navigator/dynamic-tab-navigator'
import NavigationUtil from '../navigator/navigation-util'
import CustomTheme from '../pages/custom-theme'
import actions from '../action/'

class HomePage extends Component {

  renderCustomThemeView() {
    const {customThemeViewVisible, onShowCustomThemeView} = this.props;
    return (
      <CustomTheme
        visible={customThemeViewVisible}
        {...this.props}
        onClose={() => onShowCustomThemeView(false)}
      />
    );
  }

  render () {
    // 解决DynamicTabNavigator中的页面无法跳转到外层导航页面的问题
    NavigationUtil.navigation = this.props.navigation;
    return (
      <View style={{flex: 1}}>
        <DynamicTabNavigator />
        {this.renderCustomThemeView()}
      </View>
    )
  }
}

const mapStateToProps = state => ({
  customThemeViewVisible: state.theme.customThemeViewVisible,
  theme: state.theme.theme,
});

const mapDispatchToProps = dispatch => ({
  onShowCustomThemeView: (show) => dispatch(actions.onShowCustomThemeView(show)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);