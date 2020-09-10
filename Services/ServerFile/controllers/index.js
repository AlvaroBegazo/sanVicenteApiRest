'use strict'

module.exports = {
  uploadFile: async (req, res) => {
    // const file = req.files.filename
    res.send('api-serverFile--> subir archivo')
  },
  downloadFile: async (req, res) => {
    res.send('api-serverFile--> descargar archivo')
  }
}
