import {BackHandler} from 'react-native';

/**
 * Android物理回退键处理
 */
export default class BackPressComponent {
    constructor(props) {
      //this._hardwareBackPress = this.onHardwareBackPress.bind(this); //作用就是将onHardwareBackPress中的this指向BackPressComponent的this
      //this._hardwareBackPress = this.onHardwareBackPress
      this.props = props;
    }

    componentDidMount() {
      if (this.props.backPress) {
        BackHandler.addEventListener('hardwareBackPress', this.onHardwareBackPress);
      }
    }

    componentWillUnmount() {
      if (this.props.backPress) {
        BackHandler.removeEventListener('hardwareBackPress', this.onHardwareBackPress);
      }
    }

    onHardwareBackPress = () =>  {
      return this.props.backPress();
    }
}