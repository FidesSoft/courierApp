/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-12 21:08:08
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-04-05 01:07:54
 */

import React, { Component } from "react";
import axios from 'axios';
import { View, ScrollView, StyleSheet } from "react-native";
import { Button, TextInput, HelperText } from 'react-native-paper';
import AuthStore from '../../store/AuthStore';
import * as yup from 'yup'
import { Formik } from 'formik'

class AddBalance extends Component {

    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            balance: '',
            default: false,
            loading: false,
        };
    }

    componentDidMount() {
        // 
    }

    handleBalance = (text) => this.setState({ balance: text });

    addNewBalance = async (values) => {
        // this.setState({ loading: true });
        let formData = new FormData();
        formData.append('balance', values.balance);

        let uri = `${global.apiUrl}/payment/add-balance`;
        await axios.post(uri, formData, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${AuthStore.token}`
            }
        })
            .then((response) => {
                this.props.navigation.navigate('Pay', { item: response.data })
            })
            .catch(error => {
                if (error.response.status == 401) {
                    AuthStore.token = null;
                    AuthStore.storeToken('');
                }
                this.setState({ errors: error.response.data.errors });
            });
        // this.setState({ loading: false });
    }

    render() {
        return (
            <ScrollView>
                <Formik
                    initialValues={{
                        balance: '',
                    }}
                    onSubmit={values => this.addNewBalance(values)}
                    validationSchema={yup.object().shape({
                        balance: yup
                            .string('Geçersiz karakterler içeriyor.')
                            .required('Bu alan mutlaka gerekiyor.'),
                    })}
                >
                    {({ handleChange, errors, setFieldTouched, touched, handleSubmit, isSubmitting }) => (
                        <View>
                            <TextInput style={styles.input}
                                label="Ödeme Miktarı"
                                mode="outlined"
                                keyboardType = 'numeric'
                                onChangeText={handleChange('balance')}
                                onBlur={() => setFieldTouched('balance')}
                                autoCapitalize="none" />
                            {((touched.balance && errors.balance) || (this.state.errors.balance)) && <HelperText type="error" visible style={styles.helper}>
                                {this.state.errors.balance ?? this.state.errors.balance}
                                {errors.balance ?? errors.balance}
                            </HelperText>}

                            <View style={styles.button}>
                                <Button icon="check-bold" mode="contained"
                                    loading={isSubmitting} onPress={handleSubmit}>Ödeme Yap</Button>
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

export default AddBalance;
