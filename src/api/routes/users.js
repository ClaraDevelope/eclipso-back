const { isAuth } = require('../../middlewares/auth')
const { uploadEvento, uploadPerfil } = require('../../middlewares/file')
const { postEvento } = require('../controllers/event')
const {
  getUsuarios,
  register,
  login,
  getUsuariosbyId,
  toggleEventoFavorito,
  updateUsuarios,
} = require('../controllers/users')

const userRouter = require('express').Router()
userRouter.get('/', getUsuarios)
userRouter.get('/:id', getUsuariosbyId )
userRouter.patch('/:id', isAuth, uploadPerfil, updateUsuarios)
userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.post('/:id/create', isAuth, uploadEvento, postEvento)
userRouter.post('/:eventId/favourite', isAuth, toggleEventoFavorito)



module.exports = { userRouter }