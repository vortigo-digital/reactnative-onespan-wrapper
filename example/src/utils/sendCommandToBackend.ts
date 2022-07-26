import axios from 'axios';

type RegisterUserProps = {
  commandsURL: string;
  command: string;
};

const sendCommandToBackend = async ({
  commandsURL,
  command,
}: RegisterUserProps) => {
  try {
    const response = await axios.post(commandsURL, {
      command,
    });

    if (response?.data?.command) {
      const { command } = response.data;
      console.log(`API command: ${command}`);

      return command;
    } else {
      throw new Error('Erro ao registrar usuário');
    }
  } catch (error) {
    console.log(error);
  }
};

export default sendCommandToBackend;
