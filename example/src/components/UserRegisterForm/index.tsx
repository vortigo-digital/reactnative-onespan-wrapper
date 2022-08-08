import React, { useEffect, useState } from 'react';

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

  useEffect(() => {
    setUserIdentifierState(userIdentifier);
    setStaticPasswordState(staticPassword);
  }, [userIdentifier, staticPassword]);
  return (
    <View>
      <TextInput
        label="User Identifier"
        onChangeText={(text: string) => setUserIdentifierState(text)}
        value={userIdentifierState}
      />
      <Spacer />
      <TextInput
        label="Static Password"
        onChangeText={(text: string) => setStaticPasswordState(text)}
        value={staticPasswordState}
      />
      <Spacer />
      <Button
        onPress={() =>
          onSubmit(`${userIdentifierState}`, `${staticPasswordState}`)
        }
      >
        Register User
      </Button>
    </View>
  );
};

export default UserRegisterForm;
