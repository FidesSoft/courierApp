/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-01 03:31:45
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-03-21 13:48:05
 */
import React, { Component } from 'react';
import { Image, View, StyleSheet, ScrollView } from 'react-native';
import { Button, Appbar, TextInput, Snackbar, HelperText } from 'react-native-paper';
import { observer } from 'mobx-react';
import AuthStore from '../../store/AuthStore';

@observer
class LoginScreen extends Component {
  componentWillUnmount() {
    AuthStore.errors = {};
    AuthStore.email = '';
    AuthStore.password = '';
  }
  componentDidMount() {
    AuthStore.errors = {};
    AuthStore.email = '';
    AuthStore.password = '';
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'stretch' }}>
        <Appbar.Header style={{ backgroundColor: '#F5A10D' }}>
          <Image
            style={{ width: 200, height: 50 }}
            source={require('../../assets/images/logo.png')}
            resizeMode='contain'
          />
          <Appbar.Content
            title=""
            subtitle=""
          />
          <Appbar.Content
            color="#139740"
            title="Giriş"
            subtitle=""
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

          <TextInput style={styles.input}
            label="Şifre"
            mode="outlined"
            autoCapitalize="none"
            onChangeText={text => AuthStore.handlePassword(text)}
            secureTextEntry={true} />
          <View style={{ flex: 1, alignItems: 'center' }}>
            <View style={{ flexDirection: "row" }}>
              <View style={styles.button}>
                <Button icon="account-check" loading={AuthStore.loading} mode="contained" onPress={() => AuthStore.login()}>Gİrİş</Button>
              </View>
              <View style={styles.button}>
                <Button icon="account-plus" mode="contained" onPress={() => this.props.navigation.navigate('Register')}>Yenİ ÜYelİK</Button>
              </View>
            </View>
            <Button icon="login" onPress={() => this.props.navigation.navigate('ResetPassword')}>Şİfremİ unuttum</Button>
          </View>
        </ScrollView>
        <Snackbar visible={AuthStore.loginSnackbar} onDismiss={() => AuthStore.onDismissLoginSnackbar()}
          duration={2000} action={{ label: 'Gizle', onPress: () => { AuthStore.onDismissLoginSnackbar() } }}>
          Giriş yapılamadı.</Snackbar>
        <Snackbar visible={AuthStore.logutSnackbar} onDismiss={() => AuthStore.onDismissLogutSnackbar()}
          duration={2000} action={{ label: 'Gizle', onPress: () => { AuthStore.onDismissLogutSnackbar() } }}>
          Başarıyla çıkış yaptınız.</Snackbar>
      </View>
    );
  }
}

export default LoginScreen;

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