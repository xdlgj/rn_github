import React, {Component} from 'react'
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet
} from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import HtmlView from 'react-native-htmlview'

import BaseItem from './base-item'


export default class TrendingItem extends BaseItem {
  render () {
    const {projectModel} = this.props
    const {item} = projectModel
    if (!item) return null;
    let description = '<p>' + item.description + '</p>'
    return (
      <TouchableOpacity
        onPress = {this.onItemClick}
      >
        <View style={styles.cell_container}>
          <Text style={styles.title}>
            {item.fullName}
          </Text>
          <HtmlView
            value={description}
            onLinkLongPress={(url) => {}}
            stylesheet={{
              p: styles.description,
              a: styles.description,
            }}
          />
          <Text style={styles.description}>
            {item.meta}
          </Text>
          <View style={styles.row}>
            <View style={styles.row}>
              <Text>Built by: </Text>
              {item.contributors.map((res, i, arr) => {
                return (
                  <Image
                    key={i}
                    style={{height: 22, width: 22, margin: 2}}
                    source={{uri: arr[i]}}
                  />
                )
              })}
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text>Star:</Text>
              <Text>{item.starCount}</Text>
            </View>
            {this._favoriteIcon()}
          </View>
        </View>

      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  cell_container: {
    backgroundColor: 'white',
    padding: 10,
    marginLeft: 5,
    marginRight: 5,
    marginVertical: 5,
    borderColor: '#dddddd',
    borderWidth: 0.5,
    borderRadius: 2,
    shadowColor: 'gray',
    shadowOffset: {width: 0.5, height: 0.5},
    shadowOpacity: 0.4,
    shadowRadius: 1,
    elevation: 2, //ios设置阴影
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    marginBottom: 2,
    color: '#212121',
  },
  description: {
    fontSize: 14,
    marginBottom: 2,
    color: '#757575',
  },
})