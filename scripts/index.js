import { Program } from './gl-wrappers/index.js'

import { getCanvasElement, getWebGL2Context, onCanvasDisplaySizeChange } from './utils/misc.js'
import { getFileContentsAsText, parseGeometryData } from './utils/files.js'
import { Color } from './utils/color.js'

import { Camera } from './scene/camera.js'
import { CameraOrbitControls } from './scene/camera-orbit-controls.js'
import { Geometry } from './scene/geometry.js'
import { SceneObject } from './scene/scene-object.js'

async function main() {
  // #️⃣ Cargamos assets a usar (modelos, código de shaders, etc)

  const vertexShaderSource = await getFileContentsAsText('shaders/basic.vert.glsl')
  const fragmentShaderSource = await getFileContentsAsText('shaders/basic.frag.glsl')

  const cubeGeometryData = await parseGeometryData('models/cube.obj')
  const icosphereGeometryData = await parseGeometryData('models/icosphere.obj')
  const planeGeometryData = await parseGeometryData('models/plane.obj')

  // #️⃣ Configuración base de WebGL

  const canvas = getCanvasElement('canvas')
  const gl = getWebGL2Context(canvas)

  gl.clearColor(0, 0, 0, 1)
  gl.enable(gl.DEPTH_TEST)

  // #️⃣ Creamos la cámara y sus controles para movimiento en orbita

  const position = [-8, 5, 8]
  const target = [0, 0, 0]
  const up = [0, 1, 0]

  const fov = 45
  const aspect = canvas.width / canvas.height
  const near = 0.1
  const far = 30

  const camera = new Camera(position, target, up, fov, aspect, near, far)
  const cameraOrbitControls = new CameraOrbitControls(camera, canvas)

  // #️⃣ Creamos el programa a usar

  const program = new Program(gl, vertexShaderSource, fragmentShaderSource)

  // #️⃣ Creamos las geometrías a usar

  const cubeGeometry = new Geometry(gl, cubeGeometryData)
  const icosphereGeometry = new Geometry(gl, icosphereGeometryData)
  const planeGeometry = new Geometry(gl, planeGeometryData)

  // #️⃣ Creamos los objetos de la escena

  const cube = new SceneObject(gl, cubeGeometry, Color.white, true)
  const icosphere = new SceneObject(gl, icosphereGeometry, Color.green, true)
  const plane = new SceneObject(gl, planeGeometry, Color.grey, false)

  const sceneObjects = [cube, icosphere, plane]

  // #️⃣ Configuramos el VertexArray de cada objeto (con el mapeo atributos-buffers y el buffer de indices a usar)

  cube.vertexArray.bind()
  program.setAttributeVertexBuffer('vertexPosition', cube.geometry.vertexBuffers.get('vertexPosition'))
  cube.indexBuffer.bind()
  cube.vertexArray.unbind()

  icosphere.vertexArray.bind()
  program.setAttributeVertexBuffer('vertexPosition', icosphere.geometry.vertexBuffers.get('vertexPosition'))
  icosphere.indexBuffer.bind()
  icosphere.vertexArray.unbind()

  plane.vertexArray.bind()
  program.setAttributeVertexBuffer('vertexPosition', plane.geometry.vertexBuffers.get('vertexPosition'))
  plane.indexBuffer.bind()
  plane.vertexArray.unbind()

  // #️⃣ Definimos la posición/escalado/rotación inicial de cada objeto

  cube.position = [1.5, 1, 0]
  cube.updateModelMatrix()

  icosphere.position = [-1.5, 1, 0]
  icosphere.updateModelMatrix()

  plane.scale = [4, 1, 4]
  plane.updateModelMatrix()

  // #️⃣ Establecemos el programa a usar (común a todos los objetos de la escena)

  program.use()

  // 🖼 Dibujamos la escena

  function render() {
    // Realizamos ajustes relacionados a cambios de tamaño en pantalla del canvas
    onCanvasDisplaySizeChange(canvas, handleCanvasDisplaySizeChange)

    // Limpiamos buffers de color y profundidad del canvas antes de empezar a dibujar los objetos de la escena
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    // Actualizamos los uniforms relacionados a la cámara (comunes a todos los objetos de la escena)
    program.setUniformValue('viewMatrix', camera.viewMatrix)
    program.setUniformValue('projectionMatrix', camera.projectionMatrix)

    /* 📝
     * Dibujar cada objeto en la escena consiste de los siguientes pasos:
     * 1. Actualizar los valores de uniforms específicos a cada uno.
     * 2. Definir sus conexiones atributo-buffer e indice a usar (mediante su VertexArray o VAO)
     * 3. Dibujarlo
     */

    for (const sceneObject of sceneObjects) {
      program.setUniformValue('modelMatrix', sceneObject.modelMatrix)
      program.setUniformValue('color', sceneObject.color)

      sceneObject.vertexArray.bind()

      gl.drawElements(sceneObject.drawMode, sceneObject.indexBuffer.size, sceneObject.indexBuffer.dataType, 0)
    }

    // Solicitamos el próximo frame
    requestAnimationFrame(render)
  }

  // Nuestro primer frame
  requestAnimationFrame(render)

  // 🧰 Funciones auxiliares

  function handleCanvasDisplaySizeChange(canvasDisplayWidth, canvasDisplayHeight) {
    // Ajustamos dimensiones de los buffers del canvas para que coincidan con su tamaño en pantalla
    canvas.width = canvasDisplayWidth
    canvas.height = canvasDisplayHeight

    // Ajustamos relación de aspecto de la cámara
    camera.aspect = canvas.width / canvas.height
    camera.updateProjectionMatrix()

    // Ajustamos mapeo entre Coordenadas Normalizadas del Dispositivo y coordenadas en pantalla
    gl.viewport(0, 0, canvas.width, canvas.height)
  }
}

main()
