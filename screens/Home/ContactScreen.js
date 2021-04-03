/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-22 18:45:08
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-04-03 13:52:22
 */
import React, { Component } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, HelperText, Snackbar } from 'react-native-paper';
import { observer } from 'mobx-react';
import ContactStore from '../../store/ContactStore';
import * as yup from 'yup'
import { Formik } from 'formik'

@observer
class ContactScreen extends Component {
  componentDidMount() {
    ContactStore.errors = {};
    ContactStore.subject = '';
    ContactStore.message = '';
  }

  componentWillUnmount() {
    ContactStore.errors = {};
    ContactStore.subject = '';
    ContactStore.message = '';
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'stretch', backgroundColor: '#F5FCFF' }}>
        <ScrollView>
          <Formik
            initialValues={{
              subject: '',
              message: '',
            }}

            onSubmit={values => ContactStore.sendMessage(values)}
            validationSchema={yup.object().shape({
              subject: yup
                .string()
                .required('Bu alan mutlaka gerekiyor.'),
              message: yup
                .string()
                .required('Bu alan mutlaka gerekiyor.'),
            })}
          >
            {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit, isSubmitting }) => (
              <View>
                <TextInput style={styles.input}
                  label="Konu"
                  mode="outlined"
                  onChangeText={handleChange('subject')}
                  onBlur={() => setFieldTouched('subject')}
                  autoCapitalize="none" />
                {((touched.subject && errors.subject) || (ContactStore.errors.subject)) && <HelperText type="error" visible style={styles.helper}>
                  {ContactStore.errors.subject ?? ContactStore.errors.subject}
                  {errors.subject ?? errors.subject}
                </HelperText>}

                <TextInput style={styles.input}
                  label="Mesaj"
                  mode="outlined"
                  multiline={true}
                  onChangeText={handleChange('message')}
                  onBlur={() => setFieldTouched('message')}
                  autoCapitalize="none" />
                {((touched.message && errors.message) || (ContactStore.errors.message)) && <HelperText type="error" visible style={styles.helper}>
                  {ContactStore.errors.message ?? ContactStore.errors.message}
                  {errors.message ?? errors.message}
                </HelperText>}

                <View style={styles.button}>
                  <Button icon="send" loading={isSubmitting} onPress={handleSubmit} mode="contained">Gönder</Button>
                </View>
              </View>
            )}
          </Formik>
        </ScrollView>
        <Snackbar visible={ContactStore.contactSnackbar} onDismiss={() => ContactStore.onDismissContactSnackbar()}
          duration={2000} action={{ label: 'Gizle', onPress: () => { ContactStore.onDismissContactSnackbar() } }}>
          Mesajınız başarıyla gönderildi.</Snackbar>
      </View>

    );
  }
}

export default ContactScreen;

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
    marginLeft: 15,
    marginRight: 15,
    marginTop: 30,
  },
  helper: {
    marginLeft: 5,
  },
});