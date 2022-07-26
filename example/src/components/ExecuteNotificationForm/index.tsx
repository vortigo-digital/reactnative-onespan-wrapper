import React, { useState } from 'react';

import { View, TextInput, Spacer, Button } from './styles';

interface Props {
  command: string;
  onSubmit: (cmd: string) => void;
}

const ExecuteNotificationForm = ({ command, onSubmit }: Props) => {
  const [notificationCommandState, setNotificationCommandState] = useState<
    string | null
  >(null);

  return (
    <View>
      <TextInput
        label="Command Command"
        onChangeText={(text: string) => setNotificationCommandState(text)}
        value={notificationCommandState || command}
        defaultValue={command || ''}
      />
      <Spacer />

      <Button
        onPress={() =>
          onSubmit(
            `${!!notificationCommandState ? notificationCommandState : command}`
          )
        }
      >
        Execute Notification
      </Button>
    </View>
  );
};

export default ExecuteNotificationForm;
