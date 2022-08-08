import React, { useState } from 'react';

import { View, TextInput, Button } from './styles';

interface Props {
  pin: string;
  onSubmit: (pin: string) => void;
}

const FormPIN = ({ pin, onSubmit }: Props) => {
  const [statePIN, setStatePIN] = useState<string | null>(null);

  return (
    <View style={{ flex: 1, width: '100%' }}>
      <TextInput
        label="PIN"
        onChangeText={(text: string) => setStatePIN(text)}
        value={statePIN || ''}
        defaultValue={pin || ''}
        keyboardType="numeric"
      />

      <Button onPress={() => onSubmit(`${statePIN}`)}>Set PIN</Button>
    </View>
  );
};

export default FormPIN;
