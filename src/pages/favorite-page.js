import React, {Component} from 'react'
import {
  View,
  Text,
  StyleSheet,
  Button,
} from 'react-native'
import {connect} from 'react-redux'
import {WebView} from 'react-native-webview'

import actions from '../action'

class FavoritePage extends Component {
  render () {
    return (
      // <View style={styles.container}>
        <WebView
          startInLoadingState={true}
          source={{uri: 'http://www.finsiot.com/'}}
        />
      // {/* </View> */}
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

export default connect(null, mapDispatchToProps)(FavoritePage)