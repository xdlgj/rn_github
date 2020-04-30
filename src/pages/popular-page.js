import React, {Component} from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native'
import {createMaterialTopTabNavigator} from 'react-navigation-tabs'
import {createAppContainer} from 'react-navigation'
import {connect} from 'react-redux'
import Toast from 'react-native-easy-toast'

import NavigationUtil from '../navigator/navigation-util'
import actions from '../action'
import PopularItem from '../common/popular-item'
import NavigationBar from '../common/navigation-bar'

const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'
const THEME_COLOR = '#678'

export default class PopularPage extends Component {
  constructor (props) {
    super(props);
    this.tabNames = ['Java', 'Android', 'IOS', 'Python', 'JS', 'java111111']
  }
  _genTabs(){
    const tabs = {};
    this.tabNames.forEach((item, index) => {
      tabs[`tab${index}`] = {
        screen: props => <PopularTabPage {...props} tabLabel={item}/>,
        navigationOptions: {
          title: item,
        },
      };
    });
    return tabs;
  }
  render () {
    let statusBar = {
      backgroundColor: THEME_COLOR
    }
    let navigationBar = <NavigationBar 
        title={'最热'}
        statusBar={statusBar}
        style={{backgroundColor: THEME_COLOR}}

      />
    const TabNavigator = createAppContainer(createMaterialTopTabNavigator(
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
        }
      }
    ))
    return (
      <View style={styles.container}>
        {navigationBar}
        <TabNavigator />
      </View>
    )
  }
}

const pageSize = 10
class PopularTab extends Component{
  constructor(props) {
    super(props);
    const {tabLabel} = this.props;
    this.storeName = tabLabel;
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
  loadData = (loadMore) => {
    const {onRefreshPopular, onLoadMorePopular} = this.props;
    const store = this._store();
    const url = this.genFetchUrl(this.storeName);
    if (loadMore) {
      onLoadMorePopular(this.storeName, ++store.pageIndex, pageSize, store.items, callBack => {
        this.refs.toast.show('没有更多了');
      })
    } else {
      onRefreshPopular(this.storeName, url, pageSize)
    }
  }

  renderItem = (data) => {
    const item = data.item
    return (
      <PopularItem 
        item={item}
        onSelect={() => {
          NavigationUtil.goPage({projectModel: item}, 'DetailPage')
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
  }
  render () {
    let store = this._store()
    return (
      <View style={styles.container}>
        <FlatList
          data={store.projectModes}
          renderItem={data => this.renderItem(data)}
          keyExtractor={item => '' + item.id}
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
  popular: state.popular
})
const mapDispatchToProps = dispatch => ({
  onRefreshPopular: (storeName, url, pageSize) => dispatch(actions.onRefreshPopular(storeName, url, pageSize)),
  onLoadMorePopular: (storeName, pageIndex, pageSize, items, callBack) => dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, items, callBack))
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