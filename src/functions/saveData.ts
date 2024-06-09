async function saveData (data: any) {
  // Obtén todos los datos actuales
  const allData = await figma.clientStorage.getAsync('allData') || {}

  // Establece los datos para el archivo actual
  allData[figma.root.name] = data

  // Guarda todos los datos de nuevo
  await figma.clientStorage.setAsync('allData', allData)
}

export default saveData
