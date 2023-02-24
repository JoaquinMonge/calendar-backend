const express = require("express");

const Evento = require("../models/Evento");

const getEventos = async (req, res = express.response) => {
  const eventos = await Evento.find().populate("user", "name");

  try {
    res.status(201).json({
      ok: true,
      msg: eventos,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error",
    });
  }
};
const crearEvento = async (req, res = express.response) => {
  const evento = new Evento(req.body);
  try {
    evento.user = req.uid;
    const eventoGuardado = await evento.save();
    res.status(201).json({
      ok: true,
      evento: eventoGuardado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error",
    });
  }
};
const actualizarEvento = async (req, res = express.response) => {
  const eventoId = req.params.id;
  const uid = req.uid;

  try {
    const evento = await Evento.findById(eventoId);
    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: "Evento no existe con ese ID",
      });
    }

    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: "false",
        msg: "No tiene privilegio de editar ese evento",
      });
    }

    const nuevoEvento = {
      ...req.body,
      user: uid,
    };

    const eventoActualizado = await Evento.findByIdAndUpdate(
      eventoId,
      nuevoEvento,
      //para que devuelva el documento actualizado de una vez
      { new: true }
    );

    res.status(201).json({
      ok: true,
      evento: eventoActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error",
    });
  }
};
const eliminarEvento = async (req, res = express.response) => {
  const eventoId = req.params.id;
  const uid = req.uid;
  const eventos = await Evento.find().populate("user", "name");

  try {
    const evento = await Evento.findById(eventoId);
    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: "Evento no existe con ese ID",
      });
    }

    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: "false",
        msg: "No tiene privilegio para eliminar ese evento",
      });
    }

    await Evento.findByIdAndDelete(eventoId);

    res.status(201).json({
      ok: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error",
    });
  }
};

module.exports = {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
};
