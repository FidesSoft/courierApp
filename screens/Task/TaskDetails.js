
/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-04 21:42:54
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-03-25 18:25:05
 */
import React, { Component } from "react";
import { ScrollView, Text, View, Dimensions, StyleSheet } from "react-native";
import { List, Button, Paragraph, Dialog } from 'react-native-paper';
import moment from "moment/min/moment-with-locales";
import axios from 'axios';
import AuthStore from '../../store/AuthStore';


const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

class TaskDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      task_type: '',
      shipment_type: '',
      sender_name: '',
      receiver_name: '',
      sender_phone: '',
      receiver_phone: '',
      delivery_date: '',
      delivered_at: '',
      weight: '',
      payment_type: '',
      price: '',
      status: '',
      status_id: '',
      payment_status: '',
      distance: '',
      duration: '',
      courier: '',
      courier_name: '',
      courier_price: '',
      description: '',
      sender_address: '',
      receiver_address: '',
      created_at: '',
      loading: false,
      updateStatusDialog: false,
      cancelTaskDialog: false,
      dimensions: {
        window,
        screen
      }
    };
  }

  changeUpdateStatusDialog(status) {
    this.setState({
      updateStatusDialog: status,
    });
  }

  changeCancelTaskDialog(status) {
    this.setState({
      cancelTaskDialog: status,
    });
  }

  componentDidMount() {
    Dimensions.addEventListener("change", this.onChange);
    this.setState({
      id: this.props.route.params.item.id,
      task_type: this.props.route.params.item.task_type,
      created_at: this.props.route.params.item.created_at,
      shipment_type: this.props.route.params.item.shipment_type,
      sender_name: this.props.route.params.item.sender.name,
      sender_phone: this.props.route.params.item.sender.phone,
      receiver_name: this.props.route.params.item.receiver.name,
      receiver_phone: this.props.route.params.item.receiver.phone,
      delivery_date: this.props.route.params.item.delivery_date,
      delivered_at: this.props.route.params.item.delivered_at,
      weight: this.props.route.params.item.weight,
      payment_type: this.props.route.params.item.payment_type,
      price: this.props.route.params.item.price,
      payment_status: this.props.route.params.item.payment_status,
      status: this.props.route.params.item.status.name,
      status_id: this.props.route.params.item.status.id,
      distance: this.props.route.params.item.distance,
      duration: this.props.route.params.item.duration,
      courier: this.props.route.params.item.courier,
      courier_price: this.props.route.params.item.price_courier,
      courier_name: this.props.route.params.item.courier ? this.props.route.params.item.courier.name : 'Atanmadı',
      description: this.props.route.params.item.description,
      sender_address: this.props.route.params.item.senderaddress.description + ' ' + this.props.route.params.item.senderaddress.district.name + ' ' + this.props.route.params.item.senderaddress.city.name,
      receiver_address: this.props.route.params.item.receiver.description,
    });
  }

  componentWillUnmount() {
    Dimensions.removeEventListener("change", this.onChange);
  }

  onChange = ({ window, screen }) => {
    this.setState({ dimensions: { window, screen } });
  };

  onDismissUpdateStatusSnackbar = () => this.setState({ updateStatusSnackbar: false });

  updateStatus = async (id) => {
    this.setState({ loading: true });
    let formData = new FormData();
    formData.append('id', id);

    let uri = `${global.apiUrl}/task/update-task-status/`;
    await axios.post(uri, formData, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${AuthStore.token}`
      }
    })
      .then((response) => {
        this.props.navigation.navigate('Home', { refreshData: true, update: true })
      })
      .catch(error => {
        console.log('hata')
        if (error.response.status == 401) {
          AuthStore.token = null;
          AuthStore.storeToken('');
        }
      });
    this.setState({ loading: false, updateStatusDialog: false });
    // apiden istek at sonra status guncelle, daha sonra ana sayfaya atıp refresh
    // this.setState({
    //   status: 'Kurye Teslim Aldı',
    // });
  }


  cancelTask = async (id) => {
    this.setState({ loading: true });
    let formData = new FormData();
    formData.append('id', id);

    let uri = `${global.apiUrl}/task/cancel-task/`;
    await axios.post(uri, formData, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${AuthStore.token}`
      }
    })
      .then((response) => {
        this.props.navigation.navigate('Home', { refreshData: true, update: true })
      })
      .catch(error => {
        console.log('hata')
        if (error.response.status == 401) {
          AuthStore.token = null;
          AuthStore.storeToken('');
        }
      });
    this.setState({ loading: false, cancelTaskDialog: false });
    // apiden istek at sonra status guncelle, daha sonra ana sayfaya atıp refresh
    // this.setState({
    //   status: 'Kurye Teslim Aldı',
    // });
  }


  render(props) {
    let shipment_type;
    let payment_status;
    let payment_type;
    let change_status_text;

    if (this.state.status_id == 18) {
      change_status_text = '"Teslim Aldım" olarak güncelle';
    } else if (this.state.status_id == 19) {
      change_status_text = '"Yoldayım" olarak güncelle';
    } else if (this.state.status_id == 20) {
      change_status_text = '"Hedefe Ulaştım" olarak güncelle';
    } else if (this.state.status_id == 21) {
      change_status_text = '"Teslim Ettim" olarak güncelle';
    } else {
      change_status_text = 'Durum bulunamadı...';
    }


    if (this.state.shipment_type == 1) {
      shipment_type = 'Yaya Kurye';
    } else if (this.state.shipment_type == 2) {
      shipment_type = 'Motor Kurye';
    } else if (this.state.shipment_type == 3) {
      shipment_type = 'Express Kurye';
    } else if (this.state.shipment_type == 4) {
      shipment_type = 'Araç Kurye';
    } else {
      shipment_type = 'Bulunamadı';
    }

    if (this.state.payment_type == 1) {
      payment_type = 'Kredi Kartı';
    } else if (this.state.payment_type == 2) {
      payment_type = 'Gönderici Ödemeli';
    } else if (this.state.payment_type == 3) {
      payment_type = 'Alıcı Ödemeli';
    } else if (this.state.payment_type == 4) {
      payment_type = 'Havale';
    } else if (this.state.payment_type == 5) {
      payment_type = 'Bakiyeden Ödeme';
    } else {
      payment_type = 'Bulunamadı';
    }

    if (this.state.payment_status == 0) {
      payment_status = 'Ödenmedi';
    } else if (this.state.payment_status == 1) {
      payment_status = 'Ödendi';
    } else {
      payment_status = 'Bulunamadı';
    }

    const { dimensions } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <View style={{ width: dimensions.window.width, height: dimensions.window.height - 170 }}>
          <ScrollView>
            <List.Item
              title={
                <View>
                  <Text>{'Gönderi Türü: ' + this.state.task_type == 1 ? 'Paket' : 'Evrak' + ' (' + this.state.id + ')'}</Text>
                  <Text>Durum: {this.state.status}</Text>
                </View>
              }
              description={'Tarih: ' + moment(this.state.created_at).locale('tr').format('lll')}
              left={props => <List.Icon {...props} icon="format-list-checks" />}
            />
            <List.Item
              title={
                <View>
                  <Text>Kurye Türü: {shipment_type}
                  </Text>
                </View>
              }
              description={'Açıklama: ' + this.state.description}
              left={props => <List.Icon {...props} icon="comment-account-outline" />}
            />
            <List.Item
              title={
                <View>
                  <Text>Gönderici Adı: {this.state.sender_name}</Text>
                  <Text>Telefon: {this.state.sender_phone}</Text>
                </View>
              }
              description={'Gönderici Adresi: ' + this.state.sender_address}
              left={props => <List.Icon {...props} icon="account-arrow-right-outline" />}
            />
            <List.Item
              title={
                <View>
                  <Text>Alıcı Adı: {this.state.receiver_name}</Text>
                  <Text>Telefon: {this.state.receiver_phone}</Text>
                </View>
              }
              description={'Alıcı Adresi: ' + this.state.receiver_address}
              left={props => <List.Icon {...props} icon="account-arrow-right-outline" />}
            />
            <List.Item
              title={
                <View>
                  <Text>Ağırlık: {this.state.weight} kg</Text>
                  <Text>Tahmini Uzaklık: {this.state.distance} km</Text>
                  <Text>Tahmini Varış Süre: {this.state.duration} dk</Text>
                </View>
              }
              left={props => <List.Icon {...props} icon="information-outline" />}
            />
            <List.Item
              title={
                <View>
                  <Text>Ödeme: {payment_type} ({payment_status})</Text>
                  <Text>Fiyat: {this.state.price}  ₺</Text>
                  <Text>Kurye Kazancı: {this.state.courier_price}  ₺</Text>
                </View>
              }
              left={props => <List.Icon {...props} icon="credit-card-check-outline" />}
            />

            {this.state.status_id == 18 && <List.Item
              title={
                <Button style={{ margin: 15 }} color="red" icon="close" mode="contained" compact onPress={() => this.changeCancelTaskDialog(true)}>
                  Gönderi Görevini İptal Et
            </Button>
              }
              left={props => <List.Icon {...props} />}
            />}


          </ScrollView>
        </View>

        <Dialog visible={this.state.updateStatusDialog} onDismiss={() => this.changeUpdateStatusDialog(false)}>
          <Dialog.Title>Gönderi Durumu Güncelle</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Gönderi durumunu {change_status_text}meyi onaylıyor musunuz?</Paragraph>
            {this.state.payment_status == 0 && this.state.status_id == 18 && this.state.payment_type == 2 && <>
              <Paragraph>* Nakit ödemeyi almadan bu işlemi yapmayınız. Onaylarsanız gönderi komisyon ücreti hesabınızdan düşecektir.</Paragraph></>}

            {this.state.payment_status == 0 && this.state.status_id == 21 && this.state.payment_type == 3 && <>
              <Paragraph>* Nakit ödemeyi almadan bu işlemi yapmayınız. Onaylarsanız gönderi komisyon ücreti hesabınızdan düşecektir.</Paragraph></>}

          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => this.changeUpdateStatusDialog(false)}>İptal</Button>
            <Button loading={this.state.loading} onPress={() => this.updateStatus(this.state.id)}>Evet, Onaylıyorum.</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={this.state.cancelTaskDialog} onDismiss={() => this.changeCancelTaskDialog(false)}>
          <Dialog.Title>Görevi İptal Et</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Bu gönderi görevini iptal etmek istediğinizi onaylıyor musunuz?</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => this.changeCancelTaskDialog(false)}>İptal</Button>
            <Button loading={this.state.loading} onPress={() => this.cancelTask(this.state.id)}>Evet, Onaylıyorum.</Button>
          </Dialog.Actions>
        </Dialog>
        <View style={{ width: dimensions.window.width, height: 175 }}>
          {this.state.status_id != 22 && <Button
            icon="autorenew"
            mode="contained"
            uppercase={false}
            loading={this.state.loading}
            // color="red"
            onPress={() => this.changeUpdateStatusDialog(true)}
            style={styles.button}
          >
            {change_status_text}
          </Button>}

          {this.state.status_id == 22 && <Button
            icon="autorenew"
            mode="contained"
            uppercase={false}
            style={styles.button}
          >
            Müşteri onayı bekleniyor...
                </Button>}
        </View>
      </View>
    );
  }
}

export default TaskDetails;
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
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },
  button_small: {
    marginTop: 15,
  },
  rowright: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    justifyContent: 'flex-end'
  },
  helper: {
    marginLeft: 5,
  },
  hyperlinkStyle: {
    color: 'blue',
  },
});
