import styled from 'styled-components/native';
import { TextInput as TI, DefaultTheme } from 'react-native-paper';

export const Container = styled.View`
  flex: 1;
`;

export const TextInput = styled(TI).attrs({
  theme: {
    colors: {
      ...DefaultTheme.colors,
      background: '#FFFFFF',
    },
  },
})`
  background-color: #ffffff;
`;

export const ErrorMessage = styled.Text`
  color: #ca4247;
`;
