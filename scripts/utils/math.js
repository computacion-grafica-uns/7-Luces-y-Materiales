export function toSpherical([x, y, z]) {
  const radius = Math.sqrt(x * x + y * y + z * z)
  const theta = Math.atan(x / z)
  const phi = Math.acos(y / radius)

  return [radius, theta, phi]
}

export function toCartesian([radius, theta, phi]) {
  const x = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)
  const z = radius * Math.sin(phi) * Math.cos(theta)

  return [x, y, z]
}

export function toDegrees(radians) {
  return (radians * 180) / Math.PI
}

export function toRadians(degrees) {
  return (degrees * Math.PI) / 180
}

export function clamp(value, min, max) {
  return Math.max(Math.min(value, max), min)
}
