import { NativeModules } from 'react-native';

const { OSSettingsModule, OSActivationModule, OSRegisterNotificationModule } =
  NativeModules;

export function OnespanConfig(
  accountIdentifier: string,
  cloudServerUrl: string,
  saltStorage: string,
  saltDigipass: string
): Promise<string> {
  /**
   * Configures the SDK
   *
   * @remarks
   * Must be called before any other method
   *
   * @param accountIdentifier - User account identifier
   * @param cloudServerUrl - URL of the cloud server / backend
   * @param saltStorage - Salt used to encrypt the storage
   * @param saltDigipass - Salt used to encrypt the digipass
   * @returns A string with 'success' or with a description of the error
   */
  return OSSettingsModule.setSettings(
    accountIdentifier,
    cloudServerUrl,
    saltStorage,
    saltDigipass
  );
}

export function OnespanActivate(
  userIdentifier: string,
  activationPassword: string
): Promise<string> {
  return OSActivationModule.activate(userIdentifier, activationPassword);
}

export function OnespanExecute(command: string): Promise<string> {
  return OSActivationModule.execute(command);
}

export function OnespanRegisterNotification(): Promise<string> {
  return OSRegisterNotificationModule.registerForNotifications();
}

export function OnespanExecuteNotification(command: string): Promise<string> {
  return OSRegisterNotificationModule.execute(command);
}

// const LINKING_ERROR =
//   `The package 'react-native-onespan-orchestration' doesn't seem to be linked. Make sure: \n\n` +
//   Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
//   '- You rebuilt the app after installing the package\n' +
//   '- You are not using Expo managed workflow\n';

// const OnespanOrchestration = NativeModules.OnespanOrchestration
//   ? NativeModules.OnespanOrchestration
//   : new Proxy(
//       {},
//       {
//         get() {
//           throw new Error(LINKING_ERROR);
//         },
//       }
//     );

// export function multiply(a: number, b: number): Promise<number> {
//   return OnespanOrchestration.multiply(a, b);
// }

// export function setAccountIdentifier(a: string, b: string) {
//   return OnespanBridgeAndroid.setAccountIdentifier(a, b);
// }

// export function startActivation(a: string, b: string) {
//   return OnespanBridgeAndroid.startActivation(a, b);
// }

// export function eventEmitter() {
//   return new NativeEventEmitter(OnespanBridgeAndroid);
// }

// export function startActivation(a: string, b: string): void {
//   return OnespanOrchestration.startActivation(a, b);
// }
