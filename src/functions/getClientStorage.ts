import { constants } from '../constants'

function generateUUID () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

function getFileUniqueId () {
  let fileUniqueId = figma.root.getPluginData('todo-uuid')
  if (!fileUniqueId) {
    fileUniqueId = generateUUID()
    figma.root.setPluginData('todo-uuid', fileUniqueId)
    // figma.notify('New file detected, ID generated')
  } else {
    // figma.notify('Existing file detected')
  }
  return fileUniqueId
}

async function getClientStorage (key: string, name?: string): Promise<any> {
  const fileUniqueId = getFileUniqueId()
  const storageKey = `${fileUniqueId}-${constants.PLUGIN_TAG}-${name ? name + '-' : ''}${key}`
  return await figma.clientStorage.getAsync(storageKey)
}

export default getClientStorage
