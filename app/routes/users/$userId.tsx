import { Badge, Button, Divider, Flex, Heading, HStack, Text } from '@chakra-ui/react';
import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { NavLink, useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import ActionButton from '~/components/ActionButton';
import Card from '~/components/Card';
import Layout from '~/components/Layout';
import UserImage from '~/components/UserImage';
import type { UserProfileDto } from '~/models/user.server';
import { isRankedByUser } from '~/models/user.server';
import { getUserProfile } from '~/models/user.server';
import { requireUserId } from '~/session.server';
import { useUser } from '~/utils';

type LoaderData = {
  user: UserProfileDto;
  isRanked: boolean;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.userId, 'UserId not found');
  const currentUserId = await requireUserId(request);

  const user = await getUserProfile(params.userId);
  if (!user) {
    throw new Response('Not Found', { status: 404 });
  }

  const isRanked = await isRankedByUser(currentUserId, user.id);

  return json<LoaderData>({ user, isRanked });
};

const UserProfile : React.FC = () => {
  const { user, isRanked } = useLoaderData() as LoaderData;
  const currentUser = useUser();
  const isFriends = user.friends.some(friend => friend.id === currentUser.id);

  return (
    <Layout>
      <Card p={4}>
        <UserImage size="lg" />
        <Flex ml={4} direction="column" grow={1}>
          <Flex justify="space-between" grow={1}>
            <Flex direction="column">
              <Heading size="lg" fontWeight="semibold">{user.name}</Heading>
              <Heading size="sm" fontWeight="normal">{user.email}</Heading>
            </Flex>

            {currentUser.id !== user.id && (
              <HStack>
                <ActionButton
                  action="/users/friend"
                  size="sm"
                  variant={isFriends ? 'outline' : 'solid'}
                  label={isFriends ? 'Unfriend' : 'Add Friend'}
                  method={isFriends ? 'delete' : 'post'}
                >
                  <input type="hidden" value={user.id} name="userId" />
                </ActionButton>

                {!isRanked && (
                  <ActionButton
                    action="/users/rank"
                    size="sm"
                    label="+ Rank"
                  >
                    <input type="hidden" value={user.id} name="userId" />
                  </ActionButton>
                )}
              </HStack>
            )}
            {currentUser.id === user.id && (
              <Button
                as={NavLink}
                to="/users/edit"
                colorScheme="purple"
                variant="outline"
                size="sm"
              >
                Edit
              </Button>
            )}
          </Flex>

          <Divider my={2} />

          {user.description?.split('\n').map((x, i) => <Text key={i}>{x}</Text>)}

          <Divider my={2} />

          {!!user.tags?.length && (
            <HStack spacing={2} wrap="wrap">
              {user.tags.map(tag => (
                <Badge key={tag} colorScheme="purple" p={1}>
                  {tag}
                </Badge>
              ))}
            </HStack>
          )}
        </Flex>
      </Card>
    </Layout>
  );
};

export default UserProfile;
