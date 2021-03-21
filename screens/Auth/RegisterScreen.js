/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-21 13:27:34
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-03-21 13:27:56
 */
import React, { Component } from "react";
import { Button, Text, View } from "react-native";

class RegisterScreen extends Component {
  
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
          I am , and I am RegisterScreen!
        </Text>
      </View>
    );
  }
}

export default RegisterScreen;