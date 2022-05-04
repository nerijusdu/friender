import { Heading, Stack, Flex, Button, Divider, Link } from '@chakra-ui/react';
import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { NavLink, useLoaderData } from '@remix-run/react';
import Card from '~/components/Card';
import type { PostMin } from '~/models/posts.server';
import { getPosts } from '~/models/posts.server';

export type LoaderData = {
  posts: PostMin[];
}

export const loader: LoaderFunction = async ({ request }) => {
  const posts = await getPosts();
  return json<LoaderData>({ posts });
};

const Feed : React.FC = () => {
  const { posts } = useLoaderData() as LoaderData;
  return (
    <>
      <Flex px={2} justify="space-between">
        <Heading size="lg" fontWeight="semibold">Updates</Heading>
        <Button
          as={NavLink}
          colorScheme="purple"
          size="sm"
          to="/home/new-post"
        >
          Create a post
        </Button>
      </Flex>
      <Stack>
        {posts.map(post => (
          <Card key={post.id} direction="column">
            <Flex justify="space-between" align="center">
              <Heading size="md" fontWeight="normal">{post.title}</Heading>
              <Link
                as={NavLink}
                to={`/users/${post.user.id}`}
                colorScheme="purple"
                fontSize="sm"
                textAlign="right"
              >
                {post.user.name || post.user.email}
              </Link>
            </Flex>

            <Divider my={2} />

            <Flex>{post.body}</Flex>

            <Divider my={2} />
          </Card>
        ))}
      </Stack>
    </>
  );
};

export default Feed;
