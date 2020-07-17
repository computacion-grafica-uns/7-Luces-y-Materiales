import { toSpherical, toCartesian, toRadians, clamp } from '../utils/math.js'

const wheelSensitivity = 0.01
const mouseMoveSensitivity = 0.4

export class CameraOrbitControls {
  _camera
  _radius
  _phi
  _theta
  _isPrimaryButtonPressed = false

  constructor(camera, eventsTarget) {
    this._camera = camera

    const sphericalPosition = toSpherical(this._camera.position)
    this._radius = sphericalPosition[0]
    this._theta = sphericalPosition[1]
    this._phi = sphericalPosition[2]

    eventsTarget.addEventListener('wheel', (event) => this._handleWheel(event))
    eventsTarget.addEventListener('mousedown', (event) => this._handleMouseDown(event))
    document.addEventListener('mousemove', (event) => this._handleMouseMove(event))
    document.addEventListener('mouseup', (event) => this._handleMouseUp(event))
  }

  // Métodos públicos

  dolly(value) {
    this._radius = clamp(this._radius + value, this._camera.near, this._camera.far)
    this._updateCameraPositionAndViewMatrix()
  }

  arcHorizontally(degrees) {
    this._theta = (this._theta + toRadians(degrees)) % (Math.PI * 2)
    this._updateCameraPositionAndViewMatrix()
  }

  arcVertically(degrees) {
    this._phi = clamp(this._phi - toRadians(degrees), 0.01, Math.PI)
    this._updateCameraPositionAndViewMatrix()
  }

  // Métodos privados

  _updateCameraPositionAndViewMatrix() {
    this._camera.position = toCartesian([this._radius, this._theta, this._phi])
    this._camera.updateViewMatrix()
  }

  _handleWheel(event) {
    event.preventDefault()
    this.dolly(event.deltaY * wheelSensitivity)
  }

  _handleMouseDown(event) {
    this._isPrimaryButtonPressed = (event.buttons & 1) !== 0
  }

  _handleMouseUp(event) {
    this._isPrimaryButtonPressed = (event.buttons & 1) !== 0
  }

  _handleMouseMove(event) {
    if (this._isPrimaryButtonPressed) {
      this.arcHorizontally(-event.movementX * mouseMoveSensitivity)
      this.arcVertically(event.movementY * mouseMoveSensitivity)
    }
  }
}
