import { mat4 } from '../gl-matrix/index.js'
import { VertexArray } from '../gl-wrappers/index.js'
import { toRadians } from '../utils/math.js'

export class SceneObject {
  position = [0, 0, 0]
  rotation = [0, 0, 0]
  scale = [1, 1, 1]
  _geometry
  _color
  _modelMatrix
  _vertexArray
  _indexBuffer
  _drawMode

  constructor(gl, geometry, color, useWireframe) {
    this._geometry = geometry
    this._color = color
    this._modelMatrix = mat4.create()
    this._vertexArray = new VertexArray(gl)
    this._indexBuffer = useWireframe ? geometry.indexLinesBuffer : geometry.indexTrianglesBuffer
    this._drawMode = useWireframe ? gl.LINES : gl.TRIANGLES
  }

  get geometry() {
    return this._geometry
  }

  get color() {
    return this._color
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
}
