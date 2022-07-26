import React, { useState } from 'react';

import { View, TextInput, Spacer, Button } from './styles';

interface Props {
  command: string;
  onSubmit: (cmd: string) => void;
}

const ExecuteForm = ({ command, onSubmit }: Props) => {
  const [commandState, setCommandeState] = useState<string | null>(null);

  return (
    <View>
      <TextInput
        label="Command"
        onChangeText={(text: string) => setCommandeState(text)}
        value={commandState || command}
        defaultValue={command || ''}
      />
      <Spacer />

      <Button
        onPress={() => onSubmit(`${!!commandState ? commandState : command}`)}
      >
        Execute
      </Button>
    </View>
  );
};

export default ExecuteForm;
