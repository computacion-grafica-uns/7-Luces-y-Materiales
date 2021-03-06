import { Program } from './gl-wrappers/index.js'

import { getCanvasElement, getWebGL2Context, onCanvasDisplaySizeChange } from './utils/misc.js'
import { getFileContentsAsText, parseGeometryData } from './utils/files.js'
import { Color } from './utils/color.js'

import { Camera } from './scene/camera.js'
import { CameraOrbitControls } from './scene/camera-orbit-controls.js'
import { Geometry } from './scene/geometry.js'
import { SceneObject } from './scene/scene-object.js'
import { Material } from './scene/material.js'
import { AmbientLight, PointLight } from './scene/lights.js'

async function main() {
  // #️⃣ Cargamos assets a usar (modelos, código de shaders, etc)

  const basicVertexShaderSource = await getFileContentsAsText('shaders/basic.vert.glsl')
  const basicFragmentShaderSource = await getFileContentsAsText('shaders/basic.frag.glsl')
  const normalsVertexShaderSource = await getFileContentsAsText('shaders/normals.vert.glsl')
  const normalsFragmentShaderSource = await getFileContentsAsText('shaders/normals.frag.glsl')
  const lambertVertexShaderSource = await getFileContentsAsText('shaders/lambert.vert.glsl')
  const lambertFragmentShaderSource = await getFileContentsAsText('shaders/lambert.frag.glsl')

  const cubeGeometryData = await parseGeometryData('models/cube.obj')
  const icosphereGeometryData = await parseGeometryData('models/icosphere.obj')
  const planeGeometryData = await parseGeometryData('models/plane.obj')
  const suzanneGeometryData = await parseGeometryData('models/suzanne.obj')

  // #️⃣ Configuración base de WebGL

  const canvas = getCanvasElement('canvas')
  const gl = getWebGL2Context(canvas)

  gl.clearColor(0, 0, 0, 1)
  gl.enable(gl.DEPTH_TEST)

  // #️⃣ Creamos la cámara y sus controles para movimiento en orbita

  const position = [9, 6, 9]
  const target = [0, 0.5, 0]
  const up = [0, 1, 0]

  const fov = 45
  const aspect = canvas.width / canvas.height
  const near = 0.1
  const far = 30

  const camera = new Camera(position, target, up, fov, aspect, near, far)
  const cameraOrbitControls = new CameraOrbitControls(camera, canvas)

  // #️⃣ Programas a usar

  const basicProgram = new Program(gl, basicVertexShaderSource, basicFragmentShaderSource)
  const normalsProgram = new Program(gl, normalsVertexShaderSource, normalsFragmentShaderSource)
  const lambertProgram = new Program(gl, lambertVertexShaderSource, lambertFragmentShaderSource)

  // #️⃣ Materiales a usar

  const whiteBasicMaterial = new Material(basicProgram, false, { color: Color.white })
  const greyBasicMaterial = new Material(basicProgram, false, { color: Color.grey })
  const whiteLambertMaterial = new Material(lambertProgram, true, { color: Color.white })
  const normalsMaterial = new Material(normalsProgram, false)

  // #️⃣ Geometrías a usar

  const cubeGeometry = new Geometry(gl, cubeGeometryData)
  const icosphereGeometry = new Geometry(gl, icosphereGeometryData)
  const planeGeometry = new Geometry(gl, planeGeometryData)
  const suzanneGeometry = new Geometry(gl, suzanneGeometryData)

  // #️⃣ Objetos de la escena e iluminación

  const cube = new SceneObject(gl, cubeGeometry, whiteBasicMaterial, true)
  const icosphere = new SceneObject(gl, icosphereGeometry, normalsMaterial, false)
  const plane = new SceneObject(gl, planeGeometry, greyBasicMaterial, false)
  const suzanne = new SceneObject(gl, suzanneGeometry, whiteLambertMaterial, false)

  const sceneObjects = [cube, icosphere, plane, suzanne]

  const ambientLight = new AmbientLight(Color.darkGrey)
  const pointLight = new PointLight(Color.white, [-4, 8, 8])

  // #️⃣ Definimos la posición/escalado/rotación inicial de cada objeto

  cube.position = [1.5, 1, 0]
  cube.updateModelMatrix()

  icosphere.position = [-1.5, 1, 0]
  icosphere.updateModelMatrix()

  plane.scale = [4, 1, 4]
  plane.updateModelMatrix()

  suzanne.position = [0, 3.5, 0]
  suzanne.updateModelMatrix()

  // 🖼 Dibujamos la escena

  function render() {
    // Realizamos ajustes relacionados a cambios de tamaño en pantalla del canvas
    onCanvasDisplaySizeChange(canvas, handleCanvasDisplaySizeChange)

    // Limpiamos buffers de color y profundidad del canvas antes de empezar a dibujar los objetos de la escena
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    // Dibujamos cada objeto de la escena
    for (const sceneObject of sceneObjects) {
      const material = sceneObject.material

      material.program.use()

      material.program.setUniformValue('viewMatrix', camera.viewMatrix)
      material.program.setUniformValue('projectionMatrix', camera.projectionMatrix)
      material.program.setUniformValue('modelMatrix', sceneObject.modelMatrix)

      // Seteamos las propiedades del material
      for (const [materialPropertyName, materialPropertyValue] of material.properties) {
        const materialPropertyUniformName = `material.${materialPropertyName}`
        material.program.setUniformValue(materialPropertyUniformName, materialPropertyValue)
      }

      // Actualizamos y seteamos (de ser necesario) el valor de la normal matrix
      if (material.usesNormalMatrix) {
        sceneObject.updateNormalMatrix(camera.viewMatrix)
        material.program.setUniformValue('normalMatrix', sceneObject.normalMatrix)
      }

      // Seteamos (de ser necesario) información de las luces de la escena
      if (material.isAffectedByLight) {
        material.program.setUniformValue('ambientLight.color', ambientLight.color)
        material.program.setUniformValue('pointLight.color', pointLight.color)
        material.program.setUniformValue('pointLight.position', pointLight.position)
      }

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
