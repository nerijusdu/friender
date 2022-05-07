import type { ButtonProps} from '@chakra-ui/react';
import { Button, Flex } from '@chakra-ui/react';
import { Form, useTransition } from '@remix-run/react';

export type ActionButtonProps = ButtonProps & {
  icon?: React.ReactNode;
  label?: string;
  method?: 'post' | 'put' | 'patch' | 'delete';
  action: string;
}

const ActionButton : React.FC<ActionButtonProps> = ({
  children,
  label,
  method = 'post',
  action,
  ...buttonProps
}) => {
  const transition = useTransition();

  return (
    <Flex
      as={Form}
      alignSelf="center"
      action={action}
      method="post"
    >
      <input type="hidden" name="_method" value={method} />
      {children}
      <Button
        colorScheme="purple"
        isDisabled={transition.state === 'submitting'}
        {...buttonProps}
        type="submit"
      >
        {label}
      </Button>
    </Flex>
  );
};

export default ActionButton;
