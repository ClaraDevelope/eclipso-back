const { asistentesRouter } = require('./asistente')
// const { eventoRouter } = require('./evento')
const { eventoRouter } = require('./event')
const { userRouter } = require('./users')

const mainRouter = require('express').Router()

mainRouter.use('/auth', userRouter)
mainRouter.use('/asistentes', asistentesRouter)
mainRouter.use('/eventos', eventoRouter)

module.exports = { mainRouter }