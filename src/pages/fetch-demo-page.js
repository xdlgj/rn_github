import React, {Component} from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button
} from 'react-native'


export default class FetchDemoPage extends Component {

  constructor (props) {
    super(props)
    this.state = {
      showText: '',
    }
  }
  loadData = () => {
    //https://api.github.com/search/repositories?q=java
    let url = `https://api.github.com/search/repositories?q=${this.searchKey}`
    fetch(url)
      .then(response => response.text())
      .then(responseText => {
        this.setState({showText: responseText})
        console.log(responseText)
      })
  }
  loadData2 = () => {
    //https://api.github.com/search/repositories?q=java
    let url = `https://api.github.com/search/repositories?q=${this.searchKey}`
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.text()
        }
        throw new Error('Network response was not ok.')
      })
      .then(responseText => {
        this.setState({showText: responseText})
        console.log(responseText)
      })
      .catch(e => {
        this.setState({showText: e.toString()})
      })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Fetch 使用</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText = {text => {this.searchKey = text}}
          />
          <Button
            title={'search'}
            onPress = {this.loadData2}
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