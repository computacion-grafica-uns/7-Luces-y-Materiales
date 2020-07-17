import { Camera } from '../scene/camera.js'

/**
 * @param {string} id
 * @returns {HTMLCanvasElement}
 */
export function getCanvasElement(id) {
  const canvas = document.getElementById(id)
  if (canvas === null) {
    throw new Error(`No canvas element found with '${id}' ID`)
  }

  return canvas
}

/**
 * @param {HTMLCanvasElement} canvas
 * @returns {WebGL2RenderingContext}
 */
export function getWebGL2Context(canvas) {
  const gl = canvas.getContext('webgl2')
  if (gl === null) {
    throw new Error(`No WebGL 2 context available. It may be an experimental feature that needs to be enabled.`)
  }

  return gl
}

/**
 * @callback onCanvasDisplaySizeChangeCallback
 * @param {number} canvasDisplayWidth - New canvas display width.
 * @param {number} canvasDisplayHeight - New canvas display height.
 */

/**
 * @param {HTMLCanvasElement} canvas
 * @param {onCanvasDisplaySizeChangeCallback} callback
 */
export function onCanvasDisplaySizeChange(canvas, callback) {
  // Obtenemos el tamaño en pantalla del canvas
  const canvasDisplayWidth = Math.floor(canvas.clientWidth * window.devicePixelRatio)
  const canvasDisplayHeight = Math.floor(canvas.clientHeight * window.devicePixelRatio)

  // Si las dimensiones del buffer del canvas no coinciden con su tamaño en pantalla, ejecutamos el callback
  if (canvas.width !== canvasDisplayWidth || canvas.height !== canvasDisplayHeight) {
    callback(canvasDisplayWidth, canvasDisplayHeight)
  }
}
