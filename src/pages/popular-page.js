import React, {Component} from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator
} from 'react-native'
import {createMaterialTopTabNavigator} from 'react-navigation-tabs'
import {createAppContainer} from 'react-navigation'
import {connect} from 'react-redux'
import Toast from 'react-native-easy-toast'

import NavigationUtil from '../navigator/navigation-util'
import actions from '../action'
import PopularItem from '../common/popular-item'

const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'
const THEME_COLOR = 'red'

export default class PopularPage extends Component {
  constructor (props) {
    super(props);
    this.tabNames = ['Java', 'Android', 'IOS', 'Python', 'JS']
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
    const TabNavigator = createAppContainer(createMaterialTopTabNavigator(
      this._genTabs(),
      {
        tabBarOptions: {
          tabStyle: styles.tabStyle,
          upperCaseLabel: false,
          scrollEnabled: true,
          style: {
            backgroundColor: '#a67',
          },
          indicatorStyle: styles.indicatorStyle,
          labelStyle: styles.labelStyle,
        }
      }
    ))
    return (
      <View style={styles.container}>
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
    if (!store) {
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

        }}  
      />
    )
  }
  genIndicator = () => {
    return this._store().hideLoadingMore ? null :
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