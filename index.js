const express = require('express')
const { generateTickets, createZip } = require('./ticket_generator')

const app = express()
app.use(express.static('public'))
app.use(express.json())

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`)
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
  res.json({ filename: zip })
})

app.listen(3000, () => {
  console.log('running')
})
