import { Callout, Card, Flex, Text } from '@radix-ui/themes'

const IsEmpty = () => (
  <Card variant="surface" size="2" mb="5">
    <Flex direction="column" gap="2" align="center">
      <Flex direction="column" gap="2">
        <Text size="3" weight="bold">
					No TODOs found
        </Text>
        <Flex direction="column" gap="2">
          <Text size="1">
						Add comments to your Figma file starting with <Text color="violet">TODO</Text>.

          </Text>
          <Text size="1">
						If you want to assign a <Text color="violet">TODO</Text> to
						a user, add <Text color="violet">@username:</Text> at the end of the comment.
          </Text>
          <Callout.Root color="violet" mt="2" size="1">
            <Callout.Text>
							TODO @Marcos: Fix the button
            </Callout.Text>
          </Callout.Root>
        </Flex>
      </Flex>
    </Flex>
  </Card>)
export default IsEmpty
