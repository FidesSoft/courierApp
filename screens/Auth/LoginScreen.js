/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-21 13:26:38
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-03-21 13:27:07
 */
import React, { Component } from "react";
import { Button, Text, View } from "react-native";

class LoginScreen extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
        payments: '',
    };
}

componentDidMount() {
    // this.getPayments();
}

  render(props) {
    return (
      <View>
        <Text>
          I am , and I am LoginScreen!
        </Text>
      </View>
    );
  }
}

export default LoginScreen;