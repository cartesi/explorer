import {
    Box,
    Button,
    ClientOnly,
    Heading,
    HStack,
    Progress,
    Skeleton,
    VStack,
} from '@chakra-ui/react';
import { ColorModeToggle } from '../components/ColorModeToggle';

export default async function Page() {
    return (
        <Box textAlign="center" fontSize="xl" pt="30vh">
            <VStack gap="8">
                <Heading size="2xl" letterSpacing="tight">
                    Welcome to Chakra UI v3 + Next.js (App)
                </Heading>

                <Progress.Root width="300px" value={65} striped>
                    <Progress.Track>
                        <Progress.Range />
                    </Progress.Track>
                </Progress.Root>

                <HStack>
                    <Button>Let's go!</Button>
                    <Button variant="outline">
                        bun install @chakra-ui/react
                    </Button>
                </HStack>
            </VStack>

            <Box pos="absolute" top="4" right="4">
                <ClientOnly fallback={<Skeleton w="10" h="10" rounded="md" />}>
                    <ColorModeToggle />
                </ClientOnly>
            </Box>
        </Box>
    );
}
