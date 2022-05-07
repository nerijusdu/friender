import { ChatIcon, DeleteIcon } from '@chakra-ui/icons';
import { Heading, Stack, Flex, Button, Divider, Link, HStack, IconButton, Input, InputGroup, InputRightElement, Text } from '@chakra-ui/react';
import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, NavLink, useLoaderData, useSubmit, useTransition } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import ActionButton from '~/components/ActionButton';
import Card from '~/components/Card';
import type { PostMin } from '~/models/posts.server';
import { getPosts } from '~/models/posts.server';
import { useOptionalUser } from '~/utils';

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
        {posts.map(post => <Post key={post.id} post={post} />)}
      </Stack>
    </>
  );
};

export type PostProps = {
  post: PostMin;
}

const Post : React.FC<PostProps> = ({ post }) => {
  const formRef = useRef(null);
  const [commentText, setCommentText] = useState('');
  const currentUser = useOptionalUser();
  const submit = useSubmit();
  const transition = useTransition();
  const isSubmitting = transition.state === 'submitting';
  const hasComments = !!post.comments?.length;

  useEffect(() => {
    if (!isSubmitting) {
      setCommentText('');
    }
  }, [isSubmitting]);

  return (
    <Card key={post.id} direction="column" px={0}>
      <Flex justify="space-between" align="center" px={2}>
        <Heading size="md" fontWeight="normal">{post.title}</Heading>
        <HStack>
          <Link
            as={NavLink}
            to={`/users/${post.user.id}`}
            colorScheme="purple"
            fontSize="sm"
            textAlign="right"
          >
            {post.user.name || post.user.email}
          </Link>

          {currentUser?.id === post.user.id && (
            <ActionButton
              as={IconButton}
              icon={<DeleteIcon />}
              action="/home/post"
              method='delete'
              size="sm"
              variant="ghost"
              colorScheme="red"
              rounded="full"
              aria-label="Delete post"
            >
              <input type="hidden" value={post.id} name="postId" />
            </ActionButton>
          )}
        </HStack>
      </Flex>

      <Divider my={2} borderColor="gray.400" />

      <Flex px={2}>{post.body}</Flex>

      <Divider my={2} borderColor="gray.400"/>

      {hasComments && (
        <>
          {/* <Text size="sm" fontStyle="italic" alignSelf="center" px={2}>Comments</Text>
          <Divider mt={2} /> */}
          <Stack pl={2}>
            {post.comments!.map(comment => (
              <Flex key={comment.id} justify="space-between">
                <Flex py={1}>
                  <Link as={NavLink} to={`/users/${comment.user.id}`} fontWeight="bold">
                    {comment.user.name}
                  </Link>
                  <Text ml={2}>{comment.body}</Text>
                </Flex>
                {currentUser?.id === comment.user.id && (
                  <ActionButton
                    as={IconButton}
                    icon={<DeleteIcon />}
                    action="/home/comment"
                    method='delete'
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    rounded="full"
                    aria-label="Delete comment"
                  >
                    <input type="hidden" value={comment.id} name="commentId" />
                  </ActionButton>
                )}
              </Flex>
            ))}
          </Stack>
          <Divider my={2} borderColor="gray.400" />
        </>
      )}

      <InputGroup as={Form} action="/home/comment" method="post" ref={formRef} px={2}>
        <input type="hidden" value={post.id} name="postId" />
        <Input
          placeholder="Comment"
          name="comment"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          isDisabled={isSubmitting}
        />
        <InputRightElement mr={2}>
          <IconButton
            icon={<ChatIcon />}
            onClick={() => submit(formRef?.current, { replace: true })}
            aria-label="Search"
            colorScheme="purple"
            size="sm"
            variant="ghost"
            rounded="full"
            m={2}
            isDisabled={isSubmitting}
          />
        </InputRightElement>
      </InputGroup>
    </Card>
  );
};


export default Feed;
