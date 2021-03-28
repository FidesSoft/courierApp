/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-28 19:58:06
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-03-28 20:36:30
 */
/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-04 21:42:54
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-03-13 11:55:37
 */
import React, { Component } from "react";
import { Image, View, ScrollView } from 'react-native';
import { ActivityIndicator, Appbar, } from 'react-native-paper';

class LoadingScreen extends Component {
  render(props) {
    return (
        <View style={{ flex: 1, alignItems: 'stretch' }}>
        <Appbar.Header style={{ backgroundColor: '#F5A10D' }}>
          <Image
            style={{ width: 200, height: 50 }}
            source={require('../../assets/images/logo.png')}
            resizeMode='contain'
          />
          <Appbar.Content
            title=""
            subtitle=""
          />
          <Appbar.Content
            color="#139740"
            title=""
            subtitle="Yükleniyor"
          />
        </Appbar.Header>
        <View style={{flex:1, justifyContent: "center" }}>
        <ActivityIndicator size="large" animating={true} color="#F59F0B" />
        </View>
      </View>
    );
  }
}

export default LoadingScreen;
