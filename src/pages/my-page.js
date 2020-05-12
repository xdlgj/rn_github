import React, {Component} from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import {connect} from 'react-redux'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'

import actions from '../action'
import NavigationUtil from '../navigator/navigation-util'
import NavigationBar from '../common/navigation-bar'
import { MORE_MENU } from '../common/more-menu'
import GlobalStyles from '../res/styles/global-styles'
import ViewUtil from '../util/view-util'
import {FLAG_LANGUAGE} from '../expand/dao/language-dao'


class MyPage extends Component {

  getLeftButton = (callBack) => {
    return (
      <TouchableOpacity
        style={{padding: 8, paddingLeft: 12}}
        onPress={callBack}
      >
        <Ionicons
          name={'ios-arrow-back'}
          size={26}
          style={{color: 'white'}}
        />
      </TouchableOpacity>
    )

  }

  onClick = (menu) => {
    const {theme} = this.props
    let RouteName, params = {theme}
    switch (menu) {
      case (MORE_MENU.Tutorial):
        RouteName = 'WebViewPage'
        params.title = '教程'
        params.url = 'https://coding.m.imooc.com/classindex.html?cid=304';
        break;
      case (MORE_MENU.About):
        RouteName = 'AboutPage'
        break
      case (MORE_MENU.About_Author):
        RouteName = 'AboutMePage'
        break
      case MORE_MENU.Custom_Key:
      case MORE_MENU.Custom_Language:
      case MORE_MENU.Remove_Key:
        RouteName = 'CustomKeyPage';
        params.isRemoveKey = menu === MORE_MENU.Remove_Key;
        params.flag = menu !== MORE_MENU.Custom_Language ? FLAG_LANGUAGE.flag_key : FLAG_LANGUAGE.flag_language;
        break;
      case (MORE_MENU.Sort_Key):
      case (MORE_MENU.Sort_Language):
        RouteName = 'SortPage'
        params.flag = menu !== MORE_MENU.Sort_Key ? FLAG_LANGUAGE.flag_language : FLAG_LANGUAGE.flag_key
        break
      case MORE_MENU.Custom_Theme:
        const {onShowCustomThemeView} = this.props;
        onShowCustomThemeView(true);
        break
    }
    if (RouteName) {
      NavigationUtil.goPage(params, RouteName)
    }

  }

  getItem = (menu) => {
    return ViewUtil.getMenuItem(() => {this.onClick(menu)}, menu, this.props.theme.themeColor)
  }

  render () {
    const {theme} = this.props
    let statusBar = {
      backgroundColor: theme.themeColor
    }
    let navigationBar = <NavigationBar
        title={'我的'}
        statusBar={statusBar}
        style={{backgroundColor: theme.themeColor}}
        leftButton={this.getLeftButton()}
      />
    return (
      <View style={GlobalStyles.rootContainer}>
        {navigationBar}
        <ScrollView>
          <TouchableOpacity
            onPress={() => {this.onClick(MORE_MENU.About)}}
            style={styles.item}
          >
            <View style={styles.aboutLeft}>
              <Ionicons
                name={MORE_MENU.About.icon}
                size={40}
                style={{marginRight: 10, color: theme.themeColor}}
              />
              <Text>GitHub Popular</Text>
            </View>
            <Ionicons
                name={'ios-arrow-forward'}
                size={16}
                style={{marginRight: 10, alignSelf: 'center', color: theme.themeColor}}
              />
          </TouchableOpacity>
          <View style={GlobalStyles.line}/>
          {this.getItem(MORE_MENU.Tutorial)}
          {/*趋势管理*/}
          <Text style={styles.groupTitle}>趋势管理</Text>
          {/*自定义语言*/}
          {this.getItem(MORE_MENU.Custom_Language)}
          {/*语言排序*/}
          <View style={GlobalStyles.line}/>
          {this.getItem(MORE_MENU.Sort_Language)}

          {/*最热管理*/}
          <Text style={styles.groupTitle}>最热管理</Text>
          {/*自定义标签*/}
          {this.getItem(MORE_MENU.Custom_Key)}
          {/*标签排序*/}
          <View style={GlobalStyles.line}/>
          {this.getItem(MORE_MENU.Sort_Key)}
          {/*标签移除*/}
          <View style={GlobalStyles.line}/>
          {this.getItem(MORE_MENU.Remove_Key)}

          {/*设置*/}
          <Text style={styles.groupTitle}>设置</Text>
          {/*自定义主题*/}
          {this.getItem(MORE_MENU.Custom_Theme)}
          {/*关于作者*/}
          <View style={GlobalStyles.line}/>
          {this.getItem(MORE_MENU.About_Author)}
          <View style={GlobalStyles.line}/>
          {/*反馈*/}
          {this.getItem(MORE_MENU.Feedback)}
          <View style={GlobalStyles.line}/>
          {this.getItem(MORE_MENU.CodePush)}
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    padding: 10,
    height: 90,
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  aboutLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  groupTitle: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 5,
    fontSize: 12,
    color: 'gray',
  }
})

const mapStateToProps = state => ({
  theme: state.theme.theme,
});

const mapDispatchToProps = dispatch => ({
  onShowCustomThemeView: (show) => dispatch(actions.onShowCustomThemeView(show)),
});

//注意：connect只是个function，并不应定非要放在export后面
export default connect(mapStateToProps, mapDispatchToProps)(MyPage);