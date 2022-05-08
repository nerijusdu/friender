import { SearchIcon } from '@chakra-ui/icons';
import { Badge, Flex, Heading, HStack, IconButton, Input, InputGroup, InputRightElement, Select } from '@chakra-ui/react';
import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, useLocation, useNavigate } from '@remix-run/react';
import { useEffect, useState } from 'react';
import Layout from '~/components/Layout';
import UserCard from '~/components/UserCard';
import type { UserMin} from '~/models/user.server';
import { getAllTags} from '~/models/user.server';
import { getUsers} from '~/models/user.server';
import { requireUserId } from '~/session.server';

type LoaderData = {
  users: UserMin[];
  tags: string[];
}

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  const url = new URL(request.url);
  const search = url.searchParams.get('search');
  const filter = url.searchParams.get('filter');
  const users = await getUsers({ search, tag: filter });
  const tags = await getAllTags();
  return json<LoaderData>({ users, tags });
};

const Ranks : React.FC = () => {
  const { search: urlQuery } = useLocation();
  const params = new URLSearchParams(urlQuery);
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState(params.get('search') || '');
  const [search, setSearch] = useState(params.get('search') || '');
  const [filter, setFilter] = useState(params.get('filter') || '');
  const { users, tags } = useLoaderData() as LoaderData;
  const getBorderColor = (index: number) => {
    switch (index) {
      case 0: return 'gold';
      case 1: return 'gray.300';
      case 2: return 'yellow.500';
      default: return undefined;
    }
  };

  useEffect(() => {
    const query = new URLSearchParams();
    if (search) {
      query.append('search', search);
    }
    if (filter) {
      query.append('filter', filter);
    }
    navigate(`/ranks?${query.toString()}`);
  }, [search, filter]);

  return (
    <Layout>
      <Flex px={2} justify="space-between" gap={4}>
        <Heading size="lg" fontWeight="semibold">Ranks</Heading>

        <Select
          maxW="200px"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">Filter</option>
          {tags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </Select>

        <Flex>
          <InputGroup>
            <Input
              placeholder="Search"
              maxW="300px"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <InputRightElement>
              <IconButton
                icon={<SearchIcon />}
                onClick={() => setSearch(searchText)}
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
          <HStack spacing={1} wrap="wrap">
            {user.tags?.slice(0, 5).map(tag => (
              <Badge key={tag} colorScheme="purple">
                {tag}
              </Badge>
            ))}
          </HStack>
          <Flex px={2}>
            Score: {user.score}
          </Flex>
        </UserCard>
      ))}
    </Layout>
  );
};

export default Ranks;
