/**
 * Sample OneSpan OrchestrationSDK
 * https://dev.azure.com/vortigo-af/_git/OneSpan?path=%2F&version=GBandroid-module&_a=contents
 */

import React from 'react';
import { NativeModules, Button } from 'react-native';

const { OSSettingsModule, OSActivationModule, OSRegisterNotificationModule } = NativeModules;

const NewModuleButton = () => {

  const onSubmit = async () => {

    // ------- set settings -------

    try {
      /*
        OSSettingsModule.setSettings
        params: 
        accountIdentifier: string
        cloudServerUrl: string
        saltStorage: string
        saltDigipass: string
       */
      const response = await OSSettingsModule.setSettings(
        'sybrandreinders-vort',
        '.sdb.tid.onespan.cloud',
        '38af4675075cb1971a5fe79d59e702d711577b40a6e06ab75696bbd4aaddebdc',
        '5910c093a9e6777c8291679ed655328da20958f2c4a11e03a3768b9e12e36d73'
      );

      // promisse for a success response string
      console.log(`onespan settings: ${response}`);

      if (response == "success") {
        onespanActivate();
      }

    } catch (e) {
      console.error(e);
    }

  };

  // ------- start activation -------

  async function onespanActivate() {

    try {
      /*
        OSActivationModule.activate
        params: 
        userIdentifier: string
        activationPassword: string
       */
      const command = await OSActivationModule.activate(
        'felipe7',
        'u7ej0A18',
      );

      // promisse for a command string
      console.log(`activation command: ${command}`);

      // firt - request to /v1/orchestration-commands
      // then - send command response to onespanExecute
      onespanExecute(command)

    } catch (e) {
      console.error(e);
    }
  }

  async function onespanExecute(command: string) {

    try {
      /*
        OSActivationModule.execute
        params: 
        command: string
       */
      const response = await OSActivationModule.execute(
        command
      );

      // promisse for a command or success response string
      console.log(`onespan execute: ${response}`);

      if (response == "success") {
        // activation complete next pass registerForNotification
        console.log(`activation ${response}`);
        onespanRegisterNotification();

      } else {
        // resend command to orchestrationSDK
        onespanExecute(response);
      }

    } catch (e) {
      console.error(e);
    }
  }

  // ------- register notification -------

  async function onespanRegisterNotification() {

    try {
      /*
        OSRegisterNotificationModule.registerForNotifications
        params: 
       */
      const command = await OSRegisterNotificationModule.registerForNotifications();

      // promisse for a command string
      console.log(`notification command: ${command}`);

      // firt - request to /v1/orchestration-commands
      // then - send command response to onespanExecute
      onespanNotificationExecute(command);

    } catch (e) {
      console.error(e);
    }
  }

  async function onespanNotificationExecute(command: string) {

    try {
      /*
        OSRegisterNotificationModule.execute
        params: 
        command: string
       */
      const response = await OSRegisterNotificationModule.execute(
        command
      );

      // promisse for a command or "notificationId:0123..009" response string
      let substring = response.substring(0,14);
      console.log(`onespan execute: ${substring}`);

      if (substring == "notificationId") {  
        // register notification complete
        console.log(`register notification ${response}`);

      } else {
        // resend command to orchestrationSDK
        onespanNotificationExecute(response);
      }

    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Button
      title='Start Activation!'
      color='#841584'
      onPress={onSubmit}
    />
  );
};

export default NewModuleButton;