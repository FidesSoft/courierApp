/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-30 23:46:16
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-03-30 23:46:17
 */
/**
 * @format
 */

import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import App from './App';
// import SplashScreen from 'react-native-splash-screen'

export default function Main() {
  useEffect(() => { //tek sefer çalışır
    // SplashScreen.hide();
    // console.log('hoop screeeeen')
  }, []);
  return (
      <App />
  );
}

AppRegistry.registerComponent(appName, () => Main);