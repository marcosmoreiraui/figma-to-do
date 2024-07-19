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
      try {
        const currentUser = figma.currentUser ?? {
          id: '',
          name: ''
        }
        const token = await figma?.clientStorage?.getAsync('todo-token')
        const data = await getClientStorage('data')

        figma.ui.postMessage({
          type: 'INITIALIZED',
          content: {
            ...data,
            user: {
              id: currentUser.id,
              name: currentUser.name
            },
            token
          }
        })
      } catch (e) {
        figma.ui.postMessage({
          type: 'ERROR',
          content: e
        })
      }
    }

    if (message.type === 'SAVE_OPTIONS') {
      try {
        const data = await getClientStorage('data')
        await setClientStorage('data', {
          ...data,
          options: message.content
        })
      } catch (e) {
        figma.ui.postMessage({
          type: 'ERROR',
          content: e
        })
      }
    }

    if (message.type === 'SAVE_KEYS') {
      try {
        const data = await getClientStorage('data')
        await figma.clientStorage.setAsync('todo-token', message.content.token)

        await setClientStorage('data', {
          ...data,
          ...message.content
        })
      } catch (e) {
        figma.ui.postMessage({
          type: 'ERROR',
          content: e
        })
      }
    }

    if (message.type === 'ZOOM') {
      try {
        zoomToNode(message.content)
      } catch (e) {
        figma.ui.postMessage({
          type: 'ERROR',
          content: e
        })
      }
    }

    if (message.type === 'ERROR') {
      figma.ui.postMessage({
        type: 'ERROR',
        content: message.content
      })
    }
  }
}

bootstrap()
