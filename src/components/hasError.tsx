import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { Card, Flex, Text } from '@radix-ui/themes'

const HasError = ({
  error = 'Error loading the data',
  title = 'Error',
  action
}: { error?: string, title?: string, action?: any }) => {
  return (<Card size="2">
    <Flex direction="column" gap="2">
      <ExclamationTriangleIcon color="red" width="20" height="20"/>
      <Flex direction="column" gap="0">
        <Text size="3" weight="bold" color="red">
          {title}
        </Text>
        <Text size="1">
          {error}
        </Text>
        {action && action}
      </Flex>
    </Flex>
  </Card>
  )
}

export default HasError
