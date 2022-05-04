import { Button, Flex, Heading } from '@chakra-ui/react';
import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import Card from '~/components/Card';
import UserCard from '~/components/UserCard';
import type { UserMin } from '~/models/user.server';
import { getFriends } from '~/models/user.server';
import { requireUserId } from '~/session.server';

type LoaderData = {
  friends: UserMin[];
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
        <UserCard
          key={friend.id}
          user={friend}
          actionButtons={(
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
          )}
        />
      ))}
    </>
  );
};

export default Friends;
