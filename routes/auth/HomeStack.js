/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-21 13:21:49
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-03-21 13:25:46
 */
import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
// auth
import HomeAppbar from '../../components/Appbar/HomeAppbar';
import HomeScreen from '../../screens/Home/HomeScreen';
import Empty from '../../screens/Home/Empty';

const Stack = createStackNavigator();

export default function HomeStack() {
    return (
        <Stack.Navigator
        screenOptions={{
            header: (props) => <HomeAppbar {...props} />
        }} >
            <Stack.Screen name="Home" component={HomeScreen} 
            initialParams={{ screenTitle: 'Gönderiler', screenDescription: 'Gönderileriniz' }}
            />
            <Stack.Screen name="Empty" component={Empty}
                initialParams={{ screenTitle: 'Empty', screenDescription: 'Empty Burada Yer Alacak' }}
            />
        </Stack.Navigator>
    );
}