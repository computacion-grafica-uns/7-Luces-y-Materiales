export class Buffer {
  _gl
  _buffer
  _type
  _dataType
  _size

  constructor(gl, type, data, dataType) {
    this._gl = gl
    this._type = type
    this._buffer = gl.createBuffer()

    this.bind()
    this._loadData(data, dataType)
    this.unbind()
  }

  get type() {
    return this._type
  }

  get dataType() {
    return this._dataType
  }

  get size() {
    return this._size
  }

  bind() {
    this._gl.bindBuffer(this._type, this._buffer)
  }

  unbind() {
    this._gl.bindBuffer(this._type, null)
  }

  _loadData(data, dataType) {
    let typedData

    switch (dataType) {
      case this._gl.UNSIGNED_INT:
        typedData = new Uint32Array(data)
        break
      case this._gl.FLOAT:
        typedData = new Float32Array(data)
        break
      default:
        throw new Error('Unsupported buffer data type')
    }

    this._gl.bufferData(this._type, typedData, this._gl.STATIC_DRAW)
    this._dataType = dataType
    this._size = data.length
  }
}
