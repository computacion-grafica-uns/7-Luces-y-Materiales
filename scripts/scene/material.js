export class Material {
  _program
  _properties

  constructor(program, properties) {
    this._program = program
    this._properties = new Map()

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
}