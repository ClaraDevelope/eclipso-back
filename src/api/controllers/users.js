const Usuario = require("../models/user")

const getUsuarios = async (req, res, next) => {
  try {
    const usuarios = await Usuario.find()
      .populate('eventosOrganizados')  
      .populate('eventosAsistencia')  
      .populate('usuariosSeguidos')  
      .populate('seguidores') 
      .select('userName email img telefono fechaNacimiento eventosOrganizados eventosAsistencia usuariosSeguidos seguidores');  // Seleccionar solo los campos relevantes

    return res.status(200).json(usuarios);
  } catch (error) {
    return res.status(400).json('Error al obtener los usuarios');
  }
};

// const getUsuarios = async (req, res, next) => {
//   try {
//     const usuarios = await Usuario.find().populate('eventosOrganizados')
//     return res.status(200).json(usuarios)
//   } catch (error) {
//     return res.status(400).json('error al hacer get de los usuarios')
//   }
// }

const getUsuariosbyId = async (req, res, next) => {
  try {
    const { id } = req.params
    const usuario = await Usuario.findById(id)
    return res.status(200).json(usuario)
  } catch (error) {
    return res.status(400).json('error al hacer get por ID de los usuarios')
  }
}

const register = async (req, res, next) => {
  try {
    const usuarioDuplicado = await Usuario.findOne({
      email: req.body.email
    })
    if (usuarioDuplicado) {
      return res.status(400).json('Usuario ya existente')
    }

    const newUsuario = new Usuario({
      userName: req.body.userName,
      password: req.body.password,
      email: req.body.email,
      rol: 'user'
    })
    if (req.file) {
      newUsuario.img = req.file.path
    }

    const usuario = await newUsuario.save()
    return res.status(201).json(usuario)
  } catch (error) {
    console.error(error)
    return res.status(400).json('Error al hacer post de los usuarios')
  }
}

const login = async (req, res, next) => {
  try {
    const { userName, password } = req.body

    if (!userName || typeof userName !== 'string') {
      return res.status(400).json({ error: 'Nombre de usuario no válido' })
    }
    const usuario = await Usuario.findOne({ userName })

    if (!usuario) {
      return res.status(400).json({ error: 'Usuario no encontrado' })
    }

    const contraseñaValida = bcrypt.compareSync(password, usuario.password)

    if (!contraseñaValida) {
      return res.status(400).json({ error: 'Contraseña incorrecta' })
    }

    const token = generarLlave(usuario._id)
    return res.status(200).json({ token, usuario })
  } catch (error) {
    console.error('Error en el login:', error)
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}

const updateUsuarios = async (req, res, next) => {
  try {
    const { id } = req.params;

    const antiguoUsuario = await Usuario.findById(id);
    if (!antiguoUsuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Creamos un objeto de campos a actualizar
    const camposActualizados = {};

    // Actualizamos solo los campos que se proporcionan en el cuerpo de la solicitud
    if (req.body.userName) camposActualizados.userName = req.body.userName;
    if (req.body.email) camposActualizados.email = req.body.email;
    if (req.body.password) {
      const hashedPassword = bcrypt.hashSync(req.body.password, 10);
      camposActualizados.password = hashedPassword;
    }
    if (req.file) {
      // Si el usuario ya tiene una imagen, eliminamos la anterior
      if (antiguoUsuario.img) {
        deleteImgCloudinary(antiguoUsuario.img);
      }
      camposActualizados.img = req.file.path;
    }
    if (req.body.telefono) camposActualizados.telefono = req.body.telefono;
    if (req.body.fechaNacimiento) camposActualizados.fechaNacimiento = req.body.fechaNacimiento;

    // Realizamos la actualización solo con los campos proporcionados
    const usuarioUpdated = await Usuario.findByIdAndUpdate(id, camposActualizados, { new: true });

    if (!usuarioUpdated) {
      return res.status(404).json({ error: 'No se encontró ningún usuario para actualizar' });
    }

    return res.status(200).json(usuarioUpdated);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'Error al actualizar el usuario' });
  }
};


module.exports = {
  getUsuarios,
  getUsuariosbyId,
  register,
  login,
  updateUsuarios
}