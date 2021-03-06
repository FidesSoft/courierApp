/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-22 20:01:08
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-03-22 20:07:45
 */
import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import IbanIndex from '../../screens/Iban/IbanIndex';
import IbanCreate from '../../screens/Iban/IbanCreate';
import IbanEdit from '../../screens/Iban/IbanEdit';
import DefaultAppbar from '../../components/Appbar/DefaultAppbar';

const Stack = createStackNavigator();

export default function IbanStack() {
    return (
        <Stack.Navigator
        screenOptions={{
            header: (props) => <DefaultAppbar {...props} />
        }} >
            <Stack.Screen name="IbanIndex" component={IbanIndex}
                initialParams={{ screenTitle: 'Iban Listesi', screenDescription: 'Hızlı ödeme için ibanlar ekleyin.' }}
            />
            <Stack.Screen name="IbanCreate" component={IbanCreate}
                initialParams={{ screenTitle: 'Yeni İban Ekle', screenDescription: '26 haneli iban numaranizi oluşturun.' }}
            />
            <Stack.Screen name="IbanEdit" component={IbanEdit}
                initialParams={{ screenTitle: 'İban Düzenle', screenDescription: 'İban numaranızı düzenleyin.' }}
            />
        </Stack.Navigator>
    );
}