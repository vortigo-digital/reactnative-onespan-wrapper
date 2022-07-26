import React, { useState, useEffect } from 'react';
import { NativeEventEmitter, NativeModules } from 'react-native';
import { Eventbox, BoxText } from './styles';
const { OnespanBridgeAndroid } = NativeModules;

const EventBox = () => {
  const [log, setLog] = useState<string[]>([]);

  let logLocal: string[] = [''];

  const registerEvent = (event: any) => {
    if (logLocal) {
      logLocal =
        logLocal[0] === '' ? [event.status] : [...logLocal, event.status];
      console.log({ logLocal });
    } else {
      console.log('logLocal dont exist');
    }
    console.log(`Log: ${event.status}`);

    setLog(logLocal);
  };

  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(OnespanBridgeAndroid);
    const subscription = eventEmitter.addListener(
      'onStatusEvent',
      registerEvent
    );
    return () => subscription.remove();
  }, []);

  return (
    <Eventbox>
      {!!log &&
        log.length > 0 &&
        log.map((l, i) => <BoxText key={`${i}`}> &gt; {l}</BoxText>)}
    </Eventbox>
  );
};

export default EventBox;
