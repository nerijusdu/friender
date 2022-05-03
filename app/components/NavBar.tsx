import { Flex, Image, Text } from '@chakra-ui/react';

const NavBar : React.FC = () => {
  return (
    <Flex
      bg="purple.500"
      color="white"
      align="center"
      px={2}
    >
      <Image src="/profile.jpg" w="50px" rounded="full" p={2} />
      <Text>Profile</Text>
    </Flex>
  );
};

export default NavBar;
