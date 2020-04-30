import {createAppContainer, createSwitchNavigator} from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack'

import WelcomePage from '../pages/welcome-page'
import HomePage from '../pages/home-page'
import DetailPage from '../pages/detail-page'
import FetchDemoPage from '../pages/fetch-demo-page'
import DataStoreDemoPage from '../pages/data-store-demo-page'

const InitNavigator = createStackNavigator(
  {
    WelcomePage: {
      screen: WelcomePage,
      navigationOptions: {
        header: null, //隐藏头部
      },
    }
  }
)

const MainNavigator = createStackNavigator(
  {
    HomePage: {
      screen: HomePage,
      navigationOptions: {
        header: null, //隐藏头部
      },
    },
    DetailPage: {
      screen: DetailPage,
      navigationOptions: {
        headerShown: false,
      }
    },
    FetchDemoPage: {
      screen: FetchDemoPage,
    },
    DataStoreDemoPage: {
      screen: DataStoreDemoPage,
    }
  }
)

export default createAppContainer(createSwitchNavigator(
  {
    Init: InitNavigator,
    Main: MainNavigator,
  },
  {
    navigationOptions: {
      header: null,
    }
  }
))