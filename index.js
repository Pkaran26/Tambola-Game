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

const PORT = process.env.PORT || 3000
app.listen(PORT, console.log(`Server started on port ${PORT}`))
