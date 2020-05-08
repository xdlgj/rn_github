import {createAppContainer, createSwitchNavigator} from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack'

import WelcomePage from '../pages/welcome-page'
import HomePage from '../pages/home-page'
import DetailPage from '../pages/detail-page'
import WebViewPage from '../pages/web-view-page'
import AboutPage from '../pages/about/about-page'
import AboutMePage from '../pages/about/about-me-page'
import CustomKeyPage from '../pages/custom-key-page'

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
    WebViewPage: {
      screen: WebViewPage,
      navigationOptions: {
        headerShown: false,
      }
    },
    AboutPage: {
      screen: AboutPage,
      navigationOptions: {
        headerShown: false,
      }
    },
    AboutMePage: {
      screen: AboutMePage,
      navigationOptions: {
        headerShown: false,
      }
    },
    CustomKeyPage: {
      screen: CustomKeyPage,
      navigationOptions: {
        headerShown: false,
      }
    },
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