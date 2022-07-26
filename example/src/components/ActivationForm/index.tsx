import React, { useState } from 'react';

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

  return (
    <View>
      <TextInput
        label="User Identifier"
        onChangeText={(text: string) => setUserIdentifierState(text)}
        value={userIdentifierState || userIdentifier}
        defaultValue={userIdentifier || ''}
      />
      <Spacer />
      <TextInput
        label="Activation Password"
        onChangeText={(text: string) => setActivationPasswordState(text)}
        value={activationPasswordState || activationPassword}
        defaultValue={activationPassword || ''}
      />
      <Spacer />
      <Button
        onPress={() =>
          onSubmit(
            `${!!userIdentifierState ? userIdentifierState : userIdentifier}`,
            `${
              !!activationPasswordState
                ? activationPasswordState
                : activationPassword
            }`
          )
        }
      >
        Activate
      </Button>
    </View>
  );
};

export default ActivationForm;
