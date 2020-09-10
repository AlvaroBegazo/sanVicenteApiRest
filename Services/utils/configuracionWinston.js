const winston = require('winston')

const myformat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.align(),
  winston.format.printf(info => `${info.timestamp}  ${info.level}:${info.message} `)
)

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({ format: myformat }),
    new winston.transports.File({ filename: '../LogSanVicente.log', format: myformat })
  ]
})

// se confiurara cuando se implemente a produccion o se pueda probar
// if (process.env.NODE_ENV !== 'production') {
//   logger.add(new winston.transports.Console({
//     format: winston.format.simple(),
//   }));
// }

module.exports = { logger }
