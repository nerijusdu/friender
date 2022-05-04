import type { ImageProps } from '@chakra-ui/react';
import { Link, Flex, Image } from '@chakra-ui/react';
import { NavLink } from '@remix-run/react';
import type { UserMin } from '~/models/user.server';
import Card from './Card';

export type UserCardProps = {
  user: UserMin;
  imageBorderColor?: ImageProps['borderColor'];
  actionButtons?: React.ReactNode;
}

const UserCard : React.FC<UserCardProps> = ({ user, actionButtons, children, imageBorderColor }) => {
  return (
    <Card justify="space-between" align="center">
      <Flex align="center">
        <Image
          src="/profile.jpg"
          rounded="full"
          w="50px"
          border={imageBorderColor ? '3px solid' : undefined}
          borderColor={imageBorderColor}
        />

        <Link
          as={NavLink}
          to={`/users/${user.id}`}
          size="md"
          fontWeight="normal"
          ml={4}
        >
          {user.name || user.email}
        </Link>
      </Flex>

      {children}

      {actionButtons}
    </Card>
  );
};

export default UserCard;
