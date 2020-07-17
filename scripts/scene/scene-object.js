import { mat4 } from '../gl-matrix/index.js'
import { VertexArray } from '../gl-wrappers/index.js'
import { toRadians } from '../utils/math.js'

export class SceneObject {
  position = [0, 0, 0]
  rotation = [0, 0, 0]
  scale = [1, 1, 1]
  _geometry
  _material
  _modelMatrix
  _vertexArray
  _indexBuffer
  _drawMode

  constructor(gl, geometry, material, useWireframe) {
    this._geometry = geometry
    this._material = material
    this._modelMatrix = mat4.create()
    this._vertexArray = new VertexArray(gl)
    this._indexBuffer = useWireframe ? geometry.indexLinesBuffer : geometry.indexTrianglesBuffer
    this._drawMode = useWireframe ? gl.LINES : gl.TRIANGLES

    this._setupVertexArray()
  }

  get geometry() {
    return this._geometry
  }

  get material() {
    return this._material
  }

  get modelMatrix() {
    return this._modelMatrix
  }

  get vertexArray() {
    return this._vertexArray
  }

  get indexBuffer() {
    return this._indexBuffer
  }

  get drawMode() {
    return this._drawMode
  }

  updateModelMatrix() {
    const rotationX = toRadians(this.rotation[0])
    const rotationY = toRadians(this.rotation[1])
    const rotationZ = toRadians(this.rotation[2])

    mat4.identity(this._modelMatrix)
    mat4.translate(this._modelMatrix, this._modelMatrix, this.position)
    mat4.rotateX(this._modelMatrix, this._modelMatrix, rotationX)
    mat4.rotateY(this._modelMatrix, this._modelMatrix, rotationY)
    mat4.rotateZ(this._modelMatrix, this._modelMatrix, rotationZ)
    mat4.scale(this._modelMatrix, this._modelMatrix, this.scale)
  }

  _setupVertexArray() {
    const attributes = this._material.program.attributes
    const vertexBuffers = this._geometry.vertexBuffers

    this._vertexArray.bind()

    for (const [attributeName, attribute] of attributes) {
      const vertexBuffer = vertexBuffers.get(attributeName)
      if (vertexBuffer !== undefined) {
        attribute.bindToVertexBuffer(vertexBuffer)
        attribute.enable()
      } else {
        throw new VertexArraySetupError(`No vertex buffer found for the attribute named '${attributeName}'`)
      }
    }

    this._indexBuffer.bind()
    this._vertexArray.unbind()
  }
}

// Definición de excepciones

class VertexArraySetupError extends Error {
  constructor(message) {
    super(message)
    this.name = 'Vertex Array Setup Error'
  }
}