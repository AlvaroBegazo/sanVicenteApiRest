module.exports = {
  mysql: {
    // Clever Cloud
    // host: 'brq2obab09sofnhxd4cf-mysql.services.clever-cloud.com',
    // user: 'uefb61qu4c65prv0',
    // password: '7pOlnLhXibQn6okGwu69 ',
    // database: 'brq2obab09sofnhxd4cf'

    host: 'brq2obab09sofnhxd4cf-mysql.services.clever-cloud.com',
    user: 'uefb61qu4c65prv0',
    password: '7pOlnLhXibQn6okGwu69',
    database: 'brq2obab09sofnhxd4cf'

    // host: process.env.MYSQL_HOST || 'localhost',
    // user: process.env.MYSQL_USER || 'practica',
    // password: process.env.MYSQL_PASSWORD || 'practica',
    // database: process.env.MYSQL_DATABASE || 'colegio_san_vicente'
  },
  ports_services: {
    autenticacion: process.env.PORT_AUTENTICACION || '5000',
    padre: process.env.PORT_PADRE || '5001',
    estudiante: process.env.PORT_ESTUDIANTE || '5002',
    administrativo: process.env.PORT_ADMINISTRATIVO || '8080',
    files_management: process.env.PORT_ADMINISTRATIVO || '5004',
    docente: process.env.PORT_DOCENTE || '5005'
  },
  host: {
    backend: process.env.DO_HOST_BACK || 'localhost', // digitalOcean
    frontend: process.env.DO_HOST_FRONT || 'http://localhost:4200'
  }
}
