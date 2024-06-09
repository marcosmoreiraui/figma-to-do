import { constants } from '../constants'

async function setClientStorage (key: string, value: string, name?: string): Promise<any> {
  const storageKey = `${constants.PLUGIN_TAG}-${name ? name + '-' : ''}${key}`

  await figma.clientStorage.setAsync(storageKey, value)
}

export default setClientStorage
