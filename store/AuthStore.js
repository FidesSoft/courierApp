/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-21 13:46:19
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-03-21 13:46:19
 */
import { observable, action } from 'mobx';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthStore {
  @observable email = '';
  @observable password = '';
  @observable name = '';
  @observable phone = '';
  @observable current_image = null;
  @observable imagePath = '';
  @observable password_confirmation = '';
  @observable sozlesme = false;
  @observable token = null;
  @observable loginSnackbar = false;
  @observable logutSnackbar = false;
  @observable registerSnackbar = false;
  @observable resetPaswordSnackbar = false;
  @observable updateProfileSnackbar = false;
  @observable loading = false;
  @observable errors = {};

  @observable menu = false;

  @action _openMenu() { this.menu = true; }
  @action _closeMenu() { this.menu = false; }

  @action handleName(text) { this.name = text; }
  @action handleEmail(text) { this.email = text; }
  @action handlePhone(text) { this.phone = text; }
  @action handlePassword(text) { this.password = text; }
  @action handlePasswordC(text) { this.password_confirmation = text; }
  @action handleSozlesme() { this.sozlesme = !this.sozlesme; }

  @action onDismissLoginSnackbar() { this.loginSnackbar = false; }
  @action onDismissLogutSnackbar() { this.logutSnackbar = false; }
  @action onDismissRegisterSnackbar() { this.registerSnackbar = false; }
  @action onDismissResetPaswordSnackbar() { this.resetPaswordSnackbar = false; }
  @action onDismissUpdateProfileSnackbar() { this.updateProfileSnackbar = false; }

  @action logOut = async () => {
    let uri = `${global.apiUrl}/logout`;
    await axios.post(uri, '', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.token}`
      }
    })
      .then((response) => {
        this.logutSnackbar = true;
        this.removeToken();
        this.token = null;
      })
      .catch(error => {
        //productionda bunu sil
        this.removeToken();
        this.token = null;
      });
  }

  @action async login() {
    this.loading = true;
    let formData = new FormData();
    formData.append('email', this.email);
    formData.append('password', this.password);
    let uri = `${global.apiUrl}/login`;
    await axios.post(uri, formData)
      .then(async (response) => {
        this.token = response.data.data.token;
        this.storeToken(this.token);
        global.googleApiKey = response.data.data.googleApiKey;
        this.loginSnackbar = true;
      })
      .catch(error => {
        this.errors = error.response.data.errors;
        this.loginSnackbar = true;
      });
    this.loading = false;
  }

  @action async register() {
    this.loading = true;
    if (this.sozlesme) {
      let formData = new FormData();
      formData.append('email', this.email);
      formData.append('name', this.name);
      formData.append('password', this.password);
      formData.append('password_confirmation', this.password_confirmation);

      let uri = `${global.apiUrl}/register`;
      await axios.post(uri, formData, { headers: { "Accept": "application/json" } })
        .then((response) => {
          this.token = response.data.data.token;
          this.storeToken(this.token);
          global.googleApiKey = response.data.data.googleApiKey;
        })
        .catch(error => {
          this.errors = error.response.data.errors;
        });
    } else {
      this.registerSnackbar = true;
    }
    this.loading = false;
  }

  @action async getUser() {
    this.errors = '';
    this.loading = true; //loading iconu göster && uye bilgi formu
    let uri = `${global.apiUrl}/profile`;
    await axios.get(uri, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.token}`
      }
    })
      .then((response) => {
        this.name = response.data.name;
        this.email = response.data.email;
        this.phone = response.data.phone;
        this.current_image = response.data.image;
      })
      .catch(error => {
        if (error.response.status == 401) {
          this.token = null;
          this.storeToken('');
        }
        console.log('get user info failed');
      });
    this.loading = false;
  }

  @action async updateProfile() {
    this.loading = true;
    let formData = new FormData();
    formData.append('email', this.email);
    formData.append('name', this.name);
    formData.append('phone', this.phone);
    if (this.imagePath != '') {
      formData.append("photo", {
        name: this.imagePath.fileName,
        type: this.imagePath.type,
        uri:
          Platform.OS === "android" ? this.imagePath.uri : this.imagePath.uri.replace("file://", "")
      });
    }
    formData.append('_method', "put");
    if (this.password) { formData.append('password', this.password); }
    let uri = `${global.apiUrl}/profile`;
    await axios.post(uri, formData, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'multipart/form-data;'
      }
    })
      .then((response) => {
        this.updateProfileSnackbar = true;
      })
      .catch(error => {
        this.errors = error.response.data.errors;
      });
    this.loading = false;
  }

  @action async resetPassword() {
    this.loading = true;
    let formData = new FormData();
    formData.append('email', this.email);

    let uri = `${global.apiUrl}/reset-password`;
    await axios.post(uri, formData, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.token}`
      }
    })
      .then((response) => {
        this.email = '';
        this.errors = '';
        this.resetPaswordSnackbar = true;
      })
      .catch(error => {
        this.errors = error.response.data.errors;
      });
    this.loading = false;
  }


  @action async storeToken(token) {
    try {
      await AsyncStorage.setItem("@usertoken", token);
    } catch (error) {
      console.log("Something went wrong", error);
    }
  }

  @action async getToken() {
    try {
      this.token = await AsyncStorage.getItem("@usertoken");
      // console.log(this.token )
    } catch (error) {
      console.log("Something went wrong", error);
    }
  }

  @action async removeToken() {
    try {
      await AsyncStorage.removeItem("@usertoken");
    } catch (error) {
      console.log("Something went wrong", error);
    }
  }

}
export default new AuthStore()