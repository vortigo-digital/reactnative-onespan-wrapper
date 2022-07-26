import styled from 'styled-components/native';
import { Button as BT, TextInput as TI } from 'react-native-paper';

export const Container = styled.View`
  flex: 1;
  padding: 30px;
  justify-content: flex-start;
  align-items: center;
  background-color: #f4c1c1;
`;
export const Spacer = styled.View`
  width: 100%;
  height: 5px;
`;

export const Eventbox = styled.ScrollView`
  background-color: #000000;
  margin-bottom: 10px;
  min-height: 200px;
  padding: 10px;
`;
export const View = styled.View``;
export const Text = styled.Text``;
export const BoxText = styled.Text`
  color: #00a200;
`;

export const Button = styled(BT).attrs({
  mode: 'contained',
})`
  width: 100%;
  background-color: #ee6969;
`;

export const TextInput = styled(TI).attrs({})``;

export const FormWrapper = styled.View`
  width: 100%;
`;
