import { memo } from 'react';
import { VStack, Box, StackProps } from '@chakra-ui/react';

export type OrderedContentProps = {
    title: string;
    orderedItems: string[];
    stackProps?: StackProps;
};

export const OrderedContent = memo(
    ({ title, orderedItems, stackProps }: OrderedContentProps) => (
        <VStack
            alignItems="flex-start"
            py={{ base: 2, md: 5 }}
            px={{ base: 3, md: 7 }}
            {...stackProps}
        >
            <p>{title}</p>
            <Box as="ol" pl={{ base: 4, md: 8 }}>
                {orderedItems.map((content, i) => (
                    <li id={`text-${i}}`}>{content}</li>
                ))}
            </Box>
        </VStack>
    )
);
