/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-10 13:56:01
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-04-16 01:24:44
 */
import React, { Component } from "react";
import axios from 'axios';
import AuthStore from '../../store/AuthStore';

import { Text, View, FlatList, SafeAreaView, StyleSheet, RefreshControl } from 'react-native';
import { Divider, DataTable, Button, Snackbar, FAB } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';

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
                <DataTable.Title>??deme</DataTable.Title>
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
                    <Text>{item.amount} ???</Text>
                </DataTable.Cell>
                <DataTable.Cell numeric>

                    {item.payment_status == 1 ? <Text style={{ color: "green" }}>??dendi</Text> : null}

                    {item.payment_status == 2 && item.payment_type == 2 ? <Button mode="text" compact uppercase={false} onPress={() => this.props.navigation.navigate('Pay', { item })}>
                        ??deme Yap
  </Button> : null}

                    {item.payment_status == 2 && item.payment_type == 3 ? <Button mode="text" compact uppercase={false} onPress={() => this.props.navigation.navigate('Home')}>
                        ??deme Yap
  </Button> : null}

                </DataTable.Cell>
            </DataTable.Row>
        );
    }

    render(props) {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ width: '100%' }}>
                    <RNPickerSelect
                        placeholder={{ label: 'T??m ??demeler', value: '' }}
                        doneText="Onayla"
                        value={this.state.selectedStatus}
                        style={{ inputAndroid: { color: 'black' }, inputIOS: { height: 40, marginLeft: 15, margin: 5 } }}
                        onValueChange={(itemValue) =>
                            this.updateAfterSelectedStatus(itemValue)
                        }
                        items={[
                            { label: 'Al??nan ??demeler', value: '1' },
                            { label: 'Bakiye Y??klemeleri', value: '2' },
                            { label: 'G??nderi ??demeleri', value: '3' },
                        ]}
                    />
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
                    Ba??ar??yla ??deme yap??ld??.
                </Snackbar>

                <Snackbar
                    duration={3000}
                    visible={this.state.errorSnackbar}
                    onDismiss={this.onDismissErrorSnackbar}
                >
                    ??deme ba??ar??s??z oldu
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