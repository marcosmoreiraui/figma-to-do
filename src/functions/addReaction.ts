import axios from 'axios'
import { constants } from '../constants'

const addReaction = async (commentId: string, keys: { fileKey: any, token: any }) => {
  try {
    await axios.post(`${constants.BASE_API_URL}${keys.fileKey}/comments/${commentId}/reactions`, {
      emoji: ':white_check_mark:'
    }, {
      headers: {
        'X-Figma-Token': keys.token
      }
    })

    return true
  } catch (error) {
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
export default addReaction
