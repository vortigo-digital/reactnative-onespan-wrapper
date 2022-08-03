import React, { useState } from 'react';

import { View, TextInput, Spacer, Button } from './styles';

interface Props {
  userIdentifier: string;
  staticPassword: string;
  onSubmit: (u: string, pass: string) => void;
}

const UserRegisterForm = ({
  userIdentifier,
  staticPassword,
  onSubmit,
}: Props) => {
  const [userIdentifierState, setUserIdentifierState] = useState<string | null>(
    null
  );
  const [staticPasswordState, setStaticPasswordState] = useState<string | null>(
    null
  );

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
        label="Static Password"
        onChangeText={(text: string) => setStaticPasswordState(text)}
        value={staticPasswordState || staticPassword}
        defaultValue={staticPassword || ''}
      />
      <Spacer />
      <Button
        onPress={() =>
          onSubmit(
            `${!!userIdentifierState ? userIdentifierState : userIdentifier}`,
            `${!!staticPasswordState ? staticPasswordState : staticPassword}`
          )
        }
      >
        Register User
      </Button>
    </View>
  );
};

export default UserRegisterForm;
