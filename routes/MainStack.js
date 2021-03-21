/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-21 13:18:12
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-03-21 13:20:03
 */
import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// not auth
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import ResetPasswordScreen from '../screens/Auth/ResetPasswordScreen';
// auth
import UserTab from './auth/UserTab';


const Stack = createStackNavigator();

export default class MainStack extends Component  {
     constructor(props) {
        super(props);
        this.state = {
            token: '',
        };
      }
  render() {
     return (
    <Stack.Navigator 
    // initialRouteName="Home"
    screenOptions={{
        headerShown: false,
    }}>
    {this.state.token !== '' ? (
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
    </Stack.Navigator>
    );
}
}


