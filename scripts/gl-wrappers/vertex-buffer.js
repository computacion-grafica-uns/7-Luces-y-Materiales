import { Buffer } from './buffer.js'

export class VertexBuffer extends Buffer {
  constructor(gl, data) {
    super(gl, gl.ARRAY_BUFFER, data, gl.FLOAT)
  }
}
