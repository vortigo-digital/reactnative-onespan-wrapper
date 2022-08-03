import React, { useState } from 'react';

import { View, TextInput, Spacer, Button } from './styles';

interface Props {
  apiURL: string;
  domainIdentifier: string;
  saltStorage: string;
  saltDigipass: string;
  onSubmit: ({
    apiURL,
    domainIdentifier,
    saltStorage,
    saltDigipass,
  }: {
    apiURL: string;
    domainIdentifier: string;
    saltStorage: string;
    saltDigipass: string;
  }) => void;
}

const ConfigForm = ({
  apiURL,
  domainIdentifier,
  saltStorage,
  saltDigipass,
  onSubmit,
}: Props) => {
  const [domainIdentifierState, setDomainIdentifierState] = useState<
    string | null
  >(null);
  const [saltStorageState, setSaltStorageState] = useState<string | null>(null);
  const [saltDigipassState, setSaltDigipassState] = useState<string | null>(
    null
  );
  const [apiURLState, setApiURLState] = useState<string | null>(null);

  return (
    <View>
      <TextInput
        label="DomainIdentifier (to SDK)"
        onChangeText={(text: string) => setDomainIdentifierState(text)}
        value={domainIdentifierState || domainIdentifier}
        defaultValue={domainIdentifier || ''}
      />
      <Spacer />

      <TextInput
        label="API URL (to RN API calls)"
        onChangeText={(text: string) => setApiURLState(text)}
        value={apiURLState || apiURL}
        defaultValue={apiURL || ''}
        multiline={true}
      />
      <Spacer />
      <TextInput
        label="Salt Storage (to SDK)"
        onChangeText={(text: string) => setSaltStorageState(text)}
        value={saltStorageState || saltStorage}
        defaultValue={saltStorage || ''}
        multiline={true}
      />
      <Spacer />
      <TextInput
        label="Salt Digipass (to SDK)"
        onChangeText={(text: string) => setSaltDigipassState(text)}
        value={saltDigipassState || saltDigipass}
        defaultValue={saltDigipass || ''}
        multiline={true}
      />
      <Spacer />
      <Button
        onPress={() =>
          onSubmit({
            domainIdentifier: `${
              !!domainIdentifierState ? domainIdentifierState : domainIdentifier
            }`,

            apiURL: `${!!apiURLState ? apiURLState : apiURL}`,

            saltStorage: `${
              !!saltStorageState ? saltStorageState : saltStorage
            }`,

            saltDigipass: `${
              !!saltDigipassState ? saltDigipassState : saltDigipass
            }`,
          })
        }
      >
        Config SDK
      </Button>
    </View>
  );
};

export default ConfigForm;
