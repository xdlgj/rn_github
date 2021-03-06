import React, {Component} from 'react'
import {FlatList, RefreshControl, StyleSheet, View} from 'react-native'
import {connect} from 'react-redux'
import {createAppContainer} from 'react-navigation'
import {createMaterialTopTabNavigator} from 'react-navigation-tabs'
import EventBus from 'react-native-event-bus'
import Toast from 'react-native-easy-toast'

import actions from '../action/index'
import NavigationUtil from '../navigator/navigation-util'
import PopularItem from '../common/popular-item'
import NavigationBar from '../common/navigation-bar'
import FavoriteDao from '../expand/dao/favorite-dao'
import {FLAG_STORAGE} from '../expand/dao/data-store'
import FavoriteUtil from '../util/favorite-util'
import TrendingItem from '../common/trending-item'
import EventTypes from '../util/event-types'


class FavoritePage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {theme} = this.props;
    let statusBar = {
      backgroundColor: theme.themeColor,
      barStyle: 'light-content',
    };
    let navigationBar = <NavigationBar
      title={'收藏'}
      statusBar={statusBar}
      style={{backgroundColor: theme.themeColor}}
    />;
    const TabNavigator = createAppContainer(createMaterialTopTabNavigator(
      {
        'Popular': {
          screen: props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_popular} theme={theme}/>,//初始化Component时携带默认参数 @https://github.com/react-navigation/react-navigation/issues/2392
          navigationOptions: {
            title: '最热',
          },
        },
        'Trending': {
          screen: props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_trending} theme={theme}/>,//初始化Component时携带默认参数 @https://github.com/react-navigation/react-navigation/issues/2392
          navigationOptions: {
            title: '趋势',
          },
        },
      }, 
      {
        tabBarOptions: {
          tabStyle: styles.tabStyle,
          upperCaseLabel: false,//是否使标签大写，默认为true
          style: {
            backgroundColor: theme.themeColor,//TabBar 的背景颜色
            // 移除以适配react-navigation4x
            // height: 30,//fix 开启scrollEnabled后再Android上初次加载时闪烁问题
          },
          indicatorStyle: styles.indicatorStyle,//标签指示器的样式
          labelStyle: styles.labelStyle,//文字的样式
        },
      },
    ));
    return (
      <View style={styles.container}>
        {navigationBar}
        <TabNavigator/>
      </View>
    ) 
  }
}

const mapFavoriteStateToProps = state => ({
  theme: state.theme.theme,
});
//注意：connect只是个function，并不应定非要放在export后面
export default connect(mapFavoriteStateToProps)(FavoritePage);

class FavoriteTab extends Component {
  constructor(props) {
    super(props);
    const {flag} = this.props;
    this.storeName = flag;
    this.favoriteDao = new FavoriteDao(flag);
  }

  componentDidMount() {
    this.loadData(true);
    EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.listener = data => {
      if (data.to === 2) {
        this.loadData(false);
      }
    });
  }

  componentWillUnmount() {
    EventBus.getInstance().removeListener(this.listener);
  }

  loadData(isShowLoading) {
    const {onLoadFavoriteData} = this.props;
    onLoadFavoriteData(this.storeName, isShowLoading);
  }

  /**
   * 获取与当前页面有关的数据
   * @returns {*}
   * @private
   */
  _store() {
    const {favorite} = this.props;
    let store = favorite[this.storeName];
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModels: [],//要显示的数据
      };
    }
    return store;
  }

  onFavorite(item, isFavorite) {
    FavoriteUtil.onFavorite(this.favoriteDao, item, isFavorite, this.props.flag);
    if (this.storeName === FLAG_STORAGE.flag_popular) {
      EventBus.getInstance().fireEvent(EventTypes.favorite_changed_popular);
    } else {
      EventBus.getInstance().fireEvent(EventTypes.favoriteChanged_trending);
    }
  }

  renderItem(data) {
    const {theme} = this.props;
    const item = data.item;
    const Item = this.storeName === FLAG_STORAGE.flag_popular ? PopularItem : TrendingItem;
    return (
      <Item
        theme={theme}
        projectModel={item}
        onSelect={(callback) => {
          NavigationUtil.goPage({
            theme,
            projectModel: item,
            flag: this.storeName,
            callback,
          }, 'DetailPage');
        }}
        onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
      />
    )
  }

  render() {
    let store = this._store();
    const {theme} = this.props;
    return (
      <View style={styles.container}>
        <FlatList
          data={store.projectModels}
          renderItem={data => this.renderItem(data)}
          keyExtractor={item => '' + (item.item.id || item.item.fullName)}
          refreshControl={
              <RefreshControl
                title={'Loading'}
                titleColor={theme.themeColor}
                colors={[theme.themeColor]}
                refreshing={store.isLoading}
                onRefresh={() => this.loadData(true)}
                tintColor={theme.themeColor}
              />
            }
        />
        <Toast ref={'toast'}
          position={'center'}
        />
      </View>
    );
  }
}


const mapStateToProps = state => ({
  favorite: state.favorite,
});

const mapDispatchToProps = dispatch => ({
  //将 dispatch(onRefreshPopular(storeName, url))绑定到props
  onLoadFavoriteData: (storeName, isShowLoading) => dispatch(actions.onLoadFavoriteData(storeName, isShowLoading)),
});

//注意：connect只是个function，并不应定非要放在export后面
const FavoriteTabPage = connect(mapStateToProps, mapDispatchToProps)(FavoriteTab);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabStyle: {
    // minWidth: 50 //fix minWidth会导致tabStyle初次加载时闪烁
    padding: 0,
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: 'white',
  },
  labelStyle: {
    fontSize: 13,
    margin: 0,
  },
  indicatorContainer: {
    alignItems: 'center',
  },
  indicator: {
    color: 'red',
    margin: 10,
  },
});