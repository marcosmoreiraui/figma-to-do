// Esta es una función auxiliar que busca un nodo en las páginas

function findPageForNode (nodeId: string) {
  let nodePage = null

  for (const page of figma.root.children) {
    if (page.findOne(n => n.id === nodeId)) {
      nodePage = page
      break
    }
  }

  return nodePage
}

// Este es un ejemplo de un plugin de Figma
function zoomToNode (nodeId: string) {
  const node = figma.getNodeById(nodeId)

  if (node) {
    // Find the page that contains the node
    const page = findPageForNode(nodeId)

    // Switch to the page
    if (page) {
      figma.currentPage = page
    }

    figma.viewport.scrollAndZoomIntoView([node])

    // Get the current zoom
    const currentZoom = figma.viewport.zoom

    // Apply the new zoom level
    figma.viewport.zoom = currentZoom * 1.1

    // Select the node
    figma.currentPage.selection = [node as SceneNode]
  } else {
    console.log('Node not found')
  }
}

export default zoomToNode
