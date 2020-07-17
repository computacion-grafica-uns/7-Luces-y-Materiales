export class Attribute {
  _gl
  _name
  _type
  _location
  _numberOfComponents

  constructor(gl, name, type, location) {
    this._gl = gl
    this._name = name
    this._type = type
    this._location = location
    this._numberOfComponents = this._getNumberOfComponentsForType(gl, type) // e.g. float tiene 1 componente, vec2 tiene 2, vec3 tiene 3, etc
  }

  bindToVertexBuffer(buffer) {
    buffer.bind()
    this._gl.vertexAttribPointer(this._location, this._numberOfComponents, buffer.dataType, false, 0, 0)
    buffer.unbind()
  }

  enable() {
    this._gl.enableVertexAttribArray(this._location)
  }

  disable() {
    this._gl.disableVertexAttribArray(this._location)
  }

  _getNumberOfComponentsForType(gl, type) {
    switch (type) {
      case gl.FLOAT:
        return 1
      case gl.FLOAT_VEC3:
        return 3
      default:
        throw new Error('Unsupported attribute type')
        return
    }
  }
}
