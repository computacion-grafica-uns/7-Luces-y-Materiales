import { Uniform } from './uniform.js'
import { Attribute } from './attribute.js'

export class Program {
  _gl
  _program
  _uniforms
  _attributes

  constructor(gl, vertexShaderSource, fragmentShaderSource) {
    this._gl = gl
    this._program = this._createProgram(gl, vertexShaderSource, fragmentShaderSource)
    this._uniforms = this._getActiveUniforms(gl, this._program)
    this._attributes = this._getActiveAttributes(gl, this._program)
  }

  get uniforms() {
    return this._uniforms
  }

  get attributes() {
    return this._attributes
  }

  use() {
    this._gl.useProgram(this._program)
  }

  setUniformValue(name, value) {
    const uniform = this._uniforms.get(name)

    if (uniform !== undefined) {
      uniform.value = value
    } else {
      throw new ProgramInputError(`No uniform found with the name '${name}'. Notice that it may have been defined, but later removed during shader compilation due to having no effect on the output.`)
    }
  }

  setAttributeVertexBuffer(name, vertexBuffer) {
    const attribute = this._attributes.get(name)

    if (attribute !== undefined) {
      attribute.bindToVertexBuffer(vertexBuffer)
      attribute.enable()
    } else {
      throw new ProgramInputError(`No attribute found with the name '${name}'.`)
    }
  }

  _getActiveUniforms(gl, program) {
    const uniforms = new Map()
    const uniformsCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)

    for (let uniformIndex = 0; uniformIndex < uniformsCount; uniformIndex++) {
      const uniformInfo = gl.getActiveUniform(program, uniformIndex)
      const { name, type } = uniformInfo
      const location = gl.getUniformLocation(program, name)

      uniforms.set(name, new Uniform(gl, name, type, location))
    }

    return uniforms
  }

  _getActiveAttributes(gl, program) {
    const attributes = new Map()
    const attributesCount = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES)

    for (let attributeIndex = 0; attributeIndex < attributesCount; attributeIndex++) {
      const attributeInfo = gl.getActiveAttrib(program, attributeIndex)
      const { name, type } = attributeInfo
      const location = gl.getAttribLocation(program, name)

      attributes.set(name, new Attribute(gl, name, type, location))
    }

    return attributes
  }

  _createProgram(gl, vertexShaderSource, fragmentShaderSource) {
    // Creamos shaders de vertices y fragmentos
    const vertexShader = this._createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = this._createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)

    // Creamos el programa a partir de los shaders
    const program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    // Y chequeamos que el programa se haya creado con éxito
    const linkedSuccessfully = gl.getProgramParameter(program, gl.LINK_STATUS)

    if (!linkedSuccessfully) {
      // Obtenemos el log generado al intentar crear el program y generamos excepción
      const programLog = gl.getProgramInfoLog(program)
      throw new ProgramLinkError('\n' + programLog)
    }

    return program
  }

  _createShader(gl, type, sourceCode) {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, sourceCode)
    gl.compileShader(shader)

    // Chequeamos que el shader haya compilado con éxito
    const compiledSuccessfully = gl.getShaderParameter(shader, gl.COMPILE_STATUS)

    if (!compiledSuccessfully) {
      // Obtenemos el log generado por el compilador de shaders y generamos excepción
      const shaderLog = gl.getShaderInfoLog(shader)
      if (type === gl.VERTEX_SHADER) {
        throw new VertexShaderCompilationError('\n' + shaderLog)
      } else {
        throw new FragmentShaderCompilationError('\n' + shaderLog)
      }
    }

    return shader
  }
}

// Definición de excepciones

class VertexShaderCompilationError extends Error {
  constructor(message) {
    super(message)
    this.name = 'Vertex Shader Compilation Error'
  }
}

class FragmentShaderCompilationError extends Error {
  constructor(message) {
    super(message)
    this.name = 'Fragment Shader Compilation Error'
  }
}

class ProgramLinkError extends Error {
  constructor(message) {
    super(message)
    this.name = 'Program Link Error'
  }
}

class ProgramInputError extends Error {
  constructor(message) {
    super(message)
    this.name = 'Program Input Error'
  }
}
