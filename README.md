# React Native OneSpan Wrapper
> React Native library that implements native Wrapper for Android

## Installation
To install and set up the library, run:

```sh
$ npm install @vortigo/react-native-onespan-wrapper --save
```
Or if you prefer using Yarn:
```sh
$ yarn add @vortigo/react-native-onespan-wrapper
```
## Usage
### Configuration
```sh
import { OnespanConfig } from '@vortigo/react-native-onespan-wrapper';
```

```js
OnespanConfig(accountIdentifier, cloudServerUrl, saltStorage, saltDigipass);
```

<center>

| Parameter           | Type   | Description | Example                               |
| ------------------- | ------ | ----------- | ------------------------------------- |
| `accountIdentifier` | string |             | sybrandreinders-vort                  |
| `cloudServerUrl`    | string |             | .sdb.tid.onespan.cloud                |
| `saltStorage`       | string |             | 38af4675075cb1971a5fe79d59e702d711... |
| `saltDigipass`      | string |             | 5910c093a9e6777c8291679ed655328da2... |

</center>

**Example**

```js
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
    // return "success"
    console.log(`${response}`);
  } catch (err) {
    console.log(`${err}`);
  }
};
```

---

### User Self-Registration
#### Application Workflow
![User Self-Registration](https://github.com/vortigo-digital/reactnative-onespan-wrapper/raw/main/assets/images/UserSelfRegistration.png)

**Activation command**
---
Import OnespanActivate from wrapper
```sh
import { OnespanActivate } from '@vortigo/react-native-onespan-wrapper';
```

And then call the method passing the authentication parameters

```js
startActivation(userIdentifier, activationPassword);
```

**Example**
```js
async function activate(userIdentifier: string, activationPassword: string) {
  // Call native method `OSActivationModule.activate` that will
  // ask for a 6 digits PIN and then returns a command that
  // should be sent to your API server.
  const command = await OnespanActivate(userIdentifier, activationPassword);

  // That command should be sent to backend API, which will return a
  // second command string as response
  const apiResponse = await sendCommandToBackend({
    commandsURL: `${baseURL}/v1/orchestration-commands`,
    command,
  });
  // Then you call the native method "execute" and the activation
  // proccess will be finished
  const response = await onespanExecute(apiResponse);
  return response;
}
```

**Execute command**
---
Import OnespanExecute from wrapper
```sh
import { OnespanExecute } from '@vortigo/react-native-onespan-wrapper';
```

and send a command to be interpreted by the Onespan Native SDK

```js
OnespanExecute(command);
```

**Example**

```js
async function executeCommand(command: string) {
  const response = await OnespanExecute(command);
  return response;
}
```

---

### Push Notification Registration
#### Application workflow
![Push Notification Registration](https://github.com/vortigo-digital/reactnative-onespan-wrapper/raw/main/assets/images/PushNotificationRegistrations.png)

**OnespanRegisterNotification command**
---
Import OnespanRegisterNotification from wrapper
```sh
import { OnespanRegisterNotification } from '@vortigo/react-native-onespan-wrapper';
```
And dispach `OnespanRegisterNotification`
```js
OnespanRegisterNotification();
```

**Example**
```js
async function registerNotification() {
  const command = await OnespanRegisterNotification();

  const apiResponse = await sendCommandToBackend({
    commandsURL: `${baseURL}/v1/orchestration-commands`,
    command,
  });

  const notificationExecute = await onespanNotificationExecute(apiResponse);
  return notificationExecute;
}
```

**Execute command**
---
Import OnespanExecuteNotification from wrapper
```sh
import { OnespanExecuteNotification } from '@vortigo/react-native-onespan-wrapper';
```

And dispach `OnespanExecuteNotification`

```js
onespanNotificationExecute(command);
```

**Example**

```js
async function onespanNotificationExecute(command: string) {
  const response = await OnespanExecuteNotification(command);
  if (substring == 'notificationId') {
    // register notification complete
    console.log(`register notification ${response}`);
  } else {
    // resend command to orchestrationSDK
    onespanNotificationExecute(response);
  }
}
```
