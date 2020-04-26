import React, {Component} from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
} from 'react-native'

import DataStore from '../expand/dao/data-store'

export default class DataStoreDemoPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      showText: ''
    }
    this.DataStore = new DataStore();
  }

  loadData = () => {
     //https://api.github.com/search/repositories?q=java
     let url = `https://api.github.com/search/repositories?q=${this.searchKey}`
     this.DataStore.fetchData(url)
      .then(data => {
        let showText = `初次数据加载时间：${new Date(data.timestamp)}\n${JSON.stringify(data.data)}`
        this.setState({showText})
      })
      .catch(error => {
        error && console.log(error.toString())
      })
  }
  render () {
    return (
      <View style={styles.container}>
        <Text>离线缓存框架设计</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText = {text => {this.searchKey = text}}
          />
          <Button
            title={'search'}
            onPress = {this.loadData}
          />
        </View>
        <Text>
          {this.state.showText}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  inputContainer: {
    flexDirection: 'row'
  },
  input: {
    flex: 1,
    height: 50,
    borderColor: 'black',
    borderWidth: 1,
  }
})