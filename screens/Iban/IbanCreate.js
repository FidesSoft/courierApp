/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-11 14:35:25
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-03-22 20:17:30
 */
import React, { Component } from "react";
import axios from 'axios';
import { Text, View, ScrollView, StyleSheet } from "react-native";
import { Button, TextInput, Checkbox, HelperText, Snackbar } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import AuthStore from '../../store/AuthStore';


class IbanCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            iban_no: '',
            status: '',
            default: false,
            loading: false,
        };
    }

    handleIbanNo = (text) => this.setState({ iban_no: text });
    handleStatus = (text) => this.setState({ status: text });

    addIban = async() => {
        this.setState({ loading: true });
        let formData = new FormData();
        formData.append('iban_no', this.state.iban_no);
        formData.append('status', this.state.status);

        if (this.state.default) {
            formData.append('default', this.state.default);
        }

        let uri = `${global.apiUrl}/iban/store`;
        await axios.post(uri, formData, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${AuthStore.token}`
            }
        })
            .then((response) => {
                console.log(response.data);
                this.props.navigation.navigate('IbanIndex', { refreshData: true, create: true })
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
                    onChangeText={text => this.handleIbanNo(text)}
                    autoCapitalize="none" />
                {this.state.errors.iban_no && <HelperText type="error" visible style={styles.helper}>
                    {this.state.errors.iban_no}
                </HelperText>}

                <View style={{ flex: 1, marginTop: 15, marginLeft: 15, marginRight: 15, backgroundColor: "white", borderColor: "#F59F0B", borderWidth: 1  }}>
                    <Picker
                        selectedValue={this.state.status}
                        onValueChange={(itemValue) =>
                            this.setState({ status: itemValue })
                        }>
                        <Picker.Item label="Durum Seç" value="" />
                        <Picker.Item label="Aktif" value="10" />
                        <Picker.Item label="Aktif Değil" value="11" />
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
                        onPress={() => this.addIban()}>Kaydet</Button>
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

export default IbanCreate;