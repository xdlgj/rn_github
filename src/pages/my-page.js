import React, {Component} from 'react'
import {
  View,
  Text,
  StyleSheet,
  Button,
} from 'react-native'
import {connect} from 'react-redux'

import actions from '../action'

class MyPage extends Component {
  render () {
    const {navigation} = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>MyPage</Text>
        <Button 
          title={'修改主题'}
          onPress={() => {this.props.onChangeTheme('pink')}}
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