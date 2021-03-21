/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-21 13:20:44
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-03-21 13:43:46
 */
import * as React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeStack from './HomeStack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

const Tab = createMaterialBottomTabNavigator();

export default function UserTab() {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            activeColor="#F59F0B"
            labelStyle={{ fontSize: 14 }}
            inactiveColor="#ffe77aff"
            barStyle={{ backgroundColor: '#139740'}}
        >
            <Tab.Screen name="Home" component={HomeStack}
                options={{
                    tabBarLabel: 'Gönderiler',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="apps-outline" color={color} size={26} />
                    ),
                }}
            />
            {/* <Tab.Screen name="Home" component={HomeStack}
                options={{
                    tabBarLabel: 'Home2',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="people-outline" color={color} size={26} />
                    ),
                }} /> */}
        </Tab.Navigator>
    );
}