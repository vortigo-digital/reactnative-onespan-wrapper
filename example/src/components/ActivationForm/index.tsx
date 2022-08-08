import React, { useState, useEffect } from 'react';

import { View, TextInput, Spacer, Button } from './styles';

interface Props {
  userIdentifier: string;
  activationPassword: string;
  onSubmit: (u: string, pass: string) => void;
}

const ActivationForm = ({
  userIdentifier,
  activationPassword,
  onSubmit,
}: Props) => {
  const [userIdentifierState, setUserIdentifierState] = useState<string | null>(
    null
  );
  const [activationPasswordState, setActivationPasswordState] = useState<
    string | null
  >(null);

  useEffect(() => {
    setUserIdentifierState(userIdentifier);
    setActivationPasswordState(activationPassword);
  }, [userIdentifier, activationPassword]);

  return (
    <View>
      <TextInput
        label="User Identifier"
        onChangeText={(text: string) => setUserIdentifierState(text)}
        value={userIdentifierState}
      />
      <Spacer />
      <TextInput
        label="Activation Password"
        onChangeText={(text: string) => setActivationPasswordState(text)}
        value={activationPasswordState}
      />
      <Spacer />
      <Button
        onPress={() =>
          onSubmit(`${userIdentifierState}`, `${activationPasswordState}`)
        }
      >
        Activate
      </Button>
    </View>
  );
};

export default ActivationForm;
