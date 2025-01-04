const Evento = require("../models/event")
const Usuario = require('../models/user')

const getEventos = async (req, res, next) => {
  try {
    const eventos = await Evento.find()
      .populate([{ path: 'asistentes' }, { path: 'creador' }])
      .sort({ fecha: 1 })
    return res.status(200).json(eventos)
  } catch (error) {
    console.log(error)
    return res.status(400).json('Error al hacer el get de los eventos')
  }
}
const getEventoById = async (req, res, next) => {
  try {
    const { id } = req.params
    const evento = await Evento.findById(id)
    return res.status(200).json(evento)
  } catch (error) {
    console.log(error)
    return res.status(400).json('Error al hacer el get de los eventos')
  }
}

const postEvento = async (req, res, next) => {
  try {
    const userId = req.params.id
    const newEvento = new Evento(req.body)
    newEvento.creador = userId
    if (req.file) {
      newEvento.cartel = req.file.path
    }
    const evento = await newEvento.save()

    await Usuario.findByIdAndUpdate(userId, {
      $push: {
        eventosOrganizados: evento._id,
        creador: userId
      }
    })
    await evento.save()

    return res.status(201).json({ evento })
  } catch (error) {
    console.error(error)
    return res.status(400).json({ error: 'No se ha podido crear el evento' })
  }
}

module.exports = {
  getEventos,
  getEventoById,
  postEvento,
}
