import { Button, Card, Checkbox, Dialog, DropdownMenu, Flex, Text, TextArea } from '@radix-ui/themes'
import { truncateText } from '@functions/index'
import dayjs from 'dayjs'
import { ChatBubbleIcon, Crosshair2Icon, DotsVerticalIcon, TrashIcon } from '@radix-ui/react-icons'
import React from 'react'

const TodoItem = ({
  comment,
  onZoom,
  onDelete,
  onCheckedChange,
  onReply
}: any) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [message, setMessage] = React.useState('')
  const handleZoom = (e: string) => {
    onZoom(e)
  }

  const handleDelete = (e: string) => {
    onDelete(e)
  }

  const handleCheck = (e: boolean) => {
    onCheckedChange(e)
  }

  const handleReply = (id: string, message: string) => {
    onReply(id, message)
  }

  return (
    <>
      <Card key={comment.id} asChild>
        <label htmlFor={comment.id}>
          <Flex align="center" justify="between" gap="3">
            <Flex align="center" gap="3">
              <Checkbox
                size="3"
                color="violet"
                id={comment.id}
                defaultChecked={comment.checked}
                onCheckedChange={handleCheck}
              />
              <Flex direction="column">
                <Text size="3" as="label" htmlFor={comment.id}>{truncateText(comment.comment, 75)}</Text>
                <Text size="1" color="gray">{dayjs(comment.date).fromNow()}</Text>
              </Flex>
            </Flex>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button variant="ghost" mr="2">
                  <DotsVerticalIcon/>
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item onClick={() => {
                  handleZoom(comment.nodeId)
                }}><Crosshair2Icon/> See on file</DropdownMenu.Item>

                <DropdownMenu.Item onClick={() => {
                  setIsOpen(true)
                }}><ChatBubbleIcon/> Reply</DropdownMenu.Item>

                <DropdownMenu.Separator/>
                <DropdownMenu.Item
                  color="red" onClick={() => {
                    handleDelete(comment.id)
                  }}><TrashIcon/> Delete</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Flex>
        </label>
      </Card>
      <Dialog.Root open={isOpen}>
        <Dialog.Content maxWidth="450px">
          <Dialog.Title>Reply message</Dialog.Title>
          <Flex direction="column" gap="3">
            <label htmlFor="message">
              <Text as="div" size="2" mb="1" weight="bold">
                Message
              </Text>
              <TextArea id="message" onChange={(e) => {
                setMessage(e.target.value)
              }}/>
            </label>
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray" onClick={() => {
                setIsOpen(false)
                setMessage('')
              }}>
                Cancel
              </Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button onClick={() => {
                handleReply(comment.id, message)
              }}>Send</Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </>
  )
}

export default TodoItem
