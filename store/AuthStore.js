/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-21 13:46:19
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-03-26 14:23:38
 */
import { observable, action } from 'mobx';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthStore {
  @observable isCourierAcceptTask = false;
  @observable isCourierAcceptTaskId = '';
  @observable email = '';
  @observable password = '';
  @observable password_confirmation = '';
  @observable name = '';
  @observable phone = '';
  @observable tcno = '';
  @observable imagePath = '';
  @observable courier_city = '';
  @observable courier_districts = '';
  @observable vehicle = '';
  @observable plate = '';
  @observable color = '';
  @observable birth_date = new Date();
  @observable current_image = null;
  @observable on_duty = false;
  @observable sozlesme = false;
  @observable token = null;
  @observable loginSnackbar = false;
  @observable logutSnackbar = false;
  @observable registerSnackbar = false;
  @observable resetPaswordSnackbar = false;
  @observable updateProfileSnackbar = false;
  @observable registerSuccessSnackbar = false;
  @observable loading = false;
  @observable errors = {};

  @observable menu = false;

  @action _openMenu() { this.menu = true; }
  @action _closeMenu() { this.menu = false; }

  @action handleIsCourierAcceptTask(text) { this.isCourierAcceptTask = text; }
  @action handleIsCourierAcceptTaskId(text) { this.isCourierAcceptTaskId = text; }
  @action handleName(text) { this.name = text; }
  @action handleTcNo(text) { this.tcno = text; }
  @action handleCityId(text) { this.courier_city = text; }
  @action handleDistrictId(text) { this.courier_districts = text; }
  @action handleEmail(text) { this.email = text; }
  @action handlePhone(text) { this.phone = text; }
  @action handlePassword(text) { this.password = text; }
  @action handlePasswordC(text) { this.password_confirmation = text; }
  @action handlePlate(text) { this.plate = text; }
  @action handleColor(text) { this.color = text; }
  @action handleVehicle(text) { this.vehicle = text; }
  @action handleBirthDate(text) { this.birth_date = text; }
  @action handleSozlesme() { this.sozlesme = !this.sozlesme; }
  @action handleOnDuty() { this.on_duty = !this.on_duty; console.log(this.on_duty) }

  @action onDismissLoginSnackbar() { this.loginSnackbar = false; }
  @action onDismissLogutSnackbar() { this.logutSnackbar = false; }
  @action onDismissRegisterSnackbar() { this.registerSnackbar = false; }
  @action onDismissRegisterSuccessSnackbar() { this.registerSuccessSnackbar = false; }
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

  @action async register(navi) {
    this.loading = true;
    if (this.sozlesme) {
      let formData = new FormData();
      formData.append('tcno', this.tcno);
      formData.append('email', this.email);
      formData.append('name', this.name);
      formData.append('phone', this.phone);
      formData.append('courier_city', this.courier_city);
      formData.append('courier_districts', this.courier_districts);
      formData.append('password', this.password);
      formData.append('password_confirmation', this.password_confirmation);
      if (this.imagePath != '') {
        formData.append("image", {
          name: this.imagePath.fileName,
          type: this.imagePath.type,
          uri:
            Platform.OS === "android" ? this.imagePath.uri : this.imagePath.uri.replace("file://", "")
        });
      }
      let uri = `${global.apiUrl}/register`;
      await axios.post(uri, formData, { headers: { "Accept": "application/json" } })
        .then((response) => {
          // this.token = response.data.data.token;
          // this.storeToken(this.token);
          global.googleApiKey = response.data.data.googleApiKey;
          this.registerSuccessSnackbar = true;
          navi.navigate('Login');
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
        console.log(response.data.district[0].id)
        this.name = response.data.name;
        this.email = response.data.email;
        this.phone = response.data.phone;
        this.tcno = response.data.tc;
        this.vehicle = response.data.vehicle;
        this.plate = response.data.plate;
        this.color = response.data.color;
        this.on_duty = response.data.on_duty;
        this.birth_date = response.data.birth_date;
        this.current_image = response.data.image;
        this.courier_city = response.data.city[0].id;
        this.courier_districts = response.data.district[0].id;
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
    formData.append('tcno', this.tcno);
    formData.append('email', this.email);
    formData.append('name', this.name);
    formData.append('phone', this.phone);
    formData.append('vehicle', this.vehicle);
    formData.append('plate', this.plate);
    formData.append('color', this.color);
    formData.append('on_duty', this.on_duty);
    formData.append('birth_date', this.birth_date);
    formData.append('courier_city', this.courier_city);
    formData.append('courier_districts', this.courier_districts);
    if (this.imagePath != '') {
      formData.append("photo", {
        name: this.imagePath.fileName,
        type: this.imagePath.type,
        uri:
          Platform.OS === "android" ? this.imagePath.uri : this.imagePath.uri.replace("file://", "")
      });
    }
    if (this.password) { formData.append('password', this.password); }
    let uri = `${global.apiUrl}/profile`;
    await axios.post(uri, formData, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.token}`,
      }
    })
      .then((response) => {
        this.updateProfileSnackbar = true;
      })
      .catch(error => {
        console.log('hata')
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

  @action async isThereCourierTask() {
    console.log('check-courier-task istegi gönderildi')
    let uri = `${global.apiUrl}/check-courier-task`;
    await axios.get(uri, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.token}`
      }
    })
      .then((response) => {
        if (response.data.task) {
          // console.log('devam eden gönderi var')
          this.isCourierAcceptTaskId = response.data.task.id;
          this.isCourierAcceptTask = true;
        } else {
          // console.log('devam eden gönderi yok')
          this.isCourierAcceptTaskId = '';
          this.isCourierAcceptTask = false;
        }
      })
      .catch(error => {
        if (error.response.status == 401) {
          this.token = null;
          this.storeToken('');
        }
      });
  }

  @action updateCourierLatLng(position) {
    let formData = new FormData();
    formData.append('latitude', position.coords.latitude);
    formData.append('longitude', position.coords.longitude);

    let uri = `${global.apiUrl}/update-lat-lng`;
    axios.post(uri, formData, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.token}`
      }
    })
      .then((response) => {
        console.log(response.data);
      })
      .catch(error => {
        if (error.response.status == 401) {
          this.token = null;
          this.storeToken('');
        }
      });
  }

  @action addLatLngToCourierTracking(position) {
    let formData = new FormData();
    formData.append('task_id', this.isCourierAcceptTaskId);
    formData.append('latitude', position.coords.latitude);
    formData.append('longitude', position.coords.longitude);

    let uri = `${global.apiUrl}/save-courier-tracking`;
    axios.post(uri, formData, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.token}`
      }
    })
      .then((response) => {
        console.log(response.data);
      })
      .catch(error => {
        if (error.response.status == 401) {
          this.token = null;
          this.storeToken('');
        }
      });
  }

}
export default new AuthStore()