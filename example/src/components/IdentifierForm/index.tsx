import React, { useState } from 'react';

import { View, TextInput, Spacer, Button } from './styles';

interface Props {
  accountIdentifier: string;
  cloudServerUrl: string;
  onSubmit: () => void;
}

const IdentifierForm = ({
  accountIdentifier,
  cloudServerUrl,
  onSubmit,
}: Props) => {
  const [accountIdentifierUser, setAccountIdentifierUser] = useState<
    string | null
  >(null);
  const [accountIdentifierDomain, setAccountIdentifierDomain] = useState<
    string | null
  >(null);

  return (
    <View>
      <TextInput
        label="Account Identifier"
        onChangeText={(text: string) => setAccountIdentifierUser(text)}
        value={accountIdentifierUser || accountIdentifier}
        defaultValue={accountIdentifier || ''}
      />
      <Spacer />
      <TextInput
        label="Account Identifier Domain"
        onChangeText={(text: string) => setAccountIdentifierDomain(text)}
        value={accountIdentifierDomain || cloudServerUrl}
        defaultValue={cloudServerUrl || ''}
      />
      <Spacer />
      <Button onPress={onSubmit}>Set Identifier</Button>
    </View>
  );
};

export default IdentifierForm;
