import React, {Component} from 'react';
import {DeviceInfo, StyleSheet, View} from 'react-native';
import {WebView} from 'react-native-webview';

import NavigationBar from '../common/navigation-bar';
import ViewUtil from '../util/view-util';
import NavigationUtil from '../navigator/navigation-util';
import BackPressComponent from '../common/back-press-component';
//import SafeAreaViewPlus from '../common/SafeAreaViewPlus';
import GlobalStyles from '../res/styles/global-styles';

const THEME_COLOR = '#678'

export default class WebViewPage extends Component {
    constructor(props) {
      super(props);
      this.params = this.props.navigation.state.params;
      const {title, url} = this.params;
      this.state = {
        title: title,
        url: url,
        canGoBack: false,
      };
      this.backPress = new BackPressComponent({backPress: () => this.onBackPress()});
    }

    componentDidMount() {
      this.backPress.componentDidMount();
    }

    componentWillUnmount() {
      this.backPress.componentWillUnmount();
    }

    onBackPress() {
      this.onBack();
      return true;
    }

    onBack() {
      if (this.state.canGoBack) {
        this.webView.goBack();
      } else {
        NavigationUtil.goBack(this.props.navigation);
      }
    }

    onNavigationStateChange(navState) {
      this.setState({
        canGoBack: navState.canGoBack,
        url: navState.url,
      });
    }

    render() {
      const {theme} = this.params;
      let navigationBar = <NavigationBar
        title={this.state.title}
        style={{backgroundColor: THEME_COLOR}}
        leftButton={ViewUtil.getLeftBackButton(() => this.onBackPress())}
      />;

      return (
        <View
          style={styles.container}
        >
          {navigationBar}
          <WebView
            ref={webView => this.webView = webView}
            startInLoadingState={true}
            onNavigationStateChange={e => this.onNavigationStateChange(e)}
            source={{uri: this.state.url}}
          />
        </View>
      );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0,
    },
});