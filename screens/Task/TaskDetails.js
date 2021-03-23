
/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-04 21:42:54
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-03-23 22:13:12
 */
import React, { Component } from "react";
import { ScrollView, Text, View } from "react-native";
import { List, Button } from 'react-native-paper';

class TaskDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: '',
      task_type: '',
      shipment_type: '',
      receiver_name: '',
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
      description: '',
      sender_address: '',
      receiver_address: '',
      created_at: '',
    };
  }

  componentDidMount() {
    this.setState({
      id: this.props.route.params.item.id,
      task_type: this.props.route.params.item.task_type,
      created_at: this.props.route.params.item.created_at,
      shipment_type: this.props.route.params.item.shipment_type,
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
      courier_name: this.props.route.params.item.courier ? this.props.route.params.item.courier.name : 'Atanmadı',
      description: this.props.route.params.item.description,
      sender_address: this.props.route.params.item.senderaddress.description + ' ' + this.props.route.params.item.senderaddress.district.name + ' ' + this.props.route.params.item.senderaddress.city.name,
      receiver_address: this.props.route.params.item.receiver.description,
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

    return (
      <ScrollView>
        <List.Item
          title={
            <View>
              <Text>Durum: {this.state.status}</Text>
            </View>
          }
          description={'Açıklama: ' + this.state.description}
          left={props => <List.Icon {...props} icon="format-list-checks" />}
        />
        <List.Item
          title={
            <View>
              <Text>Kurye Türü: {shipment_type}
              </Text>
            </View>
          }
          description={'Kurye Adı: ' + this.state.courier_name}
          left={props => <List.Icon {...props} icon="comment-account-outline" />}
        />
        <List.Item
          title={
            <View>
              <Text>Gönderi Türü: {this.state.task_type == 1 ? 'Paket' : 'Evrak'} ({this.state.id})</Text>
            </View>
          }
          description={'Gönderici Adresi: ' + this.state.sender_address}
          left={props => <List.Icon {...props} icon="package-variant" />}
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
            </View>
          }
          left={props => <List.Icon {...props} icon="credit-card-check-outline" />}
        />
        {this.state.courier != '' && this.state.status_id != 23 && this.state.status_id != 24 && <List.Item
          title={
            <View>
              <Button compact mode="text" onPress={() => this.props.navigation.navigate('CourierTrack', { created_at: this.state.created_at, id: this.state.id })}>
                Canlı Kurye Takibi
              </Button>
            </View>
          }
          left={props => <List.Icon {...props} icon="map-marker-radius-outline" />}
        />}

        {this.state.courier_name != 'Atanmadı' && this.state.status_id == 23 && <List.Item
          title={
            <View>
              <Button uppercase={false} compact mode="text" onPress={() => this.props.navigation.navigate('Rating', { courier_id: this.state.courier.id, task_id: this.state.id })}>
                Gönderi ve Kurye Değerlendir
              </Button>
            </View>
          }
          left={props => <List.Icon {...props} icon="star-outline" />}
        />}


        {this.state.payment_status == 0 && this.state.payment_type == 1 && <Button style={{ margin: 15 }} icon="credit-card-plus-outline" mode="contained" compact onPress={() => this.props.navigation.navigate('TaskPayment', { id: this.state.id })}>
          ÖDE
            </Button>}
        {this.state.payment_status == 0 && this.state.payment_type == 4 && <Button style={{ margin: 15 }} icon="credit-card-plus-outline" mode="contained" compact onPress={() => this.props.navigation.navigate('TaskPaymentHavale', { id: this.state.id })}>
          ÖDE
            </Button>}

            {this.state.payment_status == 1 && this.state.status_id !== 17 && this.state.status_id !== 23 && this.state.status_id !== 24 && this.state.status_id !== 25 && <Button style={{margin: 15}} icon="check-bold" mode="contained"
          uppercase={false}
          onPress={() => this.props.navigation.navigate('Approve', { id: this.state.id })}
        >Gönderiyi Teslim Aldım</Button>}

      </ScrollView>
    );
  }
}

export default TaskDetails;
