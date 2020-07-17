/**
 * @param {string} path
 * @returns {string}
 */
export async function getFileContentsAsText(path) {
  const response = await fetch(path)
  const text = await response.text()

  return text
}

/**
 * @param {string} objFilePath
 * @returns {GeometryData}
 */
export async function parseGeometryData(objFilePath) {
  const objData = await getFileContentsAsText(objFilePath)

  // Pasamos las posiciones de los vertices, normales, caras, etc a arreglos

  const vertexPositions = [] // elementos "v": [[x, y, z], [x, y, z], ...]
  const vertexNormals = [] // elementos "vn": [[x, y, z], [x, y, z], ...]

  const vertices = [] // info de cada vértice: "2/9/1 1/7/3 ..." -> [[1, 8, 0], [0, 6, 2], ...]
  const verticesIndexMap = new Map() // mapeo de grupos "v/vt/vn" a su indice en el arreglo de vertices (para acceso rápido)
  const faces = [] // indices de los vertices que forman cada cara

  const lines = objData.split('\n')

  for (const line of lines) {
    const lineElements = line.split(' ') // "v 1.00 2.00 3.00" -> ["v", "1.00", "2.00", "3.00"]
    const firstElement = lineElements.shift() // ["v", "1.00", "2.00", "3.00"] -> ["1.00", "1.00", "1.00"]

    switch (firstElement) {
      case 'v':
        vertexPositions.push(lineElements.map((element) => parseFloat(element)))
        break
      case 'vn':
        vertexNormals.push(lineElements.map((element) => parseFloat(element)))
        break
      case 'f':
        const faceVertices = []

        for (const vertexString of lineElements) {
          let vertexIndex = verticesIndexMap.get(vertexString)

          if (vertexIndex === undefined) {
            const vertex = vertexString.split('/').map((element) => parseInt(element) - 1)
            vertices.push(vertex)
            vertexIndex = vertices.length - 1
            verticesIndexMap.set(vertexString, vertexIndex)
          }

          faceVertices.push(vertexIndex)
        }

        faces.push(faceVertices)
        break
    }
  }

  // Pasamos la información obtenida a un formato apropiado para uso en buffers (flattened: [x, y, z, x, y, z, x, ...])

  const flatVertexPositions = []

  for (const vertex of vertices) {
    const vertexPositionIndex = vertex[0]
    flatVertexPositions.push(...vertexPositions[vertexPositionIndex])
  }

  let flatVertexNormals = null

  if (vertexNormals.length > 0) {
    flatVertexNormals = []
    for (const vertex of vertices) {
      const vertexNormalIndex = vertex[2]
      flatVertexNormals.push(...vertexNormals[vertexNormalIndex])
    }
  }

  // Generamos el arreglo de indices para dibujado con triángulos (gl.TRIANGLES)

  const indexTriangles = faces.flat() // [[0, 1, 2], [4, 5, 6], ...] -> [0, 1, 2, 4, 5, 6, ...]

  // Generamos el arreglo de indices para dibujado con lineas (gl.LINES)

  const indexLines = []
  const alreadyAddedLines = new Set()

  for (const faceVertices of faces) {
    for (let index = 0; index < 3; index++) {
      // agarramos de a dos indices (i.e. los extremos de cada linea)
      const a = faceVertices[index]
      const b = faceVertices[(index + 1) % 3]

      // chequeamos que el par no haya sido ya agregado (a fin de evitar re-dibujar lineas)
      // y lo agregamos al indice
      if (!alreadyAddedLines.has(a + '/' + b) && !alreadyAddedLines.has(b + '/' + a)) {
        indexLines.push(a)
        indexLines.push(b)
        alreadyAddedLines.add(a + '/' + b)
      }
    }
  }

  return {
    vertexPositions: flatVertexPositions,
    vertexNormals: flatVertexNormals,
    indexTriangles,
    indexLines,
  }
}

// Definición de tipos

/**
 * @typedef {Object} GeometryData
 * @property {number[]} vertexPositions
 * @property {number[] | null} vertexNormals
 * @property {number[]} indexTriangles
 * @property {number[]} indexLines
 */
