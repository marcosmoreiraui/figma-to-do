import { Checkbox, Flex, IconButton, Popover, Text } from '@radix-ui/themes'
import { MixerHorizontalIcon, ReloadIcon } from '@radix-ui/react-icons'

const Header = ({
  options = {
    hideResolved: false,
    hideUnassigned: false,
    username: ''
  },
  currentUser,
  isLoading,
  onClick,
  onChange
}: {
  options: {
    hideResolved?: boolean
    hideUnassigned?: boolean
    username?: string
  }
  currentUser: string
  isLoading: boolean
  onClick: any
  onChange: any
}) => {
  const handleOnClick = (e: any) => {
    onClick(e)
  }

  const handleOptions = (options: any) => {
    onChange(options)
  }

  return (
    <Flex direction="column">
      <Flex justify="between" align="center">
        <Text size="5" weight="bold"><i></i></Text>
        <Flex align="center" gap="5">
          <IconButton variant="ghost" disabled={isLoading}
            onClick={handleOnClick}>
            <ReloadIcon/>
          </IconButton>
          <Popover.Root>

            <Popover.Trigger>
              <IconButton
                disabled={isLoading}
                variant={'ghost'}
                color={(options?.hideResolved ?? options?.hideUnassigned ?? options?.username) ? 'violet' : 'gray'}>
                <MixerHorizontalIcon/>
              </IconButton>
            </Popover.Trigger>

            <Popover.Content>
              <Flex direction="column" gap="5">
                <Text as="label" size="2">
                  <Flex gap="2">
                    <Checkbox
                      color="violet"
                      defaultChecked={options?.hideResolved}
                      onCheckedChange={(v) => {
                        handleOptions({
                          ...options,
                          hideResolved: v
                        })
                      }}/>
                    Hide resolved comments
                  </Flex>
                </Text>
                <Text as="label" size="2">
                  <Flex gap="2">
                    <Checkbox color="violet" defaultChecked={options?.hideUnassigned}
                      onCheckedChange={(v) => {
                        handleOptions({
                          ...options,
                          hideUnassigned: v
                        })
                      }}/>
                    Hide non assigned TODOs
                  </Flex>
                </Text>
                <Text as="label" size="2">
                  <Flex gap="2">
                    <Checkbox color="violet"
                      defaultChecked={options?.username === currentUser}
                      onCheckedChange={(v) => {
                        handleOptions({
                          ...options,
                          username: v ? currentUser : ''
                        })
                      }}/>
                    Only show my TODOs
                  </Flex>
                </Text>
              </Flex>
            </Popover.Content>
          </Popover.Root>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Header
