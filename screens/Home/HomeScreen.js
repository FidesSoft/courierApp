/*
* @Author: @vedatbozkurt
* @Date:   2020-05-05 04:29:34
 * @Last Modified by: @vedatbozkurt
 * @Last Modified time: 2021-04-10 00:17:01
*/
import React, { Component } from 'react';
import axios from 'axios';

import { View, StyleSheet, SafeAreaView, Text, FlatList, RefreshControl } from 'react-native';
import { Snackbar, Button, List, Searchbar, Divider, Paragraph, Dialog, Portal } from 'react-native-paper';
import { observer } from 'mobx-react';
import AuthStore from '../../store/AuthStore';

import RNPickerSelect from 'react-native-picker-select';

import LoadingFooter from '../../components/LoadingFooter';
import EmptyComponent from '../../components/EmptyComponent';

@observer
class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
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
      acceptTaskDialog: false,
      updateStatusSnackbar: false,
      showAcceptTaskDialogError: false,
      loading: false,
      approveTaskId: 0,
      acceptTaskDialogError: '',
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

  cancelAccepTask() {
    this.setState({
      acceptTaskDialog: false,
      approveTaskId: 0,
    });
  }

  handleAcceptTaskDialogError() {
    this.setState({
      showAcceptTaskDialogError: false,
      approveTaskId: 0,
    });
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
      // <Text>G??nderi Listesi</Text>
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

  showApproveTaskDialog(item_id) {
    this.setState({
      acceptTaskDialog: true,
      approveTaskId: item_id,
    });
  }

  async approveTask() {
   
    this.setState({ loading: true });
    let formData = new FormData();
    formData.append('id', this.state.approveTaskId);

    let uri = `${global.apiUrl}/task/accept`;
    await axios.post(uri, formData, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${AuthStore.token}`
      }
    })
      .then((response) => {
        this.props.route.params.refreshData = true;
        this.props.navigation.navigate('TaskDetails', { acceptTask: true, item: response.data.task })
        // navi.navigate('Home');

      })
      .catch(error => {
        if (error.response.status == 401) {
          AuthStore.token = null;
          AuthStore.storeToken('');
        }
        if (error.response.data.errors) {
          this.setState({
            errors: error.response.data.errors.error_desc,
          }, () => {
            this.setState({
              acceptTaskDialogError: this.state.errors,
              showAcceptTaskDialogError: true,
            });
          });
        }
      });
    this.setState({
      acceptTaskDialog: false,
      loading: false,
    });
  }

  renderItem = ({ item }) => {
    let shipment_type;
    if (item.shipment_type == 1) {
      shipment_type = 'Yaya';
    } else if (item.shipment_type == 2) {
      shipment_type = 'Motor';
    } else if (item.shipment_type == 3) {
      shipment_type = 'Express';
    } else if (item.shipment_type == 4) {
      shipment_type = 'Ara??';
    } else {
      shipment_type = 'Bulunamad??';
    }

    let payment_type;

    if (item.payment_type == 1) {
      payment_type = 'Kredi Kart??';
    } else if (item.payment_type == 2) {
      payment_type = 'G??nderici ??demeli';
    } else if (item.payment_type == 3) {
      payment_type = 'Al??c?? ??demeli';
    } else if (item.payment_type == 4) {
      payment_type = 'Havale';
    } else if (item.payment_type == 5) {
      payment_type = 'Bakiye ??demeli';
    } else {
      payment_type = 'Bulunamad??';
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
              <Text>{item.receiver.name.substring(0, 3)}* - {item.senderaddress.district.name}/{item.senderaddress.city.name}</Text>
              <Text>{item.sender.name.substring(0, 3)}* - {item.receiver.district.name}/{item.receiver.city.name}</Text>
              <Text>Kurye ??creti: {item.price_courier} ???</Text>
              <Text>Toplam ??cret: {item.price} ???</Text>
            </View>
          }
          description={item.description}
          left={props => <View>
            <Text>
              <List.Icon color="#F59F0B" icon="calendar-check" /> </Text>
            <Text style={{ marginTop: -10 }}> {item.id} </Text>
            <Text> {item.task_type == 1 ? 'Paket' : 'Evrak'} </Text>
            <Text> {shipment_type} </Text>
          </View>}
          right={props => <View style={{ alignItems: 'flex-end' }}>
            {item.payment_status == 0 ? <Text style={{ color: 'red' }}>??denmedi</Text> : <Text style={{ color: 'green' }}> ??dendi</Text>}
            <Text style={{ color: 'green' }}> {payment_type}</Text>
            {(item.status_id == 17 || item.status_id == 25) && <Button icon="check" mode="contained" compact onPress={() => this.showApproveTaskDialog(item.id)}>
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
              placeholder="G??nderi Ara"
              onChangeText={(text) => this.handleSearch({ text })}
              onIconPress={() => this.searching()}
            />
          </View>
          <View style={{ width: '50%', borderLeftWidth: 1, borderLeftColor: '#dedbd3', backgroundColor: '#fffaf0' }}>
            <RNPickerSelect
              placeholder={{}}
              doneText="Onayla"
              value={this.state.selectedStatus}
              style={{ inputAndroid: { color: 'black' }, inputIOS: { height: 40, marginLeft: 15, margin: 5 } }}
              onValueChange={(itemValue) =>
                this.updateAfterSelectedStatus(itemValue)
              }
              items={[
                { label: 'Yeni G??nderiler', value: 1 },
                { label: 'Devam Eden G??nderilerim', value: 2 },
                { label: 'Tamamlanan G??nderilerim', value: 3 },
              ]}
            />
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
          action={{ label: 'Gizle', onPress: () => { this.onDismissUpdateSnackbar() } }}
        >
          G??ncelleme Ba??ar??l??.
                </Snackbar>

        <Snackbar visible={AuthStore.loginSnackbar} onDismiss={() => AuthStore.onDismissLoginSnackbar()}
          duration={2000} action={{ label: 'Gizle', onPress: () => { AuthStore.onDismissLoginSnackbar() } }}>
          Ba??ar??yla giri?? yapt??n??z.</Snackbar>
        <Portal>

          <Dialog visible={this.state.acceptTaskDialog} onDismiss={() => this.cancelAccepTask()}>
            <Dialog.Title>G??nderi Kabul Et</Dialog.Title>
            <Dialog.Content>
              <Paragraph>G??nderi kabul etti??inizi onayl??yor musunuz?</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => this.cancelAccepTask()}>??ptal</Button>
              <Button loading={this.state.loading} onPress={() => this.approveTask()}>Evet, Onayl??yorum.</Button>
            </Dialog.Actions>
          </Dialog>

          <Dialog visible={this.state.showAcceptTaskDialogError} onDismiss={() => this.handleAcceptTaskDialogError()}>
            <Dialog.Title>Bir Hata Olu??tu!</Dialog.Title>
            <Dialog.Content>
              <Paragraph>{this.state.acceptTaskDialogError}</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => this.handleAcceptTaskDialogError()}>??ptal</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
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
