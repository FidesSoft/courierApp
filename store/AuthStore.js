/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-21 13:46:19
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-04-20 14:59:30
 */
import { observable, action } from 'mobx';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen'

class AuthStore {
  @observable cities = [];
  @observable districts = [];
  @observable loading_screen = true;
  @observable isCourierAcceptTask = false;
  @observable isCourierAcceptTaskId = '';
  @observable email = '';
  @observable password = '';
  @observable password_confirmation = '';
  @observable name = '';
  @observable phone = '';
  @observable tcno = '';
  @observable imagePath = '';
  @observable courier_city = [];
  @observable courier_districts = [];
  @observable vehicle = '';
  @observable plate = '';
  @observable color = '';
  @observable balance = '';
  @observable birth_date = new Date('2021-01-01');
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
  @action handleBirthDate(date) { this.birth_date = date }
  @action handleSozlesme() { this.sozlesme = !this.sozlesme; }
  @action handleOnDuty() { this.on_duty == 1 ? this.on_duty = 0 : this.on_duty = 1}

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
        // productionda bunu sil
        // this.removeToken();
        // this.token = null;
      });
  }

  @action async login(values) {
    let formData = new FormData();
    formData.append('email', values.email);
    formData.append('password', values.password);
    let uri = `${global.apiUrl}/login`;
    await axios.post(uri, formData)
      .then(async (response) => {
        this.token = response.data.data.token;
        this.storeToken(this.token);
        global.googleApiKey = response.data.data.googleApiKey;
        this.loginSnackbar = true;
      })
      .catch(error => {
        if(error.response.data.errors){
          this.errors = error.response.data.errors;
        }
        this.loginSnackbar = true;
      });
  }

  @action async register(values,navi) {
      let formData = new FormData();
      formData.append('tcno', values.tcno);
      formData.append('email', values.email);
      formData.append('name', values.name);
      formData.append('phone', values.phone);
      formData.append('courier_city', JSON.stringify(this.courier_city));
      formData.append('courier_districts', JSON.stringify(this.courier_districts));
      formData.append('password', values.password);
      formData.append('password_confirmation', values.password_confirmation);
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
          // console.log(response.data);
          global.googleApiKey = response.data.data.googleApiKey;
          this.registerSuccessSnackbar = true;
          navi.navigate('Login');
        })
        .catch(error => {
          if(error.response.data.errors){
            this.errors = error.response.data.errors;
          }
        });    
  }

  @action async getUser() {
    this.errors = '';
    this.loading = true; //loading iconu g??ster && uye bilgi formu
    let uri = `${global.apiUrl}/profile`;
    await axios.get(uri, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.token}`
      }
    })
      .then((response) => {
        // console.log(response.data.city[0].id)
        this.name = response.data.name;
        this.email = response.data.email;
        this.phone = response.data.phone;
        this.tcno = response.data.tc;
        this.vehicle = response.data.vehicle;
        this.plate = response.data.plate;
        this.color = response.data.color;
        this.balance = response.data.balance;
        this.on_duty = response.data.on_duty;
        this.birth_date = response.data.birth_date;
        this.current_image = response.data.image;
        this.courier_city = [...this.courier_city, response.data.city[0].id];
        response.data.district.map((district) => {
          this.courier_districts = [...this.courier_districts, district.id];
      });
        
        this.getCities();
        this.getDistricts(this.courier_city);
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
    formData.append('current_image', this.current_image);
    formData.append('tcno', this.tcno);
    formData.append('email', this.email);
    formData.append('name', this.name);
    formData.append('phone', this.phone);
    formData.append('vehicle', this.vehicle);
    formData.append('plate', this.plate);
    formData.append('color', this.color);
    formData.append('on_duty', this.on_duty);
    formData.append('birth_date', this.birth_date);
    formData.append('courier_city', JSON.stringify(this.courier_city));
    formData.append('courier_districts', JSON.stringify(this.courier_districts));
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

// console.log(response.data.data.image)
this.current_image = response.data.data.image;
        this.updateProfileSnackbar = true;
      })
      .catch(error => {
        if(error.response.data.errors){
          this.errors = error.response.data.errors;
        }
      });
    this.loading = false;
  }

  @action async resetPassword(values) {
    let formData = new FormData();
    formData.append('email', values.email);

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
        if(error.response.data.errors){
          this.errors = error.response.data.errors;
        }
      });
  }

  @action async isThereCourierTask() {
    // console.log('check-courier-task istegi g??nderildi')
    let uri = `${global.apiUrl}/check-courier-task`;
    await axios.get(uri, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.token}`
      }
    })
      .then((response) => {
        if (response.data.task) {
          // console.log('devam eden g??nderi var')
          this.isCourierAcceptTaskId = response.data.task.id;
          this.isCourierAcceptTask = true;
        } else {
          // console.log('devam eden g??nderi yok')
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
        // console.log(response.data);
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
        // console.log(response.data);
      })
      .catch(error => {
        if (error.response.status == 401) {
          this.token = null;
          this.storeToken('');
        }
      });
  }

  @action getCities = async () => {
    let uri = `${global.apiUrl}/get-cities/`;
    await axios.get(uri, {
      headers: {
        'Accept': 'application/json',
      }
    })
      .then((response) => {
        this.cities= response.data;
      })
      .catch(error => {
        if (error.response.status == 401) {
          this.token = null;
          this.storeToken('');
        }
      });
  }

  @action getDistrictsAfterSelectedCity = async (itemValue) => {
    this.handleCityId(itemValue);
    this.handleDistrictId([]);
    this.getDistricts(itemValue);
  }

  @action getDistricts = async (itemValue) => {
    let uri = `${global.apiUrl}/get-city-districts/${itemValue}`;
    await axios.get(uri, {
      headers: {
        'Accept': 'application/json',
      }
    })
      .then((response) => {
        this.districts = response.data;
      })
      .catch(error => {
        if (error.response.status == 401) {
          this.token = null;
          this.storeToken('');
        }
      });
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
    this.loading_screen = false;
    SplashScreen.hide();
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