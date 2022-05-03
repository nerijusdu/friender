import { Flex, Heading } from '@chakra-ui/react';
import type { LoaderFunction } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import NavBar from '~/components/NavBar';
import SideBar from '~/components/SideBar';
import { requireUserId } from '~/session.server';

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  return null;
};

export default function HomePage() {
  return (
    <Flex direction="column">
      <NavBar />
      <Flex>
        <SideBar />
        <Flex direction="column" m={2} grow={1}>
          <Outlet />
        </Flex>
        <Flex px={4}>
          <Heading size="lg" fontWeight="semibold">Forums</Heading>
        </Flex>
      </Flex>
    </Flex>
  );
}