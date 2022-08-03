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

```js
import OnespanWrapper from '@vortigo/react-native-onespan-wrapper';
```

```js
const response = await OnespanWrapper.config(
  domainIdentifier,
  saltStorage,
  saltDigipass
);
```

---

### User Self-Registration

#### Application Workflow

![User Self-Registration](https://github.com/vortigo-digital/reactnative-onespan-wrapper/raw/main/assets/images/UserSelfRegistration.png)

## **Activation command**

Import OnespanActivate from wrapper

```js
import OnespanWrapper from '@vortigo/react-native-onespan-wrapper';
```

And then call the method passing the authentication parameters

```js
const command = await OnespanWrapper.activate(
  userIdentifier,
  activationPassword
);
```

**Example**

```js
const activateUser = async (userIdentifier, activationPassword) => {
  let sdkResponse = '';
  let apiResponse = '';
  sdkResponse = await OnespanWrapper.activate(
    userIdentifier,
    activationPassword
  );

  apiResponse = await executeAPICommand(sdkResponse);

  do {
    sdkResponse = await OnespanWrapper.execute(apiResponse);
    if (sdkResponse !== 'success') {
      apiResponse = await executeAPICommand(sdkResponse);
    }
  } while (sdkResponse !== 'success');
};
```

Example of our helper function "executeAPICommand", but you can create your own

```js
const commandsURL = `${baseURL}/v1/orchestration-commands`;
const executeAPICommand = async (command: string) => {
  try {
    const response = await axios.post(commandsURL, {
      command,
    });

    if (response?.data?.command) {
      const { command } = response.data;
      return command;
    } else {
      throw new Error('API command execution error');
    }
  } catch (error) {
    console.log(`${error}`);
  }
};
```

## **Execute command**

```js
import OnespanWrapper from '@vortigo/react-native-onespan-wrapper';
```

and send a command to be interpreted by the Onespan Native SDK

```js
const response = await OnespanWrapper.execute(command);
```

---

### Push Notification Registration

#### Application workflow

![Push Notification Registration](https://github.com/vortigo-digital/reactnative-onespan-wrapper/raw/main/assets/images/PushNotificationRegistrations.png)

## **OnespanRegisterNotification command**

```js
import OnespanWrapper from '@vortigo/react-native-onespan-wrapper';
```

```js
const onespanRegisterNotification = async () => {
  let sdkResponse = '';
  let apiResponse = '';
  let subString = '';
  sdkResponse = await OnespanWrapper.registerNotification.register();
  apiResponse = await executeAPICommand(sdkResponse);

  do {
    sdkResponse = await OnespanWrapper.registerNotification.execute(
      apiResponse
    );
    substring = sdkResponse.substring(0, 14);
    if (substring !== 'notificationId') {
      apiResponse = await executeAPICommand(sdkResponse);
    }
  } while (substring !== 'notificationId');
};
```

## **To Check new notifications (can be used on useEffect)**

```js
import OnespanWrapper from '@vortigo/react-native-onespan-wrapper';
```

```js
const checkNotification = async () => {
  try {
    const response = await OnespanWrapper.pushNotification.checkAndExecute();

    if (response != '') {
      const apiResponseCommand = await executeAPICommand(response);

      if (apiResponseCommand) {
        onespanAuthPushNotificationExecute(apiResponseCommand);
      }
    }
  } catch (e) {
    console.error(e);
  }
};
```

## **Notification execute command**

```js
import OnespanWrapper from '@vortigo/react-native-onespan-wrapper';
```

```js
const onespanAuthPushNotificationExecute = async (command: string) => {
  try {
    const response = await OnespanWrapper.pushNotification.execute(command);

    let splitString = response.split(':');

    if (splitString[0] == 'data') {
      onespanAuthenticationApproved(true);
    } else if (splitString[0] == 'success') {
    } else {
      const apiResponseCommand = await executeAPICommand(response);

      if (apiResponseCommand) {
        onespanAuthPushNotificationExecute(apiResponseCommand);
      }
    }
  } catch (e) {
    console.error(e);
  }
};
```

## **Send approval command**

```js
import OnespanWrapper from '@vortigo/react-native-onespan-wrapper';
```

```js
const onespanAuthenticationApproved = async (approved: boolean) => {
  try {
    const response = await OnespanWrapper.pushNotification.isApproved(approved);

    if (response != '') {
      const apiResponseCommand = await executeAPICommand(response);

      if (apiResponseCommand) {
        onespanAuthPushNotificationExecute(apiResponseCommand);
      }
    }
  } catch (e) {
    console.error(e);
  }
};
```
