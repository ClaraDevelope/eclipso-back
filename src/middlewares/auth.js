
const Evento = require('../api/models/event')
const Usuario = require('../api/models/user')
const { verificarLlave } = require('../utils/jwt')

const verificarToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization
    if (!token || !token.startsWith('Bearer ')) {
      return res.status(401).json('No se proporcionó un token de autorización')
    }
    const parsedToken = token.substring(7)

    const { id } = verificarLlave(parsedToken)
    const usuario = await Usuario.findById(id)
    usuario.password = null

    req.usuario = usuario
    next()
  } catch (error) {
    return res.status(400).json('No estás autorizado')
  }
}

const isAuth = async (req, res, next) => {
  try {
    await verificarToken(req, res, next)
  } catch (error) {
    console.error(error)
    return res.status(400).json({ error: 'No estás autorizado' })
  }
}

const isCreator = async (req, res, next) => {
  try {
    await verificarToken(req, res, async () => {
      const usuario = req.usuario
      const eventoId = req.params.id
      const evento = await Evento.findById(eventoId)

      if (!evento || evento.creador.toString() !== usuario._id.toString()) {
        throw new Error('No eres el creador del evento')
      }

      next()
    })
  } catch (error) {
    console.error(error)
    return res.status(400).json({ error: error.message })
  }
}

module.exports = { isAuth, isCreator }