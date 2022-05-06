import { SearchIcon } from '@chakra-ui/icons';
import { Flex, Heading, IconButton, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { useState } from 'react';
import UserCard from '~/components/UserCard';
import type { UserMin} from '~/models/user.server';
import { getUsers} from '~/models/user.server';
import { requireUserId } from '~/session.server';

type LoaderData = {
  users: UserMin[];
}

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  const url = new URL(request.url);
  const search = url.searchParams.get('search');
  const users = await getUsers({ search });
  return json<LoaderData>({ users });
};

const Ranks : React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
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
      <Flex px={2} justify="space-between" gap={4}>
        <Heading size="lg" fontWeight="semibold">Ranks</Heading>
        <Flex>
          <InputGroup>
            <Input
              placeholder="Search"
              maxW="300px"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <InputRightElement>
              <IconButton
                icon={<SearchIcon />}
                onClick={() => navigate('/home/ranks?search=' + search)}
                aria-label="Search"
                colorScheme="purple"
                size="sm"
                variant="ghost"
                rounded="full"
                m={2}
              />
            </InputRightElement>
          </InputGroup>
        </Flex>
      </Flex>
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
