/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-01 18:31:21
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-04-03 04:01:46
 */
import React, { Component } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Appbar, TextInput, Snackbar, HelperText } from 'react-native-paper';
import { observer } from 'mobx-react';
import AuthStore from '../../store/AuthStore';
import * as yup from 'yup'
import { Formik } from 'formik'

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
  
  submitForm(values) {
    AuthStore.handleEmail(values.email)
    AuthStore.resetPassword();
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
          <Formik
            initialValues={{
              email: '',
            }}

            onSubmit={values => AuthStore.resetPassword(values)}
            validationSchema={yup.object().shape({
              email: yup
                .string('Geçersiz karakterler içeriyor.')
                .email('Geçersiz email formatı.')
                .required('Bu alan mutlaka gerekiyor.'),
            })}
          >
            {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit, isSubmitting }) => (
              <View>
                <TextInput style={styles.input}
                  value={values.email}
                  label="Email"
                  mode="outlined"
                  onChangeText={handleChange('email')}
                  onBlur={() => setFieldTouched('email')}
                  autoCapitalize="none" />
                {touched.email && errors.email && <HelperText type="error" visible style={styles.helper}>
                  {errors.email}
                </HelperText>}
                
                {AuthStore.errors.email && <HelperText type="error" visible style={styles.helper}>
                  {AuthStore.errors.email}
                </HelperText>}

                <View style={{ flex: 1, alignItems: 'center' }}>
                  <View style={{ flexDirection: "row" }}>
                    <View style={styles.button}>
                      <Button icon="account-check" loading={isSubmitting}  disabled={!isValid} mode="contained" onPress={handleSubmit}>Şİfremİ Yenİle</Button>
                    </View>
                  </View>
                </View>

              </View>
            )}
          </Formik>
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