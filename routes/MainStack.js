/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-21 13:18:12
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-03-28 22:45:47
 */
import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {observer} from 'mobx-react';

//store files
import AuthStore from '../store/AuthStore';

import LoadingScreen from '../screens/Empty/LoadingScreen';

// not auth
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import ResetPasswordScreen from '../screens/Auth/ResetPasswordScreen';
// auth
import UserTab from './auth/UserTab';


const Stack = createStackNavigator();

@observer
export default class MainStack extends Component  {
     constructor(props) {
        super(props);
        AuthStore.getToken();
      }
  render() {
     return (
        <Stack.Navigator
        // initialRouteName="Home"
        screenOptions={{
            headerShown: false,
        }}>
        {AuthStore.loading_screen ? (
            <>
                <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
            </>
        ) : (
            <>
                {AuthStore.token !== null ? (
                    <>
                        <Stack.Screen name="UserTab" component={UserTab} />

                    </>
                ) : (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen}
                            initialParams={{ screenTitle: 'Yeni Üyelik', screenDescription: 'Üye olmak için formu eksiksiz doldurun.' }}
                        />
                        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen}
                            initialParams={{ screenTitle: 'Şifremi Unuttum', screenDescription: 'Lütfen mail adresinizi girin.' }}
                        />
                    </>
                )}
            </>
        )}
    </Stack.Navigator>
    );
}
}


