import  React, {Component} from 'react'
import { 
  View, 
  Text,
  ViewPropTypes, 
  StatusBar, 
  StyleSheet, 
  Platform
} from 'react-native'
import PropTypes from 'prop-types'

const NAV_BAR_HEIGHT_IOS = 44 //导航栏在IOS中的高度
const NAVBAR_HEIGHT_ANDROID = 50 //导航栏在android中的高低
const STATUS_BAR_HEIGHT = 20 //状态栏中的高度
const StatusBarShape = {
  barStyle: PropTypes.oneOf(['light-content', 'default']),
  hidden: PropTypes.bool,
  backgroundColor: PropTypes.string,
}
export default class NavigationBar extends Component {
  //提供属性的类型检查
  static propTypes = {
    style: ViewPropTypes.style,
    title: PropTypes.string,
    titleView: PropTypes.element,
    titleLayoutStyle: ViewPropTypes.style,
    hide: PropTypes.bool,
    statusBar: PropTypes.shape(StatusBarShape),
    rightButton: PropTypes.element,
    leftButton: PropTypes.element,
  }
  // 设置默认属性
  static defaultProps = {
    statusBar: {
      barStyle: 'light-content',
      hidden: false,
    }
  }

  getButtonElement = (data) => {
    return (
      <View style={styles.navBarButton}>
        {data ? data : null}
      </View>
    )
  }
  render () {
    //状态栏
    let statusBar = !this.props.statusBar.hidden ? 
      <View style={styles.statusBar}>
        <StatusBar {...this.props.statusBar} />
      </View> : null;
    let titleView = this.props.titleView ? this.props.titleView :
      <Text ellipsizeMode='tail' numberOfLines={1} style={styles.title}>{this.props.title}</Text>
    //导航栏
    let content = this.props.hide ? null :
      <View style={styles.navBar}>
        {this.getButtonElement(this.props.leftButton)}
        <View style={[styles.navBarTitleContainer, this.props.titleLayoutStyle]}>{titleView}</View>
        {this.getButtonElement(this.props.rightButton)}
      </View>
    return (
      <View style={[styles.container, this.props.style]}>
        {statusBar}
        {content}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  statusBar: {
    height: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT : 0,
  },
  title: {
    fontSize: 20,
    color: 'white',
  }, 
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: Platform.OS === 'ios' ? NAV_BAR_HEIGHT_IOS : NAVBAR_HEIGHT_ANDROID
  },
  navBarTitleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 40,
    right: 40,
    top: 0,
    bottom: 0,
  },
  container: {
    backgroundColor: '#2196f3',
  },
  navBarButton: {
    alignItems: 'center',
  },
})