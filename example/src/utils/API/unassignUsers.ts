import axios from 'axios';

const baseURL = `https://sybrandreinders-vort.sdb.tid.onespan.cloud`;
const params = `?serialNumber=%2A&assigned=true&offset=0&limit=20`;
const unassignURL = `${baseURL}/v1/authenticators`;

const unassignUsers = async () => {
  try {
    const response = await axios.get(`${unassignURL}${params}`);
    const { authenticators } = response.data;
    const serialNumbers = authenticators.map(
      (data: any) => data.serialNumber.split('-')[0]
    );
    const serialNumberUniques = [...new Set(serialNumbers)];
    serialNumberUniques.forEach(async (SN: any) => {
      await axios.post(`${unassignURL}/${SN}/unassign`);
    });
  } catch (error) {
    console.log(`utils/sendCommandToBackend error: ${error}`);
  }
};

export default unassignUsers;
