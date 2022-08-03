import axios from 'axios';

type RegisterUserProps = {
  userRegisterURL: string;
  staticPassword: string;
  userID: string;
};

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

const registerUser = async ({
  userRegisterURL,
  staticPassword,
  userID,
}: RegisterUserProps) => {
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
      console.log(`Activation password: ${activationPassword}`);

      return activationPassword;
    } else {
      throw new Error('Erro ao registrar usuário');
    }
  } catch (error) {
    console.log(error);
  }
};

export default registerUser;
