import React, {Component} from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  DeviceEventEmitter,
} from 'react-native'
import {createMaterialTopTabNavigator} from 'react-navigation-tabs'
import {createAppContainer} from 'react-navigation'
import {connect} from 'react-redux'
import Toast from 'react-native-easy-toast'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import EventBus from 'react-native-event-bus'

import actions from '../action'
import TrendingItem from '../common/trending-item'
import NavigationBar from '../common/navigation-bar'
import TrendingDialog, {TimeSpans} from '../common/trending-dialog'
import NavigationUtil from '../navigator/navigation-util'
import { FLAG_STORAGE } from '../expand/dao/data-store'
import FavoriteDao from '../expand/dao/favorite-dao'
import FavoriteUtil from '../util/favorite-util'
import EventTypes from '../util/event-types'
import {FLAG_LANGUAGE} from '../expand/dao/language-dao'
import ArrayUtil from '../util/array-util'

const URL = 'https://github.com/trending/'
const THEME_COLOR = '#678'
const EVENT_TYPE_TIME_SPAN_CHANGE = 'EVENT_TYPE_TIME_SPAN_CHANGE'
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending)

class TrendingPage extends Component {
  debugger
  constructor (props) {
    super(props);
    const {onLoadLanguage} = this.props
    this.state = {
      timeSpan: TimeSpans[0],
    }
    onLoadLanguage(FLAG_LANGUAGE.flag_language)
    this.preKeys = []
  }
  _genTabs(){
    const tabs = {};
    const {keys} = this.props
    keys.forEach((item, index) => {
      if (item.checked) {
        tabs[`tab${index}`] = {
          screen: props => <TrendingTabPage {...props} tabLabel={item.name} timeSpan={this.state.timeSpan}/>,
          navigationOptions: {
            title: item.name,
          },
        };
      }
    });
    return tabs;
  }
  renderTitleView = () => {
    return (
      <View>
        <TouchableOpacity
          underlayColor='transparent'
          onPress={() => this.dialog.show()}
        >
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{
                fontSize: 18,
                color: '#FFFFFF',
                fontWeight: '400',
            }}>趋势 {this.state.timeSpan.showText}</Text>
            <MaterialIcons
              name={'arrow-drop-down'}
              size={22}
              style={{color: 'white'}}
            />
          </View>
        </TouchableOpacity>
      </View>
    )
  }
  onSelectTimespan = (tab) => {
    this.dialog.dimiss()
    this.setState({timeSpan: tab})
    DeviceEventEmitter.emit(EVENT_TYPE_TIME_SPAN_CHANGE, tab)
  }
  renderTrendingDialog = () => {
    return (
      <TrendingDialog
        ref={dialog => {this.dialog = dialog}}
        onSelect={tab => {this.onSelectTimespan(tab)}}
      />
    )
  }
  _tabNav = () => {
    if (!this.tabNav || !ArrayUtil.isEqual(this.preKeys, this.props.keys)) {//优化效率：根据需要选择是否重新创建建TabNavigator，通常tab改变后才重新创建
      this.tabNav = createAppContainer(createMaterialTopTabNavigator(
        this._genTabs(),
        {
          tabBarOptions: {
            tabStyle: styles.tabStyle,
            upperCaseLabel: false, //是否是标签大写，默认为true
            scrollEnabled: true, // 是否支持选项卡滚动， 默认为false
            style: {
              backgroundColor: '#a67', 
            },
            indicatorStyle: styles.indicatorStyle, //标签指示器样式
            labelStyle: styles.labelStyle, //文本样式
          },
          lazy: true
        }
      ))
    }
    return this.tabNav
  }
  render () {
    const {keys} = this.props
    let statusBar = {
      backgroundColor: THEME_COLOR
    }
    let navigationBar = <NavigationBar 
        titleView={this.renderTitleView()}
        statusBar={statusBar}
        style={{backgroundColor: THEME_COLOR}}

      />
    const TabNavigator = keys.length ? this._tabNav() : null
    return (
      <View style={styles.container}>
        {navigationBar}
        {TabNavigator && <TabNavigator />}
        {this.renderTrendingDialog()}
      </View>
    )
  }
}

