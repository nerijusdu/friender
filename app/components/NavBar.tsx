import { Flex, Link } from '@chakra-ui/react';
import { NavLink } from '@remix-run/react';
import { useOptionalUser } from '~/utils';
import UserImage from './UserImage';

const NavBar : React.FC = () => {
  const user = useOptionalUser();

  return (
    <Flex
      bg="purple.500"
      color="white"
      align="center"
      justify="space-between"
      px={2}
    >
      {user ? (
        <Flex align="center">
          <UserImage p={2} />
          <Link as={NavLink} to={`/users/${user.id}`}>{user.name || user.email}</Link>
        </Flex>
      ) : <div></div>}
      <form action={user ? '/logout' : '/login'} method="post">
        <Link as="button" type="submit">
          {user ? 'Logout' : 'Login'}
        </Link>
      </form>
    </Flex>
  );
};

export default NavBar;
