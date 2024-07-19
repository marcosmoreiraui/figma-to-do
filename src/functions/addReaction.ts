import axios from 'axios'
import { constants } from '../constants'

const addReaction = async (commentId: string, {
  fileKey,
  token
}: { fileKey: string, token: string }) => {
  try {
    const url = `${constants.BASE_API_URL}${fileKey}/comments/${commentId}/reactions`
    await axios.post(url, { emoji: ':white_check_mark:' }, { headers: { 'X-Figma-Token': token } })
    return true
  } catch {
    parent.postMessage({
      pluginMessage: {
        type: 'ERROR',
        content: 'Error adding the reaction. Please check your token permissions, we need "write" permissions in comments.'
      }
    }, '*')
  }
}

export default addReaction