const mapTrendingStateProps = state => ({
  keys: state.language.languages
})
const mapTrendingDispatchProps = dispatch => ({
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
})
export default connect(mapTrendingStateProps, mapTrendingDispatchProps)(TrendingPage)



const pageSize = 10
class TrendingTab extends Component{

  constructor(props) {
    super(props);
    const {tabLabel} = this.props;
    this.storeName = tabLabel;
    this.timeSpan = this.props.timeSpan
    this.isFavoriteChanged = false;
  }

  genFetchUrl = (key) => {
    return URL + (key === 'All' ? '' : key) + '?' + this.timeSpan.searchText;
  }
  /**
   * 获取和当前页面有关的数据
   */
  _store = () => {
    const {trending} = this.props;
    let store = trending[this.storeName]
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
  loadData = (loadMore, refreshFavorite) => {
    const {onRefreshTrending, onLoadMoreTrending, onFlushTrendingFavorite} = this.props;
    const store = this._store();
    const url = this.genFetchUrl(this.storeName);
    if (loadMore) {
      onLoadMoreTrending(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, callBack => {
        this.refs.toast.show('没有更多了');
      })
    } else if (refreshFavorite) {
      onFlushTrendingFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao);
      this.isFavoriteChanged = false;
    } else {
      onRefreshTrending(this.storeName, url, pageSize, favoriteDao)
    }
  }

  renderItem = (data) => {
    const item = data.item
    return (
      <TrendingItem 
        projectModel={item}
        onSelect={(callback) => {
          NavigationUtil.goPage({projectModel: item, flag: FLAG_STORAGE.flag_trending, callback}, 'DetailPage')
        }}  
        onFavorite={(item, isFavorite) => {
          FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_trending)
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
    this.timeSpanChangeListener = DeviceEventEmitter.addListener(EVENT_TYPE_TIME_SPAN_CHANGE, (timeSpan) => {
      this.timeSpan = timeSpan;
      this.loadData();
    });
    EventBus.getInstance().addListener(EventTypes.favoriteChanged_trending, this.favoriteChangeListener = () => {
      this.isFavoriteChanged = true;
    });
    EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.bottomTabSelectListener = (data) => {
        if (data.to === 1 && this.isFavoriteChanged) {
            this.loadData(null, true);
        }
    });
  }
  componentWillUnmount () {
    if (this.timeSpanChangeListener){
      this.timeSpanChangeListener.remove()
    }
    EventBus.getInstance().removeListener(this.favoriteChangeListener);
    EventBus.getInstance().removeListener(this.bottomTabSelectListener);
  }
  render () {
    let store = this._store()
    return (
      <View style={styles.container}>
        <FlatList
          data={store.projectModels}
          renderItem={data => this.renderItem(data)}
          keyExtractor={item => '' + (item.item.id || item.item.fullName)}
          refreshControl={
            <RefreshControl
              title={'Loading'}
              tintColor={THEME_COLOR}
              colors={[THEME_COLOR]}
              refreshing={store.isLoading}
              onRefresh={this.loadData}
              tintColor={THEME_COLOR}
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
  trending: state.trending
})
const mapDispatchToProps = dispatch => ({
  onRefreshTrending: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onRefreshTrending(storeName, url, pageSize, favoriteDao)),
  onLoadMoreTrending: (storeName, pageIndex, pageSize, items, favoriteDao, callBack) => dispatch(actions.onLoadMoreTrending(storeName, pageIndex, pageSize, items, favoriteDao, callBack)),
  onFlushTrendingFavorite: (storeName, pageIndex, pageSize, items, favoriteDao) => dispatch(actions.onFlushTrendingFavorite(storeName, pageIndex, pageSize, items, favoriteDao)),
})

const TrendingTabPage =  connect(mapStateToProps, mapDispatchToProps)(TrendingTab)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
  },
  tabStyle: {
    minWidth: 50,
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