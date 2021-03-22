/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-03 15:15:29
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-03-15 23:16:05
 */
import { observable, action } from 'mobx';
import axios from 'axios';
import AuthStore from '../store/AuthStore';

class ContactStore {
  @observable subject = '';
  @observable message = '';
  @observable errors = {};
  @observable loading = false;
  @observable contactSnackbar = false;

  @action handleSubject(text) { this.subject = text; }
  @action handleMessage(text) { this.message = text; }

  @action onDismissContactSnackbar() { this.contactSnackbar = false; }

  @action async sendMessage(navi) {
    this.loading = true;
    let formData = new FormData();
    formData.append('subject', this.subject);
    formData.append('message', this.message);

    let uri = `${global.apiUrl}/send-message`;
    await axios.post(uri, formData, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${AuthStore.token}`
      }
    })
      .then((response) => {
        // console.log(response.data)
        this.contactSnackbar = true;
        navi.navigate('Home');
      })
      .catch(error => {
        if (error.response.status == 401) {
          AuthStore.token = null;
          AuthStore.storeToken('');
        }
        this.errors = error.response.data.errors;
      });
    this.loading = false;
  }


}
export default new ContactStore()