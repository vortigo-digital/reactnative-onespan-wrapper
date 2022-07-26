import React from 'react';

import { Control, Controller, FieldError } from 'react-hook-form';

import { ErrorMessage, TextInput } from './styles';

import { TextInputMask } from 'react-native-masked-text';

interface Props {
  control: Control<any>;
  name: string;
  error?: FieldError;
  label?: string;
  placeholder?: string;
  mask?: string;
  icon?: 'none' | 'search' | 'name' | 'phone';
}

const Input = ({
  control,
  name,
  error,
  label,
  icon,
  placeholder,
  mask,
  ...rest
}: Props) => (
  <>
    <Controller
      control={control}
      defaultValue=""
      name={name}
      render={({ field: { value, onChange } }) =>
        mask ? (
          <>
            <TextInput
              label={label}
              value={value || ''}
              onChangeText={(value) => onChange(value)}
              render={(props) => (
                <TextInputMask
                  {...props}
                  // placeholder={mask}
                  type={'cel-phone'}
                  options={{
                    maskType: 'BRL',
                    withDDD: true,
                    dddMask: '(99) ',
                  }}
                />
              )}
            />
            {!!error && <ErrorMessage>{error.message}</ErrorMessage>}
          </>
        ) : (
          <>
            <TextInput
              label={label}
              value={value || ''}
              onChangeText={(value) => onChange(value)}
            />
            {!!error && <ErrorMessage>{error.message}</ErrorMessage>}
          </>
        )
      }
    />
  </>
);

export default Input;
