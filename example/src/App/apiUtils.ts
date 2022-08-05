import axios from 'axios';

const baseURL = `https://sybrandreinders-vort.sdb.tid.onespan.cloud`;
const userRegisterURL = `${baseURL}/v1/users/register`;
const commandsURL = `${baseURL}/v1/orchestration-commands`;

const axiosAdditionalData = {
  objectType: 'RegisterUserInputEx',
  cddc: {
    browserCDDC: {
      fingerprintRaw:
        '{browser:{"userAgent":Mozilla/5.0 (Windows NT 6.1, WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36},support:{"ajax":true,"boxModel":undefined,"changeBubbles":undefined,"checkClone":true,"checkOn":true,"cors":true,"cssFloat":undefined,"hrefNormalized":undefined,"htmlSerialize":undefined,"leadingWhitespace":undefined,"noCloneChecked":true,"noCloneEvent":undefined,"opacity":undefined,"optDisabled":undefined,"style":undefined,"submitBubbles":undefined,"tbody":undefined},computer:{"screenWidth":2560,"screenHeight":1440,"OS":"Microsoft Windows","platform":"Win32"},additional:{}}',
      fingerprintHash:
        'e96dadc9651f5fe8f071110eb174fe8e7a17a9d7a96b3b1980c13e5b4af3a4d7',
    },
  },
  clientIP: '192.168.0.1',
};

const registerUserOnAPI = async (userID: string, staticPassword: string) => {
  try {
    const response = await axios.post(
      userRegisterURL,
      {
        ...axiosAdditionalData,
        staticPassword,
        userID,
      },
      {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    if (response?.data?.activationPassword) {
      const { activationPassword } = response.data;
      return activationPassword;
    } else {
      throw new Error('Erro ao registrar usuário');
    }
  } catch (error) {
    console.log(`utils/registerUser error: ${error}`);
  }
};

const executeAPICommand = async (command: string) => {
  try {
    const response = await axios.post(commandsURL, {
      command,
    });

    if (response?.data?.command) {
      const { command } = response.data;
      return command;
    } else {
      throw new Error('Erro ao registrar usuário');
    }
  } catch (error) {
    console.log(`utils/sendCommandToBackend error: ${error}`);
  }
};

export { executeAPICommand, registerUserOnAPI };
