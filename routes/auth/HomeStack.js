/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-21 13:21:49
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-03-21 13:22:12
 */
import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
// auth
import HomeAppbar from '../../components/Appbar/HomeAppbar';
import HomeScreen from '../../screens/Home/HomeScreen';
import TaskDetails from '../../screens/Task/TaskDetails';
import TaskCreate from '../../screens/Task/TaskCreate';
import TaskPayment from '../../screens/Task/TaskPayment';
import TaskPaymentHavale from '../../screens/Task/TaskPaymentHavale';
import CourierTrack from '../../screens/Task/CourierTrack';
import Rating from '../../screens/Task/Rating';
import Approve from '../../screens/Task/Approve';
import DetailsScreen from '../../screens/Home/DetailsScreen';
import ProfileScreen from '../../screens/Home/ProfileScreen';
import ContactScreen from '../../screens/Home/ContactScreen';

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
            <Stack.Screen name="Details" component={DetailsScreen}
                initialParams={{ screenTitle: 'Detaylar', screenDescription: 'Detaylar Burada Yer Alacak' }}
            />
        </Stack.Navigator>
    );
}