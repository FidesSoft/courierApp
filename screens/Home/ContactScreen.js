/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-22 18:45:08
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-03-22 19:00:02
 */
import React, { Component } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, HelperText, Snackbar } from 'react-native-paper';
import { observer } from 'mobx-react';
import ContactStore from '../../store/ContactStore';

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
          <TextInput style={styles.input}
            label="Konu"
            mode="outlined"
            onChangeText={text => ContactStore.handleSubject(text)}
            autoCapitalize="none" />
          {ContactStore.errors.subject && <HelperText type="error" visible style={styles.helper}>
            {ContactStore.errors.subject}
          </HelperText>}

          <TextInput style={styles.input}
            label="Mesaj"
            mode="outlined"
            multiline={true}
            onChangeText={text => ContactStore.handleMessage(text)}
            autoCapitalize="none" />
          {ContactStore.errors.message && <HelperText type="error" visible style={styles.helper}>
            {ContactStore.errors.message}
          </HelperText>}

          <View style={styles.button}>
            <Button icon="send" loading={ContactStore.loading} mode="contained" onPress={() => ContactStore.sendMessage(this.props.navigation)}>Gönder</Button>
          </View>
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