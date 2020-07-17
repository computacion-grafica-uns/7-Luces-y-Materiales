export class Material {
  _program
  _properties
  _isAffectedByLight
  _usesNormalMatrix

  constructor(program, isAffectedByLight, properties = {}) {
    this._program = program
    this._properties = new Map()
    this._isAffectedByLight = isAffectedByLight
    this._usesNormalMatrix = program.uniforms.has('normalMatrix')

    for (const propertyName in properties) {
      const propertyValue = properties[propertyName]
      this._properties.set(propertyName, propertyValue)
    }
  }

  get program() {
    return this._program
  }

  get properties() {
    return this._properties
  }

  get isAffectedByLight() {
    return this._isAffectedByLight
  }

  get usesNormalMatrix() {
    return this._usesNormalMatrix
  }
}