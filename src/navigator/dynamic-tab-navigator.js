import React, {Component} from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import {createAppContainer} from 'react-navigation'
import {createBottomTabNavigator, BottomTabBar} from 'react-navigation-tabs'
import {connect} from 'react-redux'
import EventBus from 'react-native-event-bus'

import PopularPage from '../pages/popular-page'
import TrendingPage from '../pages/trending-page'
import FavoritePage from '../pages/favorite-page'
import MyPage from '../pages/my-page'
import EventTypes from '../util/event-types'


const TABS = { //在这里配置页面的路由
  PopularPage: {
    screen: PopularPage,
    navigationOptions: {
      tabBarLabel: "最热",
      tabBarIcon: ({tintColor, focused}) => (
        <MaterialIcons
          name={'whatshot'}
          size={26}
          style={{color: tintColor}}
        />
      )
    }
  },
  TrendingPage: {
    screen: TrendingPage,
    navigationOptions: {
      tabBarLabel: "趋势",
      tabBarIcon: ({tintColor, focused}) => (
        <Ionicons
          name={'md-trending-up'}
          size={26}
          style={{color: tintColor}}
        />
      )
    }
  },
  FavoritePage: {
    screen: FavoritePage,
    navigationOptions: {
      tabBarLabel: "收藏",
      tabBarIcon: ({tintColor, focused}) => (
        <MaterialIcons
          name={'favorite'}
          size={26}
          style={{color: tintColor}}
        />
      )
    }
  },
  MyPage: {
    screen: MyPage,
    navigationOptions: {
      tabBarLabel: "我的",
      tabBarIcon: ({tintColor, focused}) => (
        <Entypo
          name={'user'}
          size={26}
          style={{color: tintColor}}
        />
      )
    }
  }
}

class DynamicTabNavigator extends Component {
  constructor(props) {
    super(props)
    console.disableYellowBox = true //关闭黄色警告弹框
  }
  _tabNavigator() {
    if (this.Tabs) {
      return this.Tabs
    }
    const {PopularPage, TrendingPage, FavoritePage, MyPage} = TABS;
    const tabs = {PopularPage, TrendingPage, FavoritePage, MyPage};
    PopularPage.navigationOptions.tabBarLabel = '最热'; //动态修改Tab属性
    return this.Tabs = createAppContainer(createBottomTabNavigator(
        tabs,
        {
          tabBarComponent: props => {
            return <TabBarComponent theme={this.props.theme} {...props} />
          },
        }
    ));
  };

  render () {
    const TabNavigator = this._tabNavigator();
    return (
      <TabNavigator
        onNavigationStateChange={(prevState, newState, action) => {
          EventBus.getInstance().fireEvent(EventTypes.bottom_tab_select, { //发送底部tab切换的事件
            from: prevState.index,
            to: newState.index
          })
        }}
      />
    )
  }
}

class TabBarComponent extends Component {
  render () {
    return (
      <BottomTabBar 
        {...this.props}
        activeTintColor={this.props.theme}
      />
    )
  }
}
const mapStateToProps = state => ({
  theme: state.theme.theme
})

export default  connect(mapStateToProps)(DynamicTabNavigator)