import React, {Component} from 'react'
import {
  View,
  Text,
  StyleSheet,
  Button,
} from 'react-native'
import {connect} from 'react-redux'

import actions from '../action'
import NavigationUtil from '../navigator/navigation-util'

class MyPage extends Component {
  render () {
    return (
      <View>
        <Button
          title='跳转到详情页'
          onPress={() => {NavigationUtil.goPage({}, 'DetailPage')}}
        />
        <Button
          title='跳转到详FetchDemo'
          onPress={() => {NavigationUtil.goPage({}, 'FetchDemoPage')}}
        />
        <Button
          title='跳转到详DataStoreDemo'
          onPress={() => {NavigationUtil.goPage({}, 'DataStoreDemoPage')}}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
  }
})

const mapDispatchToProps = dispatch => ({
  onChangeTheme: theme => dispatch(actions.onChangeTheme(theme))
})

export default connect(null, mapDispatchToProps)(MyPage)