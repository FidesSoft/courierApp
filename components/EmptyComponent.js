/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-10 15:37:49
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-03-18 20:58:17
 */
import React from "react";
import { View, Text } from "react-native";

const EmptyComponent = () => {
    return (
        <View style={{ flex: 1 }}>
            <Text style={{textAlign: "center"}}>Henüz kayıt bulunmuyor!</Text>
        </View>
        );
}

export default EmptyComponent;