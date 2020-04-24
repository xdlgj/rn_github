import React, {Component} from 'react'
import {Provider} from 'react-redux'
import AppNavigation from './navigator/app-navigatiors'

import store from './store'

export default class App extends Component {
    render() {
        return(
            /**
             * 3.将store传递给App框架
             */
            <Provider store= {store}>
                <AppNavigation />
            </Provider>
        )
    }
}