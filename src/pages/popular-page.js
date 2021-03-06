import React, {Component} from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import {createMaterialTopTabNavigator} from 'react-navigation-tabs'
import {createAppContainer} from 'react-navigation'
import {connect} from 'react-redux'
import Toast from 'react-native-easy-toast'
import EventBus from 'react-native-event-bus'
import Ionicons from 'react-native-vector-icons/Ionicons'

import NavigationUtil from '../navigator/navigation-util'
import actions from '../action'
import PopularItem from '../common/popular-item'
import NavigationBar from '../common/navigation-bar'
import FavoriteDao from '../expand/dao/favorite-dao'
import { FLAG_STORAGE } from '../expand/dao/data-store'
import FavoriteUtil from '../util/favorite-util'
import eventTypes from '../util/event-types'
import {FLAG_LANGUAGE} from '../expand/dao/language-dao'


const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular)

class PopularPage extends Component {
  constructor (props) {
    super(props);
    const {onLoadLanguage} = this.props
    onLoadLanguage(FLAG_LANGUAGE.flag_key)
  }
  _genTabs(){
    const tabs = {};
    const {keys, theme} = this.props
    keys.forEach((item, index) => {
      if(item.checked) {
        tabs[`tab${index}`] = {
          screen: props => <PopularTabPage {...props} tabLabel={item.name} theme={theme}/>,
          navigationOptions: {
            title: item.name,
          },
        };
      }
    });
    return tabs;
  }

  renderRightButton = () => {
    const {theme} = this.props;
    return (
      <TouchableOpacity
        onPress={() => {
          //新版本友盟SDK 时间统计方法由 track -> onEvent
          //AnalyticsUtil.onEvent('SearchButtonClick');
          NavigationUtil.goPage({theme}, 'SearchPage');
        }}
      >
      <View style={{padding: 5, marginRight: 8}}>
        <Ionicons
          name={'ios-search'}
          size={24}
          style={{
            marginRight: 8,
            alignSelf: 'center',
            color: 'white',
          }}
        />
      </View>
    </TouchableOpacity>
    )
     
}
  render () {
    const {keys, theme} = this.props
    let statusBar = {
      backgroundColor: theme.themeColor
    }
    let navigationBar = <NavigationBar 
      title={'最热'}
      statusBar={statusBar}
      rightButton={this.renderRightButton()}
      style={{backgroundColor: theme.themeColor}}
    />
    const TabNavigator = keys.length ? createAppContainer(createMaterialTopTabNavigator(
      this._genTabs(),
      {
        tabBarOptions: {
          tabStyle: styles.tabStyle,
          upperCaseLabel: false, //是否是标签大写，默认为true
          scrollEnabled: true, // 是否支持选项卡滚动， 默认为false
          style: {
            backgroundColor: theme.themeColor, 
          },
          indicatorStyle: styles.indicatorStyle, //标签指示器样式
          labelStyle: styles.labelStyle, //文本样式
        },
        lazy: true
      }
    )) : null
    return (
      <View style={styles.container}>
        {navigationBar}
        {TabNavigator && <TabNavigator />}
      </View>
    )
  }
}

const mapPopularStateToProps = state => ({
  theme: state.theme.theme,
  keys: state.language.keys
})
const mapPopularDispatchToProps = dispatch => ({
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
})

export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(PopularPage)

const pageSize = 10
class PopularTab extends Component{
  constructor(props) {
    super(props);
    const {tabLabel} = this.props;
    this.storeName = tabLabel;
    this.isFavoriteChanged = false;
  }

