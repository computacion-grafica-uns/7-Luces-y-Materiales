class Light {
  color

  constructor(color) {
    this.color = color
  }
}

export class AmbientLight extends Light {
  constructor(color) {
    super(color)
  }
}

export class PointLight extends Light {
  position

  constructor(color, position) {
    super(color)
    this.position = position
  }
}