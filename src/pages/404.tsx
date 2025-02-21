import { Heading, HStack, Text } from '@chakra-ui/react';
import Layout from '../components/Layout';

export default function Custom404() {
    return (
        <Layout>
            <HStack justifyContent="center" py="20vh">
                <Heading
                    fontSize="3xl"
                    fontWeight="bold"
                    borderEndStyle="solid"
                    borderEndWidth={1}
                    paddingEnd={3}
                >
                    404
                </Heading>
                <Text fontSize="lg">This page could not be found.</Text>
            </HStack>
        </Layout>
    );
}
