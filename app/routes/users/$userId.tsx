import { Button, Divider, Flex, Heading, HStack, Image, Text } from '@chakra-ui/react';
import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import Card from '~/components/Card';
import Layout from '~/components/Layout';
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

  const isRanked = await isRankedByUser(user.id, currentUserId);

  return json<LoaderData>({ user, isRanked });
};

const UserProfile : React.FC = () => {
  const { user, isRanked } = useLoaderData() as LoaderData;
  const currentUser = useUser();
  const isFriends = user.friends.some(friend => friend.id === currentUser.id);

  return (
    <Layout>
      <Card p={4}>
        <Image src="/profile.jpg" rounded="full" w="100px" h="100px" />
        <Flex ml={4} direction="column" grow={1}>
          <Flex justify="space-between" grow={1}>
            <Flex direction="column">
              <Heading size="lg" fontWeight="semibold">{user.name}</Heading>
              <Heading size="sm" fontWeight="normal">{user.email}</Heading>
            </Flex>

            {currentUser.id !== user.id && (
              <HStack>
                <Flex
                  as="form"
                  alignSelf="flex-start"
                  action="/users/friend"
                  method="post"
                >
                  <input type="hidden" name="_method" value={isFriends ? 'delete' : 'post'} />
                  <input type="hidden" value={user.id} name="userId" />
                  <Button
                    size="sm"
                    colorScheme="purple"
                    variant={isFriends ? 'outline' : 'primary'}
                    type="submit"
                  >
                    {isFriends ? 'Unfriend' : 'Add Friend'}
                  </Button>
                </Flex>

                {!isRanked && (
                  <Flex
                    as="form"
                    alignSelf="flex-start"
                    action="/users/rank"
                    method="post"
                  >
                    <input type="hidden" value={user.id} name="userId" />
                    <Button
                      size="sm"
                      colorScheme="purple"
                      type="submit"
                    >
                      + Rank
                    </Button>
                  </Flex>
                )}
              </HStack>
            )}
          </Flex>

          <Divider my={2} />

          {user.description?.split('\n').map((x, i) => <Text key={i}>{x}</Text>)}
        </Flex>
      </Card>
    </Layout>
  );
};

export default UserProfile;
