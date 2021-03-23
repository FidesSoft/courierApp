/*
* @Author: @vedatbozkurt
* @Date:   2020-05-05 04:29:34
* @Last Modified by:   @vedatbozkurt
* @Last Modified time: 2020-05-11 02:12:41
*/
import React, { Component } from 'react';
import axios from 'axios';

import { View, StyleSheet, SafeAreaView, Text, FlatList, RefreshControl } from 'react-native';
import { Snackbar, Button, List, Searchbar, Divider } from 'react-native-paper';
import { observer } from 'mobx-react';
import AuthStore from '../../store/AuthStore';

import { Picker } from '@react-native-picker/picker';

import LoadingFooter from '../../components/LoadingFooter';
import EmptyComponent from '../../components/EmptyComponent';

@observer
class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: '',
      search: '',
      selectedStatus: 1,
      page: 1,
      fetchingFromServer: false,
      isListEnd: false,
      updateSnackbar: false,
      createSnackbar: false,
      paymentSuccessSnackbar: false,
      paymentErrorSnackbar: false,
      ratingSnackbar: false,
      approveSnackbar: false,
      refreshing: false,
    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      // console.log(this.props.route.params.successUpdate);
      if (this.props.route.params.refreshData) {
        if (this.props.route.params.update) {
          this.setState({ updateSnackbar: true });
        }

        this.props.navigation.setParams({
          refreshData: false,
          update: false,
          paymentSuccess: false,
          paymentError: false,
        })
        this.setState({
          tasks: '',
          page: 1,
          fetchingFromServer: false,
          isListEnd: false,
        }, () => {
          this.getTasks();
        });
      }
    });
    this.getTasks();
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.setState({
      tasks: '',
      page: 1,
      fetchingFromServer: false,
      isListEnd: false,
      refreshing: false,
    }, () => {
      this.getTasks();
    });
  }

  updateAfterSelectedStatus(itemValue) {
    this.setState({ selectedStatus: itemValue }, () => {
      this.setState({
        tasks: '',
        page: 1,
        fetchingFromServer: false,
        isListEnd: false,
      }, () => {
        this.getTasks();
      });
    });
  }

  handleSearch(search) {
    this.state.search = search.text;
  }

  searching() {
    this.setState({
      tasks: '',
      page: 1,
      fetchingFromServer: false,
      isListEnd: false,
    }, () => {
      this.getTasks();
    });
  }

  getTasks = async () => {
    if (!this.state.fetchingFromServer && !this.state.isListEnd) {
      this.setState({ fetchingFromServer: true }, async () => {
        let task_type;
        if (this.state.selectedStatus == 2) {
          task_type = 'task/inprogress'
        } else if (this.state.selectedStatus == 3) {
          task_type = 'task/finished'
        } else {
          task_type = 'task'
        }
        let uri = `${global.apiUrl}/${task_type}?search=` + this.state.search + `&page=` + this.state.page;
        await axios.get(uri, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${AuthStore.token}`
          }
        })
          .then((response) => {
            if (response.data.tasks.data.length > 0) {
              this.setState({
                tasks: [...this.state.tasks, ...response.data.tasks.data],
                fetchingFromServer: false,
                page: this.state.page + 1,
              });
            } else {
              this.setState({
                fetchingFromServer: false,
                isListEnd: true,
              });
            }
          })
          .catch(error => {
            if (error.response.status == 401) {
              AuthStore.token = null;
              AuthStore.storeToken('');
            }
          });
      });
    }
  };

  onDismissUpdateSnackbar = () => this.setState({ updateSnackbar: false });

  renderHeader() {
    return (
      null
      // <Text>Gönderi Listesi</Text>
    );
  }

  showDetails(item) {
    let status_id = item.status_id;
    if (status_id != 17 && status_id != 23 && status_id != 25) {
      return this.props.navigation.navigate('TaskDetails', { item })
    } else {
      return null;
    }
  }

  approveTask(item_id) {
    console.log(item_id)
  }

  renderItem = ({ item }) => {
    let shipment_type;
    if (item.shipment_type == 1) {
      shipment_type = 'Yaya Kurye';
    } else if (item.shipment_type == 2) {
      shipment_type = 'Motor Kurye';
    } else if (item.shipment_type == 3) {
      shipment_type = 'Express Kurye';
    } else if (item.shipment_type == 4) {
      shipment_type = 'Araç Kurye';
    } else {
      shipment_type = 'Bulunamadı';
    }

    let payment_type;

    if (item.payment_type == 1) {
      payment_type = 'Kredi Kartı';
    } else if (item.payment_type == 2) {
      payment_type = 'Gönderici Ödemeli';
    } else if (item.payment_type == 3) {
      payment_type = 'Alıcı Ödemeli';
    } else if (item.payment_type == 4) {
      payment_type = 'Havale';
    } else if (item.payment_type == 5) {
      payment_type = 'Bakiye Ödemeli';
    } else {
      payment_type = 'Bulunamadı';
    }

    return (
      <>
        <List.Item style={{ backgroundColor: '#fff7e6', margin: 2 }}
          // onPress={() => console.log(item)}
          onPress={() => this.showDetails(item)}
          titleEllipsizeMode="clip"
          titleNumberOfLines={3}
          title={
            <View>
              <Text>{item.receiver.name.substring(0, 15)} - {item.receiver.phone} </Text>
              <Text>{shipment_type} - {item.status.name}</Text>
            </View>
          }
          description={item.description}
          left={props => <View>
            <Text>
              <List.Icon color="#F59F0B" icon="calendar-check" /> </Text>
            <Text style={{ marginTop: -10 }}> {item.task_type == 1 ? 'Paket' : 'Evrak'} </Text>
            <Text> {item.price} ₺ </Text>
          </View>}
          right={props => <View style={{ alignItems: 'flex-end' }}>
            {item.payment_status == 0 ? <Text style={{ color: 'red' }}>Ödenmedi</Text> : <Text style={{ color: 'green' }}> Ödendi</Text>}
            <Text style={{ color: 'green' }}> {payment_type}</Text>
            {item.status_id == 17 || item.status_id == 25 && <Button icon="credit-card-plus-outline" mode="contained" compact onPress={() => this.approveTask(item.id)}>
              Kabul Et
            </Button>}
          </View>}
        />
        <Divider />
        <Divider />
      </>
    );
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'flex-start'
        }}>
          <View style={{ width: '50%' }}>
            <Searchbar style={{
              backgroundColor: '#fffaf0',
              elevation: 0
            }}
              placeholder="Gönderi Ara"
              onChangeText={(text) => this.handleSearch({ text })}
              onIconPress={() => this.searching()}
            />
          </View>
          <View style={{ width: '50%', borderLeftWidth: 1, borderLeftColor: '#dedbd3', backgroundColor: '#fffaf0' }}>
            <Picker
              selectedValue={this.state.selectedStatus}
              onValueChange={(itemValue) =>
                this.updateAfterSelectedStatus(itemValue)
              }>
              <Picker.Item label="Yeni Gönderiler" value={1} />
              <Picker.Item label="Devam Eden Gönderilerim" value={2} />
              <Picker.Item label="Tamamlanan Gönderilerim" value={3} />
            </Picker>
          </View>
        </View>
        <Divider />
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
          ListHeaderComponent={this.renderHeader}
          data={this.state.tasks.slice()}
          ListEmptyComponent={<EmptyComponent />}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={() => this.getTasks()}
          onEndReachedThreshold={0.5}
          renderItem={this.renderItem}
          ListFooterComponent={<LoadingFooter show={this.state.fetchingFromServer} />}
        />

        <Snackbar
          duration={3000}
          visible={this.state.updateSnackbar}
          onDismiss={this.onDismissUpdateSnackbar}
        >
          Güncelleme Başarılı.
                </Snackbar>

        <Snackbar visible={AuthStore.loginSnackbar} onDismiss={() => AuthStore.onDismissLoginSnackbar()}
          duration={2000} action={{ label: 'Gizle', onPress: () => { AuthStore.onDismissLoginSnackbar() } }}>
          Başarıyla giriş yaptınız.</Snackbar>
      </SafeAreaView>
    );
  }
}

export default HomeScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
});
