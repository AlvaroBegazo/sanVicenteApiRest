'use strict'
const { uploadFile, downloadFile } = require('../controllers/index')

const uri = 'managerFiles'
module.exports = (app) => {
  // Routes
  /**
   * @swagger
   * /managerFiles/fileUpload:
   *  post:
   *    description: Subir archivos
   *    parameters:
   *      - name: fileName
   *        in: query
   *        description: nombre del archivo a subir
   *        schema:
   *          type: string
   *          format: string
   *      - name: idUsuario
   *        in: query
   *        description: id del usuario quien suba el archivo
   *        schema:
   *          type: string
   *          format: string
   *    responses:
   *      '200':
   *        description: Respuesta correcta
   */
  app.post(`${uri}/fileUpload/`, uploadFile)

  app.post('/autenticacion/admin', (req, res) => {
    const data = req.body
    console.log({ data })
    res.status(200).send({
      status: true,
      message: 'test-cors-login'
    })
  })

  /**
   * @swagger
   * /managerFiles2:
   *  get:
   *    description: Obtener archivo
   *    responses:
   *      '200':
   *        description: Archivo obtenido correctamente
   */
  app.get(`${uri}/fileUpload/`, downloadFile)
}
