import { Button, Flex, Heading, Image, Link } from '@chakra-ui/react';
import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { NavLink, useLoaderData } from '@remix-run/react';
import Card from '~/components/Card';
import { getFriends } from '~/models/user.server';
import { requireUserId } from '~/session.server';

type LoaderData = {
  friends: {
    id: string;
    name: string;
    email: string;
  }[];
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const friends = await getFriends(userId);
  return json<LoaderData>({ friends });
};

const Friends : React.FC = () => {
  const { friends } = useLoaderData() as LoaderData;

  return (
    <>
      <Heading px={2} size="lg" fontWeight="semibold">Friends</Heading>
      {!friends.length && (
        <Card>No friends yet</Card>
      )}
      {friends.map(friend => (
        <Card key={friend.id} justify="space-between">
          <Flex align="center">
            <Image src="/profile.jpg" rounded="full" w="50px" />
            <Link
              as={NavLink}
              to={`/users/${friend.id}`}
              size="md"
              fontWeight="normal"
              ml={4}
            >
              {friend.name || friend.email}
            </Link>
          </Flex>

          <Flex
            as="form"
            alignSelf="center"
            action="/users/friend"
            method="post"
          >
            <input type="hidden" name="_method" value="Delete" />
            <input type="hidden" value={friend.id} name="userId" />
            <Button
              size="sm"
              colorScheme="purple"
              type="submit"
            >
                Unfriend
            </Button>
          </Flex>
        </Card>
      ))}
    </>
  );
};

export default Friends;
