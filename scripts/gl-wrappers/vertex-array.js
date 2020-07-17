export class VertexArray {
  _gl
  _vertexArray

  constructor(gl) {
    this._gl = gl
    this._vertexArray = gl.createVertexArray()
  }

  bind() {
    this._gl.bindVertexArray(this._vertexArray)
  }

  unbind() {
    this._gl.bindVertexArray(null)
  }
}
