/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-22 15:18:57
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-04-03 14:15:52
 */
import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { Button, Checkbox, TextInput, Snackbar, HelperText, Avatar, Dialog, Portal } from 'react-native-paper';
import axios from 'axios';
import { observer } from 'mobx-react';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from "react-native-image-picker"
import DateTimePicker from '@react-native-community/datetimepicker';
import MultiSelect from 'react-native-multiple-select';

import moment from "moment";

import AuthStore from '../../store/AuthStore';

@observer
class ProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {            
            date: new Date('2021-01-01'),
            show: false,
            dialogCities: false,
            dialogDistricts: false,
        };
    }

    setDate = (event, date) => {
        this.setState({
            show: Platform.OS === 'ios' ? true : false,
            date,
        });
        date = date || this.state.date;
        AuthStore.handleBirthDate(moment(date).format('YYYY-MM-DD'));
    }

    show = () => {
        this.setState({
            show: true,
        });
    }

    datepicker = () => {
        this.show();
    }

    showDialogCities() { this.setState({ dialogCities: true }); }
    hideDialogCities() { this.setState({ dialogCities: false }); }

    showDialogDistricts() { this.setState({ dialogDistricts: true }); }
    hideDialogDistricts() { this.setState({ dialogDistricts: false }); }

    componentDidMount() {
        AuthStore.errors = {};
        AuthStore.email = '';
        AuthStore.password = '';
        AuthStore.name = '';
        AuthStore.tcno = '';
        AuthStore.phone = '';
        AuthStore.vehicle = '';
        AuthStore.plate = '';
        AuthStore.color = '';
        AuthStore.balance = 0;
        AuthStore.birth_date = new Date('2021-01-01');;
        AuthStore.on_duty = false;
        AuthStore.loading = false;
        AuthStore.current_image = null;
        AuthStore.imagePath = '';
        AuthStore.courier_city = [];
        AuthStore.courier_districts = [];
        AuthStore.getUser();
    }
    componentWillUnmount() {
        AuthStore.errors = {};
        AuthStore.email = '';
        AuthStore.password = '';
        AuthStore.name = '';
        AuthStore.tcno = '';
        AuthStore.phone = '';
        AuthStore.vehicle = '';
        AuthStore.plate = '';
        AuthStore.color = '';
        AuthStore.balance = 0;
        AuthStore.birth_date = new Date('2021-01-01');
        AuthStore.on_duty = false;
        AuthStore.loading = false;
        AuthStore.current_image = null;
        AuthStore.imagePath = '';
        AuthStore.courier_city = [];
        AuthStore.courier_districts = [];
    }

    imageGalleryLaunch = () => {
        let options = {
            storageOptions: {
                skipBackup: true,
                includeBase64: true,
                path: 'images',
            },
        };

        ImagePicker.launchImageLibrary(options, (res) => {
            // console.log('Response = ', res);
            if (res.didCancel) {
                console.log('User cancelled image picker');
            } else if (res.error) {
                console.log('ImagePicker Error: ', res.error);
            } else if (res.customButton) {
                console.log('User tapped custom button: ', res.customButton);
                alert(res.customButton);
            } else {
                const source = { uri: res.uri };
                // console.log('response', JSON.stringify(res));
                AuthStore.imagePath = res;
            }
        });
    }

    render() {
        const { show, date, mode } = this.state;

        return (
            <View style={{ flex: 1, alignItems: 'stretch', backgroundColor: '#F5FCFF' }}>
                <ScrollView>
                    <View style={{ flex: 1, alignItems: 'center', margin: 10 }}>

                        {AuthStore.imagePath.uri &&
                            <Avatar.Image style={{ margin: 10 }} size={120} source={{ uri: AuthStore.imagePath.uri }} />}

                        {AuthStore.current_image && !AuthStore.imagePath.uri &&
                            <Avatar.Image style={{ margin: 10 }} size={120} source={{ uri: `${global.url}/storage/courier/${AuthStore.current_image}` }} />}

                        {!AuthStore.current_image && !AuthStore.imagePath.uri &&
                            <Avatar.Text style={{ margin: 10 }} size={120} label={(AuthStore.name).substring(0, 2)} />}

                        <Button icon="camera" mode="contained" onPress={this.imageGalleryLaunch}>Fotograf Ekle</Button>
                        <Text style={{ marginTop: 15, }}>Bakiyeniz: {AuthStore.balance} ₺</Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'flex-start'
                    }}>
                        <View style={{ width: '50%' }}>
                            <TextInput style={styles.input}
                                onFocus={() => this.showDialogCities()}
                                // value={moment(AuthStore.birth_date).format('YYYY-MM-DD')}
                                label="İl Listesi"
                                mode="outlined"
                                // onChangeText={text => AuthStore.handleBirthDate(text)}
                                autoCapitalize="none" />
                            
                            {AuthStore.errors.courier_city && <HelperText type="error" visible style={styles.helper}>
                                {AuthStore.errors.courier_city}
                            </HelperText>}
                        </View>
                        <View style={{ width: '50%' }}>
                            <TextInput style={styles.input}
                                onFocus={() => this.showDialogDistricts()}
                                // value={moment(AuthStore.birth_date).format('YYYY-MM-DD')}
                                label="İlçe Seç"
                                mode="outlined"
                                // onChangeText={text => AuthStore.handleBirthDate(text)}
                                autoCapitalize="none" />
                            {AuthStore.errors.courier_districts && <HelperText type="error" visible style={styles.helper}>
                                {AuthStore.errors.courier_districts}
                            </HelperText>}
                        </View>
                    </View>


                    <TextInput style={styles.input}
                        value={AuthStore.tcno}
                        label="TC No"
                        mode="outlined"
                        onChangeText={text => AuthStore.handleTcNo(text)}
                        autoCapitalize="none" />
                    {AuthStore.errors.tcno && <HelperText type="error" visible style={styles.helper}>
                        {AuthStore.errors.tcno}
                    </HelperText>}

                    <TextInput style={styles.input}
                        value={AuthStore.name}
                        label="Ad"
                        mode="outlined"
                        onChangeText={text => AuthStore.handleName(text)}
                        autoCapitalize="none" />

                    {AuthStore.errors.name && <HelperText type="error" visible style={styles.helper}>
                        {AuthStore.errors.name}
                    </HelperText>}

                    <TextInput style={styles.input}
                        value={AuthStore.phone}
                        label="Telefon"
                        mode="outlined"
                        onChangeText={text => AuthStore.handlePhone(text)}
                        autoCapitalize="none" />
                    {AuthStore.errors.phone && <HelperText type="error" visible style={styles.helper}>
                        {AuthStore.errors.phone}
                    </HelperText>}

                    <TextInput style={styles.input}
                        label="Email"
                        value={AuthStore.email}
                        mode="outlined"
                        keyboardType="email-address"
                        onChangeText={text => AuthStore.handleEmail(text)}
                        autoCapitalize="none" />
                    {AuthStore.errors.email && <HelperText type="error" visible style={styles.helper}>
                        {AuthStore.errors.email}
                    </HelperText>}

                    <TextInput style={styles.input}
                        label="Şifre"
                        mode="outlined"
                        autoCapitalize="none"
                        onChangeText={text => AuthStore.handlePassword(text)}
                        secureTextEntry={true} />
                    {AuthStore.errors.password && <HelperText type="error" style={styles.helper}>
                        {AuthStore.errors.password}
                    </HelperText>}


                    <TextInput style={styles.input}
                        value={AuthStore.vehicle}
                        label="Araç Türü"
                        mode="outlined"
                        onChangeText={text => AuthStore.handleVehicle(text)}
                        autoCapitalize="none" />
                    {AuthStore.errors.vehicle && <HelperText type="error" visible style={styles.helper}>
                        {AuthStore.errors.phone}
                    </HelperText>}

                    <TextInput style={styles.input}
                        value={AuthStore.color}
                        label="Renk"
                        mode="outlined"
                        onChangeText={text => AuthStore.handleColor(text)}
                        autoCapitalize="none" />
                    {AuthStore.errors.color && <HelperText type="error" visible style={styles.helper}>
                        {AuthStore.errors.color}
                    </HelperText>}

                    <TextInput style={styles.input}
                        value={AuthStore.plate}
                        label="Plaka"
                        mode="outlined"
                        onChangeText={text => AuthStore.handlePlate(text)}
                        autoCapitalize="none" />
                    {AuthStore.errors.plate && <HelperText type="error" visible style={styles.helper}>
                        {AuthStore.errors.plate}
                    </HelperText>}

                    {/* <TextInput style={styles.input}
                        value={moment(AuthStore.birth_date).format('YYYY-MM-DD')}
                        label="Doğum Tarihi"
                        mode="outlined"
                        onChangeText={text => AuthStore.handleBirthDate(text)}
                        autoCapitalize="none" /> */}




                    <TextInput style={styles.input}
                        onFocus={() => this.datepicker()}
                        value={moment(AuthStore.birth_date).format('YYYY-MM-DD')}
                        label="Yeni Doğum Tarihi"
                        mode="outlined"
                        onChangeText={text => AuthStore.handleBirthDate(text)}
                        autoCapitalize="none" />
                    {AuthStore.errors.birth_date && <HelperText type="error" visible style={styles.helper}>
                        {AuthStore.errors.birth_date}
                    </HelperText>}

                    {show && <DateTimePicker value={new Date(AuthStore.birth_date)}
                        mode="date"
                        is24Hour={true}
                        display="default"
                        onChange={this.setDate} />
                    }

                    <View style={{ flex: 1, margin: 10 }}>
                        <View style={{ flexDirection: "row" }}>
                            <Checkbox
                                color="#139740"
                                status={AuthStore.on_duty ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    AuthStore.handleOnDuty();
                                }}
                            />
                            <View style={{ flexDirection: "column", justifyContent: 'center' }}>
                                <Text>
                                    Çalışma Durumu
                             </Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ flex: 1, alignItems: 'center', margin: 15 }}>
                        <Button icon="send" loading={AuthStore.loading} mode="contained" onPress={() => AuthStore.updateProfile()}>Profilimi Güncelle</Button>
                    </View>
                </ScrollView>

                <Snackbar visible={AuthStore.updateProfileSnackbar} onDismiss={() => AuthStore.onDismissUpdateProfileSnackbar()}
                    duration={2000} action={{ label: 'Gizle', onPress: () => { AuthStore.onDismissUpdateProfileSnackbar() } }}>
                    Profiliniz başarıyla güncellendi.</Snackbar>
                <Portal>
                    <Dialog visible={this.state.dialogCities} onDismiss={() => this.hideDialogCities()}>
                        <Dialog.Title>İl Seçin</Dialog.Title>
                        <Dialog.Content>
                            <MultiSelect
                                flatListProps={{ nestedScrollEnabled: true }}
                                styleListContainer={{ height: 256 }}
                                hideTags
                                items={AuthStore.cities}
                                uniqueKey="id"
                                onSelectedItemsChange={(itemValue) => this.getDistrictsAfterSelectedCity(itemValue)}
                                selectedItems={AuthStore.courier_city}
                                selectText="İl Seç"
                                searchInputPlaceholderText="İl Ara..."
                                onChangeInput={(text) => console.log(text)}
                                tagRemoveIconColor="#CCC"
                                tagBorderColor="#CCC"
                                tagTextColor="#CCC"
                                selectedItemTextColor="#CCC"
                                selectedItemIconColor="#CCC"
                                itemTextColor="#000"
                                displayKey="name"
                                searchInputStyle={{ color: '#CCC' }}
                                submitButtonColor="#48d22b"
                                submitButtonText="Kaydet"
                                single={true}
                            />
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => this.hideDialogCities()}>Kapat</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
                <Portal>
                    <Dialog visible={this.state.dialogDistricts} onDismiss={() => this.hideDialogDistricts()}>
                        <Dialog.Title>İlçeler Seçin</Dialog.Title>
                        <Dialog.Content>
                            <MultiSelect
                                flatListProps={{ nestedScrollEnabled: true }}
                                styleListContainer={{ height: 256 }}
                                hideTags
                                items={AuthStore.districts}
                                uniqueKey="id"
                                onSelectedItemsChange={(itemValue) =>
                                    AuthStore.handleDistrictId(itemValue)}
                                selectedItems={AuthStore.courier_districts}
                                selectText="İlçeler Seç"
                                searchInputPlaceholderText="İlçe Ara..."
                                // onChangeInput={(text) => console.log(text)}
                                tagRemoveIconColor="#CCC"
                                tagBorderColor="#CCC"
                                tagTextColor="#CCC"
                                selectedItemTextColor="#CCC"
                                selectedItemIconColor="#CCC"
                                itemTextColor="#000"
                                displayKey="name"
                                searchInputStyle={{ color: '#CCC' }}
                                submitButtonColor="#F59F0B"
                                submitButtonText="Kaydet"
                                hideSubmitButton={true}
                            />
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => this.hideDialogDistricts()}>Kapat</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </View>
        );
    }
}

export default ProfileScreen;

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
    helper: {
        marginLeft: 5,
    },
    button: {
        width: 250,
        height: 60,
        backgroundColor: '#3740ff',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        marginBottom: 12
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 15,
        color: '#fff'
    }
});
