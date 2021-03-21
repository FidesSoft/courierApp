/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-04 21:45:43
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-03-04 23:50:16
 */
import React, {Component} from 'react';
import { Appbar, Menu, Divider } from 'react-native-paper';
import AuthStore from '../../store/AuthStore';
import { Image} from 'react-native';
import {observer} from 'mobx-react';

@observer
export default class HomeAppbar extends Component {
  render() {
    const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';
    return (
      <Appbar.Header>
       {this.props.previous ? <Appbar.BackAction onPress={this.props.navigation.goBack} /> : <Image
              style={{ width: 200, height: 50 }}
              source={require('../../assets/images/logo.png')}
              resizeMode='contain'
            />
           
    }
    
         {!this.props.previous ? <Appbar.Content
    color="#139740"
    title={this.props.scene.route.params.screenTitle}
    subtitle=""
    /> : <Appbar.Content
    title={this.props.scene.route.params.screenTitle}
    subtitle={this.props.scene.route.params.screenDescription}
    /> }
        <Menu
            visible={AuthStore.menu}
            onDismiss={() => AuthStore._closeMenu()}
            anchor={
                <Appbar.Action
              icon={MORE_ICON}
              color="white"
              onPress={() => AuthStore._openMenu()}
            />
            }
          >
            <Menu.Item icon="account" onPress={() => {this.props.navigation.navigate('Profile');  AuthStore._closeMenu(); }} title="Profil" />
            <Divider />
            <Menu.Item icon="pencil" onPress={() => {this.props.navigation.navigate('Contact'); AuthStore._closeMenu();}} title="İletişim" />
            <Divider />
            <Menu.Item icon="login" onPress={() => {AuthStore.logOut(); AuthStore._closeMenu(); }} title="Çıkış" />
          </Menu>
        </Appbar.Header>
    
  );
}
}