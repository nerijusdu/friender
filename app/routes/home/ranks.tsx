import { Flex, Heading } from '@chakra-ui/react';
import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import UserCard from '~/components/UserCard';
import type { UserMin} from '~/models/user.server';
import { getUsers} from '~/models/user.server';
import { requireUserId } from '~/session.server';

type LoaderData = {
  users: UserMin[];
}

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  const users = await getUsers();
  return json<LoaderData>({ users });
};

const Ranks : React.FC = () => {
  const { users } = useLoaderData() as LoaderData;
  const getBorderColor = (index: number) => {
    switch (index) {
      case 0: return 'gold';
      case 1: return 'gray.300';
      case 2: return 'yellow.500';
      default: return undefined;
    }
  };

  return (
    <>
      <Heading px={2} size="lg" fontWeight="semibold">Ranks</Heading>
      {users.map((user, i) => (
        <UserCard
          key={user.id}
          user={user}
          imageBorderColor={getBorderColor(i)}
        >
          <Flex px={2}>
            Score: {user.score}
          </Flex>
        </UserCard>
      ))}
    </>
  );
};

export default Ranks;
