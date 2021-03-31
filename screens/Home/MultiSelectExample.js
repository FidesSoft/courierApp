/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-31 13:40:25
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-03-31 13:56:56
 */
import React, { Component } from 'react';

// import all the components we are going to use
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import AuthStore from '../../store/AuthStore';
import axios from 'axios';

// import MultiSelect library
import MultiSelect from 'react-native-multiple-select';

// Dummy Data for the MutiSelect
const items = [
    // name key is must. It is to show the text in front
    { id: 1, name: 'angellist' },
    { id: 2, name: 'codepen' },
    { id: 3, name: 'envelope' },
    { id: 4, name: 'etsy' },
    { id: 5, name: 'facebook' },
    { id: 6, name: 'foursquare' },
    { id: 7, name: 'github-alt' },
    { id: 8, name: 'github' },
    { id: 9, name: 'gitlab' },
    { id: 10, name: 'instagram' },
    { id: 11, name: 'angellist' },
    { id: 12, name: 'codepen' },
    { id: 13, name: 'envelope' },
    { id: 14, name: 'etsy' },
    { id: 15, name: 'facebook' },
    { id: 16, name: 'foursquare' },
    { id: 17, name: 'github-alt' },
    { id: 18, name: 'github' },
    { id: 19, name: 'gitlab' },
    { id: 20, name: 'instagram' },
];

export default class MultiSelectExample extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedItems: [3,1],
            districts: [],
        };
    }

    componentDidMount() {
        this.getDistricts(1);
    }

    getDistricts = async (itemValue) => {
        let uri = `${global.apiUrl}/get-city-districts/${itemValue}`;
        await axios.get(uri, {
            headers: {
                'Accept': 'application/json',
            }
        })
            .then((response) => {
                this.setState({ districts: response.data });
            })
            .catch(error => {
                if (error.response.status == 401) {
                    AuthStore.token = null;
                    AuthStore.storeToken('');
                }
            });
    }

    onSelectedItemsChange = (myselectedItems) => {
        this.setState({ selectedItems: myselectedItems }, () => {
            console.log(this.state.selectedItems)
        });
        
    };
    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.container}>
                    <Text style={styles.titleText}>
                        Multiple Select / Dropdown / Picker Example
                        in React Native
        </Text>
                    <MultiSelect
                        styleListContainer={{ height: 256 }}
                        hideTags
                        items={this.state.districts}
                        uniqueKey="id"
                        onSelectedItemsChange={this.onSelectedItemsChange}
                        selectedItems={this.state.selectedItems}
                        selectText="İlçeler Seç"
                        searchInputPlaceholderText="İlçe Ara..."
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
                    />
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
    },
    titleText: {
        padding: 8,
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    headingText: {
        padding: 8,
    },
});