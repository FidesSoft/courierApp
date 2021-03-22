/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-12 13:20:00
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-03-15 16:11:09
 */
import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import AuthStore from '../../store/AuthStore';

class Pay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pay_id: '',
    };
}
//   componentDidMount() {
    
// }
  
    webview = null;
    render() {
      let pay_id = Date.parse(this.props.route.params.item.created_at) / 1000+'2'+this.props.route.params.item.id;

        return <WebView 
        ref={(ref) => (this.webview = ref)}
        source={{
            uri: `${global.apiUrl}/payment/${pay_id}`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${AuthStore.token}`
            }
            }}
        onNavigationStateChange={this.handleWebViewNavigationStateChange}
        />;
      }
      handleWebViewNavigationStateChange = (newNavState) => {
        // newNavState looks something like this:
        // {
        //   url?: string;
        //   title?: string;
        //   loading?: boolean;
        //   canGoBack?: boolean;
        //   canGoForward?: boolean;
        // }
        const { url } = newNavState;
        if (!url) return;
    
        // one way to handle a successful form submit is via query strings
        if (url.includes('?status=success')) {
          this.webview.stopLoading();
          // maybe close this view?
          this.props.navigation.navigate('PaymentIndex', { refreshData: true, success: true })
        }
    
        // one way to handle errors is via query string
        if (url.includes('?status=unsuccess')) {
          this.webview.stopLoading();
          this.props.navigation.navigate('PaymentIndex', { refreshData: true, error: true })
        }
    
        // // redirect somewhere else
        // if (url.includes('google.com')) {
        //   const newURL = 'https://reactnative.dev/';
        //   const redirectTo = 'window.location = "' + newURL + '"';
        //   this.webview.injectJavaScript(redirectTo);
        // }
      };
}
export default Pay;
