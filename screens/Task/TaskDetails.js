
/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-04 21:42:54
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-04-20 14:37:28
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
      courier_name: this.props.route.params.item.courier ? this.props.route.params.item.courier.name : 'Atanmad??',
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

    let uri = `${global.apiUrl}/task/update-task-status`;
    await axios.post(uri, formData, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${AuthStore.token}`
      }
    })
      .then((response) => {
        // console.log(response.data.task.status_id)
        if (response.data.task.status_id == 19) {
          AuthStore.handleIsCourierAcceptTask(true);
          AuthStore.handleIsCourierAcceptTaskId(response.data.task.id);
        }else if(response.data.task.status_id == 22) {
          AuthStore.handleIsCourierAcceptTask(false);
          AuthStore.handleIsCourierAcceptTaskId('');
        }
        this.props.navigation.navigate('Home', { refreshData: true, update: true })
      })
      .catch(error => {
        // console.log('hata')
        if (error.response.status == 401) {
          AuthStore.token = null;
          AuthStore.storeToken('');
        }
      });
    this.setState({ loading: false, updateStatusDialog: false });
  }

  cancelTask = async (id) => {
    this.setState({ loading: true });
    let formData = new FormData();
    formData.append('id', id);

    let uri = `${global.apiUrl}/task/cancel-task`;
    await axios.post(uri, formData, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${AuthStore.token}`
      }
    })
      .then((response) => {
        AuthStore.handleIsCourierAcceptTask(false);
        AuthStore.handleIsCourierAcceptTaskId('');
        this.props.navigation.navigate('Home', { refreshData: true, update: true })
      })
      .catch(error => {
        // console.log('hata')
        if (error.response.status == 401) {
          AuthStore.token = null;
          AuthStore.storeToken('');
        }
      });
    this.setState({ loading: false, cancelTaskDialog: false });
    // apiden istek at sonra status guncelle, daha sonra ana sayfaya at??p refresh
    // this.setState({
    //   status: 'Kurye Teslim Ald??',
    // });
  }


  render(props) {
    let shipment_type;
    let payment_status;
    let payment_type;
    let change_status_text;

    if (this.state.status_id == 18) {
      change_status_text = '"Teslim Ald??m" olarak g??ncelle';
    } else if (this.state.status_id == 19) {
      change_status_text = '"Yolday??m" olarak g??ncelle';
    } else if (this.state.status_id == 20) {
      change_status_text = '"Hedefe Ula??t??m" olarak g??ncelle';
    } else if (this.state.status_id == 21) {
      change_status_text = '"Teslim Ettim" olarak g??ncelle';
    } else {
      change_status_text = 'Durum bulunamad??...';
    }


    if (this.state.shipment_type == 1) {
      shipment_type = 'Yaya Kurye';
    } else if (this.state.shipment_type == 2) {
      shipment_type = 'Motor Kurye';
    } else if (this.state.shipment_type == 3) {
      shipment_type = 'Express Kurye';
    } else if (this.state.shipment_type == 4) {
      shipment_type = 'Ara?? Kurye';
    } else {
      shipment_type = 'Bulunamad??';
    }

    if (this.state.payment_type == 1) {
      payment_type = 'Kredi Kart??';
    } else if (this.state.payment_type == 2) {
      payment_type = 'G??nderici ??demeli';
    } else if (this.state.payment_type == 3) {
      payment_type = 'Al??c?? ??demeli';
    } else if (this.state.payment_type == 4) {
      payment_type = 'Havale';
    } else if (this.state.payment_type == 5) {
      payment_type = 'Bakiyeden ??deme';
    } else {
      payment_type = 'Bulunamad??';
    }

    if (this.state.payment_status == 0) {
      payment_status = '??denmedi';
    } else if (this.state.payment_status == 1) {
      payment_status = '??dendi';
    } else {
      payment_status = 'Bulunamad??';
    }

    const { dimensions } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <View style={{ width: dimensions.window.width, height: dimensions.window.height - 170 }}>
          <ScrollView>
            <List.Item
              title={
                <View>
                  <Text>{'G??nderi T??r??: ' + this.state.task_type == 1 ? 'Paket' : 'Evrak' + ' (' + this.state.id + ')'}</Text>
                  <Text>Durum: {this.state.status}</Text>
                </View>
              }
              description={'Tarih: ' + moment(this.state.created_at).locale('tr').format('lll')}
              left={props => <List.Icon {...props} icon="format-list-checks" />}
            />
            <List.Item
              title={
                <View>
                  <Text>Kurye T??r??: {shipment_type}
                  </Text>
                </View>
              }
              description={'A????klama: ' + this.state.description}
              left={props => <List.Icon {...props} icon="comment-account-outline" />}
            />
            <List.Item
              title={
                <View>
                  <Text>G??nderici Ad??: {this.state.sender_name}</Text>
                  <Text>Telefon: {this.state.sender_phone}</Text>
                </View>
              }
              description={'G??nderici Adresi: ' + this.state.sender_address}
              left={props => <List.Icon {...props} icon="account-arrow-right-outline" />}
            />
            <List.Item
              title={
                <View>
                  <Text>Al??c?? Ad??: {this.state.receiver_name}</Text>
                  <Text>Telefon: {this.state.receiver_phone}</Text>
                </View>
              }
              description={'Al??c?? Adresi: ' + this.state.receiver_address}
              left={props => <List.Icon {...props} icon="account-arrow-right-outline" />}
            />
            <List.Item
              title={
                <View>
                  <Text>A????rl??k: {this.state.weight} kg</Text>
                  <Text>Tahmini Uzakl??k: {this.state.distance} km</Text>
                  <Text>Tahmini Var???? S??re: {this.state.duration} dk</Text>
                </View>
              }
              left={props => <List.Icon {...props} icon="information-outline" />}
            />
            <List.Item
              title={
                <View>
                  <Text>??deme: {payment_type} ({payment_status})</Text>
                  <Text>Fiyat: {this.state.price}  ???</Text>
                  <Text>Kurye Kazanc??: {this.state.courier_price}  ???</Text>
                </View>
              }
              left={props => <List.Icon {...props} icon="credit-card-check-outline" />}
            />

            {this.state.status_id == 18 && <List.Item
              title={
                <Button style={{ margin: 15 }} color="red" icon="close" mode="contained" compact onPress={() => this.changeCancelTaskDialog(true)}>
                  G??nderi G??revini ??ptal Et
            </Button>
              }
              left={props => <List.Icon {...props} />}
            />}


          </ScrollView>
        </View>

        <Dialog visible={this.state.updateStatusDialog} onDismiss={() => this.changeUpdateStatusDialog(false)}>
          <Dialog.Title>G??nderi Durumu G??ncelle</Dialog.Title>
          <Dialog.Content>
            <Paragraph>G??nderi durumunu {change_status_text}meyi onayl??yor musunuz?</Paragraph>
            {this.state.payment_status == 0 && this.state.status_id == 18 && this.state.payment_type == 2 && <>
              <Paragraph>* Nakit ??demeyi almadan bu i??lemi yapmay??n??z. Onaylarsan??z g??nderi komisyon ??creti hesab??n??zdan d????ecektir.</Paragraph></>}

            {this.state.payment_status == 0 && this.state.status_id == 21 && this.state.payment_type == 3 && <>
              <Paragraph>* Nakit ??demeyi almadan bu i??lemi yapmay??n??z. Onaylarsan??z g??nderi komisyon ??creti hesab??n??zdan d????ecektir.</Paragraph></>}

          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => this.changeUpdateStatusDialog(false)}>??ptal</Button>
            <Button loading={this.state.loading} onPress={() => this.updateStatus(this.state.id)}>Evet, Onayl??yorum.</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={this.state.cancelTaskDialog} onDismiss={() => this.changeCancelTaskDialog(false)}>
          <Dialog.Title>G??revi ??ptal Et</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Bu g??nderi g??revini iptal etmek istedi??inizi onayl??yor musunuz?</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => this.changeCancelTaskDialog(false)}>??ptal</Button>
            <Button loading={this.state.loading} onPress={() => this.cancelTask(this.state.id)}>Evet, Onayl??yorum.</Button>
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
            M????teri onay?? bekleniyor...
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
