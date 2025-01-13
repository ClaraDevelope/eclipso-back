const deleteImgCloudinary = require("../../utils/deleteFile");
const { generarLlave } = require("../../utils/jwt");
const Usuario = require("../models/user")
const bcrypt = require('bcrypt');

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
    const usuario = await Usuario.findById(id).populate('eventosOrganizados').populate('eventosFavoritos')
    return res.status(200).json(usuario)
  } catch (error) {
    return res.status(400).json('error al hacer get por ID de los usuarios')
  }
}

const register = async (req, res, next) => {
  try {
    const usuarioDuplicado = await Usuario.findOne({ email: req.body.email });
    if (usuarioDuplicado) {
      return res.status(400).json('Usuario ya existente');
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUsuario = new Usuario({
      userName: req.body.userName,
      password: hashedPassword,
      email: req.body.email,
      rol: 'user'
    });

    const usuario = await newUsuario.save();
    return res.status(201).json(usuario);
  } catch (error) {
    console.error(error);
    return res.status(400).json('Error al registrar el usuario');
  }
};


const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log('Datos recibidos en el login:', { email, password });

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      console.log('Usuario no encontrado para el email:', email);
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }

    console.log('Usuario encontrado:', usuario);

    const esHash = usuario.password.startsWith('$2b$');
    console.log('El password almacenado es un hash válido (bcrypt):', esHash);

    let contraseñaValida = false;

    if (esHash) {
      console.log('Comparando contraseña con hash...');
      contraseñaValida = await bcrypt.compare(password, usuario.password);
      console.log('¿Contraseña válida?:', contraseñaValida);
    } else {
      console.log('Contraseña no está hasheada. Generando hash para comparar...');
      const hashedPassword = bcrypt.hashSync(password, 10);
      console.log('Hash generado para comparación:', hashedPassword);

      contraseñaValida = hashedPassword === usuario.password;
      console.log('¿Contraseña válida (sin hash previo)?:', contraseñaValida);

      if (contraseñaValida) {
        usuario.password = await bcrypt.hash(password, 10);
        await usuario.save();
        console.log('Contraseña migrada exitosamente a hash bcrypt.');
      }
    }

    if (!contraseñaValida) {
      console.log('Contraseña incorrecta.');
      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }

    console.log('Generando token...');
    const token = generarLlave(usuario._id);
    console.log('Token generado:', token);

    return res.status(200).json({ token, usuario });
  } catch (error) {
    console.error('Error en el login:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};


const updateUsuarios = async (req, res, next) => {
  try {
    const { id } = req.params;
console.log(req.body);

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

const toggleEventoFavorito = async (req, res, next) => {
  try {
    const { userId, eventId } = req.body;

    if (!userId || !eventId) {
      return res.status(400).json({ error: 'userId y eventId son requeridos' });
    }

    const usuario = await Usuario.findById(userId);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const eventoIndex = usuario.eventosFavoritos.indexOf(eventId);

    if (eventoIndex !== -1) {
      usuario.eventosFavoritos.splice(eventoIndex, 1);
      await usuario.save();
      return res.status(200).json({
        message: 'Evento eliminado de la lista de favoritos',
        eventosFavoritos: usuario.eventosFavoritos,
      });
    } else {
      usuario.eventosFavoritos.push(eventId);
      await usuario.save();
      return res.status(200).json({
        message: 'Evento agregado a la lista de favoritos',
        eventosFavoritos: usuario.eventosFavoritos,
      });
    }
  } catch (error) {
    console.error('Error al realizar toggle en evento favorito:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};



module.exports = {
  getUsuarios,
  getUsuariosbyId,
  register,
  login,
  updateUsuarios, 
  toggleEventoFavorito
}