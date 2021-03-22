/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-11 17:11:37
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-03-22 20:16:14
 */
import React, { Component } from "react";
import axios from 'axios';
import { Text, View, ScrollView, StyleSheet } from "react-native";
import { Button, TextInput, Checkbox, HelperText, Snackbar } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import AuthStore from '../../store/AuthStore';

class IbanIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            id: '',
            iban_no: '',
            status: '',
            default: false,
            loading: false,
        };
    }

    componentDidMount() {

        this.setState({
            id: this.props.route.params.item.id,
            iban_no: this.props.route.params.item.iban_no,
            status: this.props.route.params.item.status_id,
            default: this.props.route.params.item.default,
        });
    }

    handleIbanNo = (text) => this.setState({ iban_no: text });
    handleStatus = (text) => this.setState({ status: text });

    updateIban = async() => {
        this.setState({ loading: true });
        let formData = new FormData();
        formData.append('iban_no', this.state.iban_no);
        formData.append('status', this.state.status);
        formData.append('_method', "put");

        if (this.state.default) {
            formData.append('default', this.state.default);
        }
        let uri = `${global.apiUrl}/iban/${this.state.id}`;
        await axios.post(uri, formData, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${AuthStore.token}`
            }
        })
            .then((response) => {
                this.props.navigation.navigate('IbanIndex', { refreshData: true, update: true })
            })
            .catch(error => {
                if(error.response.status == 401){
                    AuthStore.token = null;
                    AuthStore.storeToken('');
                }
                this.setState({ errors: error.response.data.errors });
            });
        this.setState({ loading: false });
    }


    render() {
        return (
            <ScrollView>
                <TextInput style={styles.input}
                    label="İban Numarası"
                    mode="outlined"
                    value={this.state.iban_no}
                    onChangeText={text => this.handleIbanNo(text)}
                    autoCapitalize="none" />
                {this.state.errors.iban_no && <HelperText type="error" visible style={styles.helper}>
                    {this.state.errors.iban_no}
                </HelperText>}

                <View style={{ flex: 1, marginTop: 15, marginLeft: 15, marginRight: 15, backgroundColor: "white", borderColor: "#F59F0B", borderWidth: 1 }}>
                    <Picker
                        selectedValue={this.state.status}
                        onValueChange={(itemValue) =>
                            this.setState({ status: itemValue })
                        }>
                        <Picker.Item label="Durum Seç" value="" />
                        <Picker.Item label="Aktif" value={10} />
                        <Picker.Item label="Aktif Değil" value={11} />
                    </Picker>
                </View>
                {this.state.errors.status && <HelperText type="error" visible style={styles.helper}>
                    {this.state.errors.status}
                </HelperText>}

                <View style={{ flex: 1, margin: 10 }}>
                    <View style={{ flexDirection: "row" }}>
                        <Checkbox
                            color="#139740"
                            status={this.state.default ? 'checked' : 'unchecked'}
                            onPress={() => {
                                this.setState({ default: !this.state.default });
                            }}
                        />
                        <View style={{ flexDirection: "column", justifyContent: 'center' }}>
                            <Text>Varsayılan</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.button}>
                    <Button icon="check-bold" mode="contained"
                        loading={this.state.loading}
                        onPress={() => this.updateIban()}>Güncelle</Button>
                </View>
            </ScrollView>
        );
    }
}

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
    button: {
        margin: 15,
    },
    helper: {
        marginLeft: 5,
    },
    hyperlinkStyle: {
        color: 'blue',
    },
});

export default IbanIndex;