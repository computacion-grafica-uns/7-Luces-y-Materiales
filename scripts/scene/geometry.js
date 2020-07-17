import { VertexBuffer, IndexBuffer } from '../gl-wrappers/index.js'

export class Geometry {
  _vertexBuffers
  _indexLinesBuffer
  _indexTrianglesBuffer

  constructor(gl, geometryData) {
    const { vertexPositions, vertexNormals } = geometryData

    this._vertexBuffers = new Map()
    this._vertexBuffers.set('vertexPosition', new VertexBuffer(gl, vertexPositions))
    if (vertexNormals !== null) this._vertexBuffers.set('vertexNormal', new VertexBuffer(gl, vertexNormals))

    const { indexLines, indexTriangles } = geometryData

    this._indexLinesBuffer = new IndexBuffer(gl, indexLines)
    this._indexTrianglesBuffer = new IndexBuffer(gl, indexTriangles)
  }

  get vertexBuffers() {
    return this._vertexBuffers
  }

  get indexLinesBuffer() {
    return this._indexLinesBuffer
  }

  get indexTrianglesBuffer() {
    return this._indexTrianglesBuffer
  }
}
