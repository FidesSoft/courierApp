/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-21 13:28:25
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-03-21 13:28:41
 */
import React, { Component } from "react";
import { Button, Text, View } from "react-native";

class ResetPasswordScreen extends Component {
  
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
          I am , and I am ResetPasswordScreen!
        </Text>
      </View>
    );
  }
}

export default ResetPasswordScreen;