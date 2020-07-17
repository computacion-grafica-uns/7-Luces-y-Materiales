import { mat4 } from '../gl-matrix/index.js'
import { toRadians } from '../utils/math.js'

export class Camera {
  position
  target
  up
  fov
  aspect
  near
  far
  _viewMatrix
  _projectionMatrix

  constructor(position, target, up, fov, aspect, near, far) {
    this.position = position
    this.target = target
    this.up = up
    this.fov = fov
    this.aspect = aspect
    this.near = near
    this.far = far

    this._viewMatrix = mat4.create()
    this._projectionMatrix = mat4.create()

    this.updateViewMatrix()
    this.updateProjectionMatrix()
  }

  get viewMatrix() {
    return this._viewMatrix
  }

  get projectionMatrix() {
    return this._projectionMatrix
  }

  updateViewMatrix() {
    mat4.lookAt(this._viewMatrix, this.position, this.target, this.up)
  }

  updateProjectionMatrix() {
    mat4.perspective(this._projectionMatrix, toRadians(this.fov), this.aspect, this.near, this.far)
  }
}
