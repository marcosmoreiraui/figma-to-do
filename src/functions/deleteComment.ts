import axios from 'axios'
import { constants } from '../constants'

async function deleteComment (commentId: string, keys: { fileKey: string, token: string }) {
  const url = `${constants.BASE_API_URL}${keys.fileKey}/comments/${commentId}`

  try {
    const response = await axios.delete(url, {
      headers: {
        'X-Figma-Token': keys.token
      }
    })
    return response.status === 204
  } catch (err) {
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

export default deleteComment
