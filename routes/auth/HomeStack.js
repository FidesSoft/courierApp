/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-21 13:21:49
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-04-03 13:54:23
 */
import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
// auth
import HomeAppbar from '../../components/Appbar/HomeAppbar';
import HomeScreen from '../../screens/Home/HomeScreen';
import ProfileScreen from '../../screens/Home/ProfileScreen';
import ContactScreen from '../../screens/Home/ContactScreen';
import TaskDetails from '../../screens/Task/TaskDetails';

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

            <Stack.Screen name="Profile" component={ProfileScreen}
                initialParams={{ screenTitle: 'Profil', screenDescription: 'Profilinizi düzenleyin.' }}
            />

            <Stack.Screen name="Contact" component={ContactScreen}
                initialParams={{ screenTitle: 'İletişim', screenDescription: 'Bizimle bir konu hakkında iletişime geçin.' }}
            />

            <Stack.Screen name="TaskDetails" component={TaskDetails}
                initialParams={{ screenTitle: 'Gönderi Detayı', screenDescription: 'Gönderi hakkında tüm detaylar.' }}
            />
        </Stack.Navigator>
    );
}