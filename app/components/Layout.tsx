import { Flex, Heading } from '@chakra-ui/react';
import NavBar from './NavBar';
import SideBar from './SideBar';

const Layout : React.FC = ({ children }) => {
  return (
    <Flex direction="column">
      <NavBar />
      <Flex>
        <SideBar />
        <Flex direction="column" m={4} grow={1}>
          {children}
        </Flex>
        <Flex px={4} height="90vh">
          <Heading size="lg" fontWeight="semibold">Forums</Heading>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Layout;
