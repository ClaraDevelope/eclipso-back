const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Usuario = require('./src/api/models/user'); 
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      serverSelectionTimeoutMS: 30000, // Aumenta el tiempo de espera de conexión
      socketTimeoutMS: 45000, // Aumenta el tiempo de espera de la operación
    });
    console.log('CONECTADO A LA BBDD');
  } catch (error) {
    console.log('ERROR AL CONECTARSE EN LA BBDD:', error);
  }
};

const actualizarPassword = async () => {
  try {
    const email = 'clara@clara.com'; // Correo del usuario
    const nuevaPassword = 'clara123'; // Nueva contraseña

    // Asegúrate de que la base de datos esté conectada
    await connectDB();
    console.log('Conectado a la base de datos');

    // Generar un nuevo hash para la nueva contraseña
    const hashedPassword = await bcrypt.hash(nuevaPassword, 10);
    console.log('Hash de la nueva contraseña generado correctamente');

    // Actualizar la contraseña del usuario
    const resultado = await Usuario.updateOne({ email }, { password: hashedPassword });
    if (resultado.matchedCount > 0) {
      console.log(`Contraseña actualizada exitosamente para: ${email}`);
    } else {
      console.log(`Usuario con email ${email} no encontrado`);
    }

    // Cerrar la conexión a la base de datos
    await mongoose.disconnect();
    console.log('Conexión cerrada');
  } catch (error) {
    console.error('Error al actualizar la contraseña:', error);
  }
};

actualizarPassword();

