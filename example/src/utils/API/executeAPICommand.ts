import axios from 'axios';

const baseURL = `https://sybrandreinders-vort.sdb.tid.onespan.cloud`;
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
      throw new Error('Erro ao registrar usuário');
    }
  } catch (error) {
    console.log(`utils/sendCommandToBackend error: ${error}`);
  }
};

export default executeAPICommand;
