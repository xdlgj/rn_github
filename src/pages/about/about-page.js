import React, {Component} from 'react'
import {View, Linking} from 'react-native'

import NavigationUtil from '../../navigator/navigation-util'
import {MORE_MENU} from '../../common/more-menu'
import ViewUtil from '../../util/view-util'
import AboutCommon, {FLAG_ABOUT} from './about-common'
import config from '../../res/data/config'
import GlobalStyles from '../../res/styles/global-styles'

const THEME_COLOR = '#678'

export default class AboutPage extends Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    this.aboutCommon = new AboutCommon(
      {
        ...this.params,
        navigation: this.props.navigation,
        flagAbout: FLAG_ABOUT.flag_about,
      }, 
      data => this.setState({...data}),
    );
    this.state = {
      data: config,
    };
  }

  componentDidMount() {
    this.aboutCommon.componentDidMount();
  }

  componentWillUnmount() {
    this.aboutCommon.componentWillUnmount();
  }

  onClick(menu) {
    const {theme} = this.params;
    let RouteName, params = {theme};
    switch (menu) {
        case MORE_MENU.Tutorial:
            RouteName = 'WebViewPage';
            params.title = '教程';
            params.url = 'https://coding.m.imooc.com/classindex.html?cid=304';
            break;
        case MORE_MENU.About_Author:
            RouteName = 'AboutMePage';
            break;
        case MORE_MENU.Feedback:
            const url = 'mailto://crazycodeboy@gmail.com';
            Linking.canOpenURL(url)
                .then(support => {
                    if (!support) {
                        console.log('Can\'t handle url: ' + url);
                    } else {
                        Linking.openURL(url);
                    }
                }).catch(e => {
                console.error('An error occurred', e);
            });
            break;
    }
    if (RouteName) {
        NavigationUtil.goPage(params, RouteName);
    }
  }

  getItem(menu) {
    const {theme} = this.params;
    return ViewUtil.getMenuItem(() => this.onClick(menu), menu, THEME_COLOR);
  }

  render() {
    const content = <View>
        {this.getItem(MORE_MENU.Tutorial)}
        <View style={GlobalStyles.line}/>
        {this.getItem(MORE_MENU.About_Author)}
        <View style={GlobalStyles.line}/>
        {this.getItem(MORE_MENU.Feedback)}
    </View>;
    return this.aboutCommon.render(content, this.state.data.app);
  }
}
