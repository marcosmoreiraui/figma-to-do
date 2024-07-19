import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { Button, Card, Flex, Text } from '@radix-ui/themes'

interface HasErrorProps {
  error?: string
  onClick: (e: any) => void
}

const HasError = ({
  error = 'Error loading the data',
  onClick
}: HasErrorProps) => (
  <Card size="2" variant="surface">
    <Flex direction="column" gap="2">
      <ExclamationTriangleIcon color="red" width="20" height="20"/>
      <Flex direction="column" gap="0">
        <Text size="3" weight="bold" color="red">{error}</Text>
        <Text size="2">Please change your token or check your permissions.</Text>
      </Flex>
    </Flex>
    <Button mt="2" onClick={onClick}>Update credentials</Button>
  </Card>
)

export default HasError
