/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-21 13:29:51
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-04-10 14:08:53
 */
import React, { useState, useEffect } from 'react';
import { Alert } from "react-native";

import { NavigationContainer } from '@react-navigation/native';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import messaging from '@react-native-firebase/messaging'; 

import MainStack from './routes/MainStack';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    // surface: '#F59F0B',
    primary: '#F59F0B',
    accent: '#139740',
    // text:'#139740',
    placeholder: '#eda324',
    // background:'#fffaf0',
  },
};


function App() {
  const [newTaskDialog, setNewTaskDialog] = useState(false);
  useEffect(async ()  => {
    await messaging().registerDeviceForRemoteMessages();
    await requestUserPermission();
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log(remoteMessage);
    });
    // console.log(await messaging().getToken())
    }, [])

    useEffect(() => {
      const unsubscribe = messaging().onMessage(async remoteMessage => {
        // alert(JSON.stringify(remoteMessage));
        Alert.alert(
          "Yeni Gönderi",
          "Size yakın yeni bir gönderi oluşturuldu. Lütfen sayfayı yenileyin.",
          [
            {
              text: "Kapat",
              // onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
          ]
        );
      });
      return unsubscribe;
    }, []);


    async function requestUserPermission() {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (enabled) {
        // console.log('Authorization status:', authStatus);
      }
  }

  global.url = 'https://c79123426f124.ngrok.io';
  global.apiUrl = `${global.url}/api/v1/courier`;
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <MainStack />
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;