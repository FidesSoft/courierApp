/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-21 13:29:51
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-03-30 23:46:27
 */
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

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
  global.url = 'https://4022ffbb4a9e.ngrok.io';
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