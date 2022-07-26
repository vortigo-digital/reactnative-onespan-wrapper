import React, { useState } from 'react';

import { View, TextInput, Spacer, Button } from './styles';

interface Props {
  accountIdentifier: string;
  cloudServerUrl: string;
  saltStorage: string;
  saltDigipass: string;
  onSubmit: (a: string, b: string, c: string, d: string) => void;
}

const ConfigForm = ({
  accountIdentifier,
  cloudServerUrl,
  saltStorage,
  saltDigipass,
  onSubmit,
}: Props) => {
  const [accountIdentifierUser, setAccountIdentifierUser] = useState<
    string | null
  >(null);
  const [accountIdentifierDomain, setAccountIdentifierDomain] = useState<
    string | null
  >(null);
  const [saltStorageState, setSaltStorageState] = useState<string | null>(null);
  const [saltDigipassState, setSaltDigipassState] = useState<string | null>(
    null
  );

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
      <TextInput
        label="Salt Storage"
        onChangeText={(text: string) => setSaltStorageState(text)}
        value={saltStorageState || saltStorage}
        defaultValue={saltStorage || ''}
      />
      <Spacer />
      <TextInput
        label="Salt Digipass"
        onChangeText={(text: string) => setSaltDigipassState(text)}
        value={saltDigipassState || saltDigipass}
        defaultValue={saltDigipass || ''}
      />
      <Spacer />
      <Button
        onPress={() =>
          onSubmit(
            `${
              !!accountIdentifierUser
                ? accountIdentifierUser
                : accountIdentifier
            }`,

            `${
              !!accountIdentifierDomain
                ? accountIdentifierDomain
                : cloudServerUrl
            }`,

            `${!!saltStorageState ? saltStorageState : saltStorage}`,

            `${!!saltDigipassState ? saltDigipassState : saltDigipass}`
          )
        }
      >
        Config SDK
      </Button>
    </View>
  );
};

export default ConfigForm;
