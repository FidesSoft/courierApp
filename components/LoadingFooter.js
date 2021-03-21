/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-10 15:30:09
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-03-10 15:49:52
 */
import React from "react";
import { View } from "react-native";
import { ActivityIndicator } from 'react-native-paper';

const LoadingFooter = (props) => {
  return (
    <View>
        {props.show ? (<ActivityIndicator animating={true} color='#F6A712' size='100' />) : null}
    </View>
);
}

export default LoadingFooter;