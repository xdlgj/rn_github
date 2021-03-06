import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import {WebView} from 'react-native-webview'

import NavigationBar from '../common/navigation-bar'
import ViewUtil from '../util/view-util'
import NavigationUtil from '../navigator/navigation-util'
import BackPressComponent from '../common/back-press-component'
import FavoriteDao from '../expand/dao/favorite-dao'

const TRENDING_URL = 'https://github.com/';
export default class DetailPage extends Component {
  constructor(props) {
    super(props)
    this.params = this.props.navigation.state.params;
    const {projectModel, flag} = this.params;
    this.favoriteDao = new FavoriteDao(flag)
    this.url = projectModel.item.html_url || TRENDING_URL + projectModel.item.fullName;
    const title = projectModel.item.full_name || projectModel.item.fullName;
    this.state = {
      title: title,
      url: this.url,
      canGoBack: false,
      isFavorite: projectModel.isFavorite,
    }
    //创建BackPressComponent对象并传入backPress参数(参数值是一个函数)
    this.backPress = new BackPressComponent({backPress: () => this.onBackPress()});
  }

  onBackPress() {
    this.onBack();
    return true;
  }

  onBack = () => {
    if (this.state.canGoBack){
      this.webView.goBack()
    } else {
      NavigationUtil.goBack(this.props.navigation)
    }
  }

  onFavoriteButtonClick = () =>  {
    const {projectModel, callback} = this.params;
    const isFavorite = projectModel.isFavorite = !projectModel.isFavorite;
    callback(isFavorite); //改变baseItem中收藏图标
    this.setState({isFavorite});
    let key = projectModel.item.id.toString();
    if (projectModel.isFavorite) {
      this.favoriteDao.saveFavoriteItem(key, JSON.stringify(projectModel.item))
    } else {
      this.favoriteDao.removeFavoriteItem(key)
    }
  }
 
  componentDidMount() {
    //组件更新时调用BackPressComponent对象的componentDidMount方法添加对物理键返回键的监听
    this.backPress.componentDidMount();
  }

  componentWillUnmount() {
      this.backPress.componentWillUnmount();
  }


  renderRightButton = () => {
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
         onPress={this.onFavoriteButtonClick}
        >
          <FontAwesome
            name={this.state.isFavorite ? 'star' : 'star-o'}
            size={20}
            style={{color: 'white', marginRight: 10}}
          />
        </TouchableOpacity>
        {ViewUtil.getShareButton(() => {

        })}
      </View>
    )
  }

  onNavigationStateChange = (navState) => {
    this.setState({canGoBack: navState.canGoBack, url: navState.url})
  }

  render () {
    const {theme} = this.props.navigation.state.params
    const titleLayoutStyle = this.state.title.length > 20 ? {paddingRight: 30} : null
    let navigationBar = <NavigationBar
      title={this.state.title}
      leftButton={ViewUtil.getLeftBackButton(() => {this.onBack()})}
      rightButton={this.renderRightButton()}
      style={{backgroundColor: theme.themeColor}}
      titleLayoutStyle={titleLayoutStyle}
    />
    return (
      <View style={styles.container}>
        {navigationBar}
        <WebView
          ref={webView => {this.webView = webView}}
          startInLoadingState={true}
          onNavigationStateChange={e => {this.onNavigationStateChange(e)}}
          source={{uri: this.url}}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
 
})