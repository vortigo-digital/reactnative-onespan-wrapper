import styled from 'styled-components/native';
import { Button as BT, TextInput as TI } from 'react-native-paper';

export const Container = styled.View`
  flex: 1;
  padding: 30px;
  justify-content: flex-start;
  align-items: center;
  background-color: #f8f8f6;
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
export const Registering = styled.View`
  justify-content: center;
  align-items: center;
`;
export const RegisteringText = styled.Text`
  font-weight: bold;
`;

const AlertBox = styled.View`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
`;
export const SuccessBox = styled(AlertBox)`
  background-color: #d4edda;
`;
export const ErrorBox = styled(AlertBox)`
  background-color: #f8d7da;
`;
export const ErrorText = styled.Text`
  color: #721c24;
`;
export const SuccessText = styled.Text`
  color: #155724;
`;
export const Text = styled.Text``;

export const ActivatedView = styled.View`
  width: 100%;
  background-color: #000000;
  padding: 10px;
`;
export const ActivatedText = styled.Text`
  color: #ffffff;
`;

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

export const RegisterNotificationButton = styled(BT).attrs({
  mode: 'contained',
})`
  width: 100%;
  background-color: #000000;
`;
