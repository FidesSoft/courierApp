/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-22 20:00:20
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-03-22 20:00:44
 */
/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-10 14:50:27
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-03-19 15:00:30
 */
import React, { Component } from "react";
import axios from 'axios';
import AuthStore from '../../store/AuthStore';

import { SafeAreaView, View, Text, FlatList, RefreshControl } from 'react-native';
import { Divider, DataTable, Button, Paragraph, Snackbar, Portal, Searchbar, IconButton, Dialog, FAB } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';

import LoadingFooter from '../../components/LoadingFooter';
import EmptyComponent from '../../components/EmptyComponent';

class IbanIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ibans: '',
            search: '',
            statuses: [],
            selectedStatus: '',
            page: 1,
            fetchingFromServer: false,
            isListEnd: false,
            deleteDialogVisible: false,
            deleteId: '',
            afterDeleteSnackbar: false,
            updateSnackbar: false,
            createSnackbar: false,
            refreshing: false,
        };
    }

    _onRefresh = () => {
        this.setState({ refreshing: true });
        this.setState({
            ibans: '',
            page: 1,
            fetchingFromServer: false,
            isListEnd: false,
            refreshing: false,
        }, () => {
            this.getIbans();
        });
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            // console.log(this.props.route.params.successUpdate);
            if (this.props.route.params.refreshData) {
                if (this.props.route.params.update) {
                    this.setState({ updateSnackbar: true });
                } else if (this.props.route.params.create) {
                    this.setState({ createSnackbar: true });
                }

                this.props.navigation.setParams({ refreshData: false, create: false, update: false })
                this.setState({
                    ibans: '',
                    page: 1,
                    fetchingFromServer: false,
                    isListEnd: false,
                }, () => {
                    this.getIbans();
                });
            }
        });
        this.getIbans();
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    updateAfterSelectedStatus(itemValue) {
        this.setState({ selectedStatus: itemValue }, () => {
            this.setState({
                ibans: '',
                page: 1,
                fetchingFromServer: false,
                isListEnd: false,
            }, () => {
                this.getIbans();
            });
        });
    }

    handleSearch(search) {
        this.state.search = search.text;
    }

    searching() {
        this.setState({
            ibans: '',
            page: 1,
            fetchingFromServer: false,
            isListEnd: false,
        }, () => {
            this.getIbans();
        });
    }

    getIbans = async() => {
        if (!this.state.fetchingFromServer && !this.state.isListEnd) {
            this.setState({ fetchingFromServer: true }, async() => {
                let uri = `${global.apiUrl}/iban?status=` + this.state.selectedStatus + `&search=` + this.state.search + `&page=` + this.state.page;
                await axios.get(uri, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${AuthStore.token}`
                    }
                })
                    .then((response) => {
                        this.setState({ statuses: response.data.statuses });

                        if (response.data.ibans.data.length > 0) {
                            this.setState({
                                ibans: [...this.state.ibans, ...response.data.ibans.data],
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
                        if(error.response.status == 401){
                            AuthStore.token = null;
                            AuthStore.storeToken('');
                        }
                    });
            });
        }
    };

    onDismissAfterDeleteSnackbar = () => this.setState({ afterDeleteSnackbar: false });
    onDismissUpdateSnackbar = () => this.setState({ updateSnackbar: false });
    onDismissCreateSnackbar = () => this.setState({ createSnackbar: false });

    showModal = (id) => {
        this.setState({ deleteDialogVisible: true });
        this.setState({ deleteId: id });
    }

    hideModal = () => {
        this.setState({ deleteDialogVisible: false });
        this.setState({ deleteId: '' });
    }

    deleteItem = () => {
        // console.log('id:' + id);
        // console.log('deleteId:' + this.state.deleteId);
        let uri = `${global.apiUrl}/iban/${this.state.deleteId}`;
        axios.delete(uri, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${AuthStore.token}`
            }
        })
            .then(res => {
                this.setState({
                    deleteId: '',
                    deleteDialogVisible: false,
                    ibans: '',
                    page: 1,
                    fetchingFromServer: false,
                    isListEnd: false,
                    afterDeleteSnackbar: true,
                }, () => {
                    this.getIbans();
                });
                // console.log(res.data)
            })
            .catch(error => {
                if(error.response.status == 401){
                    AuthStore.token = null;
                    AuthStore.storeToken('');
                }
            });
    }

    renderHeader() {
        return (
            <DataTable.Header>
                <DataTable.Title>İban</DataTable.Title>
                <DataTable.Title numeric>Durum</DataTable.Title>
                <DataTable.Title numeric>İşlemler</DataTable.Title>
            </DataTable.Header>
        );
    }

    renderItem = ({ item }) => {
        return (
            <DataTable.Row>
                <DataTable.Cell>{item.default ? <Text style={{ color: "green" }}>*</Text> : ''}{item.iban_no}</DataTable.Cell>
                <DataTable.Cell numeric>
                    {item.status_id == 10 ? <Text style={{ color: "green" }}>Aktif</Text> :
                        <Text style={{ color: "red" }}>Pasif</Text>}
                </DataTable.Cell>
                <DataTable.Cell numeric>
                    <View style={{ flex: 2, flexDirection: 'row-reverse' }}>
                        <IconButton
                            icon="trash-can"
                            color="red"
                            size={20}
                            // onPress={() => console.log(item.id)}
                            // onPress={this.showModal}
                            onPress={() => this.showModal(item.id)}
                        />
                        <IconButton
                            icon="pencil-outline"
                            color="#F59F0B"
                            size={20}
                            onPress={() => this.props.navigation.navigate('IbanEdit', { item })}
                        />
                    </View>
                </DataTable.Cell>
            </DataTable.Row>
        );
    }

    render() {

        let allStatuses = this.state.statuses.map((status) => {
            return (
                <Picker.Item label={status.name} value={status.id} key={status.id} />
            )
        });

        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start'
                }}>                    
                    <View style={{ width: '70%' }}>
                        <Searchbar style={{ backgroundColor: '#fffaf0', 
                        elevation: 0}}
                            placeholder="İban Ara"
                            onChangeText={(text) => this.handleSearch({ text })}
                            onIconPress={() => this.searching()}
                        />
                    </View>
                    <View style={{ width: '30%', borderLeftWidth : 1, borderLeftColor:  '#dedbd3', backgroundColor: '#fffaf0'}}>
                        <Picker
                            selectedValue={this.state.selectedStatus}
                            onValueChange={(itemValue) =>
                                this.updateAfterSelectedStatus(itemValue)
                            }>
                            <Picker.Item label="Tümü" value="0" />
                            {allStatuses}
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
                    data={this.state.ibans.slice()}
                    ListEmptyComponent={<EmptyComponent />}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReached={() => this.getIbans()}
                    onEndReachedThreshold={0.5}
                    renderItem={this.renderItem}
                    ListFooterComponent={<LoadingFooter show={this.state.fetchingFromServer} />}
                />
                <Portal>
                    <Dialog visible={this.state.deleteDialogVisible} onDismiss={this.hideModal} >
                        <Dialog.Title>Silme Onaylama</Dialog.Title>
                        <Dialog.Content>
                            <Paragraph>Bu içeriği silmek istediğinize emin misiniz?</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}>
                                <Button
                                    onPress={() => this.hideModal()}
                                >İptal</Button>
                                <Button
                                    onPress={() => this.deleteItem(this.state.deleteId)}
                                >Evet</Button>
                            </View>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>

                <Snackbar
                    duration={3000}
                    visible={this.state.afterDeleteSnackbar}
                    onDismiss={this.onDismissAfterDeleteSnackbar}
                    >
                    Silme Başarılı.
                </Snackbar>

                <Snackbar
                    duration={3000}
                    visible={this.state.updateSnackbar}
                    onDismiss={this.onDismissUpdateSnackbar}
                    >
                    Güncelleme Başarılı.
                </Snackbar>

                <Snackbar
                    duration={3000}
                    visible={this.state.createSnackbar}
                    onDismiss={this.onDismissCreateSnackbar}
                >
                    Ekleme Başarılı.
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
                    onPress={() => this.props.navigation.navigate('IbanCreate')}
                />
            </SafeAreaView>
        );
    }
}

export default IbanIndex;