import React, { useState, useEffect } from 'react';

import OnespanWrapper from '@vortigo/react-native-onespan-wrapper';

import { NativeModules } from 'react-native';

const {
  OSSettingsModule,
  OSActivationModule,
  OSRegisterNotificationModule,
  OSAuthWithPushNotificationModule,
} = NativeModules;

import { ActivityIndicator } from 'react-native';
// import { executeAPICommand } from '../apiUtils';

import {
  Container,
  FormWrapper,
  SuccessBox,
  ErrorBox,
  SuccessText,
  ErrorText,
  Title,
  Step,
  Description,
  Text,
  View,
  Button,
  InfoBox,
  InfoText,
} from './styles';
import {
  ActivationForm,
  ConfigForm,
  UserRegisterForm,
  FormPIN,
} from '../components';

/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
import { advanceStep } from '../utils/APP';
import {
  registerUserOnAPI,
  executeAPICommand,
  unassignUsers,
} from '../utils/API';
import initialConfig from '../config/initialConfig';
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

const App = () => {
  type currentStepTypes =
    | 'configureApp'
    | 'registerUser'
    | 'activateUser'
    | 'registerNotification'
    | 'activateNotification'
    | 'completed';

  type configurationTypes = {
    apiURL: string;
    baseURL: string;
    userRegisterURL: string;
    commandsURL: string;
    domainIdentifier: string;
    userIdentifier: string;
    staticPassword: string;
    saltStorage: string;
    saltDigipass: string;
  };

  const [loginConfirmationIsVisible, showLoginConfirmationIsVisible] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [showPIN, setShowPIN] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [commands, setCommands] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);

  const [currentStep, setCurrentStep] = useState<currentStepTypes | string>(
    'registerUser'
  );
  const [config, setConfig] = useState<configurationTypes>(initialConfig);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activationPassword, setActivationPassword] = useState<string | null>(
    null
  );

  const cleanMessages = () => {
    setError(null);
    setSuccess(null);
    setHistory([]);
  };

  const resetState = () => {
    setShowPIN(false);
    setIsSignedIn(false);
    setCommands([]);
    setIsConfigured(false);
    setConfig(initialConfig);
    setActivationPassword(null);
    setIsLoading(false);
    cleanMessages();
    setHistory([]);
  };

  /////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////
  const goToNextStep = () => {
    const nextStep = advanceStep(currentStep);
    setCurrentStep(`${nextStep}`);
  };

  /////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////

  const handleError = async (e: any, functionName = '') => {
    // const errorAsString = await convertErrorCodeToString(e);
    const errorMessage = `${
      functionName !== '' ? ` ${functionName}: ` : ''
    } ${e}`;
    console.log(errorMessage);
    setIsLoading(false);
    setError(errorMessage);
  };

  const addLog = (str: string, origin?: string) => {
    console.log(`${origin ? `${origin}: ` : ''}${str}`);
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // Step 1 - Config SDK
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  const defaultConfigSDK = async () => {
    try {
      const response = await OnespanWrapper.config(
        initialConfig.domainIdentifier,
        initialConfig.saltStorage,
        initialConfig.saltDigipass
      );
      // if (response.status === 'success') {
      checkNotifications();
      // }
    } catch (e) {
      console.log(e);
    }
  };
  type configProps = {
    apiURL: string;
    domainIdentifier: string;
    saltStorage: string;
    saltDigipass: string;
  };
  const configSDK = async ({
    apiURL,
    domainIdentifier,
    saltStorage,
    saltDigipass,
  }: configProps) => {
    if (isConfigured) {
      goToNextStep();
    }
    cleanMessages();
    setIsLoading(true);

    try {
      setConfig({
        ...config,
        apiURL,
        domainIdentifier,
        saltStorage,
        saltDigipass,
      });

      const response = await OnespanWrapper.config(
        domainIdentifier,
        saltStorage,
        saltDigipass
      );

      console.log(response);
      checkNotifications();
      setSuccess(`${response}`);
      setIsConfigured(true);
      setIsLoading(false);
      goToNextStep();
    } catch (err) {
      setError(`${err}`);
      setIsLoading(false);
      // goToNextStep();
    }
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // Step 2 - Register user on API
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  const registerUser = async (
    userIdentifier: string,
    staticPassword: string
  ) => {
    if (isRegistered) {
      goToNextStep();
    }
    cleanMessages();
    setIsLoading(true);
    await setConfig({
      ...config,
      userIdentifier,
      staticPassword,
    });
    const activationPassword = await registerUserOnAPI({
      userRegisterURL: config.userRegisterURL,
      staticPassword,
      userID: userIdentifier,
    });

    await setActivationPassword(activationPassword);
    setSuccess(`Generated activation password: ${activationPassword}`);
    setIsRegistered(true);
    goToNextStep();
    setIsLoading(false);
    return activationPassword;
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // Step 3 - Activate user on SDK
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////

  const activateUser = async (
    userIdentifier: string,
    activationPassword: string
  ) => {
    try {
      if (isActivated) {
        goToNextStep();
      }
      cleanMessages();
      setCommands([]);
      setIsLoading(true);
      // addLog('Activating user on SDK');
      // const command = await OnespanWrapper.activate(
      //   userIdentifier,
      //   activationPassword
      // );

      // /////////////// Logs //////////////////////

      // await setCommands((commands) => [
      //   ...commands,
      //   `SDK response:  ${command}`,
      // ]);
      // addLog('Sending command to API');
      // //////////////////////////////////////////////

      // const apiResponseCommand = await executeAPICommand(command);

      // /////////////// Logs //////////////////////
      // await setCommands((commands) => [
      //   ...commands,
      //   `API Response:  ${apiResponseCommand}`,
      // ]);
      // addLog('Looping untils success');
      // //////////////////////////////////////////////

      // let response = '';
      // let apiCommand = apiResponseCommand;
      // do {
      //   addLog('Sending command to SDK');
      //   response = await OnespanWrapper.execute(apiCommand);
      //   /////////////// Logs //////////////////////
      //   await setCommands((commands) => [
      //     ...commands,
      //     `SDK Response:  ${response}`,
      //   ]);

      //   if (response !== 'success') {
      //     addLog('Sending command to API');
      //     apiCommand = await executeAPICommand(response);

      //     /////////////// Logs //////////////////////
      //     await setCommands((commands) => [
      //       ...commands,
      //       `API Response:  ${apiCommand}`,
      //     ]);
      //   }
      // } while (response !== 'success');

      let sdkResponse = '';
      let apiResponse = '';
      sdkResponse = await OnespanWrapper.activate(
        userIdentifier,
        activationPassword
      );
      await setCommands((commands) => [
        ...commands,
        `SDK Response:  ${sdkResponse}`,
      ]);

      apiResponse = await executeAPICommand(sdkResponse);
      await setCommands((commands) => [
        ...commands,
        `API Response:  ${apiResponse}`,
      ]);

      do {
        sdkResponse = await OnespanWrapper.execute(apiResponse);
        await setCommands((commands) => [
          ...commands,
          `SDK Response:  ${sdkResponse}`,
        ]);
        if (sdkResponse !== 'success') {
          apiResponse = await executeAPICommand(sdkResponse);
          await setCommands((commands) => [
            ...commands,
            `API Response:  ${apiResponse}`,
          ]);
        }
      } while (sdkResponse !== 'success');

      await setCommands((commands) => [...commands, `Sucesso`]);
      setIsActivated(true);
      setIsLoading(false);
      goToNextStep();

      // executeCommandsUntilSuccess(apiResponseCommand);
    } catch (e) {
      setError(`${e}`);
      console.log(e);
      setIsLoading(false);
    }
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // Step 4 - Register Notification
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  const onespanRegisterNotification = async () => {
    cleanMessages();
    setCommands([]);
    setIsLoading(true);
    try {
      /*
         OSRegisterNotificationModule.registerForNotifications
         params:
        */
      addLog('Sending command to SDK');
      const command = await OnespanWrapper.registerNotification.register();

      // promisse for a command
      await setCommands((commands) => [
        ...commands,
        `SDK response:  ${command}`,
      ]);
      addLog('Sending command to API');

      // request to /v1/orchestration-commands OCA
      const apiResponseCommand = await executeAPICommand(command);

      await setCommands((commands) => [
        ...commands,
        `APÌ response:  ${apiResponseCommand}`,
      ]);

      if (apiResponseCommand) {
        // send command to orchestrationSDK.execute
        // console.log(`apiResponseCommand: ${apiResponseCommand}`);
        onespanNotificationExecute(apiResponseCommand);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onespanNotificationExecute = async (command: string) => {
    try {
      /*
         OSRegisterNotificationModule.execute
         params:
         command: string
        */
      addLog('Sending command to API');
      const response = await OnespanWrapper.registerNotification.execute(
        command
      );

      await setCommands((commands) => [
        ...commands,
        `SDK response:  ${response}`,
      ]);

      if (response.includes('notificationId')) {
        await setCommands((commands) => [
          ...commands,
          `Notification register complete!`,
        ]);
        await setCommands((commands) => [
          ...commands,
          `${response.replace('notificationId:', '')}`,
        ]);
        setIsLoading(false);
        goToNextStep();
      } else {
        // request to /v1/orchestration-commands OCA
        const apiResponseCommand = await executeAPICommand(response);

        await setCommands((commands) => [
          ...commands,
          `API response:  ${apiResponseCommand}`,
        ]);

        if (apiResponseCommand) {
          // send command to orchestrationSDK.execute
          console.log(`apiResponseCommand: ${apiResponseCommand}`);
          onespanNotificationExecute(apiResponseCommand);
        }
      }
    } catch (e) {
      setIsLoading(false);
      console.error(e);
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // Push Notifications
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////

  // ------- authentication with push notification -------

  const checkNotifications = async () => {
    try {
      const response = await OnespanWrapper.pushNotification.checkAndExecute();

      // promisse for a command or ""
      console.log(`checkNotificationsAndExecute ${response}`);

      if (response !== '') {
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

  // const handleLoginConfirmation = async () => {
  //   if(loginConfirmationIsVisible){
  //     setLoginConfirmationIsVisible(false);
  //     return;
  //   }
  //   else{
  //     setLoginConfirmationIsVisible(true);
  //     return;

  //   }
  //   onespanAuthenticationApproved(true);

  // }

  const onespanAuthPushNotificationExecute = async (command: string) => {
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
        // onespanAuthenticationApproved(true);
        showLoginConfirmationIsVisible(true);
      } else if (splitString[0] == 'success') {
        showLoginConfirmationIsVisible(false);
        setIsSignedIn(true);
        setShowPIN(false);
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
      console.log(e);
    }
  };

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
        setShowPIN(true);
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

  // const onespanAuthenticationApproved = async (approved: boolean) => {
  //   /*
  //      OSAuthWithPushNotificationModule.authenticationApproved
  //      params:
  //      approved: boolean
  //    */
  //   console.log(`onespanAuthenticationApproved ${approved}`);
  //   try {
  //     const response = await OnespanWrapper.pushNotification.isApproved(
  //       approved
  //     );

  //     // promisse for a command
  //     console.log(`authenticationApproved ${response}`);

  //     if (response !== '') {
  //       // request to /v1/orchestration-commands OCA
  //       const apiResponseCommand = await executeAPICommand(response);

  //       if (apiResponseCommand) {
  //         // send command to orchestrationSDK.execute
  //         console.log(`apiResponseCommand: ${apiResponseCommand}`);
  //         onespanAuthPushNotificationExecute(apiResponseCommand);
  //       }
  //     }
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  const ScreenTitle = () => {
    switch (currentStep) {
      case 'configureApp':
        return (
          <Title>
            <Step>
              <Text>Step 1</Text>
            </Step>
            <Description>
              <Text>Configure App (RN and SDK)</Text>
            </Description>
          </Title>
        );
      case 'registerUser':
        return (
          <Title>
            <Step>
              <Text>Step 2</Text>
            </Step>
            <Description>
              <Text>Register User (API)</Text>
            </Description>
          </Title>
        );

      case 'activateUser':
        return (
          <Title>
            <Step>
              <Text>Step 3</Text>
            </Step>
            <Description>
              <Text>Activate User (SDK)</Text>
            </Description>
          </Title>
        );

      case 'registerNotification':
        return (
          <Title>
            <Step>
              <Text>Step 4</Text>
            </Step>
            <Description>
              <Text> Register Notification (SDK + API + SDK)</Text>
            </Description>
          </Title>
        );

      case 'activateNotification':
        return (
          <Title>
            <Step>
              <Text>Step 5</Text>
            </Step>
            <Description>
              <Text>Activate Notification (SDK + API + SDK)</Text>
            </Description>
          </Title>
        );
      case 'completed':
        return (
          <Title>
            <Step>
              <Text>Step 6</Text>
            </Step>
            <Description>
              <Text>That's all for now</Text>
            </Description>
          </Title>
        );

      default:
        return <View />;
    }
  };

  const MainContent = () => {
    switch (currentStep) {
      case 'configureApp':
        return (
          <>
            <ConfigForm
              domainIdentifier={config.domainIdentifier}
              apiURL={config.apiURL}
              saltStorage={config.saltStorage}
              saltDigipass={config.saltDigipass}
              onSubmit={configSDK}
            />
          </>
        );
      case 'registerUser':
        return (
          <UserRegisterForm
            userIdentifier={config.userIdentifier}
            staticPassword={config.staticPassword || ''}
            onSubmit={registerUser}
          />
        );
      case 'activateUser':
        return (
          <ActivationForm
            userIdentifier={config.userIdentifier}
            activationPassword={activationPassword || ''}
            onSubmit={activateUser}
          />
        );
      case 'registerNotification':
        return (
          <View>
            <Button onPress={onespanRegisterNotification}>
              Register Notification
            </Button>
          </View>
        );
      case 'activateNotification':
        return <View />;
      case 'completed':
        return <View />;

      default:
        return <View />;
    }
  };

  // const handleLogin = async (confirmLogin: boolean) => {
  //   onespanAuthenticationApproved(confirmLogin);
  // };

  // // return (
  //   <Container>
  //     <Text>Ok</Text>
  //   </Container>
  // );

  const configureSDK = async () => {
    console.log({
      configureSDK: {
        domainIdentifier: config.domainIdentifier,
        saltStorage: config.saltStorage,
        saltDigipass: config.saltDigipass,
      },
    });
    const configresult = await OnespanWrapper.config(
      config.domainIdentifier,
      config.saltStorage,
      config.saltDigipass
    );
    console.log({ configresult });
  };

  const initApp = async () => {
    // await unassignUsers();
    setLoading(true);
    await resetState();
    await configureSDK();
    await checkNotifications();
    setLoading(false);
  };

  useEffect(() => {
    initApp();
  }, []);

  return (
    <Container>
      {loading ? (
        <ActivityIndicator />
      ) : showPIN ? (
        <FormPIN onSubmit={onespanOnUserAuthenticationInput} />
      ) : loginConfirmationIsVisible ? (
        <View>
          <Text style={{ color: '#000000' }}>Are you trying to log in?</Text>
          <View style={{ flex: 1, flexDirection: 'row', marginTop: 30 }}>
            <Button
              style={{ backgroundColor: 'green', width: 150 }}
              onPress={() => onespanAuthenticationApproved(true)}
            >
              Yes
            </Button>
            <Button
              style={{ width: 150, marginLeft: 10 }}
              onPress={() => onespanAuthenticationApproved(false)}
            >
              No
            </Button>
          </View>
        </View>
      ) : isSignedIn ? (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ color: '#000000' }}>Login concluido</Text>
        </View>
      ) : (
        <>
          <ScreenTitle />
          {!!history && history.length > 0 && (
            <InfoBox>
              <InfoText>{history[history.length - 1]}</InfoText>
            </InfoBox>
          )}
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
          {!!commands && commands.length > 0 && (
            <>
              {commands.map((command, index) => (
                <SuccessBox key={`command-${index}`}>
                  <SuccessText numberOfLines={1}>{command}</SuccessText>
                </SuccessBox>
              ))}
            </>
          )}
          <FormWrapper>
            {isLoading ? <ActivityIndicator /> : <MainContent />}
          </FormWrapper>
        </>
      )}
    </Container>
  );
};

export default App;
