const Asistente = require('../models/asistente')
const transporter = require('../../utils/nodemailer')
const Evento = require('../models/event')
const Usuario = require('../models/user')
const jwt = require('jsonwebtoken')
const { verificarLlave } = require('../../utils/jwt')

const getAsistentes = async (req, res, next) => {
  try {
    const asistentes = await Asistente.find().populate('asistencia')
    return res.status(200).json(asistentes)
  } catch (error) {
    console.log(error)
    return res.status(400).json('Error al hacer el get de los eventos')
  }
}

const getAsistenteById = async (req, res, next) => {
  try {
    const { id } = req.params
    const asistente = await Asistente.findById(id)
    return res.status(200).json(asistente)
  } catch (error) {
    console.log(error)
    return res.status(400).json('Error al hacer el get de los eventos')
  }
}
const registroAsistencia = async (req, res, next) => {
  try {
    const { userId, userName, email } = req.body;
    const { eventoId } = req.params;

    const token = req.headers['authorization']?.split(' ')[1];
    console.log(req.headers);

    if (token) {
      try {
        const decoded = verificarLlave(token); 
        req.usuario = decoded;

        let asistenteExistente = await Asistente.findOne({
          email,
          asistencia: eventoId,
        });

        if (asistenteExistente) {
          return res.status(400).json({
            mensaje: 'El correo ya está registrado como asistente para este evento',
          });
        }

        const nuevoAsistente = new Asistente({
          userId: decoded.id, 
          nombre: userName,
          email,
          asistencia: eventoId,
        });

        await nuevoAsistente.save();

        await Evento.findByIdAndUpdate(eventoId, {
          $push: { asistentes: nuevoAsistente._id },
        });

        let mail = {
          from: 'c3735861@gmail.com',
          to: email,
          subject: 'Confirmación de registro al evento',
          text: `Hola ${userName}, Gracias por registrarte para el evento.`,
          html: `
            <h5>Hola ${userName},</h5>
            <p>¡Gracias por unirte a nosotros para este emocionante evento! Estamos entusiasmados de tenerte con nosotros.</p>
            <p>¡Esperamos verte pronto!</p>
            <p>¡Saludos!</p>
            <p>Clara</p>
          `,
        };

        const info = await transporter.sendMail(mail);
        console.log('Correo electrónico enviado.', info.response);

        return res.status(200).json({
          mensaje: 'Asistencia confirmada con éxito (usuario autenticado). Recibirás un mensaje con los detalles a tu email.',
          nuevoAsistente,
          usuarioAutenticado: true,  
        });

      } catch (err) {
        console.error("Error verificando el token", err);
        return res.status(401).json({ mensaje: 'Token inválido' });
      }
    } else {
      let asistenteExistente = await Asistente.findOne({
        email,
        asistencia: eventoId,
      });

      if (asistenteExistente) {
        return res.status(400).json({
          mensaje: 'El correo ya está registrado como asistente para este evento',
        });
      }

      const nuevoAsistente = new Asistente({
        userId: null,
        nombre: userName,
        email,
        asistencia: eventoId,
      });

      await nuevoAsistente.save();

      await Evento.findByIdAndUpdate(eventoId, {
        $push: { asistentes: nuevoAsistente._id },
      });

      let mail = {
        from: 'c3735861@gmail.com',
        to: email,
        subject: 'Confirmación de registro al evento',
        text: `Hola ${userName}, Gracias por registrarte para el evento.`,
        html: `
          <h5>Hola ${userName},</h5>
          <p>¡Gracias por unirte a nosotros para este emocionante evento! Estamos entusiasmados de tenerte con nosotros.</p>
          <p>¡Esperamos verte pronto!</p>
          <p>¡Saludos!</p>
          <p>Clara</p>
        `,
      };

      const info = await transporter.sendMail(mail);
      console.log('Correo electrónico enviado.', info.response);

      return res.status(200).json({
        mensaje: 'Asistencia confirmada con éxito (usuario no autenticado). Recibirás un mensaje con los detalles a tu email.',
        nuevoAsistente,
        usuarioAutenticado: false, 
      });
    }
  } catch (error) {
    console.error('Error al confirmar la asistencia:', error);
    return res.status(500).json({ mensaje: 'Error al confirmar la asistencia' });
  }
};







module.exports = { getAsistentes, getAsistenteById, registroAsistencia }