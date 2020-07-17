export class Uniform {
  _gl
  _name
  _type
  _location
  _setValue

  constructor(gl, name, type, location) {
    this._gl = gl
    this._name = name
    this._type = type
    this._location = location
    this._setValue = this._getValueSetter(gl, type, location)
  }

  set value(value) {
    this._setValue(value)
  }

  _getValueSetter(gl, type, location) {
    switch (type) {
      case gl.FLOAT:
        return (value) => {
          gl.uniform1f(location, value)
        }
      case gl.FLOAT_VEC3:
        return (value) => {
          gl.uniform3fv(location, value)
        }
      case gl.FLOAT_MAT4:
        return (value) => {
          gl.uniformMatrix4fv(location, false, value)
        }
      default:
        throw new Error('Unsupported uniform type')
    }
  }
}
