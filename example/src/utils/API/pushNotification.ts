import axios from 'axios';

const baseURL = `https://sybrandreinders-vort.sdb.tid.onespan.cloud`;
const defaultDomain = 'sybrandreinders-vort';

interface apiResponse {
  data: { requestID: string; sessionStatus: string; requestMessage: string };
}

const loginWithPushNotification = async (
  user: string,
  domain?: string,
  type?: 'Fingerprint' | 'PIN'
) => {
  try {
    const response: apiResponse = await axios.post(
      `${baseURL}/v1/users/${user}%40${domain || defaultDomain}/login`,
      {
        objectType: 'LoginInput',
        credentials: {
          passKey: !!type ? type : 'Fingerprint',
        },
        loginMessage: {
          title: {
            text: 'Login request',
          },
          subject: 'Tap here to confirm login',
          challenge: 'Are you trying to log in?',
        },
        orchestrationDelivery: ['pushNotification', 'requestMessage'],
      },
      {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    const { requestID, sessionStatus, requestMessage } = response.data;
    return { requestID, sessionStatus, requestMessage };
  } catch (error) {
    console.log(`utils/sendCommandToBackend error: ${error}`);
  }
};

const loginWithPIN = async (user: string, domain?: string) => {
  return loginWithPushNotification(user, domain || defaultDomain, 'PIN');
};
const loginWithFingerprint = async (user: string, domain?: string) => {
  return loginWithPushNotification(
    user,
    domain || defaultDomain,
    'Fingerprint'
  );
};

export { loginWithPIN, loginWithFingerprint };
export default loginWithPushNotification;
