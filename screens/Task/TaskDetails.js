
/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-04 21:42:54
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-03-24 19:14:29
 */
import React, { Component } from "react";
import { ScrollView, Text, View, Dimensions, StyleSheet } from "react-native";
import { List, Button } from 'react-native-paper';
import moment from "moment/min/moment-with-locales";


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
      dimensions: {
        window,
        screen
      }
    };
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

  updateStatus = (id) => {
    console.log(id);
    // apiden istek at sonra status guncelle, daha sonra ana sayfaya atıp refresh
    this.setState({
      status: 'Kurye Teslim Aldı',
    });
  }

  render(props) {
    let shipment_type;
    let payment_status;
    let payment_type;

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


            {/* 
        {this.state.payment_status == 0 && this.state.payment_type == 1 && <Button style={{ margin: 15 }} icon="credit-card-plus-outline" mode="contained" compact onPress={() => this.props.navigation.navigate('TaskPayment', { id: this.state.id })}>
          ÖDE
            </Button>} */}

          </ScrollView>
        </View>

        <View style={{ width: dimensions.window.width, height: 175 }}>
          <Button
            icon="autorenew"
            mode="contained"
            uppercase={false}
            // color="red"
            onPress={() => this.updateStatus(this.state.id)}
            style={styles.button}
          >
            Teslim Aldım Olarak Güncelle
                </Button>
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
