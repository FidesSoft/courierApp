/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-11 14:35:25
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-04-16 19:11:29
 */
import React, { Component } from "react";
import axios from 'axios';
import { Text, View, ScrollView, StyleSheet } from "react-native";
import { Button, TextInput, Checkbox, HelperText } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';

import AuthStore from '../../store/AuthStore';
import * as yup from 'yup'
import { Formik } from 'formik'

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

    addIban = async (values) => {
        this.setState({ loading: true });
        let formData = new FormData();
        formData.append('iban_no', values.iban_no);
        formData.append('status', values.status);

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
                // console.log(response.data);
                this.props.navigation.navigate('IbanIndex', { refreshData: true, create: true })
            })
            .catch(error => {
                if (error.response.status == 401) {
                    AuthStore.token = null;
                    AuthStore.storeToken('');
                }
                if(error.response.data.errors){
                    this.setState({ errors: error.response.data.errors });
                  }
            });
        this.setState({ loading: false });
    }

    render() {
        return (
            <ScrollView>
                <Formik
                    initialValues={{
                        iban_no: '',
                        status: '',
                    }}

                    onSubmit={values => this.addIban(values)}
                    validationSchema={yup.object().shape({
                        status: yup
                            .string()
                            .required('Bu alan mutlaka gerekiyor.'),
                        iban_no: yup
                            .string()
                            .min(26, '??ban No en az 26 karakterden olu??mal??')
                            .max(26, '??ban No en fazla 26 karakterden olu??mal??')
                            .required('Bu alan mutlaka gerekiyor.'),
                    })}
                >
                    {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit, isSubmitting }) => (
                        <View>
                            <TextInput style={styles.input}
                                label="??ban Numaras??"
                                mode="outlined"
                                onChangeText={handleChange('iban_no')}
                                onBlur={() => setFieldTouched('iban_no')}
                                autoCapitalize="none" />
                            {((touched.iban_no && errors.iban_no) || (this.state.errors.iban_no)) && <HelperText type="error" visible style={styles.helper}>
                                {this.state.errors.iban_no ?? this.state.errors.iban_no}
                                {errors.iban_no ?? errors.iban_no}
                            </HelperText>}

                            <View style={{ flex: 1, marginTop: 15, marginLeft: 15, marginRight: 15, backgroundColor: "white", borderColor: "#F59F0B", borderWidth: 1 }}>
                                <RNPickerSelect
                                    placeholder={{ label: 'Durum Se??', value: '' }}
                                    doneText="Onayla"
                                    value={values.status}
                                    style={{ inputAndroid: { color: 'black' }, inputIOS: { height: 40, marginLeft: 15, margin: 5 } }}
                                    onValueChange={handleChange('status')}
                                    items={[
                                        { label: 'Aktif', value: '10' },
                                        { label: 'Aktif De??il', value: '11' },
                                    ]}
                                />
                            </View>
                            {((touched.status && errors.status) || (this.state.errors.status)) && <HelperText type="error" visible style={styles.helper}>
                                {this.state.errors.status ?? this.state.errors.status}
                                {errors.status ?? errors.status}
                            </HelperText>}

                            <View style={{ flex: 1, margin: 10 }}>

                                <View style={{ flexDirection: "row" }}>
                                {/* <View style={{ backgroundColor: '#ffffff' }}> */}
                                    <Checkbox
                                        color="#139740"
                                        status={this.state.default ? 'checked' : 'unchecked'}
                                        onPress={() => {
                                            this.setState({ default: !this.state.default });
                                        }}
                                    />
                                    <View style={{ flexDirection: "column", justifyContent: 'center' }}>
                                        <Text>Varsay??lan</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.button}>
                                <Button icon="check-bold" mode="contained"
                                    loading={isSubmitting} onPress={handleSubmit}>Kaydet</Button>
                            </View>
                        </View>
                    )}
                </Formik>
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
