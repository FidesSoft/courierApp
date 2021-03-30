/*
* @Author: @vedatbozkurt
* @Date:   2020-05-08 18:37:36
* @Last Modified by:   @vedatbozkurt
* @Last Modified time: 2020-05-08 19:57:28
*/
import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, Linking } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from "react-native-image-picker"

import { Button, Appbar, TextInput, Checkbox, HelperText, Snackbar, Avatar } from 'react-native-paper';
import { observer } from 'mobx-react';
import AuthStore from '../../store/AuthStore';

@observer
class RegisterScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cities: [],
      districts: [],
    };
  }
  componentDidMount() {
    AuthStore.errors = {};
    AuthStore.email = '';
    AuthStore.password = '';
    AuthStore.name = '';
    AuthStore.tcno = '';
    AuthStore.courier_city = '';
    AuthStore.courier_districts = '';
    AuthStore.imagePath = '';
    AuthStore.sozlesme = false;
    AuthStore.password_confirmation = '';
    AuthStore.loading = false;
    this.getCities();
  }
  componentWillUnmount() {
    AuthStore.errors = {};
    AuthStore.email = '';
    AuthStore.password = '';
    AuthStore.name = '';
    AuthStore.tcno = '';
    AuthStore.courier_city = '';
    AuthStore.courier_districts = '';
    AuthStore.imagePath = '';
    AuthStore.sozlesme = false;
    AuthStore.password_confirmation = '';
    AuthStore.loading = false;
  }

  getCities = async () => {
    let uri = `${global.apiUrl}/get-cities/`;
    await axios.get(uri, {
      headers: {
        'Accept': 'application/json',
      }
    })
      .then((response) => {
        this.setState({ cities: response.data });
      })
      .catch(error => {
        if (error.response.status == 401) {
          AuthStore.token = null;
          AuthStore.storeToken('');
        }
      });
  }

  getDistrictsAfterSelectedCity = async (itemValue) => {
    AuthStore.handleCityId(itemValue);
    AuthStore.handleDistrictId('');
    this.getDistricts(itemValue);
  }

  getDistricts = async (itemValue) => {
    let uri = `${global.apiUrl}/get-city-districts/${itemValue}`;
    await axios.get(uri, {
      headers: {
        'Accept': 'application/json',
      }
    })
      .then((response) => {
        this.setState({ districts: response.data });
      })
      .catch(error => {
        if (error.response.status == 401) {
          AuthStore.token = null;
          AuthStore.storeToken('');
        }
      });
  }
 


  imageGalleryLaunch = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        includeBase64: true,
        path: 'images',
      },
    };

    ImagePicker.launchImageLibrary(options, (res) => {
      // console.log('Response = ', res);
      if (res.didCancel) {
        console.log('User cancelled image picker');
      } else if (res.error) {
        console.log('ImagePicker Error: ', res.error);
      } else if (res.customButton) {
        console.log('User tapped custom button: ', res.customButton);
        alert(res.customButton);
      } else {
        const source = { uri: res.uri };
        // console.log('response', JSON.stringify(res));
        AuthStore.imagePath = res;
      }
    });
  }


  render() {
    let allCities = this.state.cities.map((city) => {
      return (
        <Picker.Item label={city.name} value={city.id} key={city.id} />
      )
    });
    let allDistricts = this.state.districts.map((district) => {
      return (
        <Picker.Item label={district.name} value={district.id} key={district.id} />
      )
    });
    return (
      <View style={{ flex: 1, alignItems: 'stretch', backgroundColor: '#F5FCFF' }}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => this.props.navigation.goBack()} />
          <Appbar.Content
            title="Yeni Üyelik"
            subtitle="Üye olmak için formu eksiksiz doldurun."
          />
        </Appbar.Header>
        <ScrollView>
          <View style={{ flex: 1, alignItems: 'center', margin: 15 }}>

            {AuthStore.imagePath.uri &&
              <Avatar.Image style={{ margin: 10 }} size={100} source={{ uri: AuthStore.imagePath.uri }} />}

            {!AuthStore.imagePath.uri &&
              <Avatar.Icon style={{ margin: 10 }} size={100} icon="file-image" />}

            {AuthStore.errors.image && <HelperText type="error" visible style={styles.helper}>
              {AuthStore.errors.image}
            </HelperText>}

            <Button icon="camera" mode="contained" onPress={this.imageGalleryLaunch}>Fotograf Ekle</Button>
          </View>
          <View style={{
            flexDirection: 'row',
            alignItems: 'flex-start'
          }}>
            <View style={{ width: '50%' }}>
            <View style={{ flex: 1, marginTop: 15, marginLeft: 15, marginRight: 15, backgroundColor: "white", borderColor: "#F59F0B", borderWidth: 1 }}>
                <Picker
                  selectedValue={AuthStore.courier_city}
                  onValueChange={(itemValue) =>
                    this.getDistrictsAfterSelectedCity(itemValue)
                  }>
                  <Picker.Item label="İl Seç" value="" />
                  {allCities}
                </Picker>
              </View>
              {AuthStore.errors.courier_city && <HelperText type="error" visible style={styles.helper}>
                {AuthStore.errors.courier_city}
              </HelperText>}
            </View>
            <View style={{ width: '50%' }}>
            <View style={{ flex: 1, marginTop: 15, marginLeft: 15, marginRight: 15, backgroundColor: "white", borderColor: "#F59F0B", borderWidth: 1 }}>
                <Picker                  
                  selectedValue={AuthStore.courier_districts}
                  onValueChange={(itemValue) =>
                    AuthStore.handleDistrictId(itemValue)
                  }>
                  <Picker.Item label="İlçe Seç" value="" />
                  {allDistricts}
                </Picker>
              </View>
              {AuthStore.errors.courier_districts && <HelperText type="error" visible style={styles.helper}>
                {AuthStore.errors.courier_districts}
              </HelperText>}
            </View>
          </View>

          <TextInput style={styles.input}
            label="TC No"
            mode="outlined"
            onChangeText={text => AuthStore.handleTcNo(text)}
            autoCapitalize="none" />
          {AuthStore.errors.tcno && <HelperText type="error" visible style={styles.helper}>
            {AuthStore.errors.tcno}
          </HelperText>}

          <TextInput style={styles.input}
            label="Adınız"
            mode="outlined"
            onChangeText={text => AuthStore.handleName(text)}
            autoCapitalize="none" />
          {AuthStore.errors.name && <HelperText type="error" visible style={styles.helper}>
            {AuthStore.errors.name}
          </HelperText>}

          <TextInput style={styles.input}
            label="Email"
            mode="outlined"
            keyboardType="email-address"
            onChangeText={text => AuthStore.handleEmail(text)}
            autoCapitalize="none" />
          {AuthStore.errors.email && <HelperText type="error" visible style={styles.helper}>
            {AuthStore.errors.email}
          </HelperText>}

          <TextInput style={styles.input}
            label="Telefon"
            mode="outlined"
            onChangeText={text => AuthStore.handlePhone(text)}
            autoCapitalize="none" />
          {AuthStore.errors.phone && <HelperText type="error" visible style={styles.helper}>
            {AuthStore.errors.phone}
          </HelperText>}

          <TextInput style={styles.input}
            label="Şifre"
            mode="outlined"
            autoCapitalize="none"
            onChangeText={text => AuthStore.handlePassword(text)}
            secureTextEntry={true} />
          {AuthStore.errors.password && <HelperText type="error" style={styles.helper}>
            {AuthStore.errors.password}
          </HelperText>}

          <TextInput style={styles.input}
            label="Şifre Onaylama"
            mode="outlined"
            autoCapitalize="none"
            onChangeText={text => AuthStore.handlePasswordC(text)}
            secureTextEntry={true} />
          <View style={{ flex: 1, margin: 10 }}>
            <View style={{ flexDirection: "row" }}>
              <Checkbox
                color="#139740"
                status={AuthStore.sozlesme ? 'checked' : 'unchecked'}
                onPress={() => {
                  AuthStore.handleSozlesme(!AuthStore.sozlesme);
                }}
              />
              <View style={{ flexDirection: "column", justifyContent: 'center' }}>
                <Text> '
                <Text
                    style={styles.hyperlinkStyle}
                    onPress={() => {
                      Linking.openURL(`${global.url}/privacy-policy`);
                    }}>
                    Gizlilik Sözleşmesi
              </Text>
              ' ve '
              <Text
                    style={styles.hyperlinkStyle}
                    onPress={() => {
                      Linking.openURL(`${global.url}/contract`);
                    }}>
                    Kullanıcı Sözleşmesi
              </Text>
              'ni okudum ve kabul ediyorum.
                </Text>
              </View>
            </View>
          </View>

          <View style={{ flex: 1, alignItems: 'center' }}>
            <View style={{ flexDirection: "row" }}>
              <View style={styles.button}>
                <Button icon="account-plus" loading={AuthStore.loading} mode="contained" onPress={() => AuthStore.register(this.props.navigation)}>KAYDET</Button>
              </View>
              <View style={styles.button}>
                <Button icon="account-check" mode="contained" onPress={() => this.props.navigation.navigate('Login')}>Giriş</Button>
              </View>
            </View>
          </View>
        </ScrollView>
        <Snackbar visible={AuthStore.registerSnackbar} onDismiss={() => AuthStore.onDismissRegisterSnackbar()}
          duration={2000} action={{ label: 'Gizle', onPress: () => { AuthStore.onDismissRegisterSnackbar() } }}>
          Sözleşmeleri kabul etmelisiniz.</Snackbar>
      </View>
    );
  }
}

export default RegisterScreen;
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
  hyperlinkStyle: {
    color: 'blue',
  },
});
