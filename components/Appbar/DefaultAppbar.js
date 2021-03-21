/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-04 21:48:16
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-03-04 22:18:03
 */
import React from 'react';
import { Appbar } from 'react-native-paper';
import {useRoute} from '@react-navigation/native';

export default function DefaultAppbar(props) {
    const route = useRoute();
    return (
        <Appbar.Header>
        <Appbar.BackAction onPress={() => props.navigation.goBack()} />
        <Appbar.Content
        title={route.params.screenTitle}
        subtitle={route.params.screenDescription}
        />
        </Appbar.Header>
  );
}