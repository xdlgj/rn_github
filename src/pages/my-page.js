import React, {Component} from 'react'
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
} from 'react-native'
import {connect} from 'react-redux'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'

import actions from '../action'
import NavigationUtil from '../navigator/navigation-util'
import NavigationBar from '../common/navigation-bar'

const THEME_COLOR = '#678'

class MyPage extends Component {

  getRightButton = () => {
    return (
      <View style={{flexDirection:'row'}}>
        <TouchableOpacity
          onPress={() => {

          }}
        >
          <View style={{padding: 5, marginLeft: 8}}>
            <Feather
              name={'search'}
              size={24}
              style={{color: 'white'}}
            />
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  getLeftButton = (callBack) => {
    return (
      <TouchableOpacity
        style={{padding: 8, paddingLeft: 12}}
        onPress={callBack}
      >
        <Ionicons
          name={'ios-arrow-back'}
          size={26}
          style={{color: 'white'}}
        />
      </TouchableOpacity>
    )

  }

  render () {
    let statusBar = {
      backgroundColor: THEME_COLOR
    }
    let navigationBar = <NavigationBar
        title={'我的'}
        statusBar={statusBar}
        style={{backgroundColor: THEME_COLOR}}
        rightButton={this.getRightButton()}
        leftButton={this.getLeftButton()}
      />
    return (
      <View style={styles.container}>
        {navigationBar}
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
    marginTop: 30,
  },
})

const mapDispatchToProps = dispatch => ({
  onChangeTheme: theme => dispatch(actions.onChangeTheme(theme))
})

export default connect(null, mapDispatchToProps)(MyPage)