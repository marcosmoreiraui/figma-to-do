import { useEffect, useState } from 'react'

import '@ui/styles/main.scss'
import '@radix-ui/themes/styles.css'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import {
  addReaction,
  deleteComment,
  fetchComments,
  filterComments,
  removeReaction,
  truncateText,
  useMessage
} from '../../src/functions'
import {
  Badge,
  Button,
  Callout,
  Card,
  Checkbox,
  DropdownMenu,
  Flex,
  Heading,
  IconButton,
  Popover,
  Separator,
  Text,
  TextField
} from '@radix-ui/themes'
import { DotsVerticalIcon, InfoCircledIcon, MixerHorizontalIcon, ReloadIcon } from '@radix-ui/react-icons'

import IsLoading from '../components/isLoading'
import IsEmpty from '../components/isEmpty'
import HasError from '../components/hasError'

dayjs.extend(relativeTime)

function extractFileKey (url: string): string | null {
  const match = /https:\/\/www\.figma\.com\/design\/([a-zA-Z0-9]*)\//.exec(url)
  return match ? match[1] : null
}

function App () {
  const [step, setStep] = useState(0)
  const [error, setError] = useState('')
  const [errorToken, setErrorToken] = useState('')

  const [isLoading, setIsLoading] = useState(true)
  const [comments, setComments] = useState<any>([])
  const [allComments, setAllComments] = useState<any>([])

  const [currentUser, setCurrentUser] = useState('')

  const [constants, setConstants] = useState({
    fileKey: '',
    token: ''
  })

  const [options, setOptions] = useState({
    hideResolved: false,
    hideUnassigned: false,
    username: '',
    reload: false
  })

  const {
    message,
    postMessage
  } = useMessage()

  const handleOptions = (value: any) => {
    postMessage('SAVE_OPTIONS', value)
    const filteredComments = filterComments(allComments, options, currentUser)
    setComments(filteredComments)
  }

  const handleConstants = (value: any) => {
    postMessage('SAVE_CONSTANTS', value)
  }

  const handleDelete = async (id: string) => {
    await deleteComment(id, constants)
    setOptions({
      ...options,
      reload: true
    })
  }

  const handleZoom = async (nodeId: string) => {
    postMessage('ZOOM', nodeId)
  }
  const getComments = async (keys: {
    fileKey: string
    token: string
  }, options: any, currentUser: string) => {
    try {
      const items = await fetchComments(keys) as any
      if (items.error) {
        setStep(0)
        setIsLoading(false)
        setError(comments.error)
      } else {
        if (comments.length > 0) {
          setAllComments(items)
          const filteredComments = filterComments(items, options, currentUser)
          setComments(filteredComments)
        }
        setStep(3)
        setIsLoading(false)
      }
    } catch (err) {
      setError('error')
      setIsLoading(false)
    }
  }

  useEffect(() => {
    postMessage('INITIALIZE')
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (message?.type === 'INITIALIZED') {
      if (message.content?.constants?.fileKey && message.content?.constants?.token) {
        setCurrentUser(message.content.currentUser)
        setConstants(message.content.constants)
        setOptions(message.content.options)
        getComments(message.content.constants, message.content.options, message.content.currentUser)
        setStep(3)
      } else {
        setStep(0)
        setIsLoading(false)
      }
    }

    if (message?.type === 'SAVED_CONSTANTS') {
      if (message?.content?.fileKey && message?.content?.token) {
        setConstants(message.content)
        setStep(3)
      } else {
        setStep(0)
      }
    }

    if (message?.type === 'SAVED_OPTIONS') {
      console.log('SAVED_OPTIONS', message.content)
      if (message.content) setOptions(message.content)
    }

    if (message?.type === 'ERROR') {
      setError(message.content)
    }
    if (message?.type === 'ERROR_TOKEN') {
      setConstants({
        ...constants,
        token: ''
      })
      setErrorToken(message.content)
    }
  }, [message])

  const Header = () => (
    <Flex justify="between" align="center">
      <Text size="5" weight="bold"><i>TO-DO list</i></Text>
      <Flex align="center" gap="4">
        <IconButton variant="ghost" disabled={isLoading}
          onClick={() => {
            setIsLoading(true)
            getComments(constants, options, currentUser)
          }}>
          <ReloadIcon width="18" height="18"/>
        </IconButton>
        <Popover.Root>

          <Popover.Trigger>
            <Button
              disabled={isLoading}
              variant={options?.hideResolved || options?.hideUnassigned || options?.username ? 'soft' : 'soft'}
              color={options?.hideResolved || options?.hideUnassigned || options?.username ? 'violet' : 'gray'}>
              <MixerHorizontalIcon/>
            </Button>
          </Popover.Trigger>

          <Popover.Content>
            <Flex direction="column" gap="5">
              <Text as="label" size="2">
                <Flex gap="2">
                  <Checkbox color="violet" defaultChecked={options?.hideResolved}
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
  )

  console.log(constants)

  const TodoItem = ({
    comment
  }: any) => (
    <Card key={comment.id}>
      <Flex align="center" justify="between" gap="3">
        <Flex align="center" gap="3">
          <Checkbox
            size="3"
            color="violet"
            id={comment.id}
            defaultChecked={comment.checked}
            onCheckedChange={(v) => {
              v ? addReaction(comment.id, constants) : removeReaction(comment.id, constants)
            }}
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
            <DropdownMenu.Item onClick={async () => {
              await handleZoom(comment.nodeId)
            }}>See in the file</DropdownMenu.Item>
            <DropdownMenu.Item
              color="red" onClick={async () => {
                await handleDelete(comment.id)
              }}>Delete</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Flex>
    </Card>)

  if (!isLoading && step !== 3 && constants?.fileKey && constants?.token) {
    return (
      <Flex className="main" direction="column" gap="5">
        {step === 0 && (
          <Flex direction="column" gap="5">
            <Flex direction="column">
              <Heading size="3" weight="bold">Connect your Figma file</Heading>
              <Text size="2">We need your File Key and Personal Access Token just this one time to work
								with the comments in your file.
              </Text>
              <Callout.Root color="violet" mt="4">
                <Callout.Icon>
                  <InfoCircledIcon/>
                </Callout.Icon>
                <Callout.Text>This data will be only stored in this computer </Callout.Text>
              </Callout.Root>

            </Flex>
            <Button color="violet" onClick={() => {
              setStep(1)
            }}>{"Ok, let's do it!"}</Button>
          </Flex>
        )}
        {step === 1 && (
          <Flex direction="column" gap="5">
            <Flex direction="column" gap="4">
              <Flex direction="column" gap="4">
                <Text size="3" weight="bold">First, we need your File link</Text>
                <Text size="2" mt="2">
                  <Badge color="violet" size="2" mr="1">1</Badge> Copy your File link
                </Text>
                <Card><img width="100%" src="https://todo-comments.vercel.app/step0.png" alt=""/></Card>
                <Text size="2" mt="2">
                  <Badge color="violet" size="2" mr="1">2</Badge> Paste your File link below
                </Text>
              </Flex>
              <Text as="label">
                <TextField.Root placeholder="https://www.figma.com/file/qeqXui2312wqe..." size="2"
                  onChange={(v) => {
                    setConstants({
                      ...constants,
                      fileKey: extractFileKey(v.target.value) ?? ''
                    })
                  }}>
                </TextField.Root>
              </Text>
            </Flex>
            <Button color="violet" disabled={!constants?.fileKey} onClick={() => {
              setStep(2)
            }}>
							Next
            </Button>
          </Flex>
        )}
        {step === 2 && (
          <Flex direction="column" gap="5">
            <Flex direction="column" gap="4">
              <Text size="3" weight="bold">Get your token</Text>
              <Text size="2">
                <Badge color="violet" size="2" mr="1">1</Badge>
								Navigate to your Figma profile Settings page.
              </Text>
              <Card>
                <img width="100%" src="https://todo-comments.vercel.app/step11.png" alt=""/>
              </Card>

              <Text size="2" mt="2">
                <Badge color="violet" size="2" mr="1">2</Badge>
								Create a new Personal Access Token.
              </Text>
              <Card>
                <img width="100%" src="https://todo-comments.vercel.app/step1.png" alt=""/>
              </Card>

              <Text size="2" mt="2">
                <Badge color="violet" size="2" mr="1">3</Badge>
								Change the expiration date and choose <strong>write</strong> permissions in comments
              </Text>
              <Card>
                <img width="100%" src="https://todo-comments.vercel.app/step2.png" alt=""/>
              </Card>

              <Text size="2">
                <Badge color="violet" size="2" mr="1">4</Badge>
								Copy your token and paste it below
              </Text>
              <Card>
                <img width="100%" src="https://todo-comments.vercel.app/step3.png" alt=""/>
              </Card>

              <Text as="label">
                <TextField.Root size="2" placeholder="figd_Fv_qOFzbbaOKJx8g..."
                  onChange={(v) => {
                    setConstants({
                      ...constants,
                      token: v.target.value
                    })
                  }}></TextField.Root>
              </Text>

              <Button mt="2" color="violet" disabled={!constants.token}
                onClick={() => {
                  handleConstants(constants)
                }}>Continue</Button>
            </Flex>
          </Flex>
        )}
      </Flex>
    )
  }

  if (error) {
    return (
      <Flex className="main" direction="column" gap="5">
        <Header/>
        <Separator style={{ width: '100%' }}/>
        <HasError error={error}/>
      </Flex>
    )
  }
  if (errorToken) {
    return (
      <Flex className="main" direction="column" gap="5">
        <Header/>
        <Separator style={{ width: '100%' }}/>
        <HasError
          error="Maybe is expired or you didn't give the right permissions. Please create a new one and paste below."
          title="Error with your token" action={
            <Flex direction="column" gap="4" mt="4">
              <Button variant="ghost" color="violet" onClick={() => {
                setStep(1)
                setConstants({
                  fileKey: '',
                  token: ''
                })
              }}>Step-by-Step Instructions</Button>
              <Text as="label">
                <TextField.Root size="2" placeholder="figd_Fv_qOFzbbaOKJx8g..."
                  onChange={(v) => {
                    setConstants({
                      ...constants,
                      token: v.target.value
                    })
                  }}></TextField.Root>
              </Text>
              <Button color="violet" disabled={!constants.token}
                onClick={() => {
                  handleConstants(constants)
                }}>Save</Button>
            </Flex>}/>
      </Flex>
    )
  }

  if (isLoading) {
    return (
      <Flex className="main" direction="column" gap="5">
        <Header/>
        <Separator style={{ width: '100%' }}/>
        <IsLoading/>
      </Flex>
    )
  }

  console.log('comments', comments)

  if (comments?.length === 0 || !comments) {
    return (
      <Flex className="main" direction="column" gap="5">
        <Header/>
        <Separator style={{ width: '100%' }}/>
        <IsEmpty/>
      </Flex>
    )
  }

  return (
    <Flex className="main" direction="column" gap="5">
      <Header/>
      <Separator style={{ width: '100%' }}/>
      <Flex direction="column" gap="4">
        {comments.map((userComment: any) => (
          <>
            {userComment.comments.length > 0 && (
              <Flex direction="column" key={userComment.user} gap="2">
                <Text size="2"
									  weight="bold">{userComment.user.toUpperCase()}{userComment.user === currentUser ? ' (You)' : ''}</Text>
                <Flex direction="column" gap="2">
                  {userComment.comments.map((comment: any) => (
                    <TodoItem key={comment.id} comment={comment}/>
                  ))}
                </Flex>
              </Flex>
            )}
          </>))}
      </Flex>
    </Flex>
  )
}

export default App
