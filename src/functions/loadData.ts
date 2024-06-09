async function loadData () {
  // Obtén todos los datos
  const allData = await figma.clientStorage.getAsync('allData') || {}

  // Regresa solo los datos para el archivo actual
  return allData[figma.root.name]
}

export default loadData
