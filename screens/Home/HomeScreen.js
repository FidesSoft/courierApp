/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-21 13:24:54
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-03-21 13:25:09
 */
import React, { Component } from "react";
import { Button, Text, View } from "react-native";

class HomeScreen extends Component {
  
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
          I am , and I am HomeScreen!
        </Text>
      </View>
    );
  }
}

export default HomeScreen;
