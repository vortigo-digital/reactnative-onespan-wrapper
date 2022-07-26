import React, { useState, useEffect } from 'react';

import {
  OnespanConfig,
  OnespanActivate,
  OnespanExecute,
  OnespanRegisterNotification,
  OnespanExecuteNotification,
} from 'react-native-onespan-orchestration-sdk';
import {
  Container,
  FormWrapper,
  ActivatedView,
  ActivatedText,
  SuccessBox,
  ErrorBox,
  SuccessText,
  ErrorText,
  Registering,
  RegisteringText,
} from './styles';
import { ActivationForm, ConfigForm } from '../components';
import {
  registerUser as registerUserOnBackend,
  sendCommandToBackend,
} from '../utils';

const App = () => {
  const initialData = {
    baseURL: 'https://sybrandreinders-vort.sdb.tid.onespan.cloud',
    userRegisterURL: `https://sybrandreinders-vort.sdb.tid.onespan.cloud/v1/users/register`,
    commandsURL: `https://sybrandreinders-vort.sdb.tid.onespan.cloud/v1/orchestration-commands`,
    accountIdentifier: 'sybrandreinders-vort',
    cloudServerUrl: '.sdb.tid.onespan.cloud',
    userIdentifier: 'userid1',
    staticPassword: 'Test1234',
    saltStorage:
      '38af4675075cb1971a5fe79d59e702d711577b40a6e06ab75696bbd4aaddebdc',
    saltDigipass:
      '5910c093a9e6777c8291679ed655328da20958f2c4a11e03a3768b9e12e36d73',
  };

  const [isConfigured, setIsConfigured] = useState(false);
  const [isActivated, setIsActivated] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activationPassword, setActivationPassword] = useState<string | null>(
    null
  );

  const cleanMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const registerUser = async () => {
    console.log(`registering user`);
    const { userRegisterURL, staticPassword, userIdentifier } = initialData;

    const activationPassword = await registerUserOnBackend({
      userRegisterURL,
      staticPassword,
      userID: userIdentifier,
    });

    setActivationPassword(activationPassword);
    return activationPassword;
  };

  useEffect(() => {
    registerUser();
  }, []);

  // const executeCommand = async (command: string) => {
  //   cleanMessages();
  //   try {
  //     const response = await OnespanExecute(command);
  //     console.log(`executeCommand: ${response}`);
  //     setSuccess(`executeCommand: ${response}`);
  //     return response;
  //   } catch (err) {
  //     console.log(err);
  //     setError(`${err}`);
  //   }
  // };

  // const activateUser = async (
  //   userIdentifier: string,
  //   activationPassword: string
  // ) => {
  //   cleanMessages();
  //   try {
  //     const response = await OnespanActivate(
  //       userIdentifier,
  //       activationPassword
  //     );
  //     console.log(`activateUser: ${response}`);
  //     setSuccess(`activateUser: ${response}`);

  //     const apiResponse = await sendCommandToBackend({
  //       commandsURL: initialData.commandsURL,
  //       command: response,
  //     });

  //     const commandResponse = await executeCommand(apiResponse);

  //     setSuccess(`commandResponse: ${commandResponse}`);

  //     console.log(`activation complete`);

  //     setIsActivated(true);
  //   } catch (err) {
  //     console.log(err);
  //     setError(`${err}`);
  //   }
  // };

  async function onespanActivate(
    userIdentifier: string,
    activationPassword: string
  ) {
    try {
      /*
        OSActivationModule.activate
        params:
        userIdentifier: string
        activationPassword: string
       */
      const command = await OnespanActivate(userIdentifier, activationPassword);

      // promisse for a command string
      console.log(`activation command: ${command}`);

      const apiResponse = await sendCommandToBackend({
        commandsURL: initialData.commandsURL,
        command,
      });

      onespanExecute(apiResponse);
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
      const response = await OnespanExecute(command);

      // promisse for a command or success response string
      console.log(`onespan execute: ${response}`);

      if (!!response) {
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

  async function onespanRegisterNotification() {
    try {
      /*
        OSRegisterNotificationModule.registerForNotifications
        params:
       */
      const command = await OnespanRegisterNotification();

      // promisse for a command string
      console.log(`notification command: ${command}`);

      const apiResponse = await sendCommandToBackend({
        commandsURL: initialData.commandsURL,
        command,
      });

      // firt - request to /v1/orchestration-commands
      // then - send command response to onespanExecute
      const notificationExecute = await onespanNotificationExecute(apiResponse);
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
      const response = await OnespanExecuteNotification(command);

      // promisse for a command or "notificationId:0123..009" response string
      let substring = response.substring(0, 14);
      console.log(`onespan execute: ${substring}`);

      if (substring == 'notificationId') {
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

  const configSDK = async (
    accountIdentifier: string,
    cloudServerUrl: string,
    saltStorage: string,
    saltDigipass: string
  ) => {
    cleanMessages();
    try {
      const response = await OnespanConfig(
        accountIdentifier,
        cloudServerUrl,
        saltStorage,
        saltDigipass
      );
      console.log(response);
      setSuccess(`${response}`);
      setIsConfigured(true);
    } catch (err) {
      console.log(err);
      setError(`${err}`);
    }
  };

  return (
    <Container>
      {!!error && (
        <ErrorBox>
          <ErrorText>{error}</ErrorText>
        </ErrorBox>
      )}
      {!!success && (
        <SuccessBox>
          <SuccessText>{success}</SuccessText>
        </SuccessBox>
      )}
      <FormWrapper>
        {!activationPassword ? (
          <Registering>
            <RegisteringText>Registrando usuário</RegisteringText>
          </Registering>
        ) : (
          <>
            {!isConfigured ? (
              <ConfigForm
                accountIdentifier={initialData.accountIdentifier}
                cloudServerUrl={initialData.cloudServerUrl}
                saltStorage={initialData.saltStorage}
                saltDigipass={initialData.saltDigipass}
                onSubmit={configSDK}
              />
            ) : !isActivated ? (
              <ActivationForm
                userIdentifier={initialData.userIdentifier}
                activationPassword={activationPassword || ''}
                onSubmit={onespanActivate}
              />
            ) : (
              <>
                <ActivatedView>
                  <ActivatedText>Activated!</ActivatedText>
                </ActivatedView>
              </>
            )}
          </>
        )}
      </FormWrapper>
    </Container>
  );
};

export default App;
