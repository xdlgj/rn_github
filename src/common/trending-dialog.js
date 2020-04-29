import React, {Component} from 'react'
import {
  Modal, 
  View, 
  Text,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import TimeSpan from '../model/time-span'

export const TimeSpans = [
  new TimeSpan('今 天', 'since=daily'),
  new TimeSpan('本 周', 'since=weekly'),
  new TimeSpan('本 月', 'since=monthly')
]

export default class TrendingDialog extends Component {

  constructor(props) {
    super(props)
    this.state = {
      visible: false
    }
  }

  show = () => {
    this.setState({visible: true})
  }

  dimiss = () => {
    this.setState({visible: false})
  }

  render () {
    const  {onClose, onSelect} = this.props
    return (
      <Modal
        transparent={true}
        visible={this.state.visible}
        onRequestClose={() => onClose}
      >
        <TouchableOpacity
          style={styles.container}
          onPress={this.dimiss}
        >
          <MaterialIcons
            name={'arrow-drop-up'}
            size={36}
            style={styles.arrow}
          />
          <View style={styles.content}>
            {TimeSpans.map((result, i, arr) => {
              return (
                <TouchableOpacity
                  onPress={() => onSelect(arr[i])}
                  underlayColor='transparent'
                >
                  <View style={styles.text_container}>
                    <Text style={styles.text}>{arr[i].showText}</Text>
                    {i !== TimeSpans.length - 1 ? <View style={styles.line}/> : null}
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0.6)'
  },
  arrow: {
    marginTop: 40,
    color: 'white',
    padding: 0,
    margin: -15,
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 3,
    paddingTop: 3,
    paddingBottom: 3,
    marginRight: 3,
  },
  text_container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    fontSize: 16,
    color: 'black',
    fontWeight: '400',
    padding: 8,
    paddingLeft: 26,
    paddingLeft: 26,
  },
  line: {
    height: 0.3,
    backgroundColor: 'darkgray',
  }
})