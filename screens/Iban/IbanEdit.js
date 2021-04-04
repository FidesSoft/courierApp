/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-11 17:11:37
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-04-05 01:09:01
 */
import React, { Component } from "react";
import axios from 'axios';
import { Text, View, ScrollView, StyleSheet } from "react-native";
import { Button, TextInput, Checkbox, HelperText, Snackbar } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import AuthStore from '../../store/AuthStore';
import * as yup from 'yup'
import { Formik } from 'formik'

class IbanIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            id: '',
            default: false,
            loading: false,
        };
    }

    componentDidMount() {

        this.setState({
            id: this.props.route.params.item.id,
            default: this.props.route.params.item.default,
        });
    }

    updateIban = async (values) => {
        let formData = new FormData();
        formData.append('iban_no', values.iban_no);
        formData.append('status', values.status);
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
                if (error.response.status == 401) {
                    AuthStore.token = null;
                    AuthStore.storeToken('');
                }
                this.setState({ errors: error.response.data.errors });
            });
    }


    render() {
        return (
            <ScrollView>
                <Formik
                    initialValues={{
                        iban_no: this.props.route.params.item.iban_no,
                        status: this.props.route.params.item.status_id,
                    }}

                    onSubmit={values => this.updateIban(values)}
                    validationSchema={yup.object().shape({
                        status: yup
                            .string()
                            .required('Bu alan mutlaka gerekiyor.'),
                        iban_no: yup
                            .string()
                            .min(26, 'İban No en az 26 karakterden oluşmalı')
                            .max(26, 'İban No en fazla 26 karakterden oluşmalı')
                            .required('Bu alan mutlaka gerekiyor.'),
                    })}
                >
                    {({ values, handleChange, errors, setFieldTouched, touched, setFieldValue, handleSubmit, isSubmitting }) => (
                        <View>
                            <TextInput style={styles.input}
                                label="İban Numarası"
                                mode="outlined"
                                value={values.iban_no}
                                onChangeText={handleChange('iban_no')}
                                onBlur={() => setFieldTouched('iban_no')}
                                autoCapitalize="none" />
                            {((touched.iban_no && errors.iban_no) || (this.state.errors.iban_no)) && <HelperText type="error" visible style={styles.helper}>
                                {this.state.errors.iban_no ?? this.state.errors.iban_no}
                                {errors.iban_no ?? errors.iban_no}
                            </HelperText>}

                            <View style={{ flex: 1, marginTop: 15, marginLeft: 15, marginRight: 15, backgroundColor: "white", borderColor: "#F59F0B", borderWidth: 1 }}>
                            <Picker
                                    selectedValue={values.status}
                                    onValueChange={(itemValue) => setFieldValue('status', itemValue)}>
                                    <Picker.Item label="Durum Seç" value="" />
                                    <Picker.Item label="Aktif" value={10} />
                                    <Picker.Item label="Aktif Değil" value={11} />
                                </Picker>
                            </View>
                            {((touched.status && errors.status) || (this.state.errors.status)) && <HelperText type="error" visible style={styles.helper}>
                                {this.state.errors.status ?? this.state.errors.status}
                                {errors.status ?? errors.status}
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
                                    loading={isSubmitting} onPress={handleSubmit}>Güncelle</Button>
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

export default IbanIndex;