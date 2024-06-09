import { constants } from '../constants'

async function getClientStorage (key: string, name?: string): Promise<any> {
  const storageKey = `${constants.PLUGIN_TAG}-${name ? name + '-' : ''}${key}`
  return await figma.clientStorage.getAsync(storageKey)
}

export default getClientStorage