  genFetchUrl = (key) => {
    return URL + key + QUERY_STR;
  }
  /**
   * 获取和当前页面有关的数据
   */
  _store = () => {
    const {popular} = this.props;
    let store = popular[this.storeName]
    if (!store || !store.items) { //有些store中没有items
      store = {
        items: [],
        isLoading: false,
        projectModes: [], //要显示的数据
        hideLoadingMore: true //默认隐藏加载更多
      }
    }
    return store;
  }
  loadData = (loadMore, refreshFavorie) => {
    const {onRefreshPopular, onLoadMorePopular, onFlushPopularFavorite} = this.props;
    const store = this._store();
    const url = this.genFetchUrl(this.storeName);
    if (loadMore) {
      onLoadMorePopular(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, callBack => {
        this.refs.toast.show('没有更多了');
      })
    } else if (refreshFavorie) {
      onFlushPopularFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao)
      this.isFavoriteChanged = false;
    } 
    else {
      onRefreshPopular(this.storeName, url, pageSize, favoriteDao)
    }
  }

  renderItem = (data) => {
    const item = data.item
    const {theme} = this.props
    return (
      <PopularItem 
        theme={theme}
        projectModel={item}
        onSelect={(callback) => {
          NavigationUtil.goPage({projectModel: item, flag: FLAG_STORAGE.flag_popular, callback, theme}, 'DetailPage')
        }}  
        onFavorite={(item, isFavorite) => {
          FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_popular)
        }}
      />
    )
  }
  genIndicator = () => {
    return this._store().hideLoadingMore || this._store().items.length < pageSize ? null :
      <View style={styles.indicatorContainer}>
        <ActivityIndicator 
          style={styles.indicator}
        />
        <Text>正在加载更多</Text>
      </View>
  }

  componentDidMount () {
    this.loadData();
    EventBus.getInstance().addListener(eventTypes.favorite_changed_popular, this.favoriteChangeListener = () => {
      this.isFavoriteChanged = true;
    });
    EventBus.getInstance().addListener(eventTypes.bottom_tab_select, this.bottomTabSelectListener = (data) => {
      if(data.to === 0 && this.isFavoriteChanged) {
        this.loadData(null, true);
      }
    })
  }

  componentWillUnmount () {
    EventBus.getInstance().removeListener(this.favoriteChangeListener);
    EventBus.getInstance().removeListener(this.bottomTabSelectListener);
  }
  render () {
    let store = this._store()
    const {theme} = this.props
    return (
      <View style={styles.container}>
        <FlatList
          data={store.projectModels}
          renderItem={data => this.renderItem(data)}
          keyExtractor={item => '' + item.item.id}
          refreshControl={
            <RefreshControl
              title={'Loading'}
              tintColor={theme.themeColor}
              colors={[theme.themeColor]}
              refreshing={store.isLoading}
              onRefresh={this.loadData}
              tintColor={theme.themeColor}
            />
          }
          ListFooterComponent={() => this.genIndicator()}
          onEndReached={() => {
            console.log('-------onEndReached---------')
            setTimeout(() => {//为了确保onMomentumScrollBegin先执行
              if (this.canLoadMore) {
                this.loadData(true)
                this.canLoadMore = false
              }
            }, 100)
          }}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={() => {//fix初始化滚动调用onEndReached的问题
            this.canLoadMore=true
            console.log('--------onMomentumScrollBegin----------')
          }}
        />
        <Toast
          ref={'toast'}
          position={'center'}
        />
      </View>
    )
  }
}

const mapStateToProps = state => ({
  popular: state.popular
})
const mapDispatchToProps = dispatch => ({
  onRefreshPopular: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onRefreshPopular(storeName, url, pageSize, favoriteDao)),
  onLoadMorePopular: (storeName, pageIndex, pageSize, items, favoriteDao, callBack) => dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, items, favoriteDao, callBack)),
  onFlushPopularFavorite: (storeName, pageIndex, pageSize, items, favoriteDao) => dispatch(actions.onFlushPopularFavorite(storeName, pageIndex, pageSize, items, favoriteDao)),
})

const PopularTabPage =  connect(mapStateToProps, mapDispatchToProps)(PopularTab)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
  },
  tabStyle: {
    minWidth: 50, // 会导致tabStyle初次加载时闪烁
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: 'white'
  },
  labelStyle: {
    fontSize: 13,
    marginTop: 6,
    marginBottom: 6,
  },
  indicatorContainer: {
    alignItems: 'center'
  },
  indicator: {
    color: 'red',
    margin: 10
  }
})