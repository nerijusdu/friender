import { Heading, Stack, Flex } from '@chakra-ui/react';

const Feed : React.FC = () => {
  return (
    <>
      <Heading size="lg" fontWeight="semibold" pl={4}>Updates</Heading>
      <Stack>
        <Flex
          m={2} p={2}
          rounded="lg"
          borderWidth="1px"
          boxShadow="md"
        >
          sumting
        </Flex>
      </Stack>
    </>
  );
};

export default Feed;
