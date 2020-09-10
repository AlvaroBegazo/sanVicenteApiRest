'use strict'

module.exports = async (db, req, res) => {
  const { dni } = req.params
  console.log(dni);
  let processStatus = true
  let detallePersona = {}
  try {
    detallePersona = await db.detallePersona(dni)
  } catch (error) {
    processStatus = false
  }

  if (processStatus && detallePersona.status) {
    res.status(200).send({
      status: true,
      message: 'Detalles de persona cargados correctamente.',
      persona: detallePersona.persona
    })
  } else {
    res.status(500).send({
      status: false,
      message: 'Error al cargar los detalles de la persona.'
    })
  }
}
