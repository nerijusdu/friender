import { Flex } from '@chakra-ui/react';
import NavBar from './NavBar';
import SideBar from './SideBar';

const Layout : React.FC = ({ children }) => {
  return (
    <Flex direction="column">
      <NavBar />
      <Flex justify="space-between">
        <SideBar />
        <Flex direction="column" m={4} grow={1} maxW="container.xl">
          {children}
        </Flex>
        <div></div>
      </Flex>
    </Flex>
  );
};

export default Layout;
