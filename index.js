const { generateTickets, createZip } = require('./ticket_generator')
const express = require('express')
const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

app.use(express.static('public'))
app.use(express.json())

let gameData = {}
let gameNum = {}

io.on('connection', (socket) => {
  console.log('user connected')
  socket.emit('CONNECTED', { message: 'you are connected' })

  socket.on('NEW_HOST_DATA', (payload) => {
    const { gameId, data } = payload
    gameData = { ...gameData, [gameId]: data }
  })

  socket.on('NEW_ARRAY', (gameId) => {
    io.emit('SEND_NEW_ARRAY', gameData[gameId])
  })

  socket.on('NEW_HOST_NUMBER', (payload) => {
    const { gameId, number } = payload
    gameNum = { ...gameNum, [gameId]: number }
  })

  socket.on('NEW_NUM', (gameId) => {
    io.emit('SEND_NEW_NUM', gameNum[gameId])
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`)
})

app.get('/viewer/:id', (req, res) => {
  res.sendFile(`${__dirname}/public/viewer.html`)
})

app.get('/ticket-generator', (req, res) => {
  res.sendFile(`${__dirname}/public/ticket.html`)
})

app.get('/generate-ticket/:no', (req, res) => {
  const tickets = generateTickets(parseInt(req.params.no))
  res.json(tickets)
})

app.post('/generate-zip', async (req, res) => {
  const tickets = req.body
  const zip = await createZip(tickets)
    .catch((err) => { return err })
  res.json({ filename: zip })
})

const PORT = process.env.PORT || 3000
server.listen(PORT, console.log(`Server started on port ${PORT}`))
