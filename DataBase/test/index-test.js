'use strict'

const test = require('ava')
const Db = require('../index')
const { v4 } = require('uuid')

// crear una BD para cada test para
test.beforeEach('Configurar base de datos', async t => {
  const dbName = `Colegio_San_Vicente_${v4()}`
  const db = new Db({ database: dbName, setup: true }) // configurar la bd
  await db.connect()
  t.context.db = db
  t.context.dbName = dbName
  t.true(db.connected, 'Deberia haber conectado')
})

test('Connect-DB', async t => {
  const num1 = 10
  t.is(typeof num1, 'number', 'num1 es el numero 10')
})
