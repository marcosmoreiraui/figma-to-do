import axios from 'axios'
import { constants } from '../constants'

async function deleteComment (commentId: string, {
  fileKey,
  token
}: { fileKey: string, token: string }) {
  try {
    const response = await axios.delete(`${constants.BASE_API_URL}${fileKey}/comments/${commentId}`, {
      headers: { 'X-Figma-Token': token }
    })
    return response.status === 204
  } catch {
    parent.postMessage({
      pluginMessage: {
        type: 'ERROR',
        content: 'Error deleting the comment. Please check your token permissions; "write" permissions in comments are required.'
      }
    }, '*')
  }
}

export default deleteComment
