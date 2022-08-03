import { NativeModules } from 'react-native';

const {
  OSSettingsModule,
  OSActivationModule,
  OSRegisterNotificationModule,
  OSAuthWithPushNotificationModule,
} = NativeModules;

const config = async (
  domainIdentifier: string,
  saltStorage: string,
  saltDigipass: string
): Promise<string> => {
  /**
   * Configures the SDK
   *
   * @remarks
   * Must be called before any other method
   *
   * @param domainIdentifier - User account identifier
   * @param saltStorage - Salt used to encrypt the storage
   * @param saltDigipass - Salt used to encrypt the digipass
   * @returns A string with 'success' or with a description of the error
   */
  const result = await OSSettingsModule.setSettings(
    domainIdentifier,
    saltStorage,
    saltDigipass
  );
  return result;
};

function activate(
  userIdentifier: string,
  activationPassword: string
): Promise<string> {
  return OSActivationModule.activate(userIdentifier, activationPassword);
}

function execute(command: string): Promise<string> {
  return OSActivationModule.execute(command);
}

function registerNotification(): Promise<string> {
  return OSRegisterNotificationModule.registerForNotifications();
}

function executeNotification(command: string): Promise<string> {
  return OSRegisterNotificationModule.execute(command);
}

function pushNotificationExecute(command: string): Promise<string> {
  return OSAuthWithPushNotificationModule.execute(command);
}

function pushNotificationCheckAndExecute(): Promise<string> {
  return OSAuthWithPushNotificationModule.checkNotificationAndExecute();
}

function pushNotificationIsApproved(approved: string): Promise<string> {
  return OSAuthWithPushNotificationModule.authenticationApproved(approved);
}

export default {
  config,
  activate,
  execute,
  registerNotification: {
    register: registerNotification,
    execute: executeNotification,
  },
  pushNotification: {
    execute: pushNotificationExecute,
    checkAndExecute: pushNotificationCheckAndExecute,
    isApproved: pushNotificationIsApproved,
  },
};
