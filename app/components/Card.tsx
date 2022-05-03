import type { FlexProps } from '@chakra-ui/react';
import { Flex } from '@chakra-ui/react';

export type CardProps = FlexProps & {
  method?: string;
};

const Card : React.FC<CardProps> = ({ children, ...flexProps }) => {
  return (
    <Flex
      m={2} p={2}
      rounded="lg"
      borderWidth="1px"
      boxShadow="md"
      {...flexProps}
    >
      {children}
    </Flex>
  );
};

export default Card;
