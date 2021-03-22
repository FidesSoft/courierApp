/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-10 13:56:01
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-03-22 23:00:59
 */
import React, { Component } from "react";
import axios from 'axios';
import AuthStore from '../../store/AuthStore';

import { Text, View, FlatList, SafeAreaView, StyleSheet, RefreshControl } from 'react-native';
import { Divider, DataTable, Button, Snackbar, FAB } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';

import LoadingFooter from '../../components/LoadingFooter';
import EmptyComponent from '../../components/EmptyComponent';

class PaymentIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            payments: '',
            selectedStatus: '',
            page: 1,
            fetchingFromServer: false,
            isListEnd: false,
            successSnackbar: false,
            errorSnackbar: false,
            refreshing: false,
        };
    }

    _onRefresh = () => {
        this.setState({ refreshing: true });
        this.setState({
            payments: '',
            page: 1,
            fetchingFromServer: false,
            isListEnd: false,
            refreshing: false,
        }, () => {
            this.getPayments();
        });
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            // console.log(this.props.route.params.successUpdate);
            if (this.props.route.params.refreshData) {
                if (this.props.route.params.success) {
                    this.setState({ successSnackbar: true });
                } else if (this.props.route.params.error) {
                    this.setState({ errorSnackbar: true });
                }

                this.props.navigation.setParams({ refreshData: false, success: false, error: false })
                this.setState({
                    payments: '',
                    page: 1,
                    fetchingFromServer: false,
                    isListEnd: false,
                }, () => {
                    this.getPayments();
                });
            }
        });
        this.getPayments();
    }

    onDismissSuccessSnackbar = () => this.setState({ successSnackbar: false });
    onDismissErrorSnackbar = () => this.setState({ errorSnackbar: false });

    updateAfterSelectedStatus(itemValue) {
        this.setState({ selectedStatus: itemValue }, () => {
            this.setState({
                payments: '',
                page: 1,
                fetchingFromServer: false,
                isListEnd: false,
            }, () => {
                this.getPayments();
            });
        });
    }

    getPayments() {
        if (!this.state.fetchingFromServer && !this.state.isListEnd) {
            this.setState({ fetchingFromServer: true }, () => {
                let uri = `${global.apiUrl}/payment?status=` + this.state.selectedStatus + `&page=` + this.state.page;
                axios.get(uri, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${AuthStore.token}`
                    }
                })
                    .then((response) => {
                        if (response.data.payments.data.length > 0) {
                            this.setState({
                                payments: [...this.state.payments, ...response.data.payments.data],
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

    renderHeader() {
        return (
            <DataTable.Header>
                <DataTable.Title>Ödeme</DataTable.Title>
                <DataTable.Title numeric>Miktar</DataTable.Title>
                <DataTable.Title numeric>Durum</DataTable.Title>
            </DataTable.Header>
        );
    }

    renderItem = ({ item }) => {
        return (
            <DataTable.Row>
                <DataTable.Cell>{item.description}</DataTable.Cell>
                <DataTable.Cell numeric>
                    <Text>{item.amount} ₺</Text>
                </DataTable.Cell>
                <DataTable.Cell numeric>

                    {item.payment_status == 1 ? <Text style={{ color: "green" }}>Ödendi</Text> : null}

                    {item.payment_status == 2 && item.payment_type == 2 ? <Button mode="text" compact uppercase={false} onPress={() => this.props.navigation.navigate('Pay', { item })}>
                        Ödeme Yap
  </Button> : null}

                    {item.payment_status == 2 && item.payment_type == 3 ? <Button mode="text" compact uppercase={false} onPress={() => this.props.navigation.navigate('Home')}>
                        Ödeme Yap
  </Button> : null}

                </DataTable.Cell>
            </DataTable.Row>
        );
    }

    render(props) {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ width: '100%' }}>
                    <Picker
                        selectedValue={this.state.selectedStatus}
                        onValueChange={(itemValue, itemIndex) => { this.updateAfterSelectedStatus(itemValue) }
                        }>
                        <Picker.Item label="Tümü" value="" />
                        <Picker.Item label="Alınan Ödemeler" value="1" />
                        <Picker.Item label="Bakiye Yüklemeleri" value="2" />
                        <Picker.Item label="Gönderi Ödemeleri" value="3" />
                    </Picker>
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
                    data={this.state.payments.slice()}
                    ListEmptyComponent={<EmptyComponent />}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReached={() => this.getPayments()}
                    onEndReachedThreshold={0.5}
                    renderItem={this.renderItem}
                    ListFooterComponent={<LoadingFooter show={this.state.fetchingFromServer} />}
                />
                <Snackbar
                    duration={3000}
                    visible={this.state.successSnackbar}
                    onDismiss={this.onDismissSuccessSnackbar}
                >
                    Başarıyla ödeme yapıldı.
                </Snackbar>

                <Snackbar
                    duration={3000}
                    visible={this.state.errorSnackbar}
                    onDismiss={this.onDismissErrorSnackbar}
                >
                    Ödeme başarısız oldu
      </Snackbar>
                <FAB
                    style={{
                        position: 'absolute',
                        margin: 16,
                        right: 0,
                        bottom: 0,
                    }}
                    small
                    icon="plus"
                    onPress={() => this.props.navigation.navigate('AddBalance')}
                />
            </SafeAreaView>
        );
    }
}

export default PaymentIndex;
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});