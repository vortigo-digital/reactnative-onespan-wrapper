/**
 * Sample OneSpan OrchestrationSDK
 * https://dev.azure.com/vortigo-af/_git/OneSpan?path=%2F&version=GBandroid-module&_a=contents
 */

import React, { useEffect } from 'react';
import { Button } from 'react-native';
import { executeAPICommand } from './apiUtils';
import OnespanWrapper from '@vortigo/react-native-onespan-wrapper';

const data = {
  user: 'vortigo123',
  activationCode: 'fKBIz6M7',
  pin: '147369',
};

const NewModuleButton = () => {
  const onSubmit = async () => {
    // ------- start activation -------

    try {
      /*
        OSActivationModule.activate
        params:
        userIdentifier: string
        activationPassword: string
       */
      const command = await OnespanWrapper.activate(
        data.user,
        data.activationCode
      );

      // promisse for a command
      console.log(`activation command: ${command}`);

      // request to /v1/orchestration-commands OCA
      const apiResponseCommand = await executeAPICommand(command);

      if (apiResponseCommand) {
        // send command to orchestrationSDK.execute
        console.log(`apiResponseCommand: ${apiResponseCommand}`);
        onespanExecute(apiResponseCommand);
      }
    } catch (e) {
      console.error(e);
    }
  };

  async function onespanExecute(command: string) {
    try {
      /*
        OSActivationModule.execute
        params:
        command: string
       */
      const response = await OnespanWrapper.execute(command);

      // promisse for a command or success
      console.log(`onespan execute: ${response}`);

      if (response == 'success') {
        // activation complete next pass registerForNotification
        console.log(`activation ${response}`);
        onespanRegisterNotification();
      } else {
        // request to /v1/orchestration-commands OCA
        const apiResponseCommand = await executeAPICommand(response);

        if (apiResponseCommand) {
          // send command to orchestrationSDK.execute
          console.log(`apiResponseCommand: ${apiResponseCommand}`);
          onespanExecute(apiResponseCommand);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  // ------- remove current user -------
  const onDelete = async () => {
    try {
      const response = await OnespanWrapper.removeCurrentUser();

      if (response) {
        console.log(`remove user: ${response}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ------- register notification -------

  async function onespanRegisterNotification() {
    try {
      /*
        OSRegisterNotificationModule.registerForNotifications
        params:
       */
      const command = await OnespanWrapper.registerNotification.register();

      // promisse for a command
      console.log(`notification command: ${command}`);

      // request to /v1/orchestration-commands OCA
      const apiResponseCommand = await executeAPICommand(command);

      if (apiResponseCommand) {
        // send command to orchestrationSDK.execute
        console.log(`apiResponseCommand: ${apiResponseCommand}`);
        onespanNotificationExecute(apiResponseCommand);
      }
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
      const response = await OnespanWrapper.registerNotification.execute(
        command
      );

      // promisse for a command or "notificationId:0123.."
      let substring = response.substring(0, 14);
      console.log(`onespan execute: ${substring}`);

      if (substring == 'notificationId') {
        // register notification complete
        console.log(`register notification ${response}`);
      } else {
        // request to /v1/orchestration-commands OCA
        const apiResponseCommand = await executeAPICommand(response);

        if (apiResponseCommand) {
          // send command to orchestrationSDK.execute
          console.log(`apiResponseCommand: ${apiResponseCommand}`);
          onespanNotificationExecute(apiResponseCommand);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    setOnespanSettings();
  }, []);

  // ------- set onespan settings -------

  async function setOnespanSettings() {
    try {
      /*
        OSSettingsModule.setSettings
        params:
        domainIdentifier: string
        saltStorage: string
        saltDigipass: string
        mainActivityPath: string - ex: com.package.name.YourActivity - needs for push notification
       */
      const response = await OnespanWrapper.config(
        'sybrandreinders-vort',
        '38af4675075cb1971a5fe79d59e702d711577b40a6e06ab75696bbd4aaddebdc',
        '5910c093a9e6777c8291679ed655328da20958f2c4a11e03a3768b9e12e36d73',
        'com.example.reactnativeonespanbridgeandroid.MainActivity'
      );

      // promisse for a success response string
      console.log(`onespan settings: ${response}`);

      if (response == 'success') {
        checkNotification();
      }
    } catch (e) {
      console.error(e);
    }
  }

  // ------- authentication with push notification -------

  async function checkNotification() {
    try {
      /*
       OSAuthWithPushNotificationModule.checkNotificationAndExecute
       always check if received push notification
      */
      const response = await OnespanWrapper.pushNotification.checkAndExecute();

      // promisse for a command or ""
      console.log(`checkNotificationAndExecute ${response}`);

      if (response != '') {
        // request to /v1/orchestration-commands OCA
        const apiResponseCommand = await executeAPICommand(response);

        if (apiResponseCommand) {
          // send command to orchestrationSDK.execute
          console.log(`apiResponseCommand: ${apiResponseCommand}`);
          onespanAuthPushNotificationExecute(apiResponseCommand);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function onespanAuthPushNotificationExecute(command: string) {
    try {
      /*
        OSAuthWithPushNotificationModule.execute
        params:
        command: string
       */
      const response = await OnespanWrapper.pushNotification.execute(command);

      // promisse for a command or dataToDisplay or success
      let splitString = response.split(':');
      console.log(`OSAuthWithPushNotificationModule.execute resp: ${response}`);

      if (splitString[0] == 'data') {
        // display host and user wants to connect
        // then accept or reject the authentication
        // this example accepted authentication (true)
        onespanAuthenticationApproved(true);
      } else if (splitString[0] == 'success') {
        console.log(`Authentication With Push Notification: ${splitString[1]}`);
      } else {
        // request to /v1/orchestration-commands OCA
        const apiResponseCommand = await executeAPICommand(response);

        if (apiResponseCommand) {
          // send command to orchestrationSDK.execute
          console.log(`apiResponseCommand: ${apiResponseCommand}`);
          onespanAuthPushNotificationExecute(apiResponseCommand);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function onespanAuthenticationApproved(approved: boolean) {
    /*
      OSAuthWithPushNotificationModule.authenticationApproved
      params:
      approved: boolean
    */
    try {
      const response = await OnespanWrapper.pushNotification.isApproved(
        approved
      );

      // promisse for a pin(required) or command
      console.log(`authenticationApproved ${response}`);
      let splitString = response.split(':');

      if (splitString[0] == 'pin') {
        // create a view with password field
        onespanOnUserAuthenticationInput(data.pin);
      } else {
        // request to /v1/orchestration-commands OCA
        const apiResponseCommand = await executeAPICommand(response);

        if (apiResponseCommand) {
          // send command to orchestrationSDK.execute
          console.log(`apiResponseCommand: ${apiResponseCommand}`);
          onespanAuthPushNotificationExecute(apiResponseCommand);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  /*
      OSAuthWithPushNotificationModule.onUserAuthenticationInput
      params:
      pin: string
    */
  async function onespanOnUserAuthenticationInput(pin: string) {
    // if user aborted authentication - send "" or send pin for auth
    const response = await OnespanWrapper.pushNotification.authWithPin(pin);

    // promisse for a command
    console.log(`onUserAuthenticationInput ${response}`);

    if (response) {
      // request to /v1/orchestration-commands OCA
      const apiResponseCommand = await executeAPICommand(response);

      if (apiResponseCommand) {
        // send command to orchestrationSDK.execute
        console.log(`apiResponseCommand: ${apiResponseCommand}`);
        onespanAuthPushNotificationExecute(apiResponseCommand);
      }
    }
  }

  // ------- start QRCode Scanner -------
  const onScan = async () => {
    try {
      const responseScan = await OnespanWrapper.scanQrCode();
      console.log(`responseScan: ${responseScan}`);

      const response = await OnespanWrapper.pushNotification.execute(
        responseScan
      );
      // promisse for a command / "canceled:" or "exception:"
      console.log(`onScan.execute: ${response}`);

      if (response) {
        // request to /v1/orchestration-commands OCA
        const apiResponseCommand = await executeAPICommand(response);

        if (apiResponseCommand) {
          // send command to orchestrationSDK.execute
          console.log(`apiResponseCommand: ${apiResponseCommand}`);
          onespanAuthPushNotificationExecute(apiResponseCommand);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Button title="Start Activation!" color="#841584" onPress={onSubmit} />
      <Button title="Remove current user" color="#841584" onPress={onDelete} />
      <Button title="Scan QRCode" color="#841584" onPress={onScan} />
    </>
  );
};

export default NewModuleButton;
