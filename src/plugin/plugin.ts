import { zoomToNode } from '../functions'
import setClientStorage from '../functions/setClientStorage'
import getClientStorage from '../functions/getClientStorage'

function bootstrap () {
  figma.showUI(__html__, {
    themeColors: true,
    width: 350,
    height: 400,
    title: 'TO-DO comments'
  })

  figma.ui.onmessage = async (message) => {
    if (message.type === 'INITIALIZE') {
      const data = await getClientStorage('data')
      const currentUser = figma.currentUser ? figma.currentUser.name : ''

      figma.ui.postMessage({
        type: 'INITIALIZED',
        content: {
          currentUser,
          options: data.options,
          constants: data.constants,
          file: figma.fileKey
        }
      })
    }

    if (message.type === 'SAVE_OPTIONS') {
      const data = await getClientStorage('data')
      await setClientStorage('data', {
        ...data,
        ...message.content
      })
    }

    if (message.type === 'SAVE_CONSTANTS') {
      const data = await getClientStorage('data')
      await setClientStorage('data', {
        ...data,
        ...message.content
      })
      figma.ui.postMessage({
        type: 'SAVED_CONSTANTS',
        content: message.content
      })
    }

    if (message.type === 'ZOOM') {
      zoomToNode(message.content)
    }

    if (message.type === 'ERROR') {
      figma.ui.postMessage({
        type: 'ERROR_TOKEN',
        content: message.content
      })
    }
  }
}

bootstrap()
