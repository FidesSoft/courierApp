/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-01 03:31:45
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-04-03 13:45:22
 */
import React, { Component } from 'react';
import { Image, View, StyleSheet, ScrollView, Text, Alert } from 'react-native';
import { Button, Appbar, TextInput, Snackbar, HelperText } from 'react-native-paper';
import { observer } from 'mobx-react';
import AuthStore from '../../store/AuthStore';
import * as yup from 'yup'
import { Formik } from 'formik'

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
          <Formik
            initialValues={{
              email: '',
              password: ''
            }}
            onSubmit={values => AuthStore.login(values)}
            validationSchema={yup.object().shape({
              email: yup
                .string('Geçersiz karakterler içeriyor.')
                .email('Geçersiz email formatı.')
                .required('Bu alan mutlaka gerekiyor.'),
              password: yup
                .string()
                // .min(4)
                // .max(10, 'Password should not excced 10 chars.')
                .required('Bu alan mutlaka gerekiyor.'),
            })}
          >
            {({ values, handleChange, errors, setFieldTouched, touched, isSubmitting, handleSubmit }) => (
              <View>
                <TextInput style={styles.input}
                  value={values.email}
                  label="Email"
                  mode="outlined"
                  onChangeText={handleChange('email')}
                  onBlur={() => setFieldTouched('email')}
                  autoCapitalize="none" />
                {((touched.email && errors.email) || (AuthStore.errors.email)) && <HelperText type="error" visible style={styles.helper}>
                  {AuthStore.errors.email ?? AuthStore.errors.email} 
                  {errors.email ?? errors.email}
                </HelperText>}

                <TextInput style={styles.input}
                  value={values.password}
                  label="Şifre"
                  mode="outlined"
                  autoCapitalize="none"
                  onChangeText={handleChange('password')}
                  onBlur={() => setFieldTouched('password')}
                  secureTextEntry={true} />
               {((touched.password && errors.password) || (AuthStore.errors.password)) && <HelperText type="error" visible style={styles.helper}>
                  {AuthStore.errors.password ?? AuthStore.errors.password} 
                  {errors.password ?? errors.password}
                </HelperText>}

                <View style={{ flex: 1, alignItems: 'center' }}>
                  {AuthStore.errors.notapproved && <HelperText type="error" visible style={styles.helper}>
                    {AuthStore.errors.notapproved}
                  </HelperText>}
                  <View style={{ flexDirection: "row" }}>
                    <View style={styles.button}>
                      <Button icon="account-check" loading={isSubmitting} mode="contained" onPress={handleSubmit}>Gİrİş</Button>
                    </View>
                    <View style={styles.button}>
                      <Button icon="account-plus" mode="contained" onPress={() => this.props.navigation.navigate('Register')}>Yenİ ÜYelİK</Button>
                    </View>
                  </View>
                  <Button icon="login" onPress={() => this.props.navigation.navigate('ResetPassword')}>Şİfremİ unuttum</Button>
                </View>
              </View>
            )}
          </Formik>
        </ScrollView>
        <Snackbar visible={AuthStore.loginSnackbar} onDismiss={() => AuthStore.onDismissLoginSnackbar()}
          duration={2000} action={{ label: 'Gizle', onPress: () => { AuthStore.onDismissLoginSnackbar() } }}>
          Giriş yapılamadı.</Snackbar>
        <Snackbar visible={AuthStore.logutSnackbar} onDismiss={() => AuthStore.onDismissLogutSnackbar()}
          duration={2000} action={{ label: 'Gizle', onPress: () => { AuthStore.onDismissLogutSnackbar() } }}>
          Başarıyla çıkış yaptınız.</Snackbar>
        <Snackbar visible={AuthStore.registerSuccessSnackbar} onDismiss={() => AuthStore.onDismissRegisterSuccessSnackbar()}
          duration={4000} action={{ label: 'Gizle', onPress: () => { AuthStore.onDismissRegisterSuccessSnackbar() } }}>
          Başarıyla üye oldunuz. Üyeliğiniz onaylandıktan sonra giriş yapabilirsiniz.</Snackbar>
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
