/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-22 22:50:24
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-03-22 22:50:35
 */
/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-04 00:51:29
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-03-12 21:31:34
 */
import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import PaymentIndex from '../../screens/Payment/PaymentIndex';
import Pay from '../../screens/Payment/Pay';
import AddBalance from '../../screens/Payment/AddBalance';
import DefaultAppbar from '../../components/Appbar/DefaultAppbar';

const Stack = createStackNavigator();

export default function PaymentStack() {
    return (
        <Stack.Navigator
        screenOptions={{
            header: (props) => <DefaultAppbar {...props} />
        }} >
            <Stack.Screen name="PaymentIndex" component={PaymentIndex}
                initialParams={{ screenTitle: 'Ödeme', screenDescription: 'Yaptığınız Ödemeler' }}
            />
            <Stack.Screen name="Pay" component={Pay}
                initialParams={{ screenTitle: 'Ödeme Yap', screenDescription: 'Güvenle ödemenizi yapın.' }}
            />
            <Stack.Screen name="AddBalance" component={AddBalance}
                initialParams={{ screenTitle: 'Bakiye Yükleme', screenDescription: 'Hesabınıza bakiye yükleyin.' }}
            />
        </Stack.Navigator>
    );
}