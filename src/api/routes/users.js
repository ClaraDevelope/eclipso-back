const { isAuth } = require('../../middlewares/auth')
const { uploadEvento } = require('../../middlewares/file')
const { postEvento } = require('../controllers/event')
const {
  getUsuarios,
  register,
  login,
  getUsuariosbyId,
} = require('../controllers/users')

const userRouter = require('express').Router()
userRouter.get('/', getUsuarios)
userRouter.get('/:id',getUsuariosbyId )
userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.post('/:id/create', isAuth, uploadEvento, postEvento)


module.exports = { userRouter }