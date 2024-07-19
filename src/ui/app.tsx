import React, { useEffect, useState } from 'react'

import '@ui/styles/main.scss'
import '@radix-ui/themes/styles.css'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { addReaction, deleteComment, filterComments, removeReaction, useMessage } from '../../src/functions'
import { Badge, Button, Callout, Card, Flex, Heading, Text, TextField } from '@radix-ui/themes'
import { InfoCircledIcon } from '@radix-ui/react-icons'

import IsLoading from '../components/isLoading'
import IsEmpty from '../components/isEmpty'
import HasError from '../components/hasError'
import Header from '../components/header'
import TodoItem from '../components/todoItem'
import fetchComments from '../functions/fetchComments'
import replyToComment from '@functions/replyToComment'

dayjs.extend(relativeTime)

function extractFileKey (url: string): string | null {
  const match = /https:\/\/www\.figma\.com\/design\/([a-zA-Z0-9]*)\//.exec(url)
  return match ? match[1] : null
}

function App () {
  const [step, setStep] = useState(0)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [comments, setComments] = useState<any>([])
  const [allComments, setAllComments] = useState<any>([])
  const [savedKeys, setSavedKeys] = useState(false)
  const [options, setOptions] = useState({
    hideResolved: false,
    hideUnassigned: false,
    username: '',
    reload: false
  })
  const [currentUser, setCurrentUser] = useState('')
  const [keys, setKeys] = useState({
    fileKey: '',
    token: ''
  })

  const {
    message,
    postMessage
  } = useMessage()

  const getComments = async (keys: any, options: any, currentUser: string) => {
    setIsLoading(true)
    await fetchComments(keys).then((res: any) => {
      if (res.error) {
        setError('Error loading comments')
        return
      }
      setAllComments(res)
      setComments(filterComments(res, options, currentUser))
    }).catch(() => {
      setError('Error loading comments')
    }).finally(() => {
      setIsLoading(false)
    })
  }

  const handleKeys = (value: any) => {
    if (value.token && value.fileKey) {
      setSavedKeys(true)
    }
    setKeys(value)
    postMessage('SAVE_KEYS', value)
  }

  const handleDelete = async (id: string) => {
    setIsLoading(true)
    await deleteComment(id, keys).then(() => {
      comments.forEach((user: any) => {
        user.comments = user.comments.filter((comment: any) => comment.id !== id)
      })
      setComments([...comments])
    }).catch(() => {
      setError('Error deleting comment')
    }).finally(() => {
      setIsLoading(false)
    })
  }

  const handleZoom = async (nodeId: string) => {
    postMessage('ZOOM', nodeId)
  }

  const handleReload = () => {
    setIsLoading(true)
    getComments(keys, options, currentUser).then(() => {
    }).catch(() => {
      setError('Error loading comments')
    }).finally(() => {
      setIsLoading(false)
    })
  }

  const handleOptions = (v: any) => {
    setOptions(v)
    setComments(filterComments(allComments, v, currentUser))
    postMessage('SAVE_OPTIONS', v)
  }

  const handleReply = async (commentId: string, message: string) => {
    setIsLoading(true)
    await replyToComment(commentId, message, keys).then(() => {
    }).catch(() => {
      setError('Error replying to comment')
    }).finally(() => {
      setIsLoading(false)
    })
  }

  const handleError = () => {
    setKeys({
      fileKey: '',
      token: ''
    })
    setStep(0)
    setSavedKeys(false)
    setError('')
  }

  const handleMessages = (msg: any) => {
    const {
      token = '',
      fileKey = '',
      options = {},
      user = '',
      error = ''
    } = msg?.content || {}

    const savedKeys = {
      fileKey,
      token
    }
    switch (msg?.type) {
      case
        'INITIALIZED':
        if (!token || !fileKey) {
          setSavedKeys(false)
          setStep(token ? 1 : 0)
          setIsLoading(false)
        }
        if (token && fileKey) {
          setSavedKeys(true)
          getComments(savedKeys, options, user.name).then(
            () => {
              setIsLoading(false)
            }
          )
        }
        setKeys(savedKeys)
        setCurrentUser(user.name)
        setOptions(options)
        break
      case
        'ERROR':
        setError(error)
        setIsLoading(false)
        break
      default:
        break
    }
  }

  useEffect(() => {
    postMessage('INITIALIZE')
  }, [])

  useEffect(() => {
    handleMessages(message)
  }, [message])

  if (!isLoading && !savedKeys) {
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
                <Text size="3" weight="bold">Add your file link</Text>
                <Text size="2" mt="2">
                  <Badge color="violet" size="2" mr="1">1</Badge> Copy your file link
                </Text>
                <Card><img width="100%" src="https://todo-comments.vercel.app/step0.png" alt=""/></Card>
                <Text size="2" mt="2">
                  <Badge color="violet" size="2" mr="1">2</Badge> Paste your file link below
                </Text>
              </Flex>
              <Text as="label">
                <TextField.Root placeholder="https://www.figma.com/file/qeqXui2312wqe..." size="2"
                  onChange={(v) => {
                    setKeys({
                      ...keys,
                      fileKey: extractFileKey(v.target.value) ?? ''
                    })
                  }}>
                </TextField.Root>
              </Text>
            </Flex>
            <Button color="violet" disabled={!keys.fileKey} onClick={() => {
              !keys.token
                ? setStep(2)
                : handleKeys(keys)
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
                    setKeys({
                      ...keys,
                      token: v.target.value
                    })
                  }}></TextField.Root>
              </Text>

              <Button mt="2" color="violet" disabled={!keys.token}
                onClick={() => {
                  handleKeys(keys)
                }}>Continue</Button>
            </Flex>
          </Flex>
        )}
      </Flex>
    )
  }

  const renderContent = () => {
    if (isLoading) return <IsLoading/>
    if (error) return <HasError onClick={handleError} error={error}/>
    if (comments?.length === 0) return <IsEmpty/>
    return (
      <Flex direction="column" gap="4">
        {comments.map((userComment: any) => (
          <Flex direction="column" key={userComment.user} gap="2">
            <Text size="2" weight="bold"
              style={{ letterSpacing: 0.5 }}>{userComment.user.toUpperCase()}{userComment.user === currentUser ? ' (You)' : ''}</Text>
            <Flex direction="column" gap="2">
              {userComment.comments.map((comment: any) => (
                <TodoItem
                  key={comment.id}
                  comment={comment}
                  onCheckedChange={async (v: boolean) => v
                    ? await addReaction(comment.id, keys)
                    : await removeReaction(comment.id, keys)}
                  onDelete={handleDelete}
                  onZoom={handleZoom}
                  onReply={handleReply}
                />
              ))}
            </Flex>
          </Flex>
        ))}
      </Flex>
    )
  }

  return (
    <Flex className="main" direction="column" gap="5">
      <Header
        isLoading={isLoading}
        onClick={handleReload}
        onChange={handleOptions}
        options={options}
        currentUser={currentUser}/>
      {renderContent()}
    </Flex>
  )
}

export default App
