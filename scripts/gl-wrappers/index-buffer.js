import { Buffer } from './buffer.js'

export class IndexBuffer extends Buffer {
  constructor(gl, data) {
    super(gl, gl.ELEMENT_ARRAY_BUFFER, data, gl.UNSIGNED_INT)
  }
}
