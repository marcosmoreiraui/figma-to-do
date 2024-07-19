import { Card, Flex, Spinner, Text } from '@radix-ui/themes'

const IsLoading = () => (
  <Card size="2" variant="surface">
    <Flex direction="column" gap="3">
      <Spinner size="3"/>
      <Flex direction="column" gap="0">
        <Text size="3" weight="bold">Loading...</Text>
        <Text size="1">If this takes too long, please move your changelog page to top level of your
          Figma file</Text>
      </Flex>
    </Flex>
  </Card>)
export default IsLoading
