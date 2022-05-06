import { Stack, Flex, Divider } from '@chakra-ui/react';
import { NavLink } from '@remix-run/react';

const SideBar : React.FC = () => {
  return (
    <Stack fontSize="xl" height="90vh" pl={2}>
      <SideBarItem title="Posts" link="/home/posts" />
      <Divider borderColor="purple.700"/>
      <SideBarItem title="Friends" link="/home/friends" />
      <Divider borderColor="purple.700"/>
      <SideBarItem title="Ranks" link="/home/ranks" />
    </Stack>
  );
};

type SidebarItemProps = {
  title: string;
  link: string;
}

const SideBarItem : React.FC<SidebarItemProps> = ({ title, link }) => {
  const styleFunc = ({ isActive }: { isActive: boolean }) => isActive ? {
    color: 'var(--chakra-colors-purple-600)',
    fontWeight: 'bold',
  } : {};

  return (
    <Flex
      as={NavLink}
      p={2} px={8}
      cursor="pointer"
      _hover={{ textDecoration: 'underline' }}
      // @ts-ignore
      style={styleFunc}
      to={link}
    >
      {title}
    </Flex>
  );
};

export default SideBar;
