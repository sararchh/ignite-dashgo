import { Avatar, Box, Flex, Text } from "@chakra-ui/react";

export function Profile() {
  return (
    <Flex align="center">
      <Box mr='4' textAlign='right'>
        <Text>Sara Rocha</Text>
        <Text color='gray.300' fontSize='small'>
          sara@mail.com
        </Text>
      </Box>

      <Avatar size='md' name='Sara Rocha' src='https://github.com/sararchh.png' />

    </Flex>

  );
}