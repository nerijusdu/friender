import { FormControl, FormErrorMessage, FormLabel, Input, Textarea } from '@chakra-ui/react';

export type FormInputProps = {
  error?: string;
  defaultValue?: string | number | null;
  name: string;
  label?: string;
  isTextArea?: boolean;
  isDisabled?: boolean;
  type?: string;
}

const FormInput : React.FC<FormInputProps> = ({
  error,
  name,
  defaultValue,
  label,
  isTextArea,
  isDisabled,
  type = 'text',
}) => {
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      {isTextArea ? (
        <Textarea id={name} name={name} defaultValue={defaultValue || undefined} isDisabled={isDisabled} />
      ) : (
        <Input id={name} name={name} type={type} defaultValue={defaultValue || undefined} isDisabled={isDisabled} />
      )}
      {error && (
        <FormErrorMessage>{error}</FormErrorMessage>
      )}
    </FormControl>
  );
};

export default FormInput;
