/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-21 13:20:44
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-03-25 21:22:26
 */
import * as React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BackgroundTimer from 'react-native-background-timer';

import HomeStack from './HomeStack';
import IbanStack from './IbanStack';
import PaymentStack from './PaymentStack';

import AuthStore from '../../store/AuthStore';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

const Tab = createMaterialBottomTabNavigator();

export default function UserTab() {
    // BackgroundTimer.runBackgroundTimer(() => {
    //     //code that will be called every 3 seconds 
    //     console.log(AuthStore.token);
    // },
    //     5000);

    
    return (
        <Tab.Navigator
            initialRouteName="Home"
            activeColor="#F59F0B"
            labelStyle={{ fontSize: 14 }}
            inactiveColor="#ffe77aff"
            barStyle={{ backgroundColor: '#139740' }}
        >
            <Tab.Screen name="Home" component={HomeStack}
                options={{
                    tabBarLabel: 'Gönderiler',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="apps-outline" color={color} size={26} />
                    ),
                }}
            />

            <Tab.Screen name="Iban" component={IbanStack}
                options={{
                    tabBarLabel: 'Ibanlar',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="card-outline" color={color} size={26} />
                    ),
                }} />

            <Tab.Screen name="Payment" component={PaymentStack}
                options={{
                    tabBarLabel: 'Ödemeler',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="wallet-outline" color={color} size={26} />
                    ),
                }} />

        </Tab.Navigator>
    );
}