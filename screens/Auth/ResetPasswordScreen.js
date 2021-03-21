/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-01 18:31:21
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-03-21 14:04:21
 */
import React, { Component } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Appbar, TextInput, Snackbar, HelperText } from 'react-native-paper';
import { observer } from 'mobx-react';
import AuthStore from '../../store/AuthStore';

@observer
class ResetPasswordScreen extends Component {
  componentDidMount() {
    AuthStore.errors = {};
    AuthStore.email = '';
    AuthStore.password = '';
  }
  componentWillUnmount() {
    AuthStore.errors = {};
    AuthStore.email = '';
    AuthStore.password = '';
  }
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'stretch', backgroundColor: '#F5FCFF' }}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => this.props.navigation.goBack()} />
          <Appbar.Content
            title="Şifremi Unuttum"
            subtitle="Lütfen mail adresinizi girin."
          />
        </Appbar.Header>
        <ScrollView>
          <TextInput style={styles.input}
            label="Email"
            mode="outlined"
            onChangeText={text => AuthStore.handleEmail(text)}
            autoCapitalize="none" />

          {AuthStore.errors.email && <HelperText type="error" visible style={styles.helper}>
            {AuthStore.errors.email}
          </HelperText>}

          <View style={{ flex: 1, alignItems: 'center' }}>
            <View style={{ flexDirection: "row" }}>
              <View style={styles.button}>
                <Button icon="account-check" loading={AuthStore.loading} mode="contained" onPress={() => AuthStore.resetPassword()}>Şifremi Yenİle</Button>
              </View>
            </View>
          </View>
        </ScrollView>
        <Snackbar visible={AuthStore.resetPaswordSnackbar} onDismiss={() => AuthStore.onDismissResetPaswordSnackbar()}
          duration={2000} action={{ label: 'Gizle', onPress: () => { AuthStore.onDismissResetPaswordSnackbar() } }}>
          Şifre yenileme işlemleri için mail kutunuzu kontrol ediniz.</Snackbar>
      </View>
    );
  }
}

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  input: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 15,

  },
  button: {
    margin: 15,
  },
  helper: {
    marginLeft: 5,
  },
});