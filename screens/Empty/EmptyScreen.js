/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-04 21:42:54
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-03-13 11:55:37
 */
import React, { Component } from "react";
import { Button, Text, View } from "react-native";

class Empty extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
        payments: '',
        selectedStatus: '',
        page: 1,
        fetchingFromServer: false,
        isListEnd: false,
    };
}

componentDidMount() {
    // this.getPayments();
}

  render(props) {
    return (
      <View>
        <Text>
          I am , and I am!
        </Text>
      </View>
    );
  }
}

export default Empty;
