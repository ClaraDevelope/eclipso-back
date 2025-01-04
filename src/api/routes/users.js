const { isAuth } = require('../../middlewares/auth')
const { uploadEvento } = require('../../middlewares/file')
const { postEvento } = require('../controllers/event')
const {
  getUsuarios,
  register,
  login,
} = require('../controllers/users')

const userRouter = require('express').Router()
userRouter.get('/', getUsuarios)
userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.post('/:id/create', isAuth, uploadEvento, postEvento)


module.exports = { userRouter }