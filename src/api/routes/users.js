// const { isAuth } = require('../../middlewares/auth')
// const { uploadPerfil, uploadEvento } = require('../../middlewares/file')
const {
  getUsuarios,
  register,
  login,
} = require('../controllers/users')

const userRouter = require('express').Router()
userRouter.get('/', getUsuarios)
userRouter.post('/register', register)
userRouter.post('/login', login)


module.exports = { userRouter }