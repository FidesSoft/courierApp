/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-21 13:20:44
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-03-26 12:04:09
 */
import React, { useState, useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Platform, PermissionsAndroid } from 'react-native';

import axios from 'axios';
import BackgroundTimer from 'react-native-background-timer';
import Geolocation from 'react-native-geolocation-service';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import AuthStore from '../../store/AuthStore';

import HomeStack from './HomeStack';
import IbanStack from './IbanStack';
import PaymentStack from './PaymentStack';

const Tab = createMaterialBottomTabNavigator();

export default function UserTab() {
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  useEffect(() => {
    requestPermissions();
    if (hasLocationPermission) {
      updateCourierLocation();
    } else {
      BackgroundTimer.stopBackgroundTimer();
    }
  });

  function updateCourierLocation() {
    BackgroundTimer.runBackgroundTimer(() => {
      //code that will be called every 3 seconds 
      Geolocation.getCurrentPosition(
        (position) => {
          console.log(position);
          updateCourierLatLng(position);
          //axios ile burdan gönder
        },
        (error) => {
          // See error code charts below.
          console.log(error.code, error.message);
          // hata varsa belli bir süre istek yapmaya gerek yok
          setHasLocationPermission(false);

        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    },
      // 5000);
    300000);
  }

  async function requestPermissions() {
    if (Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization("whenInUse");
      if (auth === "granted") {
        // do something if granted...
        setHasLocationPermission(true);
      }
    }

    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Konumunuza İhtiyacımız Var",
          message:
            "Size yakın gönderileri listelememiz için " +
            "konum bilgilerinize ihtiyacımız var.",
          buttonNeutral: "Daha sonra sor",
          buttonNegative: "İptal",
          buttonPositive: "İzin Ver"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('istek kabul edildi');
        // do something if granted...
        setHasLocationPermission(true);
      }
    }
  }

  function updateCourierLatLng(position) {
    let formData = new FormData();
    formData.append('latitude', position.coords.latitude);
    formData.append('longitude', position.coords.longitude);

    let uri = `${global.apiUrl}/update-lat-lng`;
     axios.post(uri, formData, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${AuthStore.token}`
      }
    })
      .then((response) => {
        console.log(response.data);
      })
      .catch(error => {
        if (error.response.status == 401) {
          AuthStore.token = null;
          AuthStore.storeToken('');
        }
      });
  }

  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#F59F0B"
      labelStyle={{ fontSize: 14 }}
      inactiveColor="#ffe77aff"
      barStyle={{ backgroundColor: '#139740' }}
    >
      <Tab.Screen name="Home" component={HomeStack}
        options={{
          tabBarLabel: 'Gönderiler',
          tabBarIcon: ({ color }) => (
            <Ionicons name="apps-outline" color={color} size={26} />
          ),
        }}
      />

      <Tab.Screen name="Iban" component={IbanStack}
        options={{
          tabBarLabel: 'Ibanlar',
          tabBarIcon: ({ color }) => (
            <Ionicons name="card-outline" color={color} size={26} />
          ),
        }} />

      <Tab.Screen name="Payment" component={PaymentStack}
        options={{
          tabBarLabel: 'Ödemeler',
          tabBarIcon: ({ color }) => (
            <Ionicons name="wallet-outline" color={color} size={26} />
          ),
        }} />

    </Tab.Navigator>
  );
}