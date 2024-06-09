import axios from 'axios'
import { constants } from '../constants'

interface Reaction {
  id: string
  emoji: string
}

interface Comment {
  id: string
  comment: string
  date: string
  reactions: Reaction[]
  checked?: boolean
  resolved?: string
  nodeId: string
}

interface KeyOptions {
  fileKey: string
  token: string

}

interface UserComment {
  user: string
  comments: Comment[]
}

const fetchFromAPI = async (url: string, token?: string) => {
  try {
    const response = await axios.get(url, {
      headers: {
        'X-Figma-Token': token
      }
    })
    return response.data
  } catch (error) {
    console.error(`Error fetching: ${url} `, error)
    return { error: 'Error fetching comments' }
  }
}

const processComments = async (figmaComments: any[], keys: KeyOptions) => {
  const todoComments = figmaComments.filter((comment: any) => comment.message.startsWith('TODO'))

  const users: Record<string, UserComment> = {
    noUser: {
      user: 'Unassigned',
      comments: []
    }
  }

  for (const comment of todoComments) {
    let message = comment.message.replace('TODO', '').trim()
    let match = message.match(/@(.*?)[ ]*:/)
    let username: string
    if (match?.[1]) {
      username = match[1].trim()
      message = message.replace(new RegExp(`@${username}[ ]*:`), '').trim()
    } else {
      match = message.match(/@(\S*)/)
      if (match?.[1]) {
        username = match[1].trim()
        message = message.replace(`@${username}`, '').trim()
      } else {
        username = 'noUser'
      }
    }
    if (!users[username]) {
      users[username] = {
        user: username,
        comments: []
      }
    }
    const checked = comment.reactions.some((reaction: any) => reaction.emoji === ':white_check_mark:')

    users[username].comments.push({
      id: comment.id,
      comment: message,
      date: comment.created_at,
      resolved: comment.resolved_at,
      nodeId: comment.client_meta.node_id,
      checked,
      reactions: comment.reactions
    })
  }

  if (users.noUser.comments.length === 0) {
    delete users.noUser
  }

  return Object.values(users)
}

const fetchComments = async (keys: KeyOptions) => {
  try {
    const response = await fetchFromAPI(`${constants.BASE_API_URL}${keys.fileKey}/comments`, keys.token)
    return await processComments(response.comments, keys)
  } catch (e) {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'ERROR',
          content: 'Error adding the reaction. Please check your token permissions, we need "write" permissions in comments.'
        }
      },
      '*'
    )
  }
}
export default fetchComments
